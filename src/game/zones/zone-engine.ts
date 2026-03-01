import type { ZoneId } from '../jobs/job-types';
import type {
  TravelState,
  TravelTickResult,
  ZoneConnection,
  ZoneDefinition,
} from './zone-types';

/**
 * Check whether a player meets the unlock requirement for a zone.
 */
export function isZoneUnlocked(
  zone: ZoneDefinition,
  totalLevel: number,
): boolean {
  if (!zone.unlockRequirement) return true;
  return totalLevel >= zone.unlockRequirement.totalLevel;
}

/**
 * Get all zones the player can travel to from their current zone.
 * Filters by unlock requirements.
 */
export function getAvailableDestinations(
  currentZone: ZoneDefinition,
  allZones: Record<ZoneId, ZoneDefinition>,
  totalLevel: number,
): ZoneConnection[] {
  return currentZone.connections.filter((conn) => {
    const targetZone = allZones[conn.targetZoneId];
    return targetZone !== undefined && isZoneUnlocked(targetZone, totalLevel);
  });
}

/**
 * Start traveling to a destination zone.
 * Returns null if the connection doesn't exist from the current zone.
 */
export function startTravel(
  currentZone: ZoneDefinition,
  destinationZoneId: ZoneId,
): TravelState | null {
  const connection = currentZone.connections.find(
    (c) => c.targetZoneId === destinationZoneId,
  );
  if (!connection) return null;

  return {
    destinationZoneId,
    stepsProgress: 0,
    stepsRequired: connection.stepsRequired,
  };
}

/**
 * Process steps against active travel. If the player arrives,
 * returns the remaining steps that can be applied to the next action.
 */
export function processTravelSteps(
  travel: TravelState,
  steps: number,
): TravelTickResult {
  const newProgress = travel.stepsProgress + steps;

  if (newProgress >= travel.stepsRequired) {
    const stepsRemaining = newProgress - travel.stepsRequired;
    return {
      travel: null,
      arrivedAtZone: travel.destinationZoneId,
      stepsConsumed: steps - stepsRemaining,
      stepsRemaining,
    };
  }

  return {
    travel: {
      ...travel,
      stepsProgress: newProgress,
    },
    arrivedAtZone: null,
    stepsConsumed: steps,
    stepsRemaining: 0,
  };
}
