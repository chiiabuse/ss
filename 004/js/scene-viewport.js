// Fit the complete room height: never crop the floor or futon at short viewports.
export function sceneViewport(width, height) {
  const scale = height / 620;
  return { scale, offsetX: (width - 900 * scale) / 2, offsetY: 0 };
}
