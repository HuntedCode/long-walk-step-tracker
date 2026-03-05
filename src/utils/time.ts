/**
 * Returns today's date as "YYYY-MM-DD" in the device's local timezone.
 *
 * Uses local date parts instead of toISOString().slice(0,10) because
 * toISOString() produces a UTC date string — at 11pm in UTC-5,
 * that would return tomorrow's date.
 */
export function getTodayDateString(): string {
  return dateToString(new Date());
}

/** Format a Date object as "YYYY-MM-DD" in local timezone. */
function dateToString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

const DAY_NAMES = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
] as const;

/**
 * Format a "YYYY-MM-DD" date string for display.
 * Returns "Mar 4" for current year, "Mar 4, 2025" for other years.
 */
export function formatDisplayDate(dateStr: string): string {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;
  const day = Number(dayStr);
  const currentYear = new Date().getFullYear();
  const monthName = SHORT_MONTHS[month];
  return year === currentYear
    ? `${monthName} ${day}`
    : `${monthName} ${day}, ${year}`;
}

/** Returns "YYYY-MM-DD" for N days ago in local timezone. */
export function getDateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return dateToString(d);
}

/**
 * Returns a human-readable label for a date.
 * "Today", "Yesterday", or "Mon, Mar 4".
 */
export function getDayLabel(dateStr: string, todayStr: string): string {
  if (dateStr === todayStr) return 'Today';

  const yesterdayStr = getDateNDaysAgo(1);
  if (dateStr === yesterdayStr) return 'Yesterday';

  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const d = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));
  const dayName = DAY_NAMES[d.getDay()];
  return `${dayName}, ${formatDisplayDate(dateStr)}`;
}