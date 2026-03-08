/**
 * Seeded pseudo-random number generator using the mulberry32 algorithm.
 *
 * Provides deterministic, reproducible random sequences from a 32-bit seed.
 * Fast and well-distributed — suitable for game mechanics (loot rolls, combat,
 * encounters) but NOT cryptographic use.
 *
 * Usage:
 *   const rng = createRNG(12345);     // explicit seed (deterministic)
 *   const rng = createRNG();          // timestamp seed (production)
 *   rng.next();                       // float in [0, 1)
 *   rng.nextInt(1, 6);               // integer in [1, 6]
 *   rng.weightedSelect([10, 5, 1]);  // index 0, 1, or 2 by weight
 */

/** Mulberry32 core — returns next state and a float in [0, 1). */
function mulberry32(state: number): { nextState: number; value: number } {
  let t = (state + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  return { nextState: (state + 0x6d2b79f5) | 0, value };
}

export class SeededRNG {
  private state: number;

  constructor(seed: number) {
    // Ensure the seed is a 32-bit integer
    this.state = seed | 0;
  }

  /** Returns a float in [0, 1). */
  next(): number {
    const result = mulberry32(this.state);
    this.state = result.nextState;
    return result.value;
  }

  /** Returns an integer in [min, max] (inclusive). */
  nextInt(min: number, max: number): number {
    if (min > max) {
      throw new Error(`nextInt: min (${min}) must be <= max (${max})`);
    }
    if (min === max) return min;
    const range = max - min + 1;
    return min + Math.floor(this.next() * range);
  }

  /** Pick a random element from an array. */
  pick<T>(array: readonly T[]): T {
    if (array.length === 0) {
      throw new Error('pick: array must not be empty');
    }
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Weighted random selection. Returns the index of the chosen entry.
   *
   * Weights are relative — [10, 5, 1] means index 0 is chosen ~62.5% of the
   * time, index 1 ~31.25%, index 2 ~6.25%. All weights must be >= 0 and at
   * least one must be > 0.
   */
  weightedSelect(weights: readonly number[]): number {
    if (weights.length === 0) {
      throw new Error('weightedSelect: weights array must not be empty');
    }

    let totalWeight = 0;
    for (const w of weights) {
      if (w < 0) {
        throw new Error(`weightedSelect: negative weight (${w}) not allowed`);
      }
      totalWeight += w;
    }

    if (totalWeight <= 0) {
      throw new Error('weightedSelect: total weight must be > 0');
    }

    const roll = this.next() * totalWeight;
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (roll < cumulative) {
        return i;
      }
    }

    // Floating-point edge case — return last non-zero weight index
    for (let i = weights.length - 1; i >= 0; i--) {
      if (weights[i] > 0) return i;
    }

    return weights.length - 1;
  }

  /** Shuffle an array in place (Fisher-Yates). Returns the same array. */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  /** Create a child RNG with a derived seed. */
  fork(): SeededRNG {
    // Use the next value to derive a new seed, ensuring parent and child
    // produce different sequences going forward.
    const derivedSeed = Math.floor(this.next() * 0x100000000);
    return new SeededRNG(derivedSeed);
  }
}

/** Create a SeededRNG. Defaults to `Date.now()` seed if none provided. */
export function createRNG(seed?: number): SeededRNG {
  return new SeededRNG(seed ?? Date.now());
}
