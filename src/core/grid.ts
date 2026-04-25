import type { GridCoord, PixelCoord } from "../types";

export const GRID_CELL_SIZE = 40;

/**
 * 将网格坐标转化为格子左上角的像素坐标
 */
export function gridToPixel(gx: number, gy: number): PixelCoord {
  return { x: gx * GRID_CELL_SIZE, y: gy * GRID_CELL_SIZE };
}
/**
 * 将网格坐标转化为格子中心的像素坐标
 */
export function gridToPixelCenter(gx: number, gy: number): PixelCoord {
  return { x: gx * GRID_CELL_SIZE + GRID_CELL_SIZE / 2, y: gy * GRID_CELL_SIZE + GRID_CELL_SIZE / 2 };
}
/**
 * 将像素坐标转化为网格坐标
 */
export function pixelToGrid(px: number, py: number): GridCoord {
  return { x: Math.floor(px / GRID_CELL_SIZE), y: Math.floor(py / GRID_CELL_SIZE) };
}
