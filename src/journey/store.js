import { create } from 'zustand';
import { COUNT, clampProgress } from './chambers';

// Reactive state is deliberately tiny: only `active` (the settled chamber index)
// and `target` (where the rig is heading) trigger React renders. The live camera
// progress lives in a plain ref updated every frame by the CameraRig, so the
// continuous dolly never re-renders the tree.
export const progressRef = { current: 0 };

export const useJourney = create((set, get) => ({
  count: COUNT,
  active: 0,
  target: 0,
  // true while a wheel/touch gesture is mid-flight (used to suppress marker snap fights)
  gesturing: false,

  setActive: (i) => {
    if (i !== get().active) set({ active: i });
  },
  setTarget: (t) => set({ target: clampProgress(t) }),
  nudge: (dir) => {
    const base = Math.round(get().target);
    set({ target: clampProgress(base + Math.sign(dir)) });
  },
  goto: (i) => set({ target: clampProgress(Math.round(i)) }),
  setGesturing: (g) => set({ gesturing: g }),
}));
