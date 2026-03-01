/**
 * Returns today's date as "YYYY-MM-DD" in the device's local timezone.
 *
 * Uses local date parts instead of toISOString().slice(0,10) because
 * toISOString() produces a UTC date string — at 11pm in UTC-5,
 * that would return tomorrow's date.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}