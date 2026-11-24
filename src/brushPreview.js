import { brush, onBrushChange } from './brushSettings.js';

/** Small DOM widget that shows the current brush so GUI changes are visible. */
export function initBrushPreview() {
  const dot = document.getElementById('brush-preview-dot');
  const label = document.getElementById('brush-preview-label');

  function render() {
    // Brush size is a radius (1-100); the preview draws it at half scale
    // (diameter = size px) so the largest brush fits the 100px stage.
    const diameter = Math.max(2, brush.size);
    dot.style.width = `${diameter}px`;
    dot.style.height = `${diameter}px`;
    dot.style.background = brush.color;
    dot.style.opacity = String(brush.opacity);
    label.textContent = `${brush.color}  size ${brush.size}  ${Math.round(brush.opacity * 100)}%`;
  }

  render();
  return onBrushChange(render);
}
