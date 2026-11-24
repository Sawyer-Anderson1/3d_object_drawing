import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SceneManager } from './sceneManager.js';
import { createGui } from './gui.js';
import { initBrushPreview } from './brushPreview.js';

const canvas = document.getElementById('viewport');

// --- Renderer ---------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// --- Scene + camera ---------------------------------------------------------
const sceneManager = new SceneManager();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 0.6, 4.2);

// --- Controls ---------------------------------------------------------------
// Milestone 1: left, middle and right buttons all work so the scene is explorable.
// TODO(milestone 2): set LEFT to null and use the left button for painting;
// right-drag keeps rotating.
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.ROTATE,
};
controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

// --- UI ---------------------------------------------------------------------
createGui({ sceneManager });
initBrushPreview();

// --- Resize -----------------------------------------------------------------
function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', onResize);

// --- Loop -------------------------------------------------------------------
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(sceneManager.scene, camera);
});
