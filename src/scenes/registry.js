import * as THREE from 'three';

/**
 * Preset scenes. Each entry builds the geometry of the paintable object.
 *
 * IMPORTANT for the painting milestone: texture painting needs UVs that do
 * NOT overlap. Sphere, torus and torus knot all have unique UVs. Avoid
 * BoxGeometry / CylinderGeometry as paintable presets: every face reuses the
 * full 0-1 UV square, so painting one face would paint all of them.
 */
export const SCENES = [
  {
    id: 'sphere',
    name: 'Sphere',
    createGeometry: () => new THREE.SphereGeometry(1.2, 96, 64),
  },
  {
    id: 'torus',
    name: 'Torus',
    createGeometry: () => new THREE.TorusGeometry(1, 0.45, 48, 128),
  },
  {
    id: 'torusKnot',
    name: 'Torus knot',
    createGeometry: () => new THREE.TorusKnotGeometry(0.85, 0.3, 256, 48),
  },
];

export const DEFAULT_SCENE_ID = SCENES[0].id;

export function getSceneDef(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}
