import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles, Instances, Instance } from '@react-three/drei';
import { HALL_START, HALL_END } from '../journey/chambers';
import { M } from './materials';

const sconceGeo = new THREE.ConeGeometry(0.2, 0.46, 8);
const flameGeo = new THREE.ConeGeometry(0.16, 0.5, 7);

/** Sunlight falling through the skylight - angled translucent slabs. */
function Shafts() {
  const group = useRef();
  const zs = useMemo(() => {
    const out = [];
    for (let z = HALL_START - 6; z > HALL_END + 6; z -= 16) out.push(z);
    return out;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    group.current.children.forEach((m, i) => {
      m.material.opacity = 0.05 + Math.sin(t * 0.6 + i) * 0.015;
    });
  });
  return (
    <group ref={group}>
      {zs.map((z, i) => (
        <mesh key={z} position={[i % 2 ? 1.4 : -1.2, 5.6, z]} rotation={[0, 0, 0.32]}>
          <planeGeometry args={[3.6, 12]} />
          <meshBasicMaterial color="#fffaf0" transparent opacity={0.09} depthWrite={false} blending={2} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Torches. Sconces at every station (no light each - that would multiply shader
 * permutations); a small flame mesh flickers. The single camera-following
 * lantern in Scene supplies the actual warm key for whichever chamber is active.
 */
function Torches() {
  const flames = useRef([]);
  const stations = useMemo(() => {
    const out = [];
    let flip = false;
    for (let z = HALL_START - 4; z > HALL_END + 4; z -= 13) {
      out.push([flip ? -5.8 : 5.8, 4.7, z]);
      flip = !flip;
    }
    return out;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    flames.current.forEach((f, i) => {
      if (!f) return;
      f.scale.y = 1 + Math.sin(t * 13 + i) * 0.22;
      f.scale.x = 1 + Math.sin(t * 8 + i * 2) * 0.12;
    });
  });
  return (
    <group>
      <Instances geometry={sconceGeo} material={M.bronze} limit={stations.length} range={stations.length}>
        {stations.map((p, i) => (
          <Instance key={i} position={p} rotation-x={Math.PI} />
        ))}
      </Instances>
      {stations.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => (flames.current[i] = el)}
          position={[p[0] * 0.96, p[1] + 0.35, p[2]]}
          geometry={flameGeo}
          material={M.ember}
        />
      ))}
    </group>
  );
}

export default function Atmosphere() {
  return (
    <group>
      <Shafts />
      <Torches />
      <Sparkles
        count={60}
        scale={[9, 7, 150]}
        position={[0, 5, -70]}
        size={2.6}
        speed={0.12}
        opacity={0.4}
        color="#eef1f2"
        noise={0.5}
      />
    </group>
  );
}
