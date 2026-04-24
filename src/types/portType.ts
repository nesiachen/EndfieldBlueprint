export const PortType = {
  SOLID_INPUT: "solid_input",
  SOLID_OUTPUT: "solid_output",
  LIQUID_INPUT: "liquid_input",
  LIQUID_OUTPUT: "liquid_output",
  NONE: "none",
} as const;
export type PortType = (typeof PortType)[keyof typeof PortType];
