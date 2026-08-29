import { useEffect } from 'react';
import { useJourney, progressRef } from './store';
import { clampProgress } from './chambers';

/**
 * Translates wheel / touch / keyboard input into camera travel.
 *
 * - A gentle wheel roll adds a small delta to `target`, so the rig eases forward
 *   proportionally (slow roll = slow dolly). ~140ms after input stops, `target`
 *   snaps to the nearest chamber so you always settle framed inside one.
 * - A hard flick (large single delta, or fast accumulation) jumps a whole chamber.
 * - Arrow / Page / Space / Home / End keys step between chambers.
 * - Touch drag on the Y axis behaves like the wheel.
 *
 * Nothing here touches the scrollbar; the document itself never scrolls.
 */
export function useJourneyInput(enabled) {
  useEffect(() => {
    if (!enabled) return;

    // Accumulator model: input builds up until it crosses a step threshold, then
    // the target advances one chamber and the rig eases there over ~0.6s (the
    // "cut between frames" dolly). A fast fling crosses several thresholds and
    // skips chambers; a slow roll takes a moment to tip over, then travels once.
    const WHEEL_STEP = 64; // accumulated wheel delta to advance one chamber
    const TOUCH_STEP = 120; // accumulated touch delta to advance one chamber
    const DECAY_MS = 420; // accumulator bleeds off if you stop

    let accum = 0;
    let decayTimer = null;

    const setGesturing = (g) => useJourney.getState().setGesturing(g);

    const bleed = () => {
      clearTimeout(decayTimer);
      decayTimer = setTimeout(() => {
        accum = 0;
        setGesturing(false);
      }, DECAY_MS);
    };

    const applyDelta = (rawDelta, step) => {
      setGesturing(true);
      accum += rawDelta;
      while (Math.abs(accum) >= step) {
        const dir = Math.sign(accum);
        accum -= dir * step;
        const from = Math.round(progressRef.current);
        useJourney.getState().setTarget(clampProgress(from + dir));
      }
      bleed();
    };

    let lastTouchY = null;

    // If the pointer is over a chamber tablet that can still scroll in the
    // input's direction, let it scroll natively; only drive the camera once the
    // tablet hits its scroll boundary.
    const panelAbsorbs = (target, delta) => {
      const panel = target?.closest?.('[data-scroll-panel]');
      if (!panel) return false;
      const { scrollTop, scrollHeight, clientHeight } = panel;
      if (scrollHeight - clientHeight < 4) return false;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      return delta > 0 ? !atBottom : !atTop;
    };

    const onWheel = (e) => {
      if (panelAbsorbs(e.target, e.deltaY)) return;
      e.preventDefault();
      applyDelta(e.deltaY, WHEEL_STEP);
    };

    const onTouchStart = (e) => {
      lastTouchY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (lastTouchY == null) return;
      const y = e.touches[0].clientY;
      const delta = lastTouchY - y;
      lastTouchY = y;
      if (panelAbsorbs(e.target, delta)) return;
      e.preventDefault();
      applyDelta(delta, TOUCH_STEP);
    };
    const onTouchEnd = () => {
      lastTouchY = null;
      accum = 0;
    };

    const onKey = (e) => {
      if (e.repeat) return; // holding a key shouldn't rocket through the hall
      const j = useJourney.getState();
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          j.nudge(1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          j.nudge(-1);
          break;
        case 'Home':
          e.preventDefault();
          j.goto(0);
          break;
        case 'End':
          e.preventDefault();
          j.goto(j.count - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(decayTimer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
    };
  }, [enabled]);
}
