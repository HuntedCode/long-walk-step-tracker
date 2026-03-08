import type { ItemId } from '../jobs/job-types';

/** Rarity tier for items and loot entries. Affects drop rate scaling with job level. */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * A single entry in a loot table — either guaranteed or rolled.
 *
 * For guaranteed entries, `weight` is ignored (set to 0 by convention).
 * For roll entries, `weight` determines relative probability.
 */
export interface LootEntry {
  /** The item to drop. */
  itemId: ItemId;
  /** Quantity range [min, max] (inclusive). Rolled uniformly per completion. */
  quantity: [min: number, max: number];
  /** Relative weight for roll selection. Higher = more likely. Ignored for guaranteed entries. */
  weight: number;
  /** Rarity tier — determines how much job level boosts this entry's weight. */
  rarity: ItemRarity;
}

/**
 * A complete loot table for an activity.
 *
 * Each activity completion:
 * 1. Awards all `guaranteed` entries (always).
 * 2. Rolls `rollCount` times on the `rolls` table, selecting one entry per roll
 *    via weighted random. Each roll may also yield nothing (based on `nothingWeight`).
 */
export interface LootTable {
  /** Drops that are always awarded on completion. */
  guaranteed: LootEntry[];
  /** Pool of possible bonus drops, selected by weighted random. */
  rolls: LootEntry[];
  /** Number of times to roll on the rolls table per completion. */
  rollCount: number;
  /** Weight for "no bonus drop" outcome. Competes with roll entry weights. */
  nothingWeight: number;
}
