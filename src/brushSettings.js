/**
 * Shared brush state.
 *
 * The GUI writes to `brush`; the painting code (next milestone) reads it
 * every time a stroke is stamped. Keeping this in its own module means the
 * GUI and the painting core can be developed independently.
 */

export const BRUSH_LIMITS = {
  size: { min: 1, max: 100, step: 1 }, // radius in texture pixels
  opacity: { min: 0.05, max: 1, step: 0.05 },
};

export const BRUSH_DEFAULTS = {
  color: '#e8503a', // hex string, as produced by the GUI color picker
  size: 20,
  opacity: 1,
};

/** Current brush settings. Mutate via the GUI, read anywhere. */
export const brush = { ...BRUSH_DEFAULTS };

const listeners = new Set();

/** Subscribe to brush changes. Returns an unsubscribe function. */
export function onBrushChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Call after mutating `brush` so subscribers (e.g. the preview) update. */
export function notifyBrushChange() {
  listeners.forEach((fn) => fn(brush));
}

export function resetBrush() {
  Object.assign(brush, BRUSH_DEFAULTS);
  notifyBrushChange();
}
