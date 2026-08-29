# Rahul Ranjan - Portfolio - "The Marble Hall"

A full overhaul built to the `promptv2.md` brief: the portfolio is a walk through a
3D Greco-Roman hall. Scrolling does not move a scrollbar - it drives a virtual
camera between chambers along a colonnaded corridor.

React + Vite + Tailwind + React Three Fiber + drei + Motion (Framer Motion) + Zustand.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
```

Force a route while testing: `?mode=3d` or `?mode=flat`.

## The two experiences

| Route | When | What |
|---|---|---|
| **3D hall** | pointer + roomy viewport + WebGL + hardware GL + no reduced-motion | R3F scene, wheel/touch/keyboard drives the camera |
| **Flat fallback** | reduced-motion, coarse pointer, small screen, low cores/memory, software GL | the same chambers and marble tablets as a normal vertical scroll with a crossfade between grounds |

Both share one identity: Cinzel inscription display + Cormorant / EB Garamond body,
marble-and-gold palette (`c6a35a` gold, `1f5f74` Aegean, `a8432b` terracotta,
`57694a` laurel), meander borders, carved-inscription text reveals.

## How the scroll-to-camera system works (tune here)

- `src/journey/chambers.js` - each chamber's `cam` anchor and `look` aim. Travel
  is a smootherstep blend between the two neighbouring anchors, so it reads as one
  continuous tracking shot.
- `src/journey/store.js` - Zustand holds only `target` (where the rig is heading)
  and `active` (the settled chamber, for the overlay + dial). The live camera
  progress lives in `progressRef` and never triggers a React render.
- `src/journey/useJourneyInput.js` - accumulator model. Input builds up until it
  crosses `WHEEL_STEP` / `TOUCH_STEP`, then `target` advances one chamber; a fast
  fling crosses several thresholds and skips. Arrow / Page / Space / Home / End
  keys step directly. A tall chamber tablet scrolls internally first and only
  hands scroll back to the camera at its top/bottom edge. **Pacing lives in the
  `WHEEL_STEP`, `TOUCH_STEP`, `DECAY_MS` constants.**
- `src/three/CameraRig.jsx` - per frame, eases `progressRef` toward `target`
  (`Math.pow(0.0022, dt)` damping), samples the anchor blend, moves the camera,
  slerps its look, and repositions the lantern fill light. **Dolly speed lives in
  the damping constant.**

## Content

All copy is from `rahulranjan_resume_july.pdf`, unchanged, in `src/data.js`.

> **Before deploying:** the resume lists LinkedIn / GitHub / LeetCode / Codeforces
> without URLs. Replace the `YOUR-HANDLE` placeholders in `src/data.js` ->
> `profile.links`.

## Structure

```
src/
  journey/    chambers config, Zustand store, input hook
  three/      Canvas, hall architecture, chamber props, atmosphere, camera rig
  ui/         Loader, Overlay + ChamberPanel (shared tablets), ProgressDial, Hint, Fallback
```
