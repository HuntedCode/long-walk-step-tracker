import type {
  ActivityId,
  ActivityProgressState,
  ItemReward,
  JobState,
  XpReward,
  ZoneId,
} from '../game/jobs/job-types';
import type { TravelState } from '../game/zones/zone-types';

/** The player's current mode of action. */
export type PlayerMode = 'idle' | 'traveling' | 'activity';

/** Snapshot of all player state needed by the game tick. */
export interface GameTickInput {
  /** Raw step delta from the pedometer since last tick. */
  stepDelta: number;
  /** Player's current zone. */
  currentZoneId: ZoneId;
  /** Active travel state, or null if not traveling. */
  travel: TravelState | null;
  /** Active activity progress, or null if no activity selected. */
  activityProgress: ActivityProgressState | null;
  /** Current step bank balance. */
  stepBank: number;
  /** Step bank capacity (pre-calculated from total level). */
  bankCap: number;
  /** Current job states (for requirement checks). */
  jobStates: Record<string, JobState>;
}

/** Events emitted by the game tick for UI reactions. */
export type GameEvent =
  | { type: 'ACTIVITY_COMPLETED'; activityId: ActivityId; completions: number }
  | { type: 'ARRIVED_AT_ZONE'; zoneId: ZoneId }
  | { type: 'LEVEL_UP'; jobId: string; oldLevel: number; newLevel: number }
  | { type: 'BANK_DEPOSIT'; amount: number }
  | { type: 'BANK_WITHDRAWAL'; amount: number };

/** Output of processing a game tick. Applied to stores by the hook. */
export interface GameTickResult {
  /** Updated activity progress (null if no activity or activity was cleared). */
  activityProgress: ActivityProgressState | null;
  /** Updated travel state (null if not traveling or just arrived). */
  travel: TravelState | null;
  /** Updated current zone (may change if player arrived). */
  currentZoneId: ZoneId;
  /** Updated step bank balance. */
  stepBank: number;
  /** XP to award to jobs. */
  xpRewards: XpReward[];
  /** Items to award to inventory. */
  itemRewards: ItemReward[];
  /** Events for UI reactions (level-ups, completions, arrivals). */
  events: GameEvent[];
}
