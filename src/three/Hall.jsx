import { useMemo } from 'react';
import * as THREE from 'three';
import { Instances, Instance } from '@react-three/drei';
import { HALL_START, HALL_END } from '../journey/chambers';
import { M } from './materials';

const COL_X = 4.7;
const COL_GAP = 6.4;

const shaftGeo = new THREE.CylinderGeometry(0.42, 0.5, 7, 16, 1);
const baseGeo = new THREE.BoxGeometry(1.25, 0.5, 1.25);
const capGeo = new THREE.BoxGeometry(1.3, 0.62, 1.3);
const pilasterGeo = new THREE.BoxGeometry(0.25, 9.4, 0.9);

function Colonnade({ positions }) {
  return (
    <group>
      <Instances geometry={shaftGeo} material={M.marble} limit={positions.length} range={positions.length}>
        {positions.map((p, i) => (
          <Instance key={i} position={[p[0], 4.1, p[2]]} />
        ))}
      </Instances>
      <Instances geometry={baseGeo} material={M.marbleWarm} limit={positions.length} range={positions.length}>
        {positions.map((p, i) => (
          <Instance key={i} position={[p[0], 0.28, p[2]]} />
        ))}
      </Instances>
      <Instances geometry={capGeo} material={M.marble} limit={positions.length} range={positions.length}>
        {positions.map((p, i) => (
          <Instance key={i} position={[p[0], 7.9, p[2]]} />
        ))}
      </Instances>
    </group>
  );
}

export default function Hall() {
  const columns = useMemo(() => {
    const out = [];
    for (let z = HALL_START; z > HALL_END; z -= COL_GAP) out.push([-COL_X, 0, z], [COL_X, 0, z]);
    return out;
  }, []);
  const pilasters = useMemo(() => {
    const out = [];
    for (let z = HALL_START; z > HALL_END; z -= COL_GAP * 2) out.push([-5.92, z], [5.92, z]);
    return out;
  }, []);

  const length = HALL_START - HALL_END + 20;
  const midZ = (HALL_START + HALL_END) / 2;

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, midZ]} material={M.floor} receiveShadow>
        <planeGeometry args={[12, length]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.011, midZ]} material={M.marbleWarm}>
        <planeGeometry args={[2.4, length]} />
      </mesh>

      <mesh position={[-6.2, 5.5, midZ]} rotation-y={Math.PI / 2} material={M.marbleWarm}>
        <planeGeometry args={[length, 13]} />
      </mesh>
      <mesh position={[6.2, 5.5, midZ]} rotation-y={-Math.PI / 2} material={M.marbleWarm}>
        <planeGeometry args={[length, 13]} />
      </mesh>

      <mesh position={[0, 12.4, midZ]} rotation-x={Math.PI / 2} material={M.sky}>
        <planeGeometry args={[3.4, length]} />
      </mesh>
      <mesh position={[-3.35, 11, midZ]} rotation-x={Math.PI / 2} material={M.stoneDark}>
        <planeGeometry args={[5.7, length]} />
      </mesh>
      <mesh position={[3.35, 11, midZ]} rotation-x={Math.PI / 2} material={M.stoneDark}>
        <planeGeometry args={[5.7, length]} />
      </mesh>

      {[-COL_X, COL_X].map((x) => (
        <mesh key={x} position={[x, 8.55, midZ]} material={M.marble}>
          <boxGeometry args={[1.4, 0.9, length]} />
        </mesh>
      ))}
      {[-COL_X - 0.72, COL_X + 0.72].map((x) => (
        <mesh key={x} position={[x, 8.9, midZ]} material={M.marbleWarm}>
          <boxGeometry args={[0.14, 1.5, length]} />
        </mesh>
      ))}

      <Colonnade positions={columns} />
      <Instances geometry={pilasterGeo} material={M.marbleWarm} limit={pilasters.length} range={pilasters.length}>
        {pilasters.map(([x, z], i) => (
          <Instance key={i} position={[x, 4.7, z]} />
        ))}
      </Instances>

      {/* Entrance pediment */}
      <group position={[0, 0, HALL_START + 0.5]}>
        <mesh position={[0, 9.9, 0]} material={M.marble}>
          <boxGeometry args={[12.4, 0.5, 1.4]} />
        </mesh>
        <mesh position={[0, 10.75, 0]} rotation={[0, 0, Math.PI / 2]} material={M.marbleWarm}>
          <cylinderGeometry args={[1.7, 1.7, 12.4, 3, 1]} />
        </mesh>
      </group>
    </group>
  );
}
