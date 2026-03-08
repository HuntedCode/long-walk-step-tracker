/** Unique identifier for a job (e.g., 'woodcutting', 'fishing'). */
export type JobId = string;

/** Unique identifier for an activity (e.g., 'chop_normal_tree'). */
export type ActivityId = string;

/** Unique identifier for an item (e.g., 'normal_log'). */
export type ItemId = string;

/** Unique identifier for a zone (e.g., 'whispering_woods'). */
export type ZoneId = string;

/** Static definition of a job. Lives in src/data/jobs.ts. */
export interface JobDefinition {
  id: JobId;
  name: string;
  description: string;
  /** Max level for this job. */
  maxLevel: number;
}

/** Item category for grouping in inventory. */
export type ItemCategory = 'log' | 'fish' | 'ore' | 'gem' | 'herb' | 'food' | 'equipment' | 'misc';

/** Re-export ItemRarity so consumers don't need to import from loot-types directly. */
export type { ItemRarity } from '../loot/loot-types';

/** Static definition of an item. Lives in src/data/items.ts. */
export interface ItemDefinition {
  id: ItemId;
  name: string;
  description: string;
  category: ItemCategory;
  /** Rarity tier. Affects drop rate scaling and UI styling. */
  rarity: import('../loot/loot-types').ItemRarity;
  /** Base value (for future selling/trading). 0 = unsellable. */
  value: number;
  /** Whether this item stacks in inventory. Materials stack; equipment won't. */
  stackable: boolean;
}

/** An item reward granted on activity completion. */
export interface ItemReward {
  itemId: ItemId;
  quantity: number;
}

/** XP reward granted on activity completion. */
export interface XpReward {
  jobId: JobId;
  amount: number;
}

/** Requirement to unlock an activity (job must be at a minimum level). */
export interface LevelRequirement {
  jobId: JobId;
  level: number;
}

/** Static definition of an activity. Lives in src/data/activities.ts. */
export interface ActivityDefinition {
  id: ActivityId;
  name: string;
  description: string;
  /** Which job this activity belongs to. */
  jobId: JobId;
  /** Which zone this activity is available in. */
  zoneId: ZoneId;
  /** Steps required to complete one action. */
  stepsRequired: number;
  /** Items awarded on completion (legacy — used as fallback when lootTable is absent). */
  itemRewards: ItemReward[];
  /** XP awarded on completion. */
  xpRewards: XpReward[];
  /** Level requirement to unlock. Empty array = always available. */
  requirements: LevelRequirement[];
  /** Probabilistic loot table. When present, overrides itemRewards for item drops. */
  lootTable?: import('../loot/loot-types').LootTable;
}

/** Runtime state of a job for a single player. */
export interface JobState {
  jobId: JobId;
  xp: number;
  level: number;
}

/** Runtime state of an in-progress activity. */
export interface ActivityProgressState {
  activityId: ActivityId;
  /** Steps accumulated toward current completion. */
  stepsProgress: number;
}

/** Result of processing steps against an activity. */
export interface ActivityTickResult {
  /** Updated activity progress (auto-restarted if completed). */
  progress: ActivityProgressState;
  /** Number of times the activity was completed in this tick. */
  completions: number;
  /** Total items awarded across all completions. */
  itemRewards: ItemReward[];
  /** Total XP awarded across all completions. */
  xpRewards: XpReward[];
  /** Steps leftover after all completions (already applied to restarted progress). */
  stepsConsumed: number;
}
