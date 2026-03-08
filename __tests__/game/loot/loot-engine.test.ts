import { SeededRNG } from '@/src/game/core/rng';
import {
  jobLevelMultiplier,
  applyJobLevelBonus,
  rollLootTable,
  rollLootForCompletions,
  aggregateRewards,
} from '@/src/game/loot/loot-engine';
import type { LootTable, LootEntry } from '@/src/game/loot/loot-types';

// --- Test helpers ---

function makeEntry(overrides: Partial<LootEntry> & { itemId: string }): LootEntry {
  return {
    quantity: [1, 1],
    weight: 10,
    rarity: 'common',
    ...overrides,
  };
}

function makeTable(overrides: Partial<LootTable> = {}): LootTable {
  return {
    guaranteed: [],
    rolls: [],
    rollCount: 1,
    nothingWeight: 0,
    ...overrides,
  };
}

// --- Tests ---

describe('jobLevelMultiplier', () => {
  it('returns 1.0 at level 1', () => {
    expect(jobLevelMultiplier(1)).toBe(1);
  });

  it('returns ~1.735 at level 50', () => {
    expect(jobLevelMultiplier(50)).toBeCloseTo(1.735, 3);
  });

  it('returns ~2.47 at level 99', () => {
    expect(jobLevelMultiplier(99)).toBeCloseTo(2.47, 2);
  });
});

describe('applyJobLevelBonus', () => {
  it('does not modify common entries', () => {
    const entries = [makeEntry({ itemId: 'log', weight: 50, rarity: 'common' })];
    const result = applyJobLevelBonus(entries, 99);

    expect(result[0].weight).toBe(50);
  });

  it('boosts uncommon entries based on job level', () => {
    const entries = [makeEntry({ itemId: 'gem', weight: 10, rarity: 'uncommon' })];
    const result = applyJobLevelBonus(entries, 99);

    // multiplier at 99 = 2.47, scale for uncommon = 1
    // boosted = 10 * (1 + (2.47 - 1) * 1) = 10 * 2.47 = 24.7
    expect(result[0].weight).toBeCloseTo(24.7, 0);
  });

  it('boosts rare entries more than uncommon', () => {
    const uncommon = makeEntry({ itemId: 'a', weight: 10, rarity: 'uncommon' });
    const rare = makeEntry({ itemId: 'b', weight: 10, rarity: 'rare' });

    const [resultU] = applyJobLevelBonus([uncommon], 50);
    const [resultR] = applyJobLevelBonus([rare], 50);

    expect(resultR.weight).toBeGreaterThan(resultU.weight);
  });

  it('returns unchanged weights at level 1', () => {
    const entries = [
      makeEntry({ itemId: 'a', weight: 10, rarity: 'uncommon' }),
      makeEntry({ itemId: 'b', weight: 5, rarity: 'rare' }),
    ];
    const result = applyJobLevelBonus(entries, 1);

    expect(result[0].weight).toBe(10);
    expect(result[1].weight).toBe(5);
  });

  it('does not mutate the original entries', () => {
    const entries = [makeEntry({ itemId: 'gem', weight: 10, rarity: 'rare' })];
    applyJobLevelBonus(entries, 99);

    expect(entries[0].weight).toBe(10);
  });
});

describe('rollLootTable', () => {
  it('always awards guaranteed entries', () => {
    const table = makeTable({
      guaranteed: [
        makeEntry({ itemId: 'log', quantity: [1, 1] }),
        makeEntry({ itemId: 'bark', quantity: [2, 2] }),
      ],
    });

    const rng = new SeededRNG(42);
    const rewards = rollLootTable(table, 1, rng);

    expect(rewards).toEqual([
      { itemId: 'log', quantity: 1 },
      { itemId: 'bark', quantity: 2 },
    ]);
  });

  it('rolls quantity within range for guaranteed entries', () => {
    const table = makeTable({
      guaranteed: [makeEntry({ itemId: 'log', quantity: [1, 5] })],
    });

    const quantities = new Set<number>();
    for (let seed = 0; seed < 200; seed++) {
      const rng = new SeededRNG(seed);
      const [reward] = rollLootTable(table, 1, rng);
      quantities.add(reward.quantity);
      expect(reward.quantity).toBeGreaterThanOrEqual(1);
      expect(reward.quantity).toBeLessThanOrEqual(5);
    }

    // Should see variety in quantities
    expect(quantities.size).toBeGreaterThan(1);
  });

  it('rolls from the roll table with correct proportions', () => {
    const table = makeTable({
      rolls: [
        makeEntry({ itemId: 'common_item', weight: 90, rarity: 'common' }),
        makeEntry({ itemId: 'rare_item', weight: 10, rarity: 'common' }),
      ],
      rollCount: 1,
      nothingWeight: 0,
    });

    const counts: Record<string, number> = { common_item: 0, rare_item: 0 };
    const iterations = 50000;

    for (let seed = 0; seed < iterations; seed++) {
      const rng = new SeededRNG(seed);
      const rewards = rollLootTable(table, 1, rng);
      for (const r of rewards) {
        counts[r.itemId]++;
      }
    }

    // ~90% common, ~10% rare (with tolerance)
    expect(counts.common_item / iterations).toBeCloseTo(0.9, 1);
    expect(counts.rare_item / iterations).toBeCloseTo(0.1, 1);
  });

  it('respects nothingWeight', () => {
    const table = makeTable({
      rolls: [makeEntry({ itemId: 'item', weight: 10, rarity: 'common' })],
      rollCount: 1,
      nothingWeight: 90, // 90% chance of nothing
    });

    let gotItem = 0;
    const iterations = 50000;

    for (let seed = 0; seed < iterations; seed++) {
      const rng = new SeededRNG(seed);
      const rewards = rollLootTable(table, 1, rng);
      if (rewards.length > 0) gotItem++;
    }

    // ~10% should get the item
    expect(gotItem / iterations).toBeCloseTo(0.1, 1);
  });

  it('performs multiple rolls per completion when rollCount > 1', () => {
    const table = makeTable({
      rolls: [makeEntry({ itemId: 'gem', weight: 10, rarity: 'common' })],
      rollCount: 3,
      nothingWeight: 0, // Always drops
    });

    const rng = new SeededRNG(42);
    const rewards = rollLootTable(table, 1, rng);

    // 3 rolls, each guaranteed to drop → 3 rewards (before aggregation)
    expect(rewards.length).toBe(3);
    expect(rewards.every((r) => r.itemId === 'gem')).toBe(true);
  });

  it('returns empty rolls array when roll table is empty', () => {
    const table = makeTable({
      guaranteed: [],
      rolls: [],
      rollCount: 1,
    });

    const rng = new SeededRNG(42);
    const rewards = rollLootTable(table, 1, rng);

    expect(rewards).toEqual([]);
  });

  it('combines guaranteed and roll rewards', () => {
    const table = makeTable({
      guaranteed: [makeEntry({ itemId: 'log', quantity: [1, 1] })],
      rolls: [makeEntry({ itemId: 'gem', weight: 10, rarity: 'common' })],
      rollCount: 1,
      nothingWeight: 0,
    });

    const rng = new SeededRNG(42);
    const rewards = rollLootTable(table, 1, rng);

    expect(rewards.length).toBe(2);
    expect(rewards[0].itemId).toBe('log');
    expect(rewards[1].itemId).toBe('gem');
  });

  it('job level boosts rare drops in roll table', () => {
    const table = makeTable({
      rolls: [
        makeEntry({ itemId: 'common_drop', weight: 90, rarity: 'common' }),
        makeEntry({ itemId: 'rare_drop', weight: 10, rarity: 'rare' }),
      ],
      rollCount: 1,
      nothingWeight: 0,
    });

    // Measure rare drop rate at level 1 vs level 99
    const iterations = 50000;

    let rareAtLevel1 = 0;
    for (let seed = 0; seed < iterations; seed++) {
      const rng = new SeededRNG(seed);
      const rewards = rollLootTable(table, 1, rng);
      if (rewards.some((r) => r.itemId === 'rare_drop')) rareAtLevel1++;
    }

    let rareAtLevel99 = 0;
    for (let seed = 0; seed < iterations; seed++) {
      const rng = new SeededRNG(seed);
      const rewards = rollLootTable(table, 99, rng);
      if (rewards.some((r) => r.itemId === 'rare_drop')) rareAtLevel99++;
    }

    // Level 99 should get significantly more rare drops
    expect(rareAtLevel99).toBeGreaterThan(rareAtLevel1 * 1.5);
  });
});

describe('aggregateRewards', () => {
  it('sums quantities for the same itemId', () => {
    const rewards = [
      { itemId: 'log', quantity: 3 },
      { itemId: 'gem', quantity: 1 },
      { itemId: 'log', quantity: 2 },
    ];

    const result = aggregateRewards(rewards);

    expect(result).toContainEqual({ itemId: 'log', quantity: 5 });
    expect(result).toContainEqual({ itemId: 'gem', quantity: 1 });
    expect(result.length).toBe(2);
  });

  it('returns empty array for empty input', () => {
    expect(aggregateRewards([])).toEqual([]);
  });

  it('returns single entry unchanged', () => {
    const result = aggregateRewards([{ itemId: 'ore', quantity: 7 }]);
    expect(result).toEqual([{ itemId: 'ore', quantity: 7 }]);
  });
});

describe('rollLootForCompletions', () => {
  it('rolls independently for each completion', () => {
    const table = makeTable({
      guaranteed: [makeEntry({ itemId: 'log', quantity: [1, 1] })],
    });

    const rng = new SeededRNG(42);
    const rewards = rollLootForCompletions(table, 6, 1, rng);

    // 6 completions × 1 guaranteed log = 6 total
    expect(rewards).toEqual([{ itemId: 'log', quantity: 6 }]);
  });

  it('aggregates results across completions', () => {
    const table = makeTable({
      guaranteed: [
        makeEntry({ itemId: 'log', quantity: [1, 1] }),
        makeEntry({ itemId: 'bark', quantity: [1, 1] }),
      ],
    });

    const rng = new SeededRNG(42);
    const rewards = rollLootForCompletions(table, 3, 1, rng);

    expect(rewards).toContainEqual({ itemId: 'log', quantity: 3 });
    expect(rewards).toContainEqual({ itemId: 'bark', quantity: 3 });
  });

  it('can produce rare drops across multiple completions', () => {
    const table = makeTable({
      guaranteed: [makeEntry({ itemId: 'log', quantity: [1, 1] })],
      rolls: [makeEntry({ itemId: 'rare_gem', weight: 5, rarity: 'rare' })],
      rollCount: 1,
      nothingWeight: 95,
    });

    // Over many seeds with 10 completions each, some should get the rare drop
    let gotRare = false;
    for (let seed = 0; seed < 100; seed++) {
      const rng = new SeededRNG(seed);
      const rewards = rollLootForCompletions(table, 10, 1, rng);
      if (rewards.some((r) => r.itemId === 'rare_gem')) {
        gotRare = true;
        break;
      }
    }

    expect(gotRare).toBe(true);
  });

  it('returns empty for 0 completions', () => {
    const table = makeTable({
      guaranteed: [makeEntry({ itemId: 'log', quantity: [1, 1] })],
    });

    const rng = new SeededRNG(42);
    const rewards = rollLootForCompletions(table, 0, 1, rng);

    expect(rewards).toEqual([]);
  });

  it('produces deterministic results from the same seed', () => {
    const table = makeTable({
      guaranteed: [makeEntry({ itemId: 'log', quantity: [1, 3] })],
      rolls: [
        makeEntry({ itemId: 'gem', weight: 30, rarity: 'uncommon' }),
        makeEntry({ itemId: 'relic', weight: 5, rarity: 'rare' }),
      ],
      rollCount: 1,
      nothingWeight: 65,
    });

    const rng1 = new SeededRNG(42);
    const rng2 = new SeededRNG(42);

    const rewards1 = rollLootForCompletions(table, 5, 10, rng1);
    const rewards2 = rollLootForCompletions(table, 5, 10, rng2);

    expect(rewards1).toEqual(rewards2);
  });
});
