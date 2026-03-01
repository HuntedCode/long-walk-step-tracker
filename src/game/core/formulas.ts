/**
 * Calculate the step bank capacity based on total level.
 *
 * Formula: 1000 + (totalLevel * 100)
 * - Level 3 (starting total): 1,300 step cap
 * - Level 30: 4,000 step cap
 * - Level 99 * 3 jobs = 297: 30,700 step cap
 *
 * Intentionally generous — players shouldn't feel punished
 * for forgetting to set an activity before walking.
 */
export function calculateBankCap(totalLevel: number): number {
  return 1000 + totalLevel * 100;
}

/**
 * Calculate effective steps when a player has banked steps.
 *
 * When an activity is active with banked steps available:
 * - Each real step is matched 1:1 with a banked step (2x progress)
 * - This continues until the bank is depleted
 *
 * Returns the total effective steps and how many banked steps were consumed.
 */
export function calculateEffectiveSteps(
  realSteps: number,
  bankedSteps: number,
): { effectiveSteps: number; bankedConsumed: number } {
  const bankedConsumed = Math.min(realSteps, bankedSteps);
  return {
    effectiveSteps: realSteps + bankedConsumed,
    bankedConsumed,
  };
}

/**
 * Calculate how many steps to add to the bank.
 * Respects the bank cap — won't exceed it.
 */
export function calculateBankDeposit(
  stepsToBank: number,
  currentBank: number,
  bankCap: number,
): number {
  const space = Math.max(0, bankCap - currentBank);
  return Math.min(stepsToBank, space);
}
