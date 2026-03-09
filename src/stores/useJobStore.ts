import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { levelFromXp } from '@/src/game/jobs/job-formulas';
import type { JobState, XpReward } from '@/src/game/jobs/job-types';
import { jobDefinitions } from '@/src/data/jobs';

interface JobStoreState {
  /** Job states keyed by job ID. */
  jobs: Record<string, JobState>;
}

interface JobStoreActions {
  /** Apply XP rewards from activity completions. */
  addXp: (rewards: XpReward[]) => void;
  /** Get the sum of all job levels. */
  getTotalLevel: () => number;
  /** Get the sum of all job XP. */
  getTotalXp: () => number;
}

type JobStore = JobStoreState & JobStoreActions;

function createInitialJobs(): Record<string, JobState> {
  const jobs: Record<string, JobState> = {};
  for (const def of jobDefinitions) {
    jobs[def.id] = { jobId: def.id, xp: 0, level: 1 };
  }
  return jobs;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      jobs: createInitialJobs(),

      addXp: (rewards: XpReward[]) => {
        if (rewards.length === 0) return;
        const state = get();
        const updated = { ...state.jobs };

        for (const reward of rewards) {
          const current = updated[reward.jobId];
          if (!current) continue;

          const newXp = current.xp + reward.amount;
          updated[reward.jobId] = {
            ...current,
            xp: newXp,
            level: levelFromXp(newXp),
          };
        }

        set({ jobs: updated });
      },

      getTotalLevel: () => {
        const { jobs } = get();
        return Object.values(jobs).reduce((sum, job) => sum + job.level, 0);
      },

      getTotalXp: () => {
        const { jobs } = get();
        return Object.values(jobs).reduce((sum, job) => sum + job.xp, 0);
      },
    }),
    {
      name: 'longwalk-jobs',
      storage: zustandStorage,
      version: 2,
      merge: (persisted, current) => {
        const merged = { ...(current as JobStore), ...(persisted as Partial<JobStore>) };
        // Ensure all defined jobs exist (handles new jobs added after first install)
        for (const def of jobDefinitions) {
          if (!merged.jobs[def.id]) {
            merged.jobs[def.id] = { jobId: def.id, xp: 0, level: 1 };
          }
        }
        return merged;
      },
    },
  ),
);
