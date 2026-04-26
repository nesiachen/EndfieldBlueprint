import type { PlacedDevice } from "../types";
import { equipmentCatalog } from "../data/equipment";

let _nextId = 1;

export function generateDeviceId(): string {
  return `device_${_nextId++}`;
}

/**
 * 检查设备是否重叠
 * @param x  设备左上角网格 x
 * @param y  设备左上角网格 y
 * @param length  设备占地长度（网格单位）
 * @param width   设备占地宽度（网格单位）
 * @param devices  已有设备列表
 * @param excludeId  排除的设备 ID（移动时自身不算碰撞）
 */
export function checkCollision(x: number, y: number, length: number, width: number, devices: PlacedDevice[], excludeId?: string): boolean {
  const newLeft = x;
  const newRight = x + length - 1;
  const newTop = y;
  const newBottom = y + width - 1;

  for (const d of devices) {
    if (d.id === excludeId) continue;

    const tmpl = equipmentCatalog[d.templateId];

    const dLeft = d.x;
    const dRight = d.x + tmpl.cols - 1;
    const dTop = d.y;
    const dBottom = d.y + tmpl.rows - 1;

    if (newRight >= dLeft && newLeft <= dRight && newBottom >= dTop && newBottom >= dTop && newTop <= dBottom) {
      return true;
    }
  }

  return false;
}
