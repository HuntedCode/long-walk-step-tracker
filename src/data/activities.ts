import type { ActivityDefinition } from '../game/jobs/job-types';
import { JOB_IDS } from './jobs';
import { ITEM_IDS } from './items';
import { ZONE_IDS } from './zones';

export const activityDefinitions: ActivityDefinition[] = [
  // ════════════════════════════════════════════════════════════
  // Hub: The Cairn
  // ════════════════════════════════════════════════════════════
  {
    id: 'gather_scrub_brush',
    name: 'Gather Scrub Brush',
    description: 'Pull dry scrub from the cracked earth around the camp.',
    jobId: JOB_IDS.FORAGING,
    zoneId: ZONE_IDS.THE_CAIRN,
    stepsRequired: 100,
    itemRewards: [{ itemId: ITEM_IDS.SCRUB_BRUSH, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.FORAGING, amount: 15 }],
    requirements: [],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.SCRUB_BRUSH, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [],
      rollCount: 1,
      nothingWeight: 0,
    },
  },
  {
    id: 'split_deadwood',
    name: 'Split Deadwood',
    description: 'Break apart fallen branches for kindling and splints.',
    jobId: JOB_IDS.WOODCUTTING,
    zoneId: ZONE_IDS.THE_CAIRN,
    stepsRequired: 110,
    itemRewards: [{ itemId: ITEM_IDS.DEADWOOD_SPLINT, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.WOODCUTTING, amount: 15 }],
    requirements: [],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.DEADWOOD_SPLINT, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [],
      rollCount: 1,
      nothingWeight: 0,
    },
  },
  {
    id: 'cook_simple_meal',
    name: 'Cook Simple Meal',
    description: 'Combine whatever is on hand over the cookfire.',
    jobId: JOB_IDS.COOKING,
    zoneId: ZONE_IDS.THE_COOKFIRE,
    stepsRequired: 120,
    itemRewards: [{ itemId: ITEM_IDS.SIMPLE_MEAL, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.COOKING, amount: 18 }],
    requirements: [],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.SIMPLE_MEAL, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [],
      rollCount: 1,
      nothingWeight: 0,
    },
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: Outskirts
  // ════════════════════════════════════════════════════════════

  // --- Dustfall Edge ---
  {
    id: 'gather_dustbloom',
    name: 'Gather Dustbloom',
    description: 'Pick pale flowers from the dry borderlands.',
    jobId: JOB_IDS.FORAGING,
    zoneId: ZONE_IDS.DUSTFALL_EDGE,
    stepsRequired: 150,
    itemRewards: [{ itemId: ITEM_IDS.DUSTBLOOM, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.FORAGING, amount: 20 }],
    requirements: [],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.DUSTBLOOM, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.FRAGMENT_OF_AMBITION, quantity: [1, 1], weight: 1, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 99,
    },
  },

  // --- Pilgrim's Rest ---
  {
    id: 'cook_travelers_stew',
    name: "Cook Traveler's Stew",
    description: 'Prepare a hearty stew at the waystation fire.',
    jobId: JOB_IDS.COOKING,
    zoneId: ZONE_IDS.PILGRIMS_REST,
    stepsRequired: 180,
    itemRewards: [{ itemId: ITEM_IDS.TRAVELERS_STEW, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.COOKING, amount: 28 }],
    requirements: [{ jobId: JOB_IDS.COOKING, level: 5 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.TRAVELERS_STEW, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [],
      rollCount: 1,
      nothingWeight: 0,
    },
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: Quarry Highlands [SPECIALTY: Mining, Smithing, Construction]
  // ════════════════════════════════════════════════════════════

  // --- The Quarry Face ---
  {
    id: 'mine_sandstone',
    name: 'Mine Sandstone',
    description: 'Break apart golden stone at the quarry face.',
    jobId: JOB_IDS.MINING,
    zoneId: ZONE_IDS.THE_QUARRY_FACE,
    stepsRequired: 150,
    itemRewards: [{ itemId: ITEM_IDS.SANDSTONE, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.MINING, amount: 25 }],
    requirements: [],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.SANDSTONE, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.FRAGMENT_OF_AMBITION, quantity: [1, 1], weight: 1, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 99,
    },
  },
  {
    id: 'mine_marble',
    name: 'Mine Marble',
    description: 'Extract veined white marble from deeper deposits.',
    jobId: JOB_IDS.MINING,
    zoneId: ZONE_IDS.THE_QUARRY_FACE,
    stepsRequired: 300,
    itemRewards: [{ itemId: ITEM_IDS.AL_FAKHR_MARBLE, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.MINING, amount: 55 }],
    requirements: [{ jobId: JOB_IDS.MINING, level: 10 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.AL_FAKHR_MARBLE, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.SCORCHED_RELIC, quantity: [1, 1], weight: 3, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 97,
    },
  },
  {
    id: 'mine_gilded_ore',
    name: 'Mine Gilded Ore',
    description: 'Chip away at metallic veins deep in the quarry wall.',
    jobId: JOB_IDS.MINING,
    zoneId: ZONE_IDS.THE_QUARRY_FACE,
    stepsRequired: 500,
    itemRewards: [{ itemId: ITEM_IDS.GILDED_ORE, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.MINING, amount: 90 }],
    requirements: [{ jobId: JOB_IDS.MINING, level: 25 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.GILDED_ORE, quantity: [1, 1], weight: 0, rarity: 'uncommon' },
      ],
      rolls: [
        { itemId: ITEM_IDS.SCORCHED_RELIC, quantity: [1, 1], weight: 5, rarity: 'rare' },
        { itemId: ITEM_IDS.BUILDERS_CREST, quantity: [1, 1], weight: 2, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 93,
    },
  },

  // --- Amber Ridge ---
  {
    id: 'mine_deep_vein',
    name: 'Mine Deep Vein',
    description: 'Follow rich mineral veins exposed by wind erosion along the ridge.',
    jobId: JOB_IDS.MINING,
    zoneId: ZONE_IDS.AMBER_RIDGE,
    stepsRequired: 400,
    itemRewards: [{ itemId: ITEM_IDS.GILDED_ORE, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.MINING, amount: 75 }],
    requirements: [{ jobId: JOB_IDS.MINING, level: 20 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.GILDED_ORE, quantity: [1, 1], weight: 0, rarity: 'uncommon' },
      ],
      rolls: [
        { itemId: ITEM_IDS.FRAGMENT_OF_AMBITION, quantity: [1, 1], weight: 2, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 98,
    },
  },
  {
    id: 'survey_from_ridge',
    name: 'Survey from the Ridge',
    description: 'Use the high vantage point to map the surrounding terrain.',
    jobId: JOB_IDS.WAYFINDING,
    zoneId: ZONE_IDS.AMBER_RIDGE,
    stepsRequired: 300,
    itemRewards: [],
    xpRewards: [{ jobId: JOB_IDS.WAYFINDING, amount: 45 }],
    requirements: [{ jobId: JOB_IDS.WAYFINDING, level: 10 }],
  },

  // --- The Cutting Yard ---
  {
    id: 'shape_sandstone_blocks',
    name: 'Shape Sandstone Blocks',
    description: 'Cut and square raw sandstone into usable building blocks.',
    jobId: JOB_IDS.SMITHING,
    zoneId: ZONE_IDS.THE_CUTTING_YARD,
    stepsRequired: 200,
    itemRewards: [{ itemId: ITEM_IDS.SANDSTONE_BLOCK, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.SMITHING, amount: 30 }],
    requirements: [{ jobId: JOB_IDS.SMITHING, level: 5 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.SANDSTONE_BLOCK, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [],
      rollCount: 1,
      nothingWeight: 0,
    },
  },
  {
    id: 'lay_cut_stone',
    name: 'Lay Cut Stone',
    description: 'Set shaped blocks into walls and foundations under construction.',
    jobId: JOB_IDS.CONSTRUCTION,
    zoneId: ZONE_IDS.THE_CUTTING_YARD,
    stepsRequired: 280,
    itemRewards: [],
    xpRewards: [{ jobId: JOB_IDS.CONSTRUCTION, amount: 42 }],
    requirements: [{ jobId: JOB_IDS.CONSTRUCTION, level: 8 }],
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: The Greenwood
  // ════════════════════════════════════════════════════════════

  // --- The Lone Garden ---
  {
    id: 'gather_wild_herbs',
    name: 'Gather Wild Herbs',
    description: 'Pick aromatic herbs growing in the garden undergrowth.',
    jobId: JOB_IDS.FORAGING,
    zoneId: ZONE_IDS.THE_LONE_GARDEN,
    stepsRequired: 120,
    itemRewards: [{ itemId: ITEM_IDS.WILD_HERB, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.FORAGING, amount: 20 }],
    requirements: [],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.WILD_HERB, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [],
      rollCount: 1,
      nothingWeight: 0,
    },
  },
  {
    id: 'harvest_desert_figs',
    name: 'Harvest Desert Figs',
    description: 'Carefully pick ripe figs from trees the keeper tends individually.',
    jobId: JOB_IDS.FORAGING,
    zoneId: ZONE_IDS.THE_LONE_GARDEN,
    stepsRequired: 250,
    itemRewards: [{ itemId: ITEM_IDS.DESERT_FIG, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.FORAGING, amount: 45 }],
    requirements: [{ jobId: JOB_IDS.FORAGING, level: 12 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.DESERT_FIG, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.ASHEN_HEARTWOOD, quantity: [1, 1], weight: 4, rarity: 'uncommon' },
      ],
      rollCount: 1,
      nothingWeight: 96,
    },
  },

  // --- The Hidden Spring ---
  {
    id: 'fish_the_spring',
    name: 'Fish the Spring',
    description: 'Drop a line into the quiet pool. Eels hide among the moss-covered stones.',
    jobId: JOB_IDS.FISHING,
    zoneId: ZONE_IDS.THE_HIDDEN_SPRING,
    stepsRequired: 200,
    itemRewards: [{ itemId: ITEM_IDS.SPRING_EEL, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.FISHING, amount: 30 }],
    requirements: [{ jobId: JOB_IDS.FISHING, level: 5 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.SPRING_EEL, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.DUST_PEARL, quantity: [1, 1], weight: 5, rarity: 'uncommon' },
      ],
      rollCount: 1,
      nothingWeight: 95,
    },
  },

  // --- Ironwood Grove ---
  {
    id: 'chop_ironwood',
    name: 'Chop Ironwood',
    description: 'Fell an ironwood tree. The wood resists every swing.',
    jobId: JOB_IDS.WOODCUTTING,
    zoneId: ZONE_IDS.IRONWOOD_GROVE,
    stepsRequired: 350,
    itemRewards: [{ itemId: ITEM_IDS.IRONWOOD_LOG, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.WOODCUTTING, amount: 60 }],
    requirements: [{ jobId: JOB_IDS.WOODCUTTING, level: 10 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.IRONWOOD_LOG, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.ASHEN_HEARTWOOD, quantity: [1, 1], weight: 6, rarity: 'uncommon' },
      ],
      rollCount: 1,
      nothingWeight: 94,
    },
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: The Ruins
  // ════════════════════════════════════════════════════════════

  // --- The Unfinished Reach ---
  {
    id: 'salvage_scrap_metal',
    name: 'Salvage Scrap Metal',
    description: 'Pull usable metal from the half-built monument.',
    jobId: JOB_IDS.SALVAGING,
    zoneId: ZONE_IDS.THE_UNFINISHED_REACH,
    stepsRequired: 150,
    itemRewards: [{ itemId: ITEM_IDS.OLD_SCRAP_METAL, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.SALVAGING, amount: 25 }],
    requirements: [],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.OLD_SCRAP_METAL, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.SCORCHED_RELIC, quantity: [1, 1], weight: 3, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 97,
    },
  },
  {
    id: 'reinforce_foundation',
    name: 'Reinforce Foundation',
    description: 'Shore up the crumbling base of the monument. It may never be finished, but it can be preserved.',
    jobId: JOB_IDS.CONSTRUCTION,
    zoneId: ZONE_IDS.THE_UNFINISHED_REACH,
    stepsRequired: 350,
    itemRewards: [],
    xpRewards: [{ jobId: JOB_IDS.CONSTRUCTION, amount: 55 }],
    requirements: [{ jobId: JOB_IDS.CONSTRUCTION, level: 10 }],
  },

  // --- The Collapsed Gallery ---
  {
    id: 'salvage_old_machinery',
    name: 'Salvage Old Machinery',
    description: 'Dismantle pre-collapse machinery in the buried chambers.',
    jobId: JOB_IDS.SALVAGING,
    zoneId: ZONE_IDS.THE_COLLAPSED_GALLERY,
    stepsRequired: 400,
    itemRewards: [{ itemId: ITEM_IDS.OLD_SCRAP_METAL, quantity: 2 }],
    xpRewards: [{ jobId: JOB_IDS.SALVAGING, amount: 70 }],
    requirements: [{ jobId: JOB_IDS.SALVAGING, level: 15 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.OLD_SCRAP_METAL, quantity: [1, 2], weight: 0, rarity: 'common' },
      ],
      rolls: [
        { itemId: ITEM_IDS.SCORCHED_RELIC, quantity: [1, 1], weight: 5, rarity: 'rare' },
        { itemId: ITEM_IDS.FRACTURED_RUNESTONE, quantity: [1, 1], weight: 3, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 92,
    },
  },
  {
    id: 'etch_rune_fragment',
    name: 'Etch Rune Fragment',
    description: 'Study the inscriptions on the gallery walls and reproduce fragments on blank stone.',
    jobId: JOB_IDS.RUNECRAFT,
    zoneId: ZONE_IDS.THE_COLLAPSED_GALLERY,
    stepsRequired: 300,
    itemRewards: [{ itemId: ITEM_IDS.ETCHED_RUNE_SHARD, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.RUNECRAFT, amount: 45 }],
    requirements: [{ jobId: JOB_IDS.RUNECRAFT, level: 8 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.ETCHED_RUNE_SHARD, quantity: [1, 1], weight: 0, rarity: 'uncommon' },
      ],
      rolls: [
        { itemId: ITEM_IDS.FRACTURED_RUNESTONE, quantity: [1, 1], weight: 4, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 96,
    },
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: The City
  // ════════════════════════════════════════════════════════════

  // --- The Promenade ---
  {
    id: 'trade_at_bazaar',
    name: 'Trade at the Bazaar',
    description: 'Navigate the bustling market, making connections and exchanging goods.',
    jobId: JOB_IDS.CONNECTION,
    zoneId: ZONE_IDS.THE_PROMENADE,
    stepsRequired: 250,
    itemRewards: [],
    xpRewards: [{ jobId: JOB_IDS.CONNECTION, amount: 35 }],
    requirements: [],
  },

  // --- The Forge Quarter ---
  {
    id: 'work_the_forge',
    name: 'Work the Forge',
    description: 'Heat and shape metal at the quarter\'s furnaces.',
    jobId: JOB_IDS.SMITHING,
    zoneId: ZONE_IDS.THE_FORGE_QUARTER,
    stepsRequired: 250,
    itemRewards: [],
    xpRewards: [{ jobId: JOB_IDS.SMITHING, amount: 40 }],
    requirements: [{ jobId: JOB_IDS.SMITHING, level: 5 }],
  },
  {
    id: 'forge_marble_fittings',
    name: 'Forge Marble Fittings',
    description: 'Craft precision-cut marble pieces for decorative construction.',
    jobId: JOB_IDS.SMITHING,
    zoneId: ZONE_IDS.THE_FORGE_QUARTER,
    stepsRequired: 400,
    itemRewards: [{ itemId: ITEM_IDS.MARBLE_FITTING, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.SMITHING, amount: 65 }],
    requirements: [{ jobId: JOB_IDS.SMITHING, level: 15 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.MARBLE_FITTING, quantity: [1, 1], weight: 0, rarity: 'uncommon' },
      ],
      rolls: [
        { itemId: ITEM_IDS.BUILDERS_CREST, quantity: [1, 1], weight: 3, rarity: 'rare' },
      ],
      rollCount: 1,
      nothingWeight: 97,
    },
  },

  // --- The High Archive ---
  {
    id: 'study_the_archives',
    name: 'Study the Archives',
    description: 'Pore over preserved texts and maps in the library built on ruins.',
    jobId: JOB_IDS.DIVINATION,
    zoneId: ZONE_IDS.THE_HIGH_ARCHIVE,
    stepsRequired: 300,
    itemRewards: [],
    xpRewards: [{ jobId: JOB_IDS.DIVINATION, amount: 45 }],
    requirements: [{ jobId: JOB_IDS.DIVINATION, level: 5 }],
  },
  {
    id: 'brew_dustbloom_tincture',
    name: 'Brew Dustbloom Tincture',
    description: 'Use the archive\'s alchemical equipment to distill dustbloom petals.',
    jobId: JOB_IDS.ALCHEMY,
    zoneId: ZONE_IDS.THE_HIGH_ARCHIVE,
    stepsRequired: 250,
    itemRewards: [{ itemId: ITEM_IDS.DUSTBLOOM_TINCTURE, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.ALCHEMY, amount: 35 }],
    requirements: [{ jobId: JOB_IDS.ALCHEMY, level: 5 }],
    lootTable: {
      guaranteed: [
        { itemId: ITEM_IDS.DUSTBLOOM_TINCTURE, quantity: [1, 1], weight: 0, rarity: 'common' },
      ],
      rolls: [],
      rollCount: 1,
      nothingWeight: 0,
    },
  },

  // --- The Builder's Terrace ---
  {
    id: 'lay_new_foundations',
    name: 'Lay New Foundations',
    description: 'Set stone and mortar for the next level of the city\'s expansion.',
    jobId: JOB_IDS.CONSTRUCTION,
    zoneId: ZONE_IDS.THE_BUILDERS_TERRACE,
    stepsRequired: 200,
    itemRewards: [],
    xpRewards: [{ jobId: JOB_IDS.CONSTRUCTION, amount: 30 }],
    requirements: [{ jobId: JOB_IDS.CONSTRUCTION, level: 5 }],
  },
  {
    id: 'reinforce_the_walls',
    name: 'Reinforce the Walls',
    description: 'Strengthen the city walls with additional stonework and bracing.',
    jobId: JOB_IDS.CONSTRUCTION,
    zoneId: ZONE_IDS.THE_BUILDERS_TERRACE,
    stepsRequired: 400,
    itemRewards: [],
    xpRewards: [{ jobId: JOB_IDS.CONSTRUCTION, amount: 65 }],
    requirements: [{ jobId: JOB_IDS.CONSTRUCTION, level: 15 }],
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: Story Zones
  // ════════════════════════════════════════════════════════════

  // --- Karam's Scaffold ---
  {
    id: 'reinforce_scaffold',
    name: 'Reinforce the Scaffold',
    description: 'Help stabilize the towering structure. Karam watches but says nothing.',
    jobId: JOB_IDS.CONSTRUCTION,
    zoneId: ZONE_IDS.KARAMS_SCAFFOLD,
    stepsRequired: 500,
    itemRewards: [],
    xpRewards: [{ jobId: JOB_IDS.CONSTRUCTION, amount: 80 }],
    requirements: [{ jobId: JOB_IDS.CONSTRUCTION, level: 20 }],
  },

  // --- The Rival's Camp ---
  {
    id: 'forge_camp_tools',
    name: 'Forge Camp Tools',
    description: 'Shape metal into practical tools at Tariq\'s forge. Function over form.',
    jobId: JOB_IDS.SMITHING,
    zoneId: ZONE_IDS.THE_RIVALS_CAMP,
    stepsRequired: 300,
    itemRewards: [],
    xpRewards: [{ jobId: JOB_IDS.SMITHING, amount: 50 }],
    requirements: [{ jobId: JOB_IDS.SMITHING, level: 10 }],
  },

  // --- The Old Foundation ---
  {
    id: 'read_the_stones',
    name: 'Read the Stones',
    description: 'Study the remnants of the original city. The stones remember what stood here.',
    jobId: JOB_IDS.DIVINATION,
    zoneId: ZONE_IDS.THE_OLD_FOUNDATION,
    stepsRequired: 350,
    itemRewards: [{ itemId: ITEM_IDS.FOUNDATION_RELIC, quantity: 1 }],
    xpRewards: [{ jobId: JOB_IDS.DIVINATION, amount: 55 }],
    requirements: [{ jobId: JOB_IDS.DIVINATION, level: 10 }],
    lootTable: {
      guaranteed: [],
      rolls: [
        { itemId: ITEM_IDS.FOUNDATION_RELIC, quantity: [1, 1], weight: 20, rarity: 'uncommon' },
      ],
      rollCount: 1,
      nothingWeight: 80,
    },
  },

  // --- The Newcomer's Workshop ---
  // No activities. This is a narrative zone for future quests.
];

/** Lookup map for activity definitions by ID. */
export const activityDefinitionMap: Record<string, ActivityDefinition> = Object.fromEntries(
  activityDefinitions.map((act) => [act.id, act]),
);

/** Get all activities available in a specific zone. */
export function getActivitiesForZone(zoneId: string): ActivityDefinition[] {
  return activityDefinitions.filter((act) => act.zoneId === zoneId);
}
