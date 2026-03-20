import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type { ActivityProgressState } from '@/src/game/jobs/job-types';
import type { TravelState } from '@/src/game/zones/zone-types';
import { STARTING_ZONE } from '@/src/data/zones';

interface PlayerStoreState {
  /** The zone the player is currently in. */
  currentZoneId: string;
  /** Active activity progress, or null if idle. */
  activityProgress: ActivityProgressState | null;
  /** Active travel state, or null if not traveling. */
  travel: TravelState | null;
  /** Banked steps available for 2x activity progress. */
  stepBank: number;
  /**
   * The last todaySteps value that was processed by the game tick.
   * Used to calculate deltas between ticks.
   */
  lastProcessedSteps: number;
}

interface PlayerStoreActions {
  /** Start an activity at the current zone. Clears any active travel. */
  startActivity: (activityId: string) => void;
  /** Stop the current activity. */
  stopActivity: () => void;
  /** Start traveling to a destination zone. Clears any active activity. */
  startTravel: (travel: TravelState) => void;
  /** Apply the result of a game tick to the player state. */
  applyTickResult: (result: {
    currentZoneId: string;
    activityProgress: ActivityProgressState | null;
    travel: TravelState | null;
    stepBank: number;
  }) => void;
  /** Update the last processed step count (called after each game tick). */
  setLastProcessedSteps: (steps: number) => void;
}

type PlayerStore = PlayerStoreState & PlayerStoreActions;

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      currentZoneId: STARTING_ZONE,
      activityProgress: null,
      travel: null,
      stepBank: 0,
      lastProcessedSteps: 0,

      startActivity: (activityId: string) => {
        set({
          activityProgress: { activityId, stepsProgress: 0 },
          travel: null,
        });
      },

      stopActivity: () => {
        set({ activityProgress: null });
      },

      startTravel: (travel: TravelState) => {
        set({
          travel,
          activityProgress: null,
        });
      },

      applyTickResult: (result) => {
        set({
          currentZoneId: result.currentZoneId,
          activityProgress: result.activityProgress,
          travel: result.travel,
          stepBank: result.stepBank,
        });
      },

      setLastProcessedSteps: (steps: number) => {
        set({ lastProcessedSteps: steps });
      },
    }),
    {
      name: 'longwalk-player',
      storage: zustandStorage,
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as PlayerStoreState;
        if (version < 1) {
          // v0 -> v1: placeholder zones were removed. Reset to new starting zone.
          const removedZones = new Set([
            'homestead',
            'whispering_woods',
            'silver_brook',
            'ironpeak_ridge',
          ]);
          if (removedZones.has(state.currentZoneId)) {
            state.currentZoneId = STARTING_ZONE;
            state.activityProgress = null;
            state.travel = null;
          }
        }
        return state;
      },
    },
  ),
);
