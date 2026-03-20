import type { ZoneDefinition } from '../game/zones/zone-types';
import { BIOME_IDS } from './biomes';

export const ZONE_IDS = {
  // ── Hub: The Cairn ──
  THE_CAIRN: 'the_cairn',
  THE_COOKFIRE: 'the_cookfire',

  // ── Al Fakhr: City ──
  THE_PROMENADE: 'the_promenade',
  THE_FORGE_QUARTER: 'the_forge_quarter',
  THE_HIGH_ARCHIVE: 'the_high_archive',
  THE_BUILDERS_TERRACE: 'the_builders_terrace',

  // ── Al Fakhr: Quarry Highlands ──
  THE_QUARRY_FACE: 'the_quarry_face',
  AMBER_RIDGE: 'amber_ridge',
  THE_CUTTING_YARD: 'the_cutting_yard',

  // ── Al Fakhr: The Greenwood ──
  THE_LONE_GARDEN: 'the_lone_garden',
  THE_HIDDEN_SPRING: 'the_hidden_spring',
  IRONWOOD_GROVE: 'ironwood_grove',

  // ── Al Fakhr: The Ruins ──
  THE_UNFINISHED_REACH: 'the_unfinished_reach',
  THE_COLLAPSED_GALLERY: 'the_collapsed_gallery',

  // ── Al Fakhr: Outskirts ──
  DUSTFALL_EDGE: 'dustfall_edge',
  PILGRIMS_REST: 'pilgrims_rest',

  // ── Al Fakhr: Story Zones ──
  KARAMS_SCAFFOLD: 'karams_scaffold',
  THE_RIVALS_CAMP: 'the_rivals_camp',
  THE_OLD_FOUNDATION: 'the_old_foundation',
  THE_NEWCOMERS_WORKSHOP: 'the_newcomers_workshop',
} as const;

/** Starting zone for new players. */
export const STARTING_ZONE = ZONE_IDS.THE_CAIRN;

export const zoneDefinitions: ZoneDefinition[] = [
  // ════════════════════════════════════════════════════════════
  // Hub: The Cairn
  // ════════════════════════════════════════════════════════════
  {
    id: ZONE_IDS.THE_CAIRN,
    name: 'The Cairn',
    description: 'A quiet camp at a crossroads, marked by a pile of worn stones. Your journey begins here.',
    biomeId: BIOME_IDS.THE_CAIRN,
    isCentralCity: true,
    terrain: 'SETTLEMENT',
    color: '#B8860B',
    icon: 'home-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_COOKFIRE, stepsRequired: 100 },
      { targetZoneId: ZONE_IDS.DUSTFALL_EDGE, stepsRequired: 3000 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.THE_COOKFIRE,
    name: 'The Cookfire',
    description: 'A communal fire pit where travelers share what they have gathered. The smell of simple food carries on the wind.',
    biomeId: BIOME_IDS.THE_CAIRN,
    isCentralCity: false,
    terrain: 'SETTLEMENT',
    color: '#D4760A',
    icon: 'flame-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_CAIRN, stepsRequired: 100 },
    ],
    unlockRequirement: null,
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: Outskirts
  // ════════════════════════════════════════════════════════════
  {
    id: ZONE_IDS.DUSTFALL_EDGE,
    name: 'Dustfall Edge',
    description: 'The border between the known and the unknown. Wind carries fine dust from the east.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'WASTELAND',
    color: '#C4A35A',
    icon: 'trail-sign-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_CAIRN, stepsRequired: 3000 },
      { targetZoneId: ZONE_IDS.PILGRIMS_REST, stepsRequired: 400 },
      { targetZoneId: ZONE_IDS.THE_LONE_GARDEN, stepsRequired: 600 },
      { targetZoneId: ZONE_IDS.THE_QUARRY_FACE, stepsRequired: 700 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.PILGRIMS_REST,
    name: "Pilgrim's Rest",
    description: 'A waystation for travelers. Simple fires, shared food, and stories exchanged.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'SETTLEMENT',
    color: '#C89B5E',
    icon: 'bonfire-outline',
    connections: [
      { targetZoneId: ZONE_IDS.DUSTFALL_EDGE, stepsRequired: 400 },
      { targetZoneId: ZONE_IDS.THE_PROMENADE, stepsRequired: 800 },
    ],
    unlockRequirement: null,
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: The Greenwood
  // ════════════════════════════════════════════════════════════
  {
    id: ZONE_IDS.THE_LONE_GARDEN,
    name: 'The Lone Garden',
    description: 'A dense, overgrown garden tended by one person who refuses all help. Pride keeps it perfect and isolated.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'FOREST',
    color: '#4A7C59',
    icon: 'leaf-outline',
    connections: [
      { targetZoneId: ZONE_IDS.DUSTFALL_EDGE, stepsRequired: 600 },
      { targetZoneId: ZONE_IDS.THE_HIDDEN_SPRING, stepsRequired: 300 },
      { targetZoneId: ZONE_IDS.IRONWOOD_GROVE, stepsRequired: 400 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.THE_HIDDEN_SPRING,
    name: 'The Hidden Spring',
    description: 'A quiet pool tucked in the garden depths. Few know it exists. The water is clear and cold.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'FOREST',
    color: '#4A90A4',
    icon: 'water-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_LONE_GARDEN, stepsRequired: 300 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.IRONWOOD_GROVE,
    name: 'Ironwood Grove',
    description: 'Old-growth forest at the biome edge. The trees here predate the collapse. Their wood is nearly as hard as metal.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'FOREST',
    color: '#3D6B4F',
    icon: 'leaf-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_LONE_GARDEN, stepsRequired: 400 },
      { targetZoneId: ZONE_IDS.THE_NEWCOMERS_WORKSHOP, stepsRequired: 300 },
    ],
    unlockRequirement: null,
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: Quarry Highlands
  // ════════════════════════════════════════════════════════════
  {
    id: ZONE_IDS.THE_QUARRY_FACE,
    name: 'The Quarry Face',
    description: 'An open pit mine carved into golden stone. Crews compete over output, each claiming their section produces the finest marble.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'HIGHLAND',
    color: '#8B7355',
    icon: 'triangle-outline',
    connections: [
      { targetZoneId: ZONE_IDS.DUSTFALL_EDGE, stepsRequired: 700 },
      { targetZoneId: ZONE_IDS.AMBER_RIDGE, stepsRequired: 400 },
      { targetZoneId: ZONE_IDS.THE_CUTTING_YARD, stepsRequired: 300 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.AMBER_RIDGE,
    name: 'Amber Ridge',
    description: 'High ground overlooking the quarry. Wind-scoured and sparse, but rich veins hide in the rock.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'HIGHLAND',
    color: '#A07840',
    icon: 'triangle-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_QUARRY_FACE, stepsRequired: 400 },
      { targetZoneId: ZONE_IDS.THE_CUTTING_YARD, stepsRequired: 350 },
    ],
    unlockRequirement: { totalLevel: 10 },
  },
  {
    id: ZONE_IDS.THE_CUTTING_YARD,
    name: 'The Cutting Yard',
    description: 'Where raw stone becomes shaped blocks. The sound of chisels never stops.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'HIGHLAND',
    color: '#9B8B72',
    icon: 'hammer-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_QUARRY_FACE, stepsRequired: 300 },
      { targetZoneId: ZONE_IDS.AMBER_RIDGE, stepsRequired: 350 },
      { targetZoneId: ZONE_IDS.THE_RIVALS_CAMP, stepsRequired: 500 },
    ],
    unlockRequirement: null,
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: Story Zones
  // ════════════════════════════════════════════════════════════
  {
    id: ZONE_IDS.THE_NEWCOMERS_WORKSHOP,
    name: "The Newcomer's Workshop",
    description: 'An open-air workshop near the Greenwood. Anyone can learn here. No one is turned away.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'FOREST',
    color: '#2ECC71',
    icon: 'construct-outline',
    connections: [
      { targetZoneId: ZONE_IDS.IRONWOOD_GROVE, stepsRequired: 300 },
      { targetZoneId: ZONE_IDS.THE_PROMENADE, stepsRequired: 700 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.THE_RIVALS_CAMP,
    name: "The Rival's Camp",
    description: 'A competing settlement on the outskirts, built differently and pointedly. Two visions of what the city should become.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'SETTLEMENT',
    color: '#C0392B',
    icon: 'flag-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_CUTTING_YARD, stepsRequired: 500 },
      { targetZoneId: ZONE_IDS.THE_PROMENADE, stepsRequired: 600 },
    ],
    unlockRequirement: null,
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: The City
  // ════════════════════════════════════════════════════════════
  {
    id: ZONE_IDS.THE_PROMENADE,
    name: 'The Promenade',
    description: 'The main street of Al Fakhr, rebuilt with ambitious grandeur. Markets, food stalls, and gathering places line both sides.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: true,
    terrain: 'CITY',
    color: '#D4A843',
    icon: 'storefront-outline',
    connections: [
      { targetZoneId: ZONE_IDS.PILGRIMS_REST, stepsRequired: 800 },
      { targetZoneId: ZONE_IDS.THE_NEWCOMERS_WORKSHOP, stepsRequired: 700 },
      { targetZoneId: ZONE_IDS.THE_RIVALS_CAMP, stepsRequired: 600 },
      { targetZoneId: ZONE_IDS.THE_FORGE_QUARTER, stepsRequired: 200 },
      { targetZoneId: ZONE_IDS.THE_BUILDERS_TERRACE, stepsRequired: 250 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.THE_FORGE_QUARTER,
    name: 'The Forge Quarter',
    description: 'The industrial heart of Al Fakhr. Furnaces burn day and night. The heat is relentless, but so are the smiths.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'CITY',
    color: '#E07020',
    icon: 'flame-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_PROMENADE, stepsRequired: 200 },
      { targetZoneId: ZONE_IDS.THE_HIGH_ARCHIVE, stepsRequired: 300 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.THE_HIGH_ARCHIVE,
    name: 'The High Archive',
    description: 'A library built atop old ruins. Knowledge preserved and hoarded in equal measure.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'CITY',
    color: '#7D6BA0',
    icon: 'book-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_FORGE_QUARTER, stepsRequired: 300 },
      { targetZoneId: ZONE_IDS.THE_OLD_FOUNDATION, stepsRequired: 400 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.THE_BUILDERS_TERRACE,
    name: "The Builder's Terrace",
    description: 'Scaffolding and cranes dominate the skyline. The city is always being built higher, always reaching.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'CITY',
    color: '#B08D57',
    icon: 'construct-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_PROMENADE, stepsRequired: 250 },
      { targetZoneId: ZONE_IDS.KARAMS_SCAFFOLD, stepsRequired: 200 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.KARAMS_SCAFFOLD,
    name: "Karam's Scaffold",
    description: 'The Builder\'s personal project. A towering structure that keeps getting taller. No one else is allowed to touch it.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'CITY',
    color: '#8B7355',
    icon: 'business-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_BUILDERS_TERRACE, stepsRequired: 200 },
    ],
    unlockRequirement: { totalLevel: 15 },
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr: The Ruins
  // ════════════════════════════════════════════════════════════
  {
    id: ZONE_IDS.THE_OLD_FOUNDATION,
    name: 'The Old Foundation',
    description: 'Where the original city stood before the collapse. People avoid it. Memories are heavy here.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'RUINS',
    color: '#9B59B6',
    icon: 'eye-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_HIGH_ARCHIVE, stepsRequired: 400 },
      { targetZoneId: ZONE_IDS.THE_UNFINISHED_REACH, stepsRequired: 500 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.THE_UNFINISHED_REACH,
    name: 'The Unfinished Reach',
    description: 'A half-built monument to something no one can agree on anymore. Pride as downfall, frozen in stone.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'RUINS',
    color: '#7F8C8D',
    icon: 'warning-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_OLD_FOUNDATION, stepsRequired: 500 },
      { targetZoneId: ZONE_IDS.THE_COLLAPSED_GALLERY, stepsRequired: 300 },
    ],
    unlockRequirement: null,
  },
  {
    id: ZONE_IDS.THE_COLLAPSED_GALLERY,
    name: 'The Collapsed Gallery',
    description: 'Buried chambers beneath the Reach. Machinery and inscriptions from before the collapse, still humming faintly.',
    biomeId: BIOME_IDS.AL_FAKHR,
    isCentralCity: false,
    terrain: 'RUINS',
    color: '#5D6D7E',
    icon: 'layers-outline',
    connections: [
      { targetZoneId: ZONE_IDS.THE_UNFINISHED_REACH, stepsRequired: 300 },
    ],
    unlockRequirement: { totalLevel: 12 },
  },
];

/** Lookup map for zone definitions by ID. */
export const zoneDefinitionMap: Record<string, ZoneDefinition> = Object.fromEntries(
  zoneDefinitions.map((zone) => [zone.id, zone]),
);
