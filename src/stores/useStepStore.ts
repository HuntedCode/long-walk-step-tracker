import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { getTodayDateString } from '@/src/utils/time';
import type {
  StepStoreState,
  StepStoreActions,
  DailyStepRecord,
} from '@/src/types/steps';

type StepStore = StepStoreState & StepStoreActions;

/**
 * Archive the current day into dailyHistory and reset todaySteps.
 * Extracted to avoid duplicating the rollover pattern across actions.
 */
function archiveDay(state: StepStoreState): {
  dailyHistory: Record<string, DailyStepRecord>;
  todayDate: string;
} {
  const today = getTodayDateString();
  const yesterdayRecord: DailyStepRecord = {
    date: state.todayDate,
    steps: state.todaySteps,
    lastUpdated: state.lastUpdated,
  };
  return {
    dailyHistory: {
      ...state.dailyHistory,
      [state.todayDate]: yesterdayRecord,
    },
    todayDate: today,
  };
}

export const useStepStore = create<StepStore>()(
  persist(
    (set, get) => ({
      // --- State ---
      todaySteps: 0,
      todayDate: getTodayDateString(),
      dailyHistory: {},
      lifetimeSteps: 0,
      lastUpdated: new Date().toISOString(),

      // --- Actions ---

      addSteps: (stepDelta: number) => {
        const delta = Math.floor(stepDelta);
        if (delta <= 0) return;
        const state = get();
        const today = getTodayDateString();

        if (today !== state.todayDate) {
          set({
            ...archiveDay(state),
            todaySteps: delta,
            lifetimeSteps: state.lifetimeSteps + delta,
            lastUpdated: new Date().toISOString(),
          });
        } else {
          set({
            todaySteps: state.todaySteps + delta,
            lifetimeSteps: state.lifetimeSteps + delta,
            lastUpdated: new Date().toISOString(),
          });
        }
      },

      backfillToday: (totalStepsToday: number) => {
        const total = Math.floor(totalStepsToday);
        if (total <= 0) return;
        const state = get();
        const today = getTodayDateString();

        if (today !== state.todayDate) {
          set({
            ...archiveDay(state),
            todaySteps: total,
            lifetimeSteps: state.lifetimeSteps + total,
            lastUpdated: new Date().toISOString(),
          });
        } else if (total > state.todaySteps) {
          // High-water mark: only adjust upward to prevent double-counting
          const backfilledDelta = total - state.todaySteps;
          set({
            todaySteps: total,
            lifetimeSteps: state.lifetimeSteps + backfilledDelta,
            lastUpdated: new Date().toISOString(),
          });
        }
      },

      checkDayRollover: () => {
        const state = get();
        const today = getTodayDateString();
        if (today !== state.todayDate) {
          set({
            ...archiveDay(state),
            todaySteps: 0,
            lastUpdated: new Date().toISOString(),
          });
        }
      },
    }),
    {
      name: 'longwalk-steps',
      storage: zustandStorage,
    },
  ),
);
