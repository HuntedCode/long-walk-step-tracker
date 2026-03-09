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
    color: '#4A7C59',
    icon: 'axe',
    iconLibrary: 'MaterialCommunityIcons',
  },
  {
    id: JOB_IDS.FISHING,
    name: 'Fishing',
    description: 'Catch fish from rivers and lakes.',
    maxLevel: 99,
    color: '#4A90A4',
    icon: 'fish-outline',
    iconLibrary: 'Ionicons',
  },
  {
    id: JOB_IDS.MINING,
    name: 'Mining',
    description: 'Extract ore and gems from rock.',
    maxLevel: 99,
    color: '#8B7355',
    icon: 'pickaxe',
    iconLibrary: 'MaterialCommunityIcons',
  },
];

/** Lookup map for job definitions by ID. */
export const jobDefinitionMap: Record<string, JobDefinition> = Object.fromEntries(
  jobDefinitions.map((job) => [job.id, job]),
);
