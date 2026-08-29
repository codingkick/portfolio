// The hall runs along -Z. Each chamber is a vantage point the virtual camera
// dollies between. `z` is the world position of the chamber's focal area;
// `cam` / `look` are the camera anchor and its aim when settled in that chamber.
// Between chambers the rig interpolates both, so travel reads as one tracking shot.

export const EYE = 2.3; // camera eye height

export const chambers = [
  {
    id: 'hero',
    label: 'Entrance',
    marker: 'I',
    z: 2,
    cam: [0, EYE, 12],
    look: [0, 2.2, -10],
  },
  {
    id: 'about',
    label: 'Atrium',
    marker: 'II',
    z: -24,
    cam: [1.5, EYE, -12],
    look: [-1.2, 1.7, -30],
  },
  {
    id: 'experience',
    label: 'Colonnade',
    marker: 'III',
    z: -52,
    cam: [-1.8, EYE, -39],
    look: [1.6, 1.6, -60],
  },
  {
    id: 'skills',
    label: 'Tablets',
    marker: 'IV',
    z: -80,
    cam: [1.7, EYE, -67],
    look: [-2.2, 1.7, -88],
  },
  {
    id: 'work',
    label: 'Exhibits',
    marker: 'V',
    z: -108,
    cam: [-1.6, EYE, -95],
    look: [1.4, 1.6, -116],
  },
  {
    id: 'contact',
    label: 'Altar',
    marker: 'VI',
    z: -136,
    cam: [0, EYE, -123],
    look: [0, 1.9, -144],
  },
];

export const HALL_START = 8;
export const HALL_END = -150;
export const COUNT = chambers.length;

export const clampProgress = (p) => Math.min(COUNT - 1, Math.max(0, p));

// Catmull-ish eased blend between two integer anchors.
export function sampleJourney(progress) {
  const p = clampProgress(progress);
  const i = Math.floor(p);
  const j = Math.min(COUNT - 1, i + 1);
  const tRaw = p - i;
  // smootherstep for cinematic ease between chambers
  const t = tRaw * tRaw * tRaw * (tRaw * (tRaw * 6 - 15) + 10);
  const a = chambers[i];
  const b = chambers[j];
  return {
    cam: [
      a.cam[0] + (b.cam[0] - a.cam[0]) * t,
      a.cam[1] + (b.cam[1] - a.cam[1]) * t,
      a.cam[2] + (b.cam[2] - a.cam[2]) * t,
    ],
    look: [
      a.look[0] + (b.look[0] - a.look[0]) * t,
      a.look[1] + (b.look[1] - a.look[1]) * t,
      a.look[2] + (b.look[2] - a.look[2]) * t,
    ],
  };
}
