import type { BiomeDefinition, BiomeId } from './biome-types';
import type { ZoneDefinition } from '../zones/zone-types';
import type { ZoneId } from '../jobs/job-types';

/**
 * Check which biomes the player has newly discovered based on lifetime steps.
 * Returns biome IDs that are discoverable but not yet in the discovered set.
 */
export function checkDiscovery(
  lifetimeSteps: number,
  biomes: BiomeDefinition[],
  alreadyDiscovered: Set<BiomeId>,
): BiomeId[] {
  return biomes
    .filter(
      (biome) =>
        lifetimeSteps >= biome.discoverySteps && !alreadyDiscovered.has(biome.id),
    )
    .map((biome) => biome.id);
}

/** Find which biome a zone belongs to. Returns undefined if no biome contains that zone. */
export function getBiomeForZone(
  zoneId: ZoneId,
  biomes: BiomeDefinition[],
): BiomeDefinition | undefined {
  return biomes.find((biome) => biome.zoneIds.includes(zoneId));
}

/** Get all zone definitions that belong to a specific biome. */
export function getZonesInBiome(
  biomeId: BiomeId,
  biomes: BiomeDefinition[],
  zones: ZoneDefinition[],
): ZoneDefinition[] {
  const biome = biomes.find((b) => b.id === biomeId);
  if (!biome) return [];
  const zoneIdSet = new Set(biome.zoneIds);
  return zones.filter((zone) => zoneIdSet.has(zone.id));
}
