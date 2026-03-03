import { create } from 'zustand';
import type { GameEvent } from '@/src/types/game';

interface EventStoreState {
  /** Queue of game events waiting to be displayed. */
  events: GameEvent[];
}

interface EventStoreActions {
  /** Push new game events to the display queue. */
  pushEvents: (events: GameEvent[]) => void;
  /** Remove the first event from the queue (after it's been shown). */
  shiftEvent: () => void;
}

type EventStore = EventStoreState & EventStoreActions;

/**
 * Transient store for game events (level-ups, completions, arrivals).
 * NOT persisted — events are ephemeral UI notifications only.
 */
export const useEventStore = create<EventStore>()((set) => ({
  events: [],

  pushEvents: (events: GameEvent[]) => {
    if (events.length === 0) return;
    // Filter out noisy events (bank deposits/withdrawals)
    const notable = events.filter(
      (e) => e.type !== 'BANK_DEPOSIT' && e.type !== 'BANK_WITHDRAWAL',
    );
    if (notable.length === 0) return;
    set((state) => ({ events: [...state.events, ...notable] }));
  },

  shiftEvent: () => {
    set((state) => ({ events: state.events.slice(1) }));
  },
}));
