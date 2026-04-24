export interface Device {
  id: string;
  templateId: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
}

export interface IOPort {
  id: string;
  deviceId: string;
  ioType?: string;
  position: "top" | "right" | "bottom" | "left";
  x: number;
  y: number;
  length: number;
  width: number;
  height: number;
  status: "idle" | "connected" | "error";
  connectedTo?: string;
}

export interface GridConfig {
  baseCellSize: number;
  cellRows: number;
  cellCols: number;
  minScale: number;
  maxScale: number;
  snapToGrid: boolean;
}
