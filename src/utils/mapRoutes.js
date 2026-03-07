// Shared route helpers for map rendering.
export function generateCurvedRoute(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return coordinates;
  }

  const result = [];
  for (let i = 0; i < coordinates.length - 1; i += 1) {
    const start = coordinates[i];
    const end = coordinates[i + 1];

    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.01) {
      result.push(start);
      continue;
    }

    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2;
    const offset = dist * 0.15;
    const cpX = midX - (dy / dist) * offset;
    const cpY = midY + (dx / dist) * offset;

    const steps = Math.max(30, Math.round(dist * 4));
    for (let t = 0; t <= 1; t += 1 / steps) {
      const x = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * cpX + t * t * end[0];
      const y = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * cpY + t * t * end[1];
      result.push([x, y]);
    }
  }

  result.push(coordinates[coordinates.length - 1]);
  return result;
}
