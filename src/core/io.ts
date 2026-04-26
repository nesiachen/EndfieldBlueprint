import type { EquipmentTemplate } from "../data/equipment";
import type { IOPort, PlacedDevice } from "../types";

/**
 * 将设备模板的 ioSides 展开为网格上的绝对 IO 端口列表
 */
export function getDeviceIOPorts(device: PlacedDevice, template: EquipmentTemplate): IOPort[] {
  const ports: IOPort[] = [];
  const { x: dx, y: dy } = device;
  const { cols, rows, ioSides } = template;

  //   top
  ioSides.top.forEach((type, i) => {
    if (type !== "NONE") {
      ports.push({ deviceId: device.id, side: "top", sideIndex: i, x: dx + i, y: dy, type, direction: "down" });
    }
  });
  //   bottom
  ioSides.bottom.forEach((type, i) => {
    if (type !== "NONE") {
      ports.push({ deviceId: device.id, side: "bottom", sideIndex: i, x: dx + i, y: dy + rows - 1, type, direction: "up" });
    }
  });
  //   left
  ioSides.left.forEach((type, i) => {
    if (type !== "NONE") {
      ports.push({ deviceId: device.id, side: "right", sideIndex: i, x: dx, y: dy + i, type, direction: "right" });
    }
  });
  //   right
  ioSides.right.forEach((type, i) => {
    if (type !== "NONE") {
      ports.push({ deviceId: device.id, side: "left", sideIndex: i, x: dx + cols - 1, y: dy + i, type, direction: "left" });
    }
  });

  return ports;
}

/**
 * 在网格坐标 (x, y) 查找是否有端口
 * @param devicesWithTemplates 设备和模板的配对数组
 */
export function getPortAt(x: number, y: number, devicesWithTemplates: { device: PlacedDevice; template: EquipmentTemplate }[]): IOPort | null {
  for (const { device, template } of devicesWithTemplates) {
    const ports = getDeviceIOPorts(device, template);
    const found = ports.find((p) => p.x === x && p.y === y);
    if (found) return found;
  }
  return null;
}
