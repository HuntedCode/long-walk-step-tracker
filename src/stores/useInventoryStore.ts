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
  /** Remove items from inventory. Returns false if insufficient quantity. */
  removeItems: (itemId: string, quantity: number) => boolean;
  /** Get the current quantity of an item. */
  getItemCount: (itemId: string) => number;
  /** Check if the player has at least `quantity` of an item. */
  hasItems: (itemId: string, quantity: number) => boolean;
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

      removeItems: (itemId: string, quantity: number) => {
        const current = get().items[itemId] ?? 0;
        if (current < quantity) return false;

        const updated = { ...get().items };
        const remaining = current - quantity;
        if (remaining <= 0) {
          delete updated[itemId];
        } else {
          updated[itemId] = remaining;
        }

        set({ items: updated });
        return true;
      },

      getItemCount: (itemId: string) => {
        return get().items[itemId] ?? 0;
      },

      hasItems: (itemId: string, quantity: number) => {
        return (get().items[itemId] ?? 0) >= quantity;
      },
    }),
    {
      name: 'longwalk-inventory',
      storage: zustandStorage,
    },
  ),
);
