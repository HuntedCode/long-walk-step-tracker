import type { JobId, ZoneId } from '../jobs/job-types';

/** Unique identifier for a biome (e.g., 'al_fakhr', 'the_cairn'). */
export type BiomeId = string;

/** Static definition of a biome. Lives in src/data/biomes.ts. */
export interface BiomeDefinition {
  id: BiomeId;
  name: string;
  /** Display name shown in UI (Arabic name for central cities, evocative for others). */
  displayName: string;
  description: string;
  /** Emotional theme for internal design reference (e.g., 'Pride', 'Grief'). */
  theme: string;
  /** Primary hex accent color for UI theming. */
  color: string;
  /** Secondary hex accent color for gradients/contrast. */
  colorSecondary: string;
  /** Icon name. */
  icon: string;
  /** Which icon library the icon belongs to. */
  iconLibrary: 'Ionicons' | 'MaterialCommunityIcons';
  /** The primary zone of this biome (central city or main hub zone). */
  centralZoneId: ZoneId;
  /** All zone IDs belonging to this biome (including central). */
  zoneIds: ZoneId[];
  /** Lifetime steps required to discover this biome. 0 = always visible. */
  discoverySteps: number;
  /** Level scaling parameters for content in this biome. */
  levelRange: BiomeLevelRange;
  /** 2-3 skills this biome specializes in (deep content, multiple tiers). */
  specialtyJobIds: JobId[];
  /** NPC stubs for this biome (forward-compatible for Phase 2 quests). */
  npcs: NpcStub[];
  /** Encounter stubs (forward-compatible for Phase 3 combat). */
  encounterStubs: EncounterStub[];
  /** Connection questline stub. Null = always connected (e.g., the hub). */
  connectionQuest: ConnectionQuestStub | null;
}

/** Level range parameters for a biome's content. */
export interface BiomeLevelRange {
  /** Minimum job level for the easiest activities in this biome. */
  minLevel: number;
  /** Maximum job level for the hardest activities in this biome. */
  maxLevel: number;
  /** Suggested total level (sum of all job levels) to enter comfortably. */
  suggestedTotalLevel: number;
}

/** Forward-compatible NPC stub. Full NPC system comes with Phase 2 quests. */
export interface NpcStub {
  id: string;
  name: string;
  /** Which zone this NPC is found in. */
  zoneId: ZoneId;
  /** Archetype label for design reference (e.g., 'The Builder'). */
  archetype: string;
  /** 1-2 sentence character description. */
  description: string;
  /** Hex color for NPC UI accent. */
  color: string;
  /** Icon name. */
  icon: string;
  /** Which icon library the icon belongs to. */
  iconLibrary: 'Ionicons' | 'MaterialCommunityIcons';
}

/** Forward-compatible encounter stub. Full combat comes in Phase 3. */
export interface EncounterStub {
  id: string;
  name: string;
  /** Which zone this encounter appears in. */
  zoneId: ZoneId;
  /** 1-2 sentence description. */
  description: string;
  /** Estimated difficulty tier for design reference. */
  tier: 'starting' | 'early' | 'mid' | 'late' | 'endgame';
}

/** Forward-compatible connection quest stub. Full quest system is Phase 2. */
export interface ConnectionQuestStub {
  id: string;
  name: string;
  /** Brief description of the questline's narrative. */
  description: string;
  /** Estimated steps to complete (narrative framing, not mechanical yet). */
  estimatedSteps: number;
  /** NPC IDs involved in this questline. */
  involvedNpcIds: string[];
}

/** Runtime state of a biome for a single player. */
export interface BiomeState {
  biomeId: BiomeId;
  /** Whether this biome has been discovered (player walked enough lifetime steps). */
  discovered: boolean;
  /** Whether the connection questline is complete (fast travel unlocked). */
  connected: boolean;
  /** Timestamp of first discovery. */
  discoveredAt: number | null;
  /** Timestamp of connection completion. */
  connectedAt: number | null;
}
