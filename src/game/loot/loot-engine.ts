/**
 * Loot engine — pure functions for rolling loot tables.
 *
 * No React, no side effects. Takes a SeededRNG and loot table,
 * returns item rewards. The game tick calls these after activity completions.
 */

import type { ItemReward } from '../jobs/job-types';
import type { ItemRarity, LootEntry, LootTable } from './loot-types';
import type { SeededRNG } from '../core/rng';

/** Rarity-tiered scaling factors for job level bonus. */
const RARITY_SCALE: Record<ItemRarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 1.5,
  epic: 2,
  legendary: 2.5,
};

/**
 * Calculate the job level multiplier for rare drop weight boosting.
 *
 * Level 1 = 1.0x (no bonus), Level 99 = ~2.47x.
 * Only non-common entries are boosted.
 */
export function jobLevelMultiplier(jobLevel: number): number {
  return 1 + (jobLevel - 1) * 0.015;
}

/**
 * Apply job level bonus to roll entries.
 *
 * Returns a new array with boosted weights for non-common entries.
 * Common entries are returned unchanged.
 */
export function applyJobLevelBonus(
  entries: readonly LootEntry[],
  jobLevel: number,
): LootEntry[] {
  const multiplier = jobLevelMultiplier(jobLevel);

  return entries.map((entry) => {
    const scale = RARITY_SCALE[entry.rarity];
    if (scale === 0) return { ...entry };

    return {
      ...entry,
      weight: entry.weight * (1 + (multiplier - 1) * scale),
    };
  });
}

/**
 * Roll a quantity within a LootEntry's [min, max] range.
 */
function rollQuantity(entry: LootEntry, rng: SeededRNG): number {
  return rng.nextInt(entry.quantity[0], entry.quantity[1]);
}

/**
 * Roll a loot table for a single activity completion.
 *
 * 1. Awards all guaranteed entries.
 * 2. Rolls `rollCount` times on the roll table (with job level bonus applied).
 *    Each roll may yield nothing (based on nothingWeight).
 *
 * Returns an array of ItemRewards (not aggregated — caller should aggregate).
 */
export function rollLootTable(
  table: LootTable,
  jobLevel: number,
  rng: SeededRNG,
): ItemReward[] {
  const rewards: ItemReward[] = [];

  // Guaranteed drops
  for (const entry of table.guaranteed) {
    const qty = rollQuantity(entry, rng);
    if (qty > 0) {
      rewards.push({ itemId: entry.itemId, quantity: qty });
    }
  }

  // Roll table
  if (table.rolls.length > 0) {
    const boostedEntries = applyJobLevelBonus(table.rolls, jobLevel);

    // Build weights array: [entry0, entry1, ..., nothing]
    const weights = boostedEntries.map((e) => e.weight);
    if (table.nothingWeight > 0) {
      weights.push(table.nothingWeight);
    }

    for (let roll = 0; roll < table.rollCount; roll++) {
      const selectedIndex = rng.weightedSelect(weights);

      // If selectedIndex is beyond the entries array, it's the "nothing" slot
      if (selectedIndex < boostedEntries.length) {
        const entry = boostedEntries[selectedIndex];
        const qty = rollQuantity(entry, rng);
        if (qty > 0) {
          rewards.push({ itemId: entry.itemId, quantity: qty });
        }
      }
    }
  }

  return rewards;
}

/**
 * Aggregate item rewards by itemId, summing quantities.
 */
export function aggregateRewards(rewards: ItemReward[]): ItemReward[] {
  const map = new Map<string, number>();

  for (const reward of rewards) {
    map.set(reward.itemId, (map.get(reward.itemId) ?? 0) + reward.quantity);
  }

  return Array.from(map.entries()).map(([itemId, quantity]) => ({
    itemId,
    quantity,
  }));
}

/**
 * Roll a loot table for N activity completions.
 *
 * Each completion rolls independently (so 6 completions = 6 chances at rare
 * drops). Results are aggregated by itemId.
 */
export function rollLootForCompletions(
  table: LootTable,
  completions: number,
  jobLevel: number,
  rng: SeededRNG,
): ItemReward[] {
  const allRewards: ItemReward[] = [];

  for (let i = 0; i < completions; i++) {
    allRewards.push(...rollLootTable(table, jobLevel, rng));
  }

  return aggregateRewards(allRewards);
}
