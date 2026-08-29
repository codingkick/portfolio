import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import Loader from '../ui/Loader';
import { chambers } from '../journey/chambers';

export default function Hall3D() {
  // Phones and weaker machines run the same scene - same hall, canal, fish and
  // caustics - on a lighter budget: fewer fish, a coarser water mesh, the floor
  // caustic spill dropped, and the render resolution capped so the fragment-heavy
  // water shader stays smooth. `high` keeps everything at full fidelity.
  const { quality, dprMax } = useMemo(() => {
    if (typeof window === 'undefined') return { quality: 'high', dprMax: 1.5 };
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const small = window.innerWidth < 820 || window.innerHeight < 560;
    const mem = navigator.deviceMemory || 8;
    const cores = navigator.hardwareConcurrency || 8;
    const light = coarse || small || mem <= 4 || cores <= 4;
    return light
      ? { quality: 'low', dprMax: 1.25 }
      : { quality: 'high', dprMax: 1.5 };
  }, []);

  return (
    <>
      <Loader />
      <div className="hall-canvas">
        <Canvas
          dpr={[1, dprMax]}
          gl={{ antialias: true, powerPreference: 'high-performance', stencil: false, depth: true }}
          camera={{ fov: 44, near: 0.1, far: 240, position: chambers[0].cam }}
        >
          <Suspense fallback={null}>
            <Scene quality={quality} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
