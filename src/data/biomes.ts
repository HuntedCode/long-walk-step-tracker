import type { BiomeDefinition } from '../game/biomes/biome-types';
import { JOB_IDS } from './jobs';

export const BIOME_IDS = {
  THE_CAIRN: 'the_cairn',
  AL_FAKHR: 'al_fakhr',
} as const;

export const biomeDefinitions: BiomeDefinition[] = [
  // ════════════════════════════════════════════════════════════
  // The Cairn (Hub)
  // ════════════════════════════════════════════════════════════
  {
    id: BIOME_IDS.THE_CAIRN,
    name: 'The Cairn',
    displayName: 'The Cairn',
    description: 'A modest camp at a crossroads. The journey begins here.',
    theme: 'Beginning',
    color: '#B8860B',
    colorSecondary: '#D4760A',
    icon: 'home-outline',
    iconLibrary: 'Ionicons',
    centralZoneId: 'the_cairn',
    zoneIds: ['the_cairn', 'the_cookfire'],
    discoverySteps: 0,
    levelRange: {
      minLevel: 1,
      maxLevel: 1,
      suggestedTotalLevel: 0,
    },
    specialtyJobIds: [],
    npcs: [],
    encounterStubs: [],
    connectionQuest: null,
  },

  // ════════════════════════════════════════════════════════════
  // Al Fakhr (Pride)
  // ════════════════════════════════════════════════════════════
  {
    id: BIOME_IDS.AL_FAKHR,
    name: 'Al Fakhr',
    displayName: 'Al Fakhr',
    description: 'A region that was clearly great once. Impressive ruins, ambitious infrastructure half-rebuilt, grandeur that is both inspiring and sad.',
    theme: 'Pride',
    color: '#D4A843',
    colorSecondary: '#8B7355',
    icon: 'city-variant',
    iconLibrary: 'MaterialCommunityIcons',
    centralZoneId: 'the_promenade',
    zoneIds: [
      // City
      'the_promenade',
      'the_forge_quarter',
      'the_high_archive',
      'the_builders_terrace',
      // Quarry Highlands
      'the_quarry_face',
      'amber_ridge',
      'the_cutting_yard',
      // The Greenwood
      'the_lone_garden',
      'the_hidden_spring',
      'ironwood_grove',
      // The Ruins
      'the_unfinished_reach',
      'the_collapsed_gallery',
      // Outskirts
      'dustfall_edge',
      'pilgrims_rest',
      // Story Zones
      'karams_scaffold',
      'the_rivals_camp',
      'the_old_foundation',
      'the_newcomers_workshop',
    ],
    discoverySteps: 2000,
    levelRange: {
      minLevel: 1,
      maxLevel: 25,
      suggestedTotalLevel: 22,
    },
    specialtyJobIds: [JOB_IDS.MINING, JOB_IDS.CONSTRUCTION, JOB_IDS.SMITHING],
    npcs: [
      {
        id: 'npc_karam',
        name: 'Karam',
        zoneId: 'karams_scaffold',
        archetype: 'The Builder',
        description: 'Rebuilt more of the city than anyone. Skilled, dedicated, incapable of rest.',
        color: '#8B7355',
        icon: 'hammer',
        iconLibrary: 'MaterialCommunityIcons',
      },
      {
        id: 'npc_safiya',
        name: 'Safiya',
        zoneId: 'the_old_foundation',
        archetype: 'The Elder',
        description: 'Measures everything against what was lost. Her standards are grief in disguise.',
        color: '#9B59B6',
        icon: 'book-open-variant',
        iconLibrary: 'MaterialCommunityIcons',
      },
      {
        id: 'npc_reza',
        name: 'Reza',
        zoneId: 'the_newcomers_workshop',
        archetype: 'The Newcomer',
        description: 'Arrived after the collapse. Builds without the weight of comparison.',
        color: '#2ECC71',
        icon: 'account-plus',
        iconLibrary: 'MaterialCommunityIcons',
      },
      {
        id: 'npc_tariq',
        name: 'Tariq',
        zoneId: 'the_rivals_camp',
        archetype: 'The Rival',
        description: 'Runs a competing project. Two visions, neither willing to bend.',
        color: '#C0392B',
        icon: 'account-alert',
        iconLibrary: 'MaterialCommunityIcons',
      },
    ],
    encounterStubs: [],
    connectionQuest: {
      id: 'cq_al_fakhr',
      name: 'The Weight of Ambition',
      description: 'Mediate between factions whose pride prevents cooperation.',
      estimatedSteps: 15000,
      involvedNpcIds: ['npc_karam', 'npc_safiya', 'npc_reza', 'npc_tariq'],
    },
  },
];

/** Lookup map for biome definitions by ID. */
export const biomeDefinitionMap: Record<string, BiomeDefinition> = Object.fromEntries(
  biomeDefinitions.map((biome) => [biome.id, biome]),
);
