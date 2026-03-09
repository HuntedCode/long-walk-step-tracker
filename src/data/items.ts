import type { ItemDefinition } from '../game/jobs/job-types';

/**
 * NOTE: All items are placeholders. Names and descriptions will be revisited
 * as game systems mature and the world bible evolves.
 */

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
  // Rare drops
  ASHEN_HEARTWOOD: 'ashen_heartwood',
  DUST_PEARL: 'dust_pearl',
  SCORCHED_RELIC: 'scorched_relic',
  FRACTURED_RUNESTONE: 'fractured_runestone',
} as const;

export const itemDefinitions: ItemDefinition[] = [
  // --- Logs ---
  {
    id: ITEM_IDS.NORMAL_LOG,
    name: 'Normal Log',
    description: 'A standard log from a common tree.',
    category: 'log',
    rarity: 'common',
    value: 1,
    stackable: true,
  },
  {
    id: ITEM_IDS.OAK_LOG,
    name: 'Oak Log',
    description: 'A sturdy log from an oak tree.',
    category: 'log',
    rarity: 'common',
    value: 3,
    stackable: true,
  },
  {
    id: ITEM_IDS.WILLOW_LOG,
    name: 'Willow Log',
    description: 'A flexible log from a willow tree.',
    category: 'log',
    rarity: 'common',
    value: 5,
    stackable: true,
  },
  // --- Fish ---
  {
    id: ITEM_IDS.RAW_SHRIMP,
    name: 'Raw Shrimp',
    description: 'A small shrimp, freshly caught.',
    category: 'fish',
    rarity: 'common',
    value: 1,
    stackable: true,
  },
  {
    id: ITEM_IDS.RAW_TROUT,
    name: 'Raw Trout',
    description: 'A plump trout from the brook.',
    category: 'fish',
    rarity: 'common',
    value: 4,
    stackable: true,
  },
  // --- Ores ---
  {
    id: ITEM_IDS.COPPER_ORE,
    name: 'Copper Ore',
    description: 'A chunk of copper ore.',
    category: 'ore',
    rarity: 'common',
    value: 2,
    stackable: true,
  },
  {
    id: ITEM_IDS.IRON_ORE,
    name: 'Iron Ore',
    description: 'A heavy piece of iron ore.',
    category: 'ore',
    rarity: 'common',
    value: 4,
    stackable: true,
  },
  {
    id: ITEM_IDS.SILVER_ORE,
    name: 'Silver Ore',
    description: 'A gleaming nugget of silver ore.',
    category: 'ore',
    rarity: 'common',
    value: 7,
    stackable: true,
  },
  // --- Rare drops (El Qabul themed, placeholders) ---
  {
    id: ITEM_IDS.ASHEN_HEARTWOOD,
    name: 'Ashen Heartwood',
    description: 'Petrified wood that radiates a faint, impossible warmth.',
    category: 'misc',
    rarity: 'uncommon',
    value: 15,
    stackable: true,
  },
  {
    id: ITEM_IDS.DUST_PEARL,
    name: 'Dust Pearl',
    description: 'An iridescent pearl pulled from silted waters. It hums when held.',
    category: 'misc',
    rarity: 'uncommon',
    value: 15,
    stackable: true,
  },
  {
    id: ITEM_IDS.SCORCHED_RELIC,
    name: 'Scorched Relic',
    description: 'A fragment of pre-cataclysm metalwork, still warm to the touch.',
    category: 'misc',
    rarity: 'rare',
    value: 40,
    stackable: true,
  },
  {
    id: ITEM_IDS.FRACTURED_RUNESTONE,
    name: 'Fractured Runestone',
    description: 'A broken stone etched with forgotten script. The marks seem to shift.',
    category: 'misc',
    rarity: 'rare',
    value: 50,
    stackable: true,
  },
];

/** Lookup map for item definitions by ID. */
export const itemDefinitionMap: Record<string, ItemDefinition> = Object.fromEntries(
  itemDefinitions.map((item) => [item.id, item]),
);
