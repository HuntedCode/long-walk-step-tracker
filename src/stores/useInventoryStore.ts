import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type { ItemReward } from '@/src/game/jobs/job-types';

interface InventoryStoreState {
  /** Item quantities keyed by item ID. Only items with quantity > 0 appear. */
  items: Record<string, number>;
}

interface InventoryStoreActions {
  /** Add items from activity completion rewards. */
  addItems: (rewards: ItemReward[]) => void;
}

type InventoryStore = InventoryStoreState & InventoryStoreActions;

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      items: {},

      addItems: (rewards: ItemReward[]) => {
        if (rewards.length === 0) return;
        const state = get();
        const updated = { ...state.items };

        for (const reward of rewards) {
          updated[reward.itemId] = (updated[reward.itemId] ?? 0) + reward.quantity;
        }

        set({ items: updated });
      },
    }),
    {
      name: 'longwalk-inventory',
      storage: zustandStorage,
    },
  ),
);
