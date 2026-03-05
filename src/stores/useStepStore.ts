import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { getTodayDateString, getDateNDaysAgo } from '@/src/utils/time';
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
    goalAtTime: state.dailyStepGoal,
  };
  return {
    dailyHistory: {
      ...state.dailyHistory,
      [state.todayDate]: yesterdayRecord,
    },
    todayDate: today,
  };
}

/**
 * If today's steps meet the goal and today isn't already recorded,
 * append today to goalMetDates. Returns the updated array or null if unchanged.
 */
function checkGoalMet(state: StepStoreState, newTodaySteps: number): string[] | null {
  const today = getTodayDateString();
  if (newTodaySteps < state.dailyStepGoal) return null;
  if (state.goalMetDates.includes(today)) return null;
  return [...state.goalMetDates, today].sort();
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
      dailyStepGoal: 1000,
      pendingDailyStepGoal: null,
      goalMetDates: [],

      // --- Actions ---

      addSteps: (stepDelta: number) => {
        const delta = Math.floor(stepDelta);
        if (delta <= 0) return;
        const state = get();
        const today = getTodayDateString();

        if (today !== state.todayDate) {
          const newSteps = delta;
          const promotion = state.pendingDailyStepGoal !== null
            ? { dailyStepGoal: state.pendingDailyStepGoal, pendingDailyStepGoal: null as number | null }
            : {};
          const archived = archiveDay(state);
          const goalMet = checkGoalMet({ ...state, ...archived, ...promotion, todaySteps: newSteps }, newSteps);
          set({
            ...archived,
            ...promotion,
            todaySteps: newSteps,
            lifetimeSteps: state.lifetimeSteps + delta,
            lastUpdated: new Date().toISOString(),
            ...(goalMet ? { goalMetDates: goalMet } : {}),
          });
        } else {
          const newSteps = state.todaySteps + delta;
          const goalMet = checkGoalMet(state, newSteps);
          set({
            todaySteps: newSteps,
            lifetimeSteps: state.lifetimeSteps + delta,
            lastUpdated: new Date().toISOString(),
            ...(goalMet ? { goalMetDates: goalMet } : {}),
          });
        }
      },

      backfillToday: (totalStepsToday: number) => {
        const total = Math.floor(totalStepsToday);
        if (total <= 0) return;
        const state = get();
        const today = getTodayDateString();

        if (today !== state.todayDate) {
          const promotion = state.pendingDailyStepGoal !== null
            ? { dailyStepGoal: state.pendingDailyStepGoal, pendingDailyStepGoal: null as number | null }
            : {};
          const archived = archiveDay(state);
          const goalMet = checkGoalMet({ ...state, ...archived, ...promotion, todaySteps: total }, total);
          set({
            ...archived,
            ...promotion,
            todaySteps: total,
            lifetimeSteps: state.lifetimeSteps + total,
            lastUpdated: new Date().toISOString(),
            ...(goalMet ? { goalMetDates: goalMet } : {}),
          });
        } else if (total > state.todaySteps) {
          // High-water mark: only adjust upward to prevent double-counting
          const backfilledDelta = total - state.todaySteps;
          const goalMet = checkGoalMet(state, total);
          set({
            todaySteps: total,
            lifetimeSteps: state.lifetimeSteps + backfilledDelta,
            lastUpdated: new Date().toISOString(),
            ...(goalMet ? { goalMetDates: goalMet } : {}),
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
            ...(state.pendingDailyStepGoal !== null
              ? { dailyStepGoal: state.pendingDailyStepGoal, pendingDailyStepGoal: null }
              : {}),
          });
        }
      },

      setDailyStepGoal: (goal: number) => {
        const state = get();
        const clamped = Math.max(1000, Math.min(100000, Math.floor(goal)));
        if (clamped === state.dailyStepGoal) {
          set({ pendingDailyStepGoal: null });
        } else {
          set({ pendingDailyStepGoal: clamped });
        }
      },

      clearPendingGoal: () => {
        set({ pendingDailyStepGoal: null });
      },

      debugSetStreak: (days: number) => {
        const dates: string[] = [];
        for (let i = 1; i <= days; i++) {
          dates.push(getDateNDaysAgo(i));
        }
        set({ goalMetDates: dates.sort() });
      },

      removeSteps: (stepDelta: number) => {
        const delta = Math.floor(stepDelta);
        if (delta <= 0) return;
        const state = get();
        const actual = Math.min(delta, state.todaySteps);
        if (actual === 0) return;
        const newSteps = state.todaySteps - actual;
        const today = getTodayDateString();
        // If steps drop below goal, remove today from goalMetDates
        const shouldRevoke = newSteps < state.dailyStepGoal && state.goalMetDates.includes(today);
        set({
          todaySteps: newSteps,
          lifetimeSteps: Math.max(0, state.lifetimeSteps - actual),
          lastUpdated: new Date().toISOString(),
          ...(shouldRevoke
            ? { goalMetDates: state.goalMetDates.filter((d) => d !== today) }
            : {}),
        });
      },
    }),
    {
      name: 'longwalk-steps',
      storage: zustandStorage,
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as StepStoreState;
        if (version === 0) {
          return {
            ...state,
            pendingDailyStepGoal: null,
            dailyStepGoal: Math.max(1000, state.dailyStepGoal),
          };
        }
        return state;
      },
    },
  ),
);
