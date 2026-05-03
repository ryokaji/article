export interface GeoBounds {
  south: number;
  north: number;
  west: number;
  east: number;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function parseCoordinate(
  value: number | string,
  name: string,
  min: number,
  max: number,
  context: string,
): number {
  const numeric = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numeric) || numeric < min || numeric > max) {
    throw new Error(`${context}: ${name} must be between ${min} and ${max}.`);
  }

  return numeric;
}

export function expandBounds(
  bounds: GeoBounds,
  paddingRatio = 0.3,
  minSpan = 0.0025,
): GeoBounds {
  const latSpan = Math.max(bounds.north - bounds.south, minSpan);
  const lonSpan = Math.max(bounds.east - bounds.west, minSpan);

  return {
    south: clampNumber(bounds.south - latSpan * paddingRatio, -90, 90),
    north: clampNumber(bounds.north + latSpan * paddingRatio, -90, 90),
    west: clampNumber(bounds.west - lonSpan * paddingRatio, -180, 180),
    east: clampNumber(bounds.east + lonSpan * paddingRatio, -180, 180),
  };
}

export function boundsFromCenterZoom(
  latitude: number,
  longitude: number,
  zoom: number,
  minSpan = 0.0025,
): GeoBounds {
  const latSpan = Math.max(180 / 2 ** zoom, minSpan);
  const lonSpan = Math.max(latSpan / Math.max(Math.cos((latitude * Math.PI) / 180), 0.2), minSpan);

  return {
    south: clampNumber(latitude - latSpan / 2, -90, 90),
    north: clampNumber(latitude + latSpan / 2, -90, 90),
    west: clampNumber(longitude - lonSpan / 2, -180, 180),
    east: clampNumber(longitude + lonSpan / 2, -180, 180),
  };
}

export function boundsToBbox(bounds: GeoBounds): string {
  return `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`;
}
