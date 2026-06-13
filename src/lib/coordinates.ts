export const MAP_CONFIG: Record<string, { scale: number; origin_x: number; origin_z: number }> = {
  'AmbroseValley': { scale: 900, origin_x: -370, origin_z: -473 },
  'GrandRift': { scale: 581, origin_x: -290, origin_z: -290 },
  'Lockdown': { scale: 1000, origin_x: -500, origin_z: -500 },
};

/**
 * Converts world coordinates (x, z) to pixel coordinates (px, py) on a 1024x1024 canvas.
 * This is primarily a reference since ETL pre-computes this.
 */
export function worldToPixel(mapId: string, world_x: number, world_z: number): { px: number; py: number } {
  const config = MAP_CONFIG[mapId];
  if (!config) return { px: 0, py: 0 };

  const { scale, origin_x, origin_z } = config;
  
  const u = (world_x - origin_x) / scale;
  const v = (world_z - origin_z) / scale;
  
  let px = u * 1024;
  let py = (1 - v) * 1024;
  
  // Clamp to [0, 1024]
  px = Math.max(0, Math.min(1024, px));
  py = Math.max(0, Math.min(1024, py));
  
  return { px, py };
}
