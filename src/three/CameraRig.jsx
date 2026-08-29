import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useJourney, progressRef } from '../journey/store';
import { sampleJourney } from '../journey/chambers';

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _base = new THREE.Quaternion();
const _offset = new THREE.Quaternion();
const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
const _target = new THREE.Quaternion();
const UP = new THREE.Vector3(0, 1, 0);

const LOOK_SENSITIVITY = 0.0026; // radians per pixel dragged
const PITCH_LIMIT = 1.15; // ~66deg up/down
const RECENTER_BASE = 0.6; // higher = slower drift back to the authored heading

/**
 * Drives the camera: every frame it eases `progressRef` toward `target`, samples
 * an authored anchor + aim for that spot in the hall, and faces the camera down
 * it. On top of that it adds a free 360deg look: drag anywhere in the scene to
 * pan the view (full yaw, clamped pitch). When you let go the view drifts slowly
 * back to the authored framing so the "tracking shot" reasserts itself.
 */
export default function CameraRig({ fillLight }) {
  const lastActive = useRef(-1);
  const frames = useRef(0);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const dragging = useRef(false);

  // Free-look drag handling (fine pointers only; touch stays reserved for travel).
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let lastX = 0;
    let lastY = 0;

    const onDown = (e) => {
      if (e.button !== 0) return;
      // don't hijack drags that begin on interactive UI
      if (e.target.closest('a, button, input, textarea, [data-scroll-panel], nav')) return;
      dragging.current = true;
      lastX = e.clientX;
      lastY = e.clientY;
      document.body.style.cursor = 'grabbing';
    };
    const onMove = (e) => {
      if (!dragging.current) return;
      yaw.current -= (e.clientX - lastX) * LOOK_SENSITIVITY;
      pitch.current -= (e.clientY - lastY) * LOOK_SENSITIVITY;
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.body.style.cursor = '';
    };
  }, []);

  // Touch look-around. Vertical swipes already drive travel (useJourneyInput), so
  // on touch a *sideways* swipe pans the view; once a gesture commits to
  // horizontal it keeps panning (with a little vertical tilt) until the finger lifts.
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) return;

    let sx = 0;
    let sy = 0;
    let tracking = false;
    let horizontal = false;

    const onStart = (e) => {
      // Skip only genuinely interactive targets. A horizontal swipe that starts
      // on the (pan-y) chamber tablet still counts as a look - it can't scroll it.
      if (e.target.closest?.('a, button, input, textarea, nav')) return;
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
      tracking = true;
      horizontal = false;
    };
    const onMove = (e) => {
      if (!tracking) return;
      const t = e.touches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (!horizontal && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        horizontal = true;
      }
      if (horizontal) {
        dragging.current = true; // hold the free-look steady, don't recenter mid-swipe
        yaw.current -= dx * LOOK_SENSITIVITY * 0.7;
        pitch.current -= dy * LOOK_SENSITIVITY * 0.4;
        pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
      }
      sx = t.clientX;
      sy = t.clientY;
    };
    const onEnd = () => {
      tracking = false;
      horizontal = false;
      dragging.current = false;
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, []);

  useFrame((state, dt) => {
    // Once a few real frames have rendered, the lazily-compiled shaders are done;
    // signal the loader to lift so the hall is lit, not black, when it does.
    if (frames.current < 16) {
      frames.current += 1;
      if (frames.current === 15) window.dispatchEvent(new Event('hall-ready'));
    }

    const { target, setActive } = useJourney.getState();
    const d = Math.min(1, dt);

    // Frame-rate independent easing. A higher base = a slower, gentler approach:
    // ~0.18 gives a long, smooth ~2.5s glide between chambers.
    const k = 1 - Math.pow(0.18, d);
    progressRef.current += (target - progressRef.current) * k;
    if (Math.abs(target - progressRef.current) < 0.0004) progressRef.current = target;

    const { cam, look } = sampleJourney(progressRef.current);
    const t = state.clock.elapsedTime;

    // settled camera + a barely-there idle breath so it never feels frozen
    _pos.set(
      cam[0] + Math.sin(t * 0.22) * 0.035,
      cam[1] + Math.sin(t * 0.3) * 0.025,
      cam[2],
    );
    state.camera.position.copy(_pos);

    // drift the free-look offset back toward neutral when not dragging
    if (!dragging.current) {
      const r = 1 - Math.pow(RECENTER_BASE, d);
      yaw.current += (0 - yaw.current) * r;
      pitch.current += (0 - pitch.current) * r;
    }

    // authored heading, then the user's free-look offset on top
    _look.set(look[0], look[1] + Math.sin(t * 0.26) * 0.04, look[2]);
    _m.lookAt(state.camera.position, _look, UP);
    _base.setFromRotationMatrix(_m);
    _euler.set(pitch.current, yaw.current, 0);
    _offset.setFromEuler(_euler);
    _target.copy(_base).multiply(_offset);

    // slow, smooth rotational settle; responsive while the user is dragging
    const rot = dragging.current ? 0.35 : 1 - Math.pow(0.05, d);
    state.camera.quaternion.slerp(_target, rot);

    if (fillLight?.current) {
      fillLight.current.position.set(
        state.camera.position.x,
        state.camera.position.y + 1.4,
        state.camera.position.z - 3,
      );
    }

    const active = Math.round(progressRef.current);
    if (active !== lastActive.current) {
      lastActive.current = active;
      setActive(active);
    }
  });

  return null;
}
