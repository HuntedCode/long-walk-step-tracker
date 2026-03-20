import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type { BiomeId, BiomeState } from '../game/biomes/biome-types';
import { biomeDefinitions } from '../data/biomes';

interface BiomeStore {
  /** Runtime state for each biome, keyed by biome ID. */
  biomes: Record<BiomeId, BiomeState>;

  /** Mark a biome as discovered (visible on map). */
  discoverBiome: (biomeId: BiomeId) => void;

  /** Mark a biome as connected (fast travel unlocked). */
  connectBiome: (biomeId: BiomeId) => void;

  /** Check if a biome has been discovered. */
  isDiscovered: (biomeId: BiomeId) => boolean;

  /** Check if a biome is connected (fast travel available). */
  isConnected: (biomeId: BiomeId) => boolean;
}

function createInitialBiomeStates(): Record<BiomeId, BiomeState> {
  const states: Record<BiomeId, BiomeState> = {};
  for (const biome of biomeDefinitions) {
    const isHub = biome.connectionQuest === null;
    states[biome.id] = {
      biomeId: biome.id,
      discovered: isHub,
      connected: isHub,
      discoveredAt: isHub ? Date.now() : null,
      connectedAt: isHub ? Date.now() : null,
    };
  }
  return states;
}

export const useBiomeStore = create<BiomeStore>()(
  persist(
    (set, get) => ({
      biomes: createInitialBiomeStates(),

      discoverBiome: (biomeId: BiomeId) => {
        const current = get().biomes[biomeId];
        if (!current || current.discovered) return;
        set((state) => ({
          biomes: {
            ...state.biomes,
            [biomeId]: {
              ...state.biomes[biomeId],
              discovered: true,
              discoveredAt: Date.now(),
            },
          },
        }));
      },

      connectBiome: (biomeId: BiomeId) => {
        const current = get().biomes[biomeId];
        if (!current || current.connected) return;
        set((state) => ({
          biomes: {
            ...state.biomes,
            [biomeId]: {
              ...state.biomes[biomeId],
              connected: true,
              connectedAt: Date.now(),
            },
          },
        }));
      },

      isDiscovered: (biomeId: BiomeId) => {
        return get().biomes[biomeId]?.discovered ?? false;
      },

      isConnected: (biomeId: BiomeId) => {
        return get().biomes[biomeId]?.connected ?? false;
      },
    }),
    {
      name: 'longwalk-biomes',
      storage: zustandStorage,
      version: 0,
    },
  ),
);
