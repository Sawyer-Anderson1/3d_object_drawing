import * as THREE from 'three';
import { DEFAULT_SCENE_ID, getSceneDef } from './scenes/registry.js';

/** Builds a checkerboard texture so UV layout and stretching are visible. */
function createCheckerTexture(size = 512, squares = 16) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cell = size / squares;
  for (let y = 0; y < squares; y++) {
    for (let x = 0; x < squares; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#f2f2f2' : '#c9ccd3';
      ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Owns the THREE.Scene, lighting, and the currently loaded paintable object.
 * Swapping scenes disposes the previous object's GPU resources.
 */
export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1b1d22);

    this.currentId = null;
    this.mesh = null;
    this.showChecker = false;
    this.checkerTexture = createCheckerTexture();

    this.#addLights();
    this.load(DEFAULT_SCENE_ID);
  }

  #addLights() {
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3f4b, 1.1));

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 5, 6);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0x9db4ff, 0.8);
    rim.position.set(-5, 2, -4);
    this.scene.add(rim);
  }

  /** Replace the current object with the scene definition `id`. */
  load(id) {
    const def = getSceneDef(id);
    this.#disposeMesh();

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.55,
      metalness: 0.05,
      map: this.showChecker ? this.checkerTexture : null,
    });
    this.mesh = new THREE.Mesh(def.createGeometry(), material);
    this.mesh.name = def.id;
    this.scene.add(this.mesh);
    this.currentId = def.id;
    return this.mesh;
  }

  setShowChecker(show) {
    this.showChecker = show;
    if (this.mesh) {
      this.mesh.material.map = show ? this.checkerTexture : null;
      this.mesh.material.needsUpdate = true;
    }
  }

  #disposeMesh() {
    if (!this.mesh) return;
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose(); // shared checker texture is kept on purpose
    this.mesh = null;
  }
}
