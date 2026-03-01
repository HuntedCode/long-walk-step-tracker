/**
 * RuneScape-inspired exponential XP curve.
 *
 * Level 1 = 0 XP, Level 2 = 83 XP, Level 99 = 13,034,431 XP.
 * The curve is steep — early levels come fast, late levels require
 * serious dedication.
 */

const MAX_LEVEL = 99;

/**
 * Returns the cumulative XP required to reach a given level.
 * Level 1 requires 0 XP. Level must be between 1 and MAX_LEVEL.
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  const clamped = Math.min(level, MAX_LEVEL);
  let total = 0;
  for (let i = 1; i < clamped; i++) {
    total += Math.floor(i + 300 * Math.pow(2, i / 7));
  }
  return Math.floor(total / 4);
}

/**
 * Returns the level for a given amount of XP.
 * Searches from level 1 upward until the XP threshold exceeds the input.
 */
export function levelFromXp(xp: number): number {
  if (xp <= 0) return 1;
  for (let level = 2; level <= MAX_LEVEL; level++) {
    if (xp < xpForLevel(level)) {
      return level - 1;
    }
  }
  return MAX_LEVEL;
}

/**
 * Returns the XP remaining until the next level.
 * Returns 0 if already at MAX_LEVEL.
 */
export function xpToNextLevel(xp: number): number {
  const currentLevel = levelFromXp(xp);
  if (currentLevel >= MAX_LEVEL) return 0;
  return xpForLevel(currentLevel + 1) - xp;
}

/**
 * Returns the fraction of progress toward the next level (0 to 1).
 * Returns 1 if at MAX_LEVEL.
 */
export function levelProgress(xp: number): number {
  const currentLevel = levelFromXp(xp);
  if (currentLevel >= MAX_LEVEL) return 1;
  const currentThreshold = xpForLevel(currentLevel);
  const nextThreshold = xpForLevel(currentLevel + 1);
  const range = nextThreshold - currentThreshold;
  if (range <= 0) return 1;
  return (xp - currentThreshold) / range;
}
