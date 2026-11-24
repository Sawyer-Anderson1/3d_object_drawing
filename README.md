# 3D Paint

CS 4361.002 - Group 4 (Sawyer Anderson, Rinin Abraham, James Barnes)

A Three.js application for painting directly on 3D objects.

## Status

**Milestone 1 (Nov. 1) - scene rendering and functional GUI: done.**

- Rendered 3D object with lighting and orbit controls
- Scene selector (sphere, torus, torus knot)
- Brush settings GUI: color picker, size, opacity, reset
- Live brush preview (bottom-left)
- Optional UV checker overlay to inspect the model's UV layout

Painting is **not** implemented yet. See the roadmap below.

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

Other scripts:

```bash
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Controls

| Input | Action |
| --- | --- |
| Left or right drag | Orbit |
| Scroll / middle drag | Zoom |

Left-drag orbits for now. It will switch to painting in milestone 2, leaving right-drag for orbit (already configured in `src/main.js`).

## Project structure

```
index.html              Page shell: canvas + brush preview
src/
  main.js               Renderer, camera, controls, render loop
  sceneManager.js       THREE.Scene, lights, loading/disposing the paintable object
  scenes/registry.js    Preset scene definitions (add new presets here)
  brushSettings.js      Shared brush state (color, size, opacity) + change events
  gui.js                lil-gui control panel
  brushPreview.js       DOM preview of the current brush
  style.css
```

### How the pieces connect

The GUI mutates the `brush` object in `src/brushSettings.js`. The painting code
(milestone 2) should simply read `brush` each time it stamps, so the GUI and the
painting core can be built independently.

## Roadmap

1. **Milestone 1 (done):** scene rendering, scene selection, brush GUI.
2. **Milestone 2 (Nov. 15):** painting.
   - Raycast from the mouse to get the UV under the cursor (`THREE.Raycaster`, `intersects[0].uv`)
   - Paint texture as a `WebGLRenderTarget`; brush stamped with a fragment shader
   - Assign the render target's texture to the mesh material so paint persists while orbiting
   - Interpolate stamps between mouse positions for continuous strokes
   - Switch left-drag to paint
3. **Milestone 3 (Nov. 29):** extras: eraser, brush types, undo/clear, custom model loading (only for models with non-overlapping UVs).

## Notes for painting

- Paintable meshes need **non-overlapping UVs**. Do not add `BoxGeometry` or `CylinderGeometry` presets: each face reuses the full 0-1 UV square, so painting one face paints all of them.
- Brush `size` is a radius in paint-texture pixels (to be mapped to UV space once the paint texture size is chosen).
- The UV checker toggle is a quick way to see UV stretching, which affects how circular the brush looks on the surface.

## Git workflow suggestion

- `main` always runs
- One short-lived branch per feature (`feature/raycast-picking`, `feature/brush-shader`, ...)
- Open a pull request and have a teammate review before merging
