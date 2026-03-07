import type { ZoneDefinition } from '../game/zones/zone-types';

export const ZONE_IDS = {
  HOMESTEAD: 'homestead',
  WHISPERING_WOODS: 'whispering_woods',
  SILVER_BROOK: 'silver_brook',
  IRONPEAK_RIDGE: 'ironpeak_ridge',
} as const;

/** Starting zone for new players. */
export const STARTING_ZONE = ZONE_IDS.HOMESTEAD;

export const zoneDefinitions: ZoneDefinition[] = [
  {
    id: ZONE_IDS.HOMESTEAD,
    name: 'Homestead',
    description: 'A quiet settlement at the crossroads. Your journey begins here.',
    biome: 'CROSSROADS',
    color: '#B8860B',
    icon: 'home-outline',
    unlockRequirement: null,
    connections: [
      { targetZoneId: ZONE_IDS.WHISPERING_WOODS, stepsRequired: 500 },
      { targetZoneId: ZONE_IDS.SILVER_BROOK, stepsRequired: 800 },
      { targetZoneId: ZONE_IDS.IRONPEAK_RIDGE, stepsRequired: 1200 },
    ],
  },
  {
    id: ZONE_IDS.WHISPERING_WOODS,
    name: 'Whispering Woods',
    description: 'A dense forest filled with trees ripe for the axe.',
    biome: 'FOREST',
    color: '#4A7C59',
    icon: 'leaf-outline',
    unlockRequirement: null,
    connections: [
      { targetZoneId: ZONE_IDS.HOMESTEAD, stepsRequired: 500 },
      { targetZoneId: ZONE_IDS.SILVER_BROOK, stepsRequired: 600 },
    ],
  },
  {
    id: ZONE_IDS.SILVER_BROOK,
    name: 'Silver Brook',
    description: 'A sparkling brook teeming with fish.',
    biome: 'COASTAL',
    color: '#4A90A4',
    icon: 'water-outline',
    unlockRequirement: null,
    connections: [
      { targetZoneId: ZONE_IDS.HOMESTEAD, stepsRequired: 800 },
      { targetZoneId: ZONE_IDS.WHISPERING_WOODS, stepsRequired: 600 },
      { targetZoneId: ZONE_IDS.IRONPEAK_RIDGE, stepsRequired: 700 },
    ],
  },
  {
    id: ZONE_IDS.IRONPEAK_RIDGE,
    name: 'Ironpeak Ridge',
    description: 'A craggy mountain ridge rich with mineral veins.',
    biome: 'HIGHLAND',
    color: '#8B7355',
    icon: 'triangle-outline',
    unlockRequirement: { totalLevel: 5 },
    connections: [
      { targetZoneId: ZONE_IDS.HOMESTEAD, stepsRequired: 1200 },
      { targetZoneId: ZONE_IDS.SILVER_BROOK, stepsRequired: 700 },
    ],
  },
];

/** Lookup map for zone definitions by ID. */
export const zoneDefinitionMap: Record<string, ZoneDefinition> = Object.fromEntries(
  zoneDefinitions.map((zone) => [zone.id, zone]),
);
