import { create } from 'zustand';

/**
 * Tiny reactive state for the "aim at the canal" interaction. The Canal component
 * decides, every frame, whether the camera is looking at the flowing water and
 * whether the crosshair is currently over a fish; the DOM Reticle just reads it.
 *
 *   visible  - camera is pointed at the water channel -> show the crosshair
 *   locked   - the crosshair is sitting on a fish     -> arm it (red brackets)
 *   hits     - bumped each time a fish is struck       -> lets the UI flash
 */
// Live mouse position in normalised device coords (-1..1), updated on mousemove.
// A plain mutable object so the per-frame raycast never triggers a React render.
export const pointer = { x: 0, y: 0, inside: false };

export const useAim = create((set, get) => ({
  visible: false,
  locked: false,
  hits: 0,

  setAim: (visible, locked) => {
    const s = get();
    if (s.visible !== visible || s.locked !== locked) set({ visible, locked });
  },
  registerHit: () => set({ hits: get().hits + 1 }),
}));
