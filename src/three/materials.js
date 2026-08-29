import * as THREE from 'three';

// Shared material instances. Reusing a handful of materials across the whole
// hall means the renderer compiles ~6 shader programs on first frame instead of
// dozens, which is the difference between an instant start and a multi-second
// stall while every mesh compiles its own.

export const M = {
  // White Carrara-style marble: near-white with a faint cool grey cast.
  marble: new THREE.MeshStandardMaterial({ color: '#eef0ee', roughness: 0.68, flatShading: true }),
  marbleWarm: new THREE.MeshStandardMaterial({ color: '#e2e5e3', roughness: 0.82, flatShading: true }),
  marbleDim: new THREE.MeshStandardMaterial({ color: '#cfd2d0', roughness: 0.8, flatShading: true }),
  marbleSmooth: new THREE.MeshStandardMaterial({ color: '#f3f4f2', roughness: 0.55 }),
  floor: new THREE.MeshStandardMaterial({ color: '#e0e1dd', roughness: 0.85 }),
  stoneDark: new THREE.MeshStandardMaterial({ color: '#9aa0a1', roughness: 0.95 }),
  gold: new THREE.MeshStandardMaterial({ color: '#c6a35a', roughness: 0.4, metalness: 0.85 }),
  bronze: new THREE.MeshStandardMaterial({ color: '#8a6a33', roughness: 0.4, metalness: 0.8 }),
  water: new THREE.MeshStandardMaterial({ color: '#3f7f92', roughness: 0.18, metalness: 0.25 }),
  sky: new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
  flame: new THREE.MeshBasicMaterial({ color: '#ffb257', transparent: true, opacity: 0.9 }),
  ember: new THREE.MeshBasicMaterial({ color: '#ff9d47' }),
};
