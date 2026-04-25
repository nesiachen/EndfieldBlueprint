import type { Recipe } from "../types";

export const recipes: Recipe[] = [
  { id: "refine_iron_plate", name: "精炼铁板", machineTemplateId: "refining_unit", duration: 3, inputs: [{ itemId: "iron_ore", name: "铁矿", amount: 2, type: "solid" }], outputs: [{ itemId: "iron_plate", name: "铁板", amount: 1, type: "solid" }] },
  { id: "refine_steel_plate", name: "精炼钢板", machineTemplateId: "refining_unit", duration: 4, inputs: [{ itemId: "steel_ore", name: "钢矿", amount: 2, type: "solid" }], outputs: [{ itemId: "steel_plate", name: "钢板", amount: 1, type: "solid" }] },
  { id: "shred_ore", name: "粉碎矿石", machineTemplateId: "shredding_unit", duration: 2, inputs: [{ itemId: "raw_ore", name: "原矿", amount: 1, type: "solid" }], outputs: [{ itemId: "iron_ore", name: "铁矿粉", amount: 1, type: "solid" }, { itemId: "stone", name: "石材", amount: 1, type: "solid" }] },
  { id: "plant_wheat", name: "种植小麦", machineTemplateId: "planting_unit", duration: 10, inputs: [{ itemId: "seed", name: "种子", amount: 1, type: "solid" }, { itemId: "water", name: "水", amount: 2, type: "liquid" }], outputs: [{ itemId: "wheat", name: "小麦", amount: 3, type: "solid" }] },
  { id: "fill_water_bottle", name: "灌装水", machineTemplateId: "filling_unit", duration: 1, inputs: [{ itemId: "bottle", name: "空瓶", amount: 1, type: "solid" }, { itemId: "water", name: "水", amount: 1, type: "liquid" }], outputs: [{ itemId: "water_bottle", name: "瓶装水", amount: 1, type: "solid" }] },
  { id: "forge_alloy", name: "锻造合金", machineTemplateId: "forge_of_the_sky", duration: 8, inputs: [{ itemId: "iron_plate", name: "铁板", amount: 2, type: "solid" }, { itemId: "coal", name: "煤炭", amount: 1, type: "solid" }], outputs: [{ itemId: "alloy", name: "合金", amount: 1, type: "solid" }] },
];

export const getRecipesByMachine = (machineTemplateId: string): Recipe[] => {
  return recipes.filter((r) => r.machineTemplateId === machineTemplateId);
};
