import type { DailyStepRecord } from '@/src/types/steps';
import { getDateNDaysAgo } from './time';

export interface ChartDataPoint {
  label: string;
  value: number;
}

const SHORT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

/** Parse "YYYY-MM-DD" into a local Date. */
function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Resolve steps for a date, using todaySteps for today. */
function stepsFor(
  date: string,
  dailyHistory: Record<string, DailyStepRecord>,
  todaySteps: number,
  todayDate: string,
): number {
  if (date === todayDate) return todaySteps;
  return dailyHistory[date]?.steps ?? 0;
}

/**
 * Last N days of step data, ordered oldest → newest.
 * Labels: day-of-week abbreviation ("Mon", "Tue", ...).
 */
export function getDailyChartData(
  dailyHistory: Record<string, DailyStepRecord>,
  todaySteps: number,
  todayDate: string,
  count = 14,
): ChartDataPoint[] {
  const points: ChartDataPoint[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = getDateNDaysAgo(i);
    const d = parseDate(date);
    const label = SHORT_DAY_NAMES[d.getDay()];
    points.push({ label, value: stepsFor(date, dailyHistory, todaySteps, todayDate) });
  }
  return points;
}

/**
 * Last N weeks of step data summed per week, ordered oldest → newest.
 * Each week starts on Monday and ends on Sunday.
 * Labels: "Mon DD" of the week's start date.
 */
export function getWeeklyChartData(
  dailyHistory: Record<string, DailyStepRecord>,
  todaySteps: number,
  todayDate: string,
  count = 8,
): ChartDataPoint[] {
  // Find the most recent Monday (start of current week)
  const today = parseDate(todayDate);
  const todayDay = today.getDay(); // 0=Sun
  const daysSinceMonday = todayDay === 0 ? 6 : todayDay - 1;

  const points: ChartDataPoint[] = [];
  for (let w = count - 1; w >= 0; w--) {
    const weekStartOffset = daysSinceMonday + w * 7;
    let total = 0;
    for (let d = 0; d < 7; d++) {
      const offset = weekStartOffset - d;
      if (offset < 0) break; // don't sum future dates
      const date = getDateNDaysAgo(offset);
      total += stepsFor(date, dailyHistory, todaySteps, todayDate);
    }
    const weekStartDate = parseDate(getDateNDaysAgo(weekStartOffset));
    const label = `${SHORT_MONTH_NAMES[weekStartDate.getMonth()]} ${weekStartDate.getDate()}`;
    points.push({ label, value: total });
  }
  return points;
}

/**
 * Last N months of step data summed per calendar month, oldest → newest.
 * Labels: month abbreviation ("Jan", "Feb", ...).
 */
export function getMonthlyChartData(
  dailyHistory: Record<string, DailyStepRecord>,
  todaySteps: number,
  todayDate: string,
  count = 6,
): ChartDataPoint[] {
  const today = parseDate(todayDate);
  const points: ChartDataPoint[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const targetMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let total = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      total += stepsFor(dateStr, dailyHistory, todaySteps, todayDate);
    }

    const label = SHORT_MONTH_NAMES[month];
    points.push({ label, value: total });
  }
  return points;
}

/**
 * Last N years of step data summed per calendar year, oldest → newest.
 * Labels: year string ("2024", "2025", ...).
 */
export function getYearlyChartData(
  dailyHistory: Record<string, DailyStepRecord>,
  todaySteps: number,
  todayDate: string,
  count = 3,
): ChartDataPoint[] {
  const today = parseDate(todayDate);
  const currentYear = today.getFullYear();
  const points: ChartDataPoint[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const year = currentYear - i;
    let total = 0;

    // Sum all history entries for this year
    for (const [dateStr, record] of Object.entries(dailyHistory)) {
      if (dateStr.startsWith(`${year}-`)) {
        total += record.steps;
      }
    }
    // Add today's steps if it falls in this year
    if (todayDate.startsWith(`${year}-`)) {
      total += todaySteps;
      // Subtract any double-counted today from history
      if (dailyHistory[todayDate]) {
        total -= dailyHistory[todayDate].steps;
      }
    }

    points.push({ label: String(year), value: total });
  }
  return points;
}
