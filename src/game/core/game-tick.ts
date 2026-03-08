import type { ActivityDefinition } from '../jobs/job-types';
import { processActivitySteps, applyXpRewards, detectLevelUps } from '../jobs/job-engine';
import { processTravelSteps } from '../zones/zone-engine';
import { calculateEffectiveSteps, calculateBankDeposit } from './formulas';
import { rollLootForCompletions } from '../loot/loot-engine';
import { itemDefinitionMap } from '../../data/items';
import type { SeededRNG } from './rng';
import type { GameEvent, GameTickInput, GameTickResult } from '../../types/game';

/**
 * Process a game tick — the central dispatcher that routes step deltas
 * to the appropriate system (travel, activity, or bank).
 *
 * Deterministic when given the same inputs and RNG seed.
 * The calling hook is responsible for applying the result to stores.
 *
 * Flow:
 * 1. If TRAVELING → steps go to travel progress. On arrival, remaining
 *    steps fall through to activity or bank.
 * 2. If ACTIVITY ACTIVE → steps (+ banked) go to activity progress.
 *    Completions award items and XP. Activity auto-restarts.
 *    If the activity has a lootTable, items are rolled probabilistically.
 * 3. If IDLE → steps go to the step bank (up to cap).
 */
export function processGameTick(
  input: GameTickInput,
  activeActivity: ActivityDefinition | null,
  rng?: SeededRNG,
): GameTickResult {
  const events: GameEvent[] = [];
  let remainingSteps = input.stepDelta;
  let currentZoneId = input.currentZoneId;
  let travel = input.travel;
  let activityProgress = input.activityProgress;
  let stepBank = input.stepBank;
  const xpRewards: GameTickResult['xpRewards'] = [];
  const itemRewards: GameTickResult['itemRewards'] = [];

  // --- Phase 1: Travel ---
  if (travel && remainingSteps > 0) {
    const travelResult = processTravelSteps(travel, remainingSteps);
    travel = travelResult.travel;
    remainingSteps = travelResult.stepsRemaining;

    if (travelResult.arrivedAtZone) {
      currentZoneId = travelResult.arrivedAtZone;
      events.push({ type: 'ARRIVED_AT_ZONE', zoneId: currentZoneId });
    }
  }

  // --- Phase 2: Activity ---
  // Both the definition and progress must exist. If the definition lookup
  // failed (activeActivity is null), we skip to banking so steps aren't lost.
  if (activeActivity && activityProgress && remainingSteps > 0) {
    // Calculate effective steps with bank bonus
    const { effectiveSteps, bankedConsumed } = calculateEffectiveSteps(
      remainingSteps,
      stepBank,
    );

    if (bankedConsumed > 0) {
      stepBank -= bankedConsumed;
      events.push({ type: 'BANK_WITHDRAWAL', amount: bankedConsumed });
    }

    const activityResult = processActivitySteps(
      activeActivity,
      activityProgress,
      effectiveSteps,
    );

    activityProgress = activityResult.progress;

    if (activityResult.completions > 0) {
      // Determine item rewards: use loot table if available, else fallback
      if (activeActivity.lootTable && rng) {
        const jobLevel = input.jobStates[activeActivity.jobId]?.level ?? 1;
        const lootRewards = rollLootForCompletions(
          activeActivity.lootTable,
          activityResult.completions,
          jobLevel,
          rng,
        );
        itemRewards.push(...lootRewards);

        // Emit RARE_DROP events for non-common items
        for (const reward of lootRewards) {
          const itemDef = itemDefinitionMap[reward.itemId];
          if (itemDef && itemDef.rarity !== 'common') {
            events.push({
              type: 'RARE_DROP',
              itemId: reward.itemId,
              quantity: reward.quantity,
              rarity: itemDef.rarity,
            });
          }
        }
      } else {
        // Legacy fallback: deterministic item rewards
        itemRewards.push(...activityResult.itemRewards);
      }

      xpRewards.push(...activityResult.xpRewards);

      events.push({
        type: 'ACTIVITY_COMPLETED',
        activityId: activityProgress.activityId,
        completions: activityResult.completions,
      });

      // Detect level-ups from XP rewards
      const updatedJobs = applyXpRewards(activityResult.xpRewards, input.jobStates);
      const levelUps = detectLevelUps(input.jobStates, updatedJobs);
      for (const lu of levelUps) {
        events.push({
          type: 'LEVEL_UP',
          jobId: lu.jobId,
          oldLevel: lu.oldLevel,
          newLevel: lu.newLevel,
        });
      }
    }

    remainingSteps = 0; // Activity consumes all remaining steps
  }

  // --- Phase 3: Bank ---
  // Bank steps if idle (no travel, no active activity). Also bank if the
  // activity definition couldn't be resolved (activeActivity is null but
  // activityProgress exists) to avoid silently losing steps.
  const activityIsRunning = activeActivity && activityProgress;
  if (remainingSteps > 0 && !travel && !activityIsRunning) {
    const deposit = calculateBankDeposit(remainingSteps, stepBank, input.bankCap);
    if (deposit > 0) {
      stepBank += deposit;
      events.push({ type: 'BANK_DEPOSIT', amount: deposit });
    }
  }

  return {
    activityProgress,
    travel,
    currentZoneId,
    stepBank,
    xpRewards,
    itemRewards,
    events,
  };
}
