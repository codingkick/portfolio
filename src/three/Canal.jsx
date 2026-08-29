import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { M } from './materials';

/*
 * A Roman nymphaeum-style water channel (a rill) running the FULL length of the
 * hall, from the entrance sill to the altar steps, so the scroll-driven camera
 * tracks alongside it the whole journey. Three connected pieces, all keyed off
 * ONE light direction and ONE flow speed so light, motion and sparkle read as
 * the same phenomenon:
 *
 *   1. a custom water shader  - scrolling procedural surface + travelling ripple
 *      crests (very readable current), Fresnel mix, depth-graded colour,
 *      flow-locked specular sparkle, drifting foam streaks, marble-edge foam
 *   2. shader caustics        - additive ripple-light on the channel bed and a
 *      fainter spill onto the marble floor, scrolling in sync with the water
 *   3. a shoal of fish        - bright koi-palette individuals following
 *      Catmull-Rom paths at varied speed / depth, bodies yaw + roll into turns,
 *      caudal fins wag, emissive so they pop against the water
 *
 * ---- TUNING ------------------------------------------------------------------
 *   FLOW              global current speed (drives water, ripples, sparkle, caustics)
 *   water uSparkle    sun-glitter intensity on the surface
 *   water uBump       how choppy the surface normal reads
 *   water uDisp       vertical undulation of the surface mesh
 *   CAUSTIC_BED / _FLOOR   brightness of the projected ripple-light
 *   fish count        HIGH_FISH / LOW_FISH below
 *   fish speed        `speed` range in the descriptor loop
 *   FISH_GLOW         emissive strength of the fish
 * ---------------------------------------------------------------------------- */

const Z0 = 6; // channel head, just inside the entrance
const Z1 = -138; // channel tail, short of the altar steps
const LEN = Z0 - Z1; // 144
const MIDZ = (Z0 + Z1) / 2; // -66
const HALF_W = 0.85; // half the water width
const WATER_Y = 0.15; // surface height above the marble runway
const BED_Y = -0.55; // channel bed

const FLOW = 0.18; // <- master current speed
const CAUSTIC_BED = 0.65;
const CAUSTIC_FLOOR = 0.2;
const HIGH_FISH = 34;
const LOW_FISH = 18;
const FISH_GLOW = 0.7;

// Sun matches Scene's key directionalLight at [16, 24, 9].
const SUN_DIR = new THREE.Vector3(16, 24, 9).normalize();

// Bright Mediterranean / koi palette - oranges, golds, koi-red, white, blue.
const PALETTE = ['#ff6a14', '#ffb01f', '#e63212', '#fdf3e2', '#2f83d6', '#ff8a2a', '#f5c400'];

// Shared procedural noise for both shaders.
const NOISE_GLSL = /* glsl */ `
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float wave(vec2 p){
    return vnoise(p) * 0.5 + vnoise(p * 2.03 + 11.0) * 0.3 + vnoise(p * 4.11 + 23.0) * 0.2;
  }
`;

const WATER_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  uniform float uTime, uFlow, uDisp;
  ${NOISE_GLSL}
  void main(){
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    float fl = uTime * uFlow;
    vec2 qq = vec2(wp.x * 1.6, wp.z * 0.5);
    float d = wave(qq + vec2(0.0, -fl * 2.0)) - 0.5;
    d += sin(wp.z * 3.4 - uTime * uFlow * 9.0) * 0.5;
    wp.y += d * uDisp;
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const WATER_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vWorld;
  uniform float uTime, uFlow, uSparkle, uBump;
  uniform vec3 uSunDir, uSunColor, uShallow, uDeep, uFog;
  ${NOISE_GLSL}
  void main(){
    vec3 viewDir = normalize(cameraPosition - vWorld);
    float fl = uTime * uFlow;
    vec2 q = vec2(vWorld.x * 1.6, vWorld.z * 0.5);
    vec2 q1 = q + vec2(0.0, -fl * 2.0);
    vec2 q2 = q * 1.9 + vec2(fl * 0.6, -fl * 3.4) + 7.0;

    float h  = wave(q1) * 0.6 + wave(q2) * 0.4;
    float e  = 0.18;
    float hx = wave(q1 + vec2(e, 0.0)) * 0.6 + wave(q2 + vec2(e, 0.0)) * 0.4;
    float hz = wave(q1 + vec2(0.0, e)) * 0.6 + wave(q2 + vec2(0.0, e)) * 0.4;

    // travelling ripple crests down the channel - the main "this is flowing" cue
    float crest = cos(vWorld.z * 3.4 - uTime * uFlow * 9.0) * 0.6
                + cos(vWorld.z * 1.3 - uTime * uFlow * 5.0 + vWorld.x * 1.5) * 0.4;

    vec3 n = normalize(vec3(-(hx - h) * uBump, 1.0, -(hz - h) * uBump + crest * 0.85));

    float fres = pow(1.0 - clamp(dot(n, viewDir), 0.0, 1.0), 3.0);
    fres = mix(0.04, 1.0, fres);

    float edge = abs(vUv.x - 0.5) * 2.0;
    vec3 wcol = mix(uDeep, uShallow, clamp(edge * edge * 0.9 + 0.08, 0.0, 1.0));
    vec3 refl = mix(uFog, uSunColor, 0.25);
    vec3 col = mix(wcol, refl, fres * 0.62);

    // drifting flow streaks - bright filaments sliding along the current
    float streak = wave(vec2(vWorld.x * 3.2, vWorld.z * 0.35 - fl * 4.0));
    col += smoothstep(0.58, 0.78, streak) * 0.10;

    // sparkle: half-vector spec off the moving normal + a flow-locked glitter mask
    vec3 hv = normalize(uSunDir + viewDir);
    float spec = pow(max(dot(n, hv), 0.0), 200.0);
    float spk = wave(q1 * 7.0 + vec2(0.0, -fl * 4.5));
    spk = smoothstep(0.70, 0.93, spk);
    col += uSunColor * (spec * 2.4 + spec * spk * 8.0 + spk * 0.06) * uSparkle;

    // soft foam where the water meets the marble lip and the end sills,
    // plus a little foam riding the ripple crests
    float foam = smoothstep(0.87, 1.0, edge) * (0.5 + 0.5 * wave(q1 * 3.5));
    foam = max(foam, smoothstep(0.55, 0.95, crest) * smoothstep(0.4, 1.0, wave(q1 * 5.0)) * 0.5);
    float ends = smoothstep(0.92, 1.0, abs(vUv.y - 0.5) * 2.0);
    foam = max(foam, ends * 0.6);
    col = mix(col, vec3(0.93, 0.96, 0.97), foam * 0.7);

    float alpha = mix(0.36, 0.82, fres);
    alpha = max(alpha, foam * 0.85);
    alpha = clamp(max(alpha, spec), 0.0, 1.0);

    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

const CAUSTIC_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vWorld;
  uniform float uTime, uFlow, uIntensity;
  uniform vec3 uColor;
  ${NOISE_GLSL}
  void main(){
    vec2 p = vec2(vWorld.x * 1.3, vWorld.z * 0.5);
    vec2 mv = vec2(0.0, -uTime * uFlow * 2.0);
    float n1 = wave(p + mv);
    float n2 = wave(p * 1.8 - mv * 1.4 + 5.0);
    float c = pow(clamp(1.0 - abs(n1 - n2) * 2.2, 0.0, 1.0), 6.0);
    c += pow(clamp(1.0 - abs(wave(p * 2.4 + mv * 0.6) - 0.5) * 2.4, 0.0, 1.0), 9.0) * 0.7;

    float mask = smoothstep(1.0, 0.2, abs(vUv.x - 0.5) * 2.0);
    float endm = smoothstep(1.0, 0.72, abs(vUv.y - 0.5) * 2.0);
    gl_FragColor = vec4(uColor * c * uIntensity * mask * endm, 1.0);
  }
`;

const CAUSTIC_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main(){
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const _p = new THREE.Vector3();
const _t = new THREE.Vector3();

export default function Canal({ quality = 'high' }) {
  const low = quality === 'low';

  const waterMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: WATER_VERT,
        fragmentShader: WATER_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uFlow: { value: FLOW },
          uSparkle: { value: low ? 0.82 : 1.0 },
          uBump: { value: 7.0 },
          uDisp: { value: low ? 0.032 : 0.045 },
          uSunDir: { value: SUN_DIR },
          uSunColor: { value: new THREE.Color('#fff3e0') },
          uShallow: { value: new THREE.Color('#7fd4cf') },
          uDeep: { value: new THREE.Color('#0f6076') },
          uFog: { value: new THREE.Color('#dbe3e8') },
        },
      }),
    [low],
  );

  const causticMats = useMemo(() => {
    const make = (intensity) =>
      new THREE.ShaderMaterial({
        vertexShader: CAUSTIC_VERT,
        fragmentShader: CAUSTIC_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uFlow: { value: FLOW },
          uIntensity: { value: intensity },
          uColor: { value: new THREE.Color('#9fe0da') },
        },
      });
    return { bed: make(CAUSTIC_BED), floor: make(CAUSTIC_FLOOR) };
  }, []);

  // Reusable swim lanes spanning the whole channel - varied side-to-side sway,
  // varied depth, generated so they always cover head-to-tail.
  const curves = useMemo(() => {
    const mk = (pts) =>
      new THREE.CatmullRomCurve3(
        pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
        false,
        'catmullrom',
        0.5,
      );
    const lane = (seed, sway, dMin, dMax) => {
      const pts = [];
      const N = 9;
      for (let k = 0; k <= N; k++) {
        const f = k / N;
        const z = Z0 + (Z1 - Z0) * f;
        const x = Math.sin(k * 1.7 + seed) * sway;
        const y = dMin + (dMax - dMin) * (0.5 + 0.5 * Math.sin(k * 0.9 + seed * 2));
        pts.push([x, y, z]);
      }
      return mk(pts);
    };
    return [
      lane(0.0, 0.46, -0.26, -0.05),
      lane(2.1, 0.4, -0.3, -0.09),
      lane(4.3, 0.5, -0.2, -0.04),
      lane(1.2, 0.32, -0.24, -0.06),
    ];
  }, []);

  const fish = useMemo(() => {
    const n = low ? LOW_FISH : HIGH_FISH;
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push({
        curve: curves[i % curves.length],
        u: Math.random(),
        dir: Math.random() < 0.5 ? 1 : -1,
        speed: 0.014 + Math.random() * 0.024,
        wagFreq: 6 + Math.random() * 4,
        wagAmp: 0.35 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        scale: 1.6 + Math.random() * 1.0,
        color: PALETTE[i % PALETTE.length],
        lateral: (Math.random() - 0.5) * 0.36,
      });
    }
    return arr;
  }, [curves, low]);

  const fishMats = useMemo(() => ({}), []);
  const getFishMat = (hex) =>
    fishMats[hex] ||
    (fishMats[hex] = new THREE.MeshStandardMaterial({
      color: hex,
      emissive: new THREE.Color(hex).multiplyScalar(FISH_GLOW),
      roughness: 0.34,
      metalness: 0.0,
      flatShading: true,
    }));

  const bodyRefs = useRef([]);
  const tailRefs = useRef([]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    waterMat.uniforms.uTime.value = t;
    causticMats.bed.uniforms.uTime.value = t;
    causticMats.floor.uniforms.uTime.value = t;

    const d = Math.min(dt, 0.05);
    for (let i = 0; i < fish.length; i++) {
      const f = fish[i];
      const g = bodyRefs.current[i];
      if (!g) continue;
      const surge = 1 + 0.3 * Math.sin(t * 0.5 + f.phase);
      f.u = (f.u + f.dir * f.speed * d * surge + 1) % 1;

      f.curve.getPoint(f.u, _p);
      f.curve.getTangent(f.u, _t);
      g.position.set(_p.x + f.lateral, _p.y, _p.z);

      const yaw = Math.atan2(_t.x * f.dir, _t.z * f.dir);
      const pitch = Math.asin(THREE.MathUtils.clamp(-_t.y * f.dir, -1, 1)) * 0.6;
      const roll = Math.sin(t * f.wagFreq * 0.5 + f.phase) * 0.18;
      g.rotation.set(pitch, yaw, roll);

      const tail = tailRefs.current[i];
      if (tail) tail.rotation.y = Math.sin(t * f.wagFreq + f.phase) * f.wagAmp;
    }
  });

  useEffect(
    () => () => {
      waterMat.dispose();
      causticMats.bed.dispose();
      causticMats.floor.dispose();
      Object.values(fishMats).forEach((m) => m.dispose());
    },
    [waterMat, causticMats, fishMats],
  );

  return (
    <group>
      {/* channel bed */}
      <mesh rotation-x={-Math.PI / 2} position={[0, BED_Y, MIDZ]} receiveShadow>
        <planeGeometry args={[HALF_W * 2, LEN]} />
        <meshStandardMaterial color="#1f5560" roughness={0.9} />
      </mesh>

      {/* inner channel walls */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * HALF_W, (BED_Y + WATER_Y) / 2, MIDZ]}
          rotation-y={-s * (Math.PI / 2)}
        >
          <planeGeometry args={[LEN, WATER_Y - BED_Y]} />
          <meshStandardMaterial color="#356064" roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* marble curbs + end sills */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (HALF_W + 0.13), 0.12, MIDZ]} material={M.marbleWarm}>
          <boxGeometry args={[0.28, 0.32, LEN]} />
        </mesh>
      ))}
      {[Z0, Z1].map((z) => (
        <mesh key={z} position={[0, 0.07, z]} material={M.marbleWarm}>
          <boxGeometry args={[HALF_W * 2 + 0.6, 0.4, 0.42]} />
        </mesh>
      ))}

      {/* caustics - ripple light on the bed always; the fainter spill onto the
          surrounding marble is dropped on the lighter (mobile) tier */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, BED_Y + 0.015, MIDZ]}
        material={causticMats.bed}
        renderOrder={1}
      >
        <planeGeometry args={[HALF_W * 2, LEN]} />
      </mesh>
      {!low && (
        <mesh
          rotation-x={-Math.PI / 2}
          position={[0, 0.03, MIDZ]}
          material={causticMats.floor}
          renderOrder={1}
        >
          <planeGeometry args={[3.6, LEN]} />
        </mesh>
      )}

      {/* fish */}
      {fish.map((f, i) => (
        <group key={i} ref={(el) => (bodyRefs.current[i] = el)} scale={f.scale} renderOrder={2}>
          <mesh material={getFishMat(f.color)} scale={[0.55, 0.62, 1.34]}>
            <sphereGeometry args={[0.16, 10, 8]} />
          </mesh>
          {/* dorsal fin - reads the fish silhouette from above */}
          <mesh
            position={[0, 0.13, -0.02]}
            rotation-x={Math.PI / 2}
            scale={[0.18, 1, 0.6]}
            material={getFishMat(f.color)}
          >
            <coneGeometry args={[0.1, 0.24, 4]} />
          </mesh>
          <group ref={(el) => (tailRefs.current[i] = el)} position={[0, 0, -0.2]}>
            <mesh rotation-x={Math.PI / 2} scale={[0.42, 1.9, 1]} material={getFishMat(f.color)}>
              <coneGeometry args={[0.13, 0.3, 5]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* water surface - drawn last so fish + caustics show through it */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, WATER_Y, MIDZ]}
        material={waterMat}
        renderOrder={3}
      >
        <planeGeometry args={[HALF_W * 2, LEN, 2, low ? 48 : 200]} />
      </mesh>
    </group>
  );
}
