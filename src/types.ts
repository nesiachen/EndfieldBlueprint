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
export type PortType = "SOLID_INPUT" | "SOLID_OUTPUT" | "LIQUID_INPUT" | "LIQUID_OUTPUT" | "NONE";

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
