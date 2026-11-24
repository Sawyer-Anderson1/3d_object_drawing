import GUI from 'lil-gui';
import { SCENES } from './scenes/registry.js';
import {
  brush,
  BRUSH_LIMITS,
  notifyBrushChange,
  resetBrush,
} from './brushSettings.js';

/**
 * Builds the control panel.
 * @param {object} opts
 * @param {import('./sceneManager.js').SceneManager} opts.sceneManager
 */
export function createGui({ sceneManager }) {
  const gui = new GUI({ title: '3D Paint' });

  // --- Scene -------------------------------------------------------------
  const sceneFolder = gui.addFolder('Scene');
  const sceneState = {
    scene: sceneManager.currentId,
    uvChecker: sceneManager.showChecker,
  };
  const sceneOptions = Object.fromEntries(SCENES.map((s) => [s.name, s.id]));

  sceneFolder
    .add(sceneState, 'scene', sceneOptions)
    .name('Object')
    .onChange((id) => sceneManager.load(id));

  sceneFolder
    .add(sceneState, 'uvChecker')
    .name('UV checker')
    .onChange((v) => sceneManager.setShowChecker(v));

  // --- Brush -------------------------------------------------------------
  const brushFolder = gui.addFolder('Brush');

  const colorCtrl = brushFolder
    .addColor(brush, 'color')
    .name('Color')
    .onChange(notifyBrushChange);

  const sizeCtrl = brushFolder
    .add(brush, 'size', BRUSH_LIMITS.size.min, BRUSH_LIMITS.size.max, BRUSH_LIMITS.size.step)
    .name('Size')
    .onChange(notifyBrushChange);

  const opacityCtrl = brushFolder
    .add(
      brush,
      'opacity',
      BRUSH_LIMITS.opacity.min,
      BRUSH_LIMITS.opacity.max,
      BRUSH_LIMITS.opacity.step,
    )
    .name('Opacity')
    .onChange(notifyBrushChange);

  brushFolder
    .add(
      {
        reset: () => {
          resetBrush();
          [colorCtrl, sizeCtrl, opacityCtrl].forEach((c) => c.updateDisplay());
        },
      },
      'reset',
    )
    .name('Reset brush');

  return gui;
}
