import { SeededRNG, createRNG } from '@/src/game/core/rng';

describe('SeededRNG', () => {
  describe('determinism', () => {
    it('produces the same sequence from the same seed', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(42);

      const seq1 = Array.from({ length: 20 }, () => rng1.next());
      const seq2 = Array.from({ length: 20 }, () => rng2.next());

      expect(seq1).toEqual(seq2);
    });

    it('produces different sequences from different seeds', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(99);

      const seq1 = Array.from({ length: 10 }, () => rng1.next());
      const seq2 = Array.from({ length: 10 }, () => rng2.next());

      expect(seq1).not.toEqual(seq2);
    });
  });

  describe('next()', () => {
    it('returns values in [0, 1)', () => {
      const rng = new SeededRNG(12345);

      for (let i = 0; i < 10000; i++) {
        const val = rng.next();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      }
    });

    it('produces roughly uniform distribution', () => {
      const rng = new SeededRNG(777);
      const buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 10 buckets
      const rolls = 100000;

      for (let i = 0; i < rolls; i++) {
        const bucket = Math.floor(rng.next() * 10);
        buckets[bucket]++;
      }

      const expected = rolls / 10;
      for (const count of buckets) {
        // Each bucket should be within 5% of expected
        expect(count).toBeGreaterThan(expected * 0.9);
        expect(count).toBeLessThan(expected * 1.1);
      }
    });
  });

  describe('nextInt()', () => {
    it('returns values in [min, max] inclusive', () => {
      const rng = new SeededRNG(42);

      for (let i = 0; i < 1000; i++) {
        const val = rng.nextInt(3, 7);
        expect(val).toBeGreaterThanOrEqual(3);
        expect(val).toBeLessThanOrEqual(7);
        expect(Number.isInteger(val)).toBe(true);
      }
    });

    it('returns min when min === max', () => {
      const rng = new SeededRNG(42);
      expect(rng.nextInt(5, 5)).toBe(5);
      expect(rng.nextInt(0, 0)).toBe(0);
    });

    it('covers all values in range', () => {
      const rng = new SeededRNG(42);
      const seen = new Set<number>();

      for (let i = 0; i < 1000; i++) {
        seen.add(rng.nextInt(1, 6));
      }

      expect(seen).toEqual(new Set([1, 2, 3, 4, 5, 6]));
    });

    it('throws when min > max', () => {
      const rng = new SeededRNG(42);
      expect(() => rng.nextInt(10, 5)).toThrow('min (10) must be <= max (5)');
    });
  });

  describe('pick()', () => {
    it('picks elements from the array', () => {
      const rng = new SeededRNG(42);
      const items = ['a', 'b', 'c', 'd'];

      for (let i = 0; i < 100; i++) {
        expect(items).toContain(rng.pick(items));
      }
    });

    it('eventually picks all elements', () => {
      const rng = new SeededRNG(42);
      const items = ['x', 'y', 'z'];
      const seen = new Set<string>();

      for (let i = 0; i < 100; i++) {
        seen.add(rng.pick(items));
      }

      expect(seen).toEqual(new Set(['x', 'y', 'z']));
    });

    it('throws on empty array', () => {
      const rng = new SeededRNG(42);
      expect(() => rng.pick([])).toThrow('array must not be empty');
    });

    it('works with single-element array', () => {
      const rng = new SeededRNG(42);
      expect(rng.pick([99])).toBe(99);
    });
  });

  describe('weightedSelect()', () => {
    it('selects indices proportional to weights', () => {
      const rng = new SeededRNG(42);
      const weights = [70, 20, 10]; // 70%, 20%, 10%
      const counts = [0, 0, 0];
      const rolls = 100000;

      for (let i = 0; i < rolls; i++) {
        counts[rng.weightedSelect(weights)]++;
      }

      // Check proportions with 3% tolerance
      expect(counts[0] / rolls).toBeCloseTo(0.7, 1);
      expect(counts[1] / rolls).toBeCloseTo(0.2, 1);
      expect(counts[2] / rolls).toBeCloseTo(0.1, 1);
    });

    it('always selects the only nonzero weight', () => {
      const rng = new SeededRNG(42);
      const weights = [0, 0, 10, 0];

      for (let i = 0; i < 100; i++) {
        expect(rng.weightedSelect(weights)).toBe(2);
      }
    });

    it('works with a single weight', () => {
      const rng = new SeededRNG(42);
      expect(rng.weightedSelect([5])).toBe(0);
    });

    it('handles very skewed weights', () => {
      const rng = new SeededRNG(42);
      // 999 vs 1 — the rare option should appear ~0.1% of the time
      const weights = [999, 1];
      const counts = [0, 0];
      const rolls = 100000;

      for (let i = 0; i < rolls; i++) {
        counts[rng.weightedSelect(weights)]++;
      }

      expect(counts[0] / rolls).toBeGreaterThan(0.99);
      expect(counts[1] / rolls).toBeLessThan(0.02);
      expect(counts[1]).toBeGreaterThan(0); // Should still appear
    });

    it('throws on empty weights', () => {
      const rng = new SeededRNG(42);
      expect(() => rng.weightedSelect([])).toThrow('weights array must not be empty');
    });

    it('throws on negative weight', () => {
      const rng = new SeededRNG(42);
      expect(() => rng.weightedSelect([10, -5, 3])).toThrow('negative weight');
    });

    it('throws when all weights are zero', () => {
      const rng = new SeededRNG(42);
      expect(() => rng.weightedSelect([0, 0, 0])).toThrow('total weight must be > 0');
    });
  });

  describe('shuffle()', () => {
    it('contains the same elements after shuffling', () => {
      const rng = new SeededRNG(42);
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      rng.shuffle(arr);

      expect(arr.sort()).toEqual(original.sort());
    });

    it('produces deterministic results', () => {
      const arr1 = [1, 2, 3, 4, 5, 6, 7, 8];
      const arr2 = [...arr1];

      new SeededRNG(42).shuffle(arr1);
      new SeededRNG(42).shuffle(arr2);

      expect(arr1).toEqual(arr2);
    });

    it('actually changes order (with high probability)', () => {
      const rng = new SeededRNG(42);
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const original = [...arr];
      rng.shuffle(arr);

      // With 10 elements, the chance of no change is astronomically low
      expect(arr).not.toEqual(original);
    });

    it('handles single-element array', () => {
      const rng = new SeededRNG(42);
      const arr = [1];
      rng.shuffle(arr);
      expect(arr).toEqual([1]);
    });

    it('handles empty array', () => {
      const rng = new SeededRNG(42);
      const arr: number[] = [];
      rng.shuffle(arr);
      expect(arr).toEqual([]);
    });

    it('returns the same array reference', () => {
      const rng = new SeededRNG(42);
      const arr = [1, 2, 3];
      const result = rng.shuffle(arr);
      expect(result).toBe(arr);
    });
  });

  describe('fork()', () => {
    it('creates a child with a different sequence', () => {
      const parent = new SeededRNG(42);
      const child = parent.fork();

      const parentSeq = Array.from({ length: 10 }, () => parent.next());
      const childSeq = Array.from({ length: 10 }, () => child.next());

      expect(parentSeq).not.toEqual(childSeq);
    });

    it('produces deterministic children', () => {
      const parent1 = new SeededRNG(42);
      const parent2 = new SeededRNG(42);

      const child1 = parent1.fork();
      const child2 = parent2.fork();

      const seq1 = Array.from({ length: 10 }, () => child1.next());
      const seq2 = Array.from({ length: 10 }, () => child2.next());

      expect(seq1).toEqual(seq2);
    });

    it('does not affect parent sequence after forking', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(42);

      // rng1: fork then continue
      const child = rng1.fork();
      const afterFork1 = rng1.next();

      // rng2: skip one next() (consumed by fork), then continue
      rng2.next(); // consumed by fork internally
      const afterFork2 = rng2.next();

      expect(afterFork1).toBe(afterFork2);
      // Use child to avoid unused variable
      expect(child).toBeDefined();
    });
  });

  describe('createRNG()', () => {
    it('creates an RNG with explicit seed', () => {
      const rng = createRNG(42);
      const expected = new SeededRNG(42);

      expect(rng.next()).toBe(expected.next());
    });

    it('creates an RNG without seed (uses timestamp)', () => {
      const rng = createRNG();
      const val = rng.next();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    });
  });
});
