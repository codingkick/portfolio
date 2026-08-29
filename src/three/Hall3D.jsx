import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import Loader from '../ui/Loader';
import { chambers } from '../journey/chambers';

export default function Hall3D() {
  // Midrange machines still get the 3D route; drop the canal's heavier passes
  // (caustics, denser water mesh, full fish count) when the device looks weak.
  const quality = useMemo(() => {
    if (typeof navigator === 'undefined') return 'high';
    const mem = navigator.deviceMemory || 8;
    const cores = navigator.hardwareConcurrency || 8;
    return mem <= 4 || cores <= 4 ? 'low' : 'high';
  }, []);

  return (
    <>
      <Loader />
      <div className="hall-canvas">
        <Canvas
          dpr={[1, 1.4]}
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
