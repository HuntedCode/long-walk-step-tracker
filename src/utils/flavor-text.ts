/**
 * Personality-driven text generators for the Steps page.
 * Keeps all the fun, flavor, and voice centralized.
 */

/** Hero section flavor text based on today's step count. */
export function getStepCountFlavor(steps: number): string {
  if (steps === 0) return "Your shoes are judging you.";
  if (steps < 100) return "Baby steps. Literally.";
  if (steps < 500) return "A gentle stroll. We all start somewhere.";
  if (steps < 1000) return `Every journey starts with a single step. You've got ${steps.toLocaleString()}.`;
  if (steps < 2500) return "Warming up nicely.";
  if (steps < 5000) return "Now we're moving.";
  if (steps < 7500) return "Solid effort. Your shoes approve.";
  if (steps < 10000) return "Closing in on the big 10K.";
  if (steps < 15000) return "Legend status. The ground fears you.";
  if (steps < 25000) return "You're built different.";
  if (steps < 50000) return "Are you a mailman? Seriously impressive.";
  return "You might be lost. But in a cool way.";
}

/** Streak card flavor text based on current streak length. */
export function getStreakFlavor(streak: number): string {
  if (streak === 0) return "Start walking to begin a streak.";
  if (streak === 1) return "Day one. Let's go.";
  if (streak === 2) return "Two in a row. Coincidence?";
  if (streak === 3) return "Three's a trend.";
  if (streak <= 6) return "Building momentum.";
  if (streak === 7) return "A whole week. Respect.";
  if (streak <= 10) return "Over a week. Keep it rolling.";
  if (streak <= 13) return "Double digits. Impressive.";
  if (streak === 14) return "Two weeks strong.";
  if (streak <= 20) return "This is becoming a lifestyle.";
  if (streak <= 24) return "Three weeks. This is who you are now.";
  if (streak <= 29) return "Almost a month. Don't stop.";
  if (streak <= 30) return "Monthly legend.";
  if (streak <= 50) return "Unstoppable force.";
  if (streak <= 75) return "At this point, the streak has you.";
  if (streak <= 100) return "Triple digits. You absolute machine.";
  if (streak <= 200) return "This streak could vote in some countries.";
  if (streak <= 365) return "Approaching a full orbit around the sun.";
  return "Your streak is older than some businesses.";
}

const REST_DAY_QUIPS = [
  "Rest day",
  "Recharging",
  "Recovery mode",
  "Plotting tomorrow's steps",
  "Feet on standby",
  "Taking a breather",
  "Legs on vacation",
  "Saving energy",
  "The couch won today",
  "Strategically resting",
  "Tomorrow's a new day",
  "Off-duty",
] as const;

const GOAL_MET_QUIPS = [
  "Goal crushed.",
  "Daily target: demolished.",
  "Your shoes are proud.",
  "Another day in the books.",
  "Nailed it.",
  "Check that box.",
  "Mission accomplished.",
  "Walking machine.",
  "Steps? Conquered.",
  "Today's goal didn't stand a chance.",
  "You showed up. That's the hard part.",
  "Consistency looks good on you.",
  "Goal met. Rest earned.",
  "The pavement thanks you.",
  "Locked in.",
] as const;

/** Celebratory text when the daily step goal is hit. Deterministic per date. */
export function getGoalMetFlavor(dateStr: string): string {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 37 + dateStr.charCodeAt(i)) | 0;
  }
  return GOAL_MET_QUIPS[Math.abs(hash) % GOAL_MET_QUIPS.length];
}

/** Returns a quip for days with 0 steps. Deterministic per date string. */
export function getRestDayFlavor(dateStr: string): string {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return REST_DAY_QUIPS[Math.abs(hash) % REST_DAY_QUIPS.length];
}

/**
 * Encouraging text when the user is close to their daily goal.
 * Returns null if not close enough to warrant encouragement.
 */
export function getNearGoalFlavor(stepsRemaining: number): string | null {
  if (stepsRemaining <= 0) return null;
  if (stepsRemaining < 100) return "You're practically there!";
  if (stepsRemaining < 250) return "So close you can taste it.";
  if (stepsRemaining < 500) return "Just a short walk away.";
  if (stepsRemaining < 1000) return "A quick stroll and you're done.";
  return null;
}
