import { lazy, Suspense, useEffect, useState } from 'react';
import Overlay from './ui/Overlay';
import ProgressDial from './ui/ProgressDial';
import Hint from './ui/Hint';
import Fallback from './ui/Fallback';
import { useJourneyInput } from './journey/useJourneyInput';

// three.js + R3F only load for the 3D route, so the fallback stays light.
const Hall3D = lazy(() => import('./three/Hall3D'));

/**
 * Decide which experience to serve. The full 3D walk (marble hall, flowing canal,
 * fish, caustics) now runs on phones too - swipe to travel, drag sideways to look.
 * The crossfade fallback is reserved for the cases where the 3D route genuinely
 * cannot run well: a reduced-motion preference, no WebGL, or a software renderer.
 * `?mode=3d` / `?mode=flat` force a route for testing.
 */
function decideMode() {
  if (typeof window === 'undefined') return 'flat';

  const forced = new URLSearchParams(window.location.search).get('mode');
  if (forced === '3d' || forced === 'flat') return forced;

  const mq = (q) => window.matchMedia(q).matches;
  const reduce = mq('(prefers-reduced-motion: reduce)');

  let webgl = false;
  let software = false;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    webgl = Boolean(gl);
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = dbg
        ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
        : '';
      software = /swiftshader|llvmpipe|software|basic render/i.test(renderer);
    }
  } catch {
    webgl = false;
  }

  if (reduce || !webgl || software) return 'flat';
  return '3d';
}

export default function App() {
  const [mode] = useState(decideMode);

  useEffect(() => {
    document.body.dataset.journey = mode === '3d' ? '3d' : 'flat';
    return () => {
      delete document.body.dataset.journey;
    };
  }, [mode]);

  useJourneyInput(mode === '3d');

  if (mode !== '3d') return <Fallback />;

  return (
    <>
      <Suspense fallback={null}>
        <Hall3D />
      </Suspense>
      <Overlay />
      <ProgressDial />
      <Hint />
      {/* cinematic vignette framing the shot */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{ boxShadow: 'inset 0 0 220px 30px rgba(40,52,64,0.16)' }}
      />
    </>
  );
}
