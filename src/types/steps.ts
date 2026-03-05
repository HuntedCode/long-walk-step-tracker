export type PedometerPermissionStatus = 'granted' | 'undetermined' | 'denied';

/**
 * Snapshot of daily step data for a single calendar day.
 * Keyed by ISO date string (YYYY-MM-DD) in the store.
 */
export interface DailyStepRecord {
  date: string;
  steps: number;
  lastUpdated: string;
  /** The daily step goal that was active on this day. Optional for pre-migration data. */
  goalAtTime?: number;
}

export interface StepStoreState {
  /** Today's total accumulated steps */
  todaySteps: number;
  /** ISO date string for "today" — used to detect midnight rollover */
  todayDate: string;
  /** Historical daily records, keyed by ISO date string */
  dailyHistory: Record<string, DailyStepRecord>;
  /** Lifetime total steps across all days */
  lifetimeSteps: number;
  /** ISO timestamp of last step store update */
  lastUpdated: string;
  /** User-configurable daily step goal (default 1,000, min 1,000, max 100,000). */
  dailyStepGoal: number;
  /** Goal queued for tomorrow. Null means no pending change. */
  pendingDailyStepGoal: number | null;
  /** Sorted array of dates where the app was opened AND the goal was met. */
  goalMetDates: string[];
}

export interface StepStoreActions {
  /** Add steps from a pedometer update. Handles day rollover internally. */
  addSteps: (stepDelta: number) => void;
  /** Backfill steps from historical query (Health Connect / Core Motion). */
  backfillToday: (totalStepsToday: number) => void;
  /** Force a day rollover check (called on app foreground). */
  checkDayRollover: () => void;
  /** Queue a new daily step goal for tomorrow (clamped to 1,000–100,000). */
  setDailyStepGoal: (goal: number) => void;
  /** Cancel the pending goal change. */
  clearPendingGoal: () => void;
  /** Debug only: remove steps from today (clamped to 0). Reverts goalMet if applicable. */
  removeSteps: (stepDelta: number) => void;
  /** Debug only: set goalMetDates to simulate a streak of N consecutive days ending yesterday. */
  debugSetStreak: (days: number) => void;
}
