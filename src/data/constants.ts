import type { BeltSpec } from "../types";

export const BELT_SPECS: BeltSpec[] = [
  { id: "belt_t1", name: "基础传送带", rate: 60, type: "belt" },
  { id: "belt_t2", name: "高速传送带", rate: 120, type: "belt" },
  { id: "belt_t3", name: "极速传送带", rate: 240, type: "belt" },
];

export const PIPE_SPECS: BeltSpec[] = [
  { id: "pipe_t1", name: "基础管道", rate: 60, type: "pipe" },
  { id: "pipe_t2", name: "高速管道", rate: 120, type: "pipe" },
  { id: "pipe_t3", name: "极速管道", rate: 240, type: "pipe" },
];

export const DEFAULT_BELT_SPEC = BELT_SPECS[0];
export const DEFAULT_PIPE_SPEC = PIPE_SPECS[0];
