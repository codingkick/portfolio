import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Lathe } from '@react-three/drei';
import { M } from './materials';

function urnProfile(scale = 1) {
  return [
    [0.0, 0.0], [0.55, 0.0], [0.62, 0.15], [0.35, 0.35], [0.5, 0.9],
    [0.62, 1.5], [0.34, 2.0], [0.2, 2.15], [0.34, 2.28], [0.28, 2.4],
  ].map(([x, y]) => new THREE.Vector2(x * scale, y * scale));
}

function Urn({ position, scale = 1 }) {
  const profile = useMemo(() => urnProfile(scale), [scale]);
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} material={M.marbleDim}>
        <boxGeometry args={[1.1 * scale, 0.5, 1.1 * scale]} />
      </mesh>
      <Lathe args={[profile, 22]} position={[0, 0.5, 0]} material={M.marbleSmooth} />
    </group>
  );
}

function Statue({ position, facing = 0 }) {
  return (
    <group position={position} rotation-y={facing}>
      <mesh position={[0, 0.5, 0]} material={M.marbleDim}>
        <boxGeometry args={[1.4, 1, 1.4]} />
      </mesh>
      <mesh position={[0, 1.15, 0]} material={M.marbleSmooth}>
        <boxGeometry args={[1.05, 0.28, 1.05]} />
      </mesh>
      <mesh position={[0, 2.05, 0]} material={M.marbleSmooth}>
        <cylinderGeometry args={[0.34, 0.62, 1.9, 10, 1]} />
      </mesh>
      <mesh position={[0, 3.0, 0]} material={M.marbleSmooth}>
        <sphereGeometry args={[0.45, 12, 10]} />
      </mesh>
      <mesh position={[0, 3.5, 0.02]} material={M.marbleSmooth}>
        <sphereGeometry args={[0.26, 14, 12]} />
      </mesh>
      <mesh position={[0.34, 2.5, 0.1]} rotation-z={-0.6} material={M.marbleSmooth}>
        <capsuleGeometry args={[0.11, 0.8, 4, 8]} />
      </mesh>
    </group>
  );
}

function Tablet({ position }) {
  return (
    <group position={position} rotation-y={Math.PI / 2}>
      <mesh material={M.marbleSmooth}>
        <boxGeometry args={[2.6, 1.7, 0.16]} />
      </mesh>
      <mesh position={[0, 0, 0.09]} material={M.gold}>
        <boxGeometry args={[2.9, 2.0, 0.06]} />
      </mesh>
      <mesh position={[0, 0, 0.14]} material={M.marbleWarm}>
        <boxGeometry args={[2.55, 1.66, 0.04]} />
      </mesh>
    </group>
  );
}

function LaurelRing({ position, r = 1.1 }) {
  return (
    <mesh position={position} rotation-x={Math.PI / 2} material={M.bronze}>
      <torusGeometry args={[r, 0.09, 8, 36]} />
    </mesh>
  );
}

function Altar({ position }) {
  const flame = useRef();
  const light = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const f = 0.78 + Math.sin(t * 11) * 0.12 + Math.sin(t * 27) * 0.06;
    if (light.current) light.current.intensity = 5.5 * f;
    if (flame.current) {
      flame.current.scale.y = 1 + Math.sin(t * 14) * 0.15;
      flame.current.scale.x = 1 + Math.sin(t * 9 + 1) * 0.08;
    }
  });
  const bowl = useMemo(
    () =>
      [[0, 0], [0.7, 0], [0.8, 0.12], [0.78, 0.4], [0.5, 0.36], [0.48, 0.1]].map(
        ([x, y]) => new THREE.Vector2(x, y),
      ),
    [],
  );
  return (
    <group position={position}>
      {[1.6, 1.15, 0.8].map((w, i) => (
        <mesh key={i} position={[0, 0.2 + i * 0.42, 0]} material={i === 0 ? M.marbleDim : M.marbleSmooth}>
          <boxGeometry args={[w * 1.6, 0.42, w * 1.6]} />
        </mesh>
      ))}
      <Lathe args={[bowl, 24]} position={[0, 1.6, 0]} material={M.bronze} />
      <mesh ref={flame} position={[0, 2.15, 0]} material={M.flame}>
        <coneGeometry args={[0.28, 0.8, 10]} />
      </mesh>
      <pointLight ref={light} position={[0, 2.3, 0]} color="#ffa94d" intensity={5.5} distance={22} decay={2} />
    </group>
  );
}

export default function Props() {
  return (
    <group>
      <Urn position={[-3.1, 0, 5.5]} scale={1.05} />
      <Urn position={[3.1, 0, 5.5]} scale={1.05} />

      {/* The canal now runs through the atrium, so this station keeps only its
          flanking urn - the old square basin would have collided with the rill. */}
      <group position={[0, 0, -24]}>
        <Urn position={[-4.6, 0, -3]} scale={0.8} />
      </group>

      <group position={[0, 0, -50]}>
        <mesh position={[-3.6, 4.6, 0]} material={M.marble}>
          <cylinderGeometry args={[0.5, 0.6, 9.2, 16, 1]} />
        </mesh>
        <LaurelRing position={[-3.6, 5.4, 0]} r={0.95} />
        <mesh position={[3.6, 3.4, -14]} material={M.marbleDim}>
          <cylinderGeometry args={[0.5, 0.6, 6.6, 16, 1]} />
        </mesh>
        <LaurelRing position={[3.6, 4.2, -14]} r={0.8} />
      </group>

      {[-72, -77, -82, -87, -92].map((z, i) => (
        <Tablet key={z} position={[-5.75, 2.6 + (i % 2 ? 1.4 : 0), z]} />
      ))}

      <Statue position={[-4.1, 0, -100]} facing={0.5} />
      <Statue position={[4.1, 0, -110]} facing={-0.5} />
      <Statue position={[-4.1, 0, -120]} facing={0.5} />

      <Altar position={[0, 0, -142]} />
    </group>
  );
}
