import type { DailyStepRecord } from '@/src/types/steps';
import { getDateNDaysAgo } from './time';

export interface StepStats {
  /** Consecutive days where the daily goal was met, including today if at risk. */
  streak: number;
  /** True when the streak includes yesterday but today's goal hasn't been met yet. */
  streakAtRisk: boolean;
  /** Longest goal-met streak ever recorded. */
  bestStreak: number;
  /** Single highest-step day. */
  bestDay: { date: string; steps: number } | null;
  /** Total steps this calendar week (Mon–today). */
  weekSteps: number;
  /** Average daily steps this calendar week. */
  weekAvg: number;
  /** Total steps last full calendar week (Mon–Sun). */
  prevWeekSteps: number;
  /** Total steps in the last 30 days (including today). */
  monthSteps: number;
  /** Average daily steps over the last 30 days. */
  monthAvg: number;
  /** Total days with at least 1 step recorded. */
  totalDaysActive: number;
  /** Today's progress toward the daily goal (0–1). */
  goalProgress: number;
  /** Whether today's goal has been met. */
  goalMet: boolean;
}

interface StepStatsInput {
  dailyHistory: Record<string, DailyStepRecord>;
  todaySteps: number;
  todayDate: string;
  goalMetDates: string[];
  dailyStepGoal: number;
}

/**
 * Compute all step stats from the daily history and today's live count.
 *
 * Pure function — no store access. Today's data comes from the live
 * `todaySteps` value since it hasn't been archived to history yet.
 */
export function calculateStepStats(input: StepStatsInput): StepStats {
  const { dailyHistory, todaySteps, todayDate, goalMetDates, dailyStepGoal } = input;

  const stepsForDate = (date: string): number => {
    if (date === todayDate) return todaySteps;
    return dailyHistory[date]?.steps ?? 0;
  };

  // --- Goal progress ---
  const goalMet = todaySteps >= dailyStepGoal;
  const goalProgress = dailyStepGoal > 0 ? Math.min(1, todaySteps / dailyStepGoal) : 0;

  // --- Streaks (based on goalMetDates) ---
  const { streak, streakAtRisk, bestStreak } = calculateStreaks(goalMetDates, goalMet, todayDate);

  // --- Best day ---
  let bestDay: StepStats['bestDay'] = null;
  for (const record of Object.values(dailyHistory)) {
    if (record.steps > 0 && (!bestDay || record.steps > bestDay.steps)) {
      bestDay = { date: record.date, steps: record.steps };
    }
  }
  if (todaySteps > 0 && (!bestDay || todaySteps > bestDay.steps)) {
    bestDay = { date: todayDate, steps: todaySteps };
  }

  // --- Calendar week sum (Mon–today) ---
  const todayParsed = new Date(
    Number(todayDate.slice(0, 4)),
    Number(todayDate.slice(5, 7)) - 1,
    Number(todayDate.slice(8, 10)),
  );
  const dow = todayParsed.getDay(); // 0=Sun
  const daysSinceMonday = dow === 0 ? 6 : dow - 1;
  const daysInWeekSoFar = daysSinceMonday + 1;

  let weekSteps = 0;
  for (let i = 0; i < daysInWeekSoFar; i++) {
    weekSteps += stepsForDate(getDateNDaysAgo(i));
  }

  // --- Previous calendar week sum (last Mon–Sun) ---
  let prevWeekSteps = 0;
  for (let i = 0; i < 7; i++) {
    prevWeekSteps += stepsForDate(getDateNDaysAgo(daysInWeekSoFar + i));
  }

  // --- Calendar month sum (1st–today) ---
  const dayOfMonth = todayParsed.getDate();
  let monthSteps = 0;
  for (let i = 0; i < dayOfMonth; i++) {
    monthSteps += stepsForDate(getDateNDaysAgo(i));
  }

  // --- Days active ---
  let totalDaysActive = 0;
  for (const record of Object.values(dailyHistory)) {
    if (record.steps > 0) totalDaysActive++;
  }
  if (todaySteps > 0 && !dailyHistory[todayDate]) totalDaysActive++;

  return {
    streak,
    streakAtRisk,
    bestStreak,
    bestDay,
    weekSteps,
    weekAvg: Math.round(weekSteps / daysInWeekSoFar),
    prevWeekSteps,
    monthSteps,
    monthAvg: Math.round(monthSteps / dayOfMonth),
    totalDaysActive,
    goalProgress,
    goalMet,
  };
}

/**
 * Calculate current and best streaks from goalMetDates.
 *
 * Current streak: walk backwards from today through consecutive dates
 * in goalMetDates. Today counts via the live `goalMet` check.
 *
 * Best streak: scan sorted goalMetDates for longest consecutive run.
 */
function calculateStreaks(
  goalMetDates: string[],
  todayGoalMet: boolean,
  todayDate: string,
): { streak: number; streakAtRisk: boolean; bestStreak: number } {
  // Build a Set for O(1) lookups
  const metSet = new Set(goalMetDates);

  // Current streak: walk backwards from today
  // Upper bound: can't exceed total goal-met days + 1 (for today)
  const maxLookback = metSet.size + 1;
  let streak = 0;
  let streakAtRisk = false;
  if (todayGoalMet || metSet.has(todayDate)) {
    streak = 1;
    for (let i = 1; i <= maxLookback; i++) {
      if (metSet.has(getDateNDaysAgo(i))) {
        streak++;
      } else {
        break;
      }
    }
  } else if (metSet.has(getDateNDaysAgo(1))) {
    // Today's goal not yet met, but yesterday was — streak is at risk
    streakAtRisk = true;
    streak = 1;
    for (let i = 2; i <= maxLookback; i++) {
      if (metSet.has(getDateNDaysAgo(i))) {
        streak++;
      } else {
        break;
      }
    }
  }

  // Best streak: scan sorted dates for longest consecutive run
  const allDates = [...goalMetDates];
  // Include today if met but not yet persisted
  if ((todayGoalMet || metSet.has(todayDate)) && !allDates.includes(todayDate)) {
    allDates.push(todayDate);
  }
  allDates.sort();

  let bestStreak = 0;
  let currentRun = 0;

  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      currentRun = 1;
    } else {
      const prev = new Date(allDates[i - 1]);
      const curr = new Date(allDates[i]);
      const diffDays = Math.round(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
      );
      currentRun = diffDays === 1 ? currentRun + 1 : 1;
    }
    if (currentRun > bestStreak) bestStreak = currentRun;
  }

  if (streak > bestStreak) bestStreak = streak;

  return { streak, streakAtRisk, bestStreak };
}

/**
 * Get an array of the last N days' step data, ordered newest-first.
 * Today is always first, using the live `todaySteps` value.
 */
export function getRecentDays(
  dailyHistory: Record<string, DailyStepRecord>,
  todaySteps: number,
  todayDate: string,
  count: number,
): DailyStepRecord[] {
  const days: DailyStepRecord[] = [];
  for (let i = 0; i < count; i++) {
    const date = getDateNDaysAgo(i);
    if (date === todayDate) {
      days.push({ date, steps: todaySteps, lastUpdated: new Date().toISOString() });
    } else {
      days.push(dailyHistory[date] ?? { date, steps: 0, lastUpdated: '' });
    }
  }
  return days;
}
