import type { ActivityDefinition } from '../game/jobs/job-types';
import type { LootTable } from '../game/loot/loot-types';
import { JOB_IDS } from './jobs';
import { ITEM_IDS } from './items';
import { ZONE_IDS } from './zones';

export const activityDefinitions: ActivityDefinition[] = [
  // --- Woodcutting (Whispering Woods) ---
  {
    id: 'chop_normal_tree',
    name: 'Chop Normal Tree',
    description: 'Chop a common tree for basic logs.',
    jobId: JOB_IDS.WOODCUTTING,
    zoneId: ZONE_IDS.WHISPERING_WOODS,
    stepsRequired: 150,
    itemRewards: [{ itemId: ITEM_IDS.NORMAL_LOG, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.WOODCUTTING, amount: 25 }],
    requirements: [],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.NORMAL_LOG, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [],
      rollCount: 1,
      nothingWeight: 0,
    },
  },
  {
    id: 'chop_oak_tree',
    name: 'Chop Oak Tree',
    description: 'Fell a sturdy oak for quality lumber.',
    jobId: JOB_IDS.WOODCUTTING,
    zoneId: ZONE_IDS.WHISPERING_WOODS,
    stepsRequired: 300,
    itemRewards: [{ itemId: ITEM_IDS.OAK_LOG, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.WOODCUTTING, amount: 50 }],
    requirements: [{ jobId: JOB_IDS.WOODCUTTING, level: 15 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.OAK_LOG, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.ASHEN_HEARTWOOD, quantity: [1, 1], weight: 5, rarity: 'uncommon' },
      ],
      rollCount: 1,
      nothingWeight: 95,
    },
  },
  {
    id: 'chop_willow_tree',
    name: 'Chop Willow Tree',
    description: 'Harvest a tall willow for flexible wood.',
    jobId: JOB_IDS.WOODCUTTING,
    zoneId: ZONE_IDS.WHISPERING_WOODS,
    stepsRequired: 500,
    itemRewards: [{ itemId: ITEM_IDS.WILLOW_LOG, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.WOODCUTTING, amount: 85 }],
    requirements: [{ jobId: JOB_IDS.WOODCUTTING, level: 30 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.WILLOW_LOG, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.ASHEN_HEARTWOOD, quantity: [1, 1], weight: 8, rarity: 'uncommon' },
        { itemId: ITEM_IDS.FRACTURED_RUNESTONE, quantity: [1, 1], weight: 2, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 90,
    },
  },

  // --- Fishing (Silver Brook) ---
  {
    id: 'catch_shrimp',
    name: 'Catch Shrimp',
    description: 'Net small shrimp from shallow waters.',
    jobId: JOB_IDS.FISHING,
    zoneId: ZONE_IDS.SILVER_BROOK,
    stepsRequired: 120,
    itemRewards: [{ itemId: ITEM_IDS.RAW_SHRIMP, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.FISHING, amount: 20 }],
    requirements: [],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.RAW_SHRIMP, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [],
      rollCount: 1,
      nothingWeight: 0,
    },
  },
  {
    id: 'catch_trout',
    name: 'Catch Trout',
    description: 'Lure trout from deeper waters.',
    jobId: JOB_IDS.FISHING,
    zoneId: ZONE_IDS.SILVER_BROOK,
    stepsRequired: 280,
    itemRewards: [{ itemId: ITEM_IDS.RAW_TROUT, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.FISHING, amount: 45 }],
    requirements: [{ jobId: JOB_IDS.FISHING, level: 20 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.RAW_TROUT, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.DUST_PEARL, quantity: [1, 1], weight: 6, rarity: 'uncommon' },
        { itemId: ITEM_IDS.FRACTURED_RUNESTONE, quantity: [1, 1], weight: 2, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 92,
    },
  },

  // --- Mining (Ironpeak Ridge) ---
  {
    id: 'mine_copper',
    name: 'Mine Copper',
    description: 'Break apart soft rock to extract copper.',
    jobId: JOB_IDS.MINING,
    zoneId: ZONE_IDS.IRONPEAK_RIDGE,
    stepsRequired: 200,
    itemRewards: [{ itemId: ITEM_IDS.COPPER_ORE, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.MINING, amount: 30 }],
    requirements: [],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.COPPER_ORE, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [],
      rollCount: 1,
      nothingWeight: 0,
    },
  },
  {
    id: 'mine_iron',
    name: 'Mine Iron',
    description: 'Chip away at dense iron deposits.',
    jobId: JOB_IDS.MINING,
    zoneId: ZONE_IDS.IRONPEAK_RIDGE,
    stepsRequired: 400,
    itemRewards: [{ itemId: ITEM_IDS.IRON_ORE, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.MINING, amount: 60 }],
    requirements: [{ jobId: JOB_IDS.MINING, level: 15 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.IRON_ORE, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.SCORCHED_RELIC, quantity: [1, 1], weight: 4, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 96,
    },
  },
  {
    id: 'mine_silver',
    name: 'Mine Silver',
    description: 'Extract gleaming silver from deep veins.',
    jobId: JOB_IDS.MINING,
    zoneId: ZONE_IDS.IRONPEAK_RIDGE,
    stepsRequired: 600,
    itemRewards: [{ itemId: ITEM_IDS.SILVER_ORE, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.MINING, amount: 95 }],
    requirements: [{ jobId: JOB_IDS.MINING, level: 30 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.SILVER_ORE, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.SCORCHED_RELIC, quantity: [1, 1], weight: 7, rarity: 'rare' },
        { itemId: ITEM_IDS.FRACTURED_RUNESTONE, quantity: [1, 1], weight: 3, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 90,
    },
  },
];

/** Lookup map for activity definitions by ID. */
export const activityDefinitionMap: Record<string, ActivityDefinition> = Object.fromEntries(
  activityDefinitions.map((act) => [act.id, act]),
);

/** Get all activities available in a specific zone. */
export function getActivitiesForZone(zoneId: string): ActivityDefinition[] {
  return activityDefinitions.filter((act) => act.zoneId === zoneId);
}
