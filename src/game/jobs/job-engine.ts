import { levelFromXp } from './job-formulas';
import type {
  ActivityDefinition,
  ActivityProgressState,
  ActivityTickResult,
  ItemReward,
  JobState,
  LevelRequirement,
  XpReward,
} from './job-types';

/**
 * Check whether a player meets all requirements to perform an activity.
 */
export function meetsRequirements(
  requirements: LevelRequirement[],
  jobStates: Record<string, JobState>,
): boolean {
  return requirements.every((req) => {
    const job = jobStates[req.jobId];
    return job !== undefined && job.level >= req.level;
  });
}

/**
 * Process steps against an active activity. Handles multiple completions
 * if enough steps are provided (e.g., from banked steps or large deltas).
 *
 * Returns the updated progress state, completions, and rewards.
 * The activity auto-restarts after each completion.
 */
export function processActivitySteps(
  activity: ActivityDefinition,
  progress: ActivityProgressState,
  steps: number,
): ActivityTickResult {
  let currentProgress = progress.stepsProgress + steps;
  let completions = 0;
  const totalItemRewards: ItemReward[] = [];
  const totalXpRewards: XpReward[] = [];

  while (currentProgress >= activity.stepsRequired) {
    currentProgress -= activity.stepsRequired;
    completions++;
  }

  if (completions > 0) {
    // Aggregate rewards across all completions
    for (const reward of activity.itemRewards) {
      totalItemRewards.push({
        itemId: reward.itemId,
        quantity: reward.quantity * completions,
      });
    }
    for (const reward of activity.xpRewards) {
      totalXpRewards.push({
        jobId: reward.jobId,
        amount: reward.amount * completions,
      });
    }
  }

  return {
    progress: {
      activityId: progress.activityId,
      stepsProgress: currentProgress,
    },
    completions,
    itemRewards: totalItemRewards,
    xpRewards: totalXpRewards,
    stepsConsumed: steps,
  };
}

/**
 * Apply XP rewards to job states and recalculate levels.
 * Returns a new record with only the jobs that changed.
 */
export function applyXpRewards(
  xpRewards: XpReward[],
  jobStates: Record<string, JobState>,
): Record<string, JobState> {
  const updated: Record<string, JobState> = {};

  for (const reward of xpRewards) {
    const current = updated[reward.jobId] ?? jobStates[reward.jobId];
    if (!current) continue;

    const newXp = current.xp + reward.amount;
    const newLevel = levelFromXp(newXp);

    updated[reward.jobId] = {
      ...current,
      xp: newXp,
      level: newLevel,
    };
  }

  return updated;
}

/**
 * Detect level-ups by comparing old and new job states.
 * Returns an array of { jobId, oldLevel, newLevel } for each job that leveled up.
 */
export function detectLevelUps(
  oldStates: Record<string, JobState>,
  newStates: Record<string, JobState>,
): Array<{ jobId: string; oldLevel: number; newLevel: number }> {
  const levelUps: Array<{ jobId: string; oldLevel: number; newLevel: number }> = [];

  for (const [jobId, newState] of Object.entries(newStates)) {
    const oldState = oldStates[jobId];
    if (oldState && newState.level > oldState.level) {
      levelUps.push({
        jobId,
        oldLevel: oldState.level,
        newLevel: newState.level,
      });
    }
  }

  return levelUps;
}
