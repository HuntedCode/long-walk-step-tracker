import type { JobDefinition } from '../game/jobs/job-types';

export const JOB_IDS = {
  WOODCUTTING: 'woodcutting',
  FISHING: 'fishing',
  MINING: 'mining',
} as const;

export const jobDefinitions: JobDefinition[] = [
  {
    id: JOB_IDS.WOODCUTTING,
    name: 'Woodcutting',
    description: 'Fell trees to gather logs.',
    maxLevel: 99,
  },
  {
    id: JOB_IDS.FISHING,
    name: 'Fishing',
    description: 'Catch fish from rivers and lakes.',
    maxLevel: 99,
  },
  {
    id: JOB_IDS.MINING,
    name: 'Mining',
    description: 'Extract ore and gems from rock.',
    maxLevel: 99,
  },
];

/** Lookup map for job definitions by ID. */
export const jobDefinitionMap: Record<string, JobDefinition> = Object.fromEntries(
  jobDefinitions.map((job) => [job.id, job]),
);
