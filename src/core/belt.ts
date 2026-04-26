import type { GridCoord, IOPort } from "../types";

let _nextId = 1;

export function generateBeltId(): string {
  return `belt_${_nextId++}`;
}

/** 判断两点之间的线段是否水平或垂直 */
export function isOrthogonalSegment(a: GridCoord, b: GridCoord): boolean {
  return a.x === b.x || a.y === b.y;
}

export function validateBeltConnection(startPort: IOPort, endPort: IOPort): { valid: boolean; reason?: string } {
  const isOutput = startPort.type === "SOLID_OUTPUT" || startPort.type === "LIQUID_OUTPUT";
  if (!isOutput) return { valid: false, reason: "起点不是输出口" };

  const isInput = endPort.type === "SOLID_INPUT" || endPort.type === "LIQUID_INPUT";
  if (!isInput) return { valid: false, reason: "终点不是输入口" };

  const startIsSolid = startPort.type === "SOLID_OUTPUT";
  const endIsSOlid = endPort.type === "SOLID_INPUT";
  if (startIsSolid !== endIsSOlid) return { valid: false, reason: "物料类型不匹配" };

  return { valid: true };
}
