import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import Loader from '../ui/Loader';
import { chambers } from '../journey/chambers';

export default function Hall3D() {
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
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
