import { useRef } from 'react';
import Hall from './Hall';
import Props from './Props';
import Atmosphere from './Atmosphere';
import CameraRig from './CameraRig';

export default function Scene() {
  const fill = useRef();

  return (
    <>
      {/* Bright midday: a pale sky the far end of the hall fades into, not black. */}
      <color attach="background" args={['#dbe3e8']} />
      <fog attach="fog" args={['#dbe3e8', 40, 165]} />

      {/* Few lights (each one multiplies first-frame shader compiles), tuned for
          flooding daylight: strong near-white sun, bright sky hemi, high ambient
          so the white marble reads bright and airy. */}
      <ambientLight intensity={0.95} color="#e8edf1" />
      <hemisphereLight intensity={1.7} color="#f3f8fc" groundColor="#8f9490" />
      <directionalLight position={[16, 24, 9]} intensity={2.5} color="#fffaf1" />
      <directionalLight position={[-10, 14, -26]} intensity={0.6} color="#dbe6ee" />
      <pointLight ref={fill} color="#f6f2ea" intensity={1.1} distance={34} decay={1.6} />

      <CameraRig fillLight={fill} />
      <Hall />
      <Props />
      <Atmosphere />
    </>
  );
}
