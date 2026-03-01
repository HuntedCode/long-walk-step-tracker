export type PedometerPermissionStatus = 'granted' | 'undetermined' | 'denied';

/**
 * Snapshot of daily step data for a single calendar day.
 * Keyed by ISO date string (YYYY-MM-DD) in the store.
 */
export interface DailyStepRecord {
  date: string;
  steps: number;
  lastUpdated: string;
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
}

export interface StepStoreActions {
  /** Add steps from a pedometer update. Handles day rollover internally. */
  addSteps: (stepDelta: number) => void;
  /** Backfill steps from historical query (Health Connect / Core Motion). */
  backfillToday: (totalStepsToday: number) => void;
  /** Force a day rollover check (called on app foreground). */
  checkDayRollover: () => void;
}
