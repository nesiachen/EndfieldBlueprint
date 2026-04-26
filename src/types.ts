/** 网格坐标 */
export interface GridCoord {
  x: number;
  y: number;
}
/** 像素坐标 */
export interface PixelCoord {
  x: number;
  y: number;
}

/** 设备端口物料类型 */
export const PortType = {
  SOLID_INPUT: "SOLID_INPUT",
  SOLID_OUTPUT: "SOLID_OUTPUT",
  LIQUID_INPUT: "LIQUID_INPUT",
  LIQUID_OUTPUT: "LIQUID_OUTPUT",
  NONE: "NONE",
} as const;
export type PortType = (typeof PortType)[keyof typeof PortType];

/** 设备模板ID（所有可用设备的唯一标识） */
export type EquipmentId = keyof typeof import("./data/equipment").equipmentCatalog;

export interface BeltSpec {
  id: string;
  name: string;
  rate: number;
  type: "belt" | "pipe";
}

export interface ItemAmount {
  itemId: string;
  name: string;
  amount: number;
  type: "solid" | "liquid";
}
export interface Recipe {
  id: string;
  name: string;
  machineId: string;
  duration: number;
  inputs: ItemAmount[];
  outputs: ItemAmount[];
}

/** 放置到网格上的设备实例 */
export interface PlacedDevice {
  id: string;
  templateId: string;
  x: number;
  y: number;
}

/** IO口 */
export type Direction = "up" | "down" | "left" | "right";
export interface IOPort {
  deviceId: string;
  side: "top" | "bottom" | "left" | "right";
  sideIndex: number;
  x: number;
  y: number;
  type: PortType;
  direction: Direction;
}
