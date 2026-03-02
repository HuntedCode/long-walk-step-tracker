import { useEffect, useRef } from 'react';
import { processGameTick } from '@/src/game/core/game-tick';
import { calculateBankCap } from '@/src/game/core/formulas';
import { activityDefinitionMap } from '@/src/data/activities';
import { useStepStore } from '@/src/stores/useStepStore';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { useJobStore } from '@/src/stores/useJobStore';
import { useInventoryStore } from '@/src/stores/useInventoryStore';
import type { GameTickInput } from '@/src/types/game';

/**
 * Headless hook that bridges the step store to the game engine.
 *
 * Subscribes directly to useStepStore via Zustand's subscribe API
 * (not a React selector) so game ticks run as store-to-store side
 * effects without triggering React render cycles.
 *
 * Must be mounted once at the root layout for the entire app lifecycle.
 */
export function useGameTick(): void {
  const subscribedRef = useRef(false);

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    // Track previous todaySteps to detect changes (subscribe fires on any state change)
    let prevTodaySteps = useStepStore.getState().todaySteps;

    const unsubscribe = useStepStore.subscribe((state) => {
      // Only process when todaySteps actually changed
      if (state.todaySteps === prevTodaySteps) return;

      const todaySteps = state.todaySteps;
      prevTodaySteps = todaySteps;

      const playerState = usePlayerStore.getState();
      const stepDelta = todaySteps - playerState.lastProcessedSteps;

      // Guard: no new steps (or day rollover reset todaySteps below baseline)
      if (stepDelta <= 0) {
        // On day rollover, reset the baseline so future steps aren't lost
        if (todaySteps < playerState.lastProcessedSteps) {
          playerState.setLastProcessedSteps(todaySteps);
        }
        return;
      }
      const jobState = useJobStore.getState();

      // Look up the active activity definition (null if idle)
      const activeActivity = playerState.activityProgress
        ? activityDefinitionMap[playerState.activityProgress.activityId] ?? null
        : null;

      const input: GameTickInput = {
        stepDelta,
        currentZoneId: playerState.currentZoneId,
        travel: playerState.travel,
        activityProgress: playerState.activityProgress,
        stepBank: playerState.stepBank,
        bankCap: calculateBankCap(jobState.getTotalLevel()),
        jobStates: jobState.jobs,
      };

      const result = processGameTick(input, activeActivity);

      // Apply results to stores
      playerState.applyTickResult({
        currentZoneId: result.currentZoneId,
        activityProgress: result.activityProgress,
        travel: result.travel,
        stepBank: result.stepBank,
      });
      playerState.setLastProcessedSteps(todaySteps);

      if (result.xpRewards.length > 0) {
        useJobStore.getState().addXp(result.xpRewards);
      }
      if (result.itemRewards.length > 0) {
        useInventoryStore.getState().addItems(result.itemRewards);
      }
    });

    return () => {
      subscribedRef.current = false;
      unsubscribe();
    };
  }, []);
}
