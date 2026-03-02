import type { ItemDefinition } from '../game/jobs/job-types';

export const ITEM_IDS = {
  // Logs
  NORMAL_LOG: 'normal_log',
  OAK_LOG: 'oak_log',
  WILLOW_LOG: 'willow_log',
  // Fish
  RAW_SHRIMP: 'raw_shrimp',
  RAW_TROUT: 'raw_trout',
  // Ores
  COPPER_ORE: 'copper_ore',
  IRON_ORE: 'iron_ore',
  SILVER_ORE: 'silver_ore',
} as const;

export const itemDefinitions: ItemDefinition[] = [
  // Logs
  {
    id: ITEM_IDS.NORMAL_LOG,
    name: 'Normal Log',
    description: 'A standard log from a common tree.',
    category: 'log',
  },
  {
    id: ITEM_IDS.OAK_LOG,
    name: 'Oak Log',
    description: 'A sturdy log from an oak tree.',
    category: 'log',
  },
  {
    id: ITEM_IDS.WILLOW_LOG,
    name: 'Willow Log',
    description: 'A flexible log from a willow tree.',
    category: 'log',
  },
  // Fish
  {
    id: ITEM_IDS.RAW_SHRIMP,
    name: 'Raw Shrimp',
    description: 'A small shrimp, freshly caught.',
    category: 'fish',
  },
  {
    id: ITEM_IDS.RAW_TROUT,
    name: 'Raw Trout',
    description: 'A plump trout from the brook.',
    category: 'fish',
  },
  // Ores
  {
    id: ITEM_IDS.COPPER_ORE,
    name: 'Copper Ore',
    description: 'A chunk of copper ore.',
    category: 'ore',
  },
  {
    id: ITEM_IDS.IRON_ORE,
    name: 'Iron Ore',
    description: 'A heavy piece of iron ore.',
    category: 'ore',
  },
  {
    id: ITEM_IDS.SILVER_ORE,
    name: 'Silver Ore',
    description: 'A gleaming nugget of silver ore.',
    category: 'ore',
  },
];

/** Lookup map for item definitions by ID. */
export const itemDefinitionMap: Record<string, ItemDefinition> = Object.fromEntries(
  itemDefinitions.map((item) => [item.id, item]),
);
