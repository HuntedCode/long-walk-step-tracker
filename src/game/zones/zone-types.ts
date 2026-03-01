import type { ZoneId } from '../jobs/job-types';

/** Requirement to unlock a zone (e.g., total level >= 5). */
export interface ZoneUnlockRequirement {
  /** Minimum total level (sum of all job levels) to enter this zone. */
  totalLevel: number;
}

/** A connection from one zone to another with a travel cost. */
export interface ZoneConnection {
  targetZoneId: ZoneId;
  /** Steps required to travel to this zone. */
  stepsRequired: number;
}

/** Static definition of a zone. Lives in src/data/zones.ts. */
export interface ZoneDefinition {
  id: ZoneId;
  name: string;
  description: string;
  /** Connections to other zones the player can travel to. */
  connections: ZoneConnection[];
  /** Requirement to unlock this zone. Null = always available. */
  unlockRequirement: ZoneUnlockRequirement | null;
}

/** Runtime state of an in-progress travel between zones. */
export interface TravelState {
  /** Zone the player is traveling to. */
  destinationZoneId: ZoneId;
  /** Steps accumulated toward arrival. */
  stepsProgress: number;
  /** Total steps required to arrive. */
  stepsRequired: number;
}

/** Result of processing steps against active travel. */
export interface TravelTickResult {
  /** Updated travel state. Null if the player arrived. */
  travel: TravelState | null;
  /** The zone the player arrived at, or null if still traveling. */
  arrivedAtZone: ZoneId | null;
  /** Steps consumed by travel. */
  stepsConsumed: number;
  /** Steps remaining after arrival (to be applied to next action). */
  stepsRemaining: number;
}
