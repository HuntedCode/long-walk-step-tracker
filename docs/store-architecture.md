# Store Architecture

> How the Zustand stores relate to each other, persistence details, and
> non-obvious state management patterns.

---

## Store Inventory

| Store | Key | Persisted | Version | Purpose |
|-------|-----|-----------|---------|---------|
| `useStepStore` | `longwalk-steps` | Yes | 1 | Daily/lifetime step counts, goals, streak tracking |
| `usePlayerStore` | `longwalk-player` | Yes | 1 | Current zone, activity, travel, step bank, lastProcessedSteps |
| `useJobStore` | `longwalk-jobs` | Yes | 0 | Job XP and levels per job |
| `useInventoryStore` | `longwalk-inventory` | Yes | 1 | Item quantities, show-all-items toggle |
| `useBiomeStore` | `longwalk-biomes` | Yes | 0 | Biome discovery and connection state |
| `useEventStore` | — | **No** | — | Ephemeral game event queue (toasts) |

All persisted stores use `zustandStorage` from `src/stores/storage.ts`
(AsyncStorage-backed). Future MMKV migration: swap one import in `storage.ts`.

---

## State Ownership

Each piece of game state lives in exactly one store:

| Data | Owner | Notes |
|------|-------|-------|
| Step counts (today, lifetime, history) | `useStepStore` | |
| Daily step goal + pending goal | `useStepStore` | |
| Goal met dates (streak source) | `useStepStore` | |
| Current zone | `usePlayerStore` | |
| Active activity + progress | `usePlayerStore` | |
| Active travel + progress | `usePlayerStore` | |
| Step bank balance | `usePlayerStore` | |
| `lastProcessedSteps` | `usePlayerStore` | Baseline for delta calculation |
| Job XP and levels | `useJobStore` | |
| Item quantities | `useInventoryStore` | |
| Show-all-items UI toggle | `useInventoryStore` | Persisted, default false |
| Biome discovered/connected state | `useBiomeStore` | `biomes{}` record keyed by biome ID |
| Pending UI notifications | `useEventStore` | Not persisted |

### Derived values (computed at read time)
- `totalLevel`: `useJobStore.getTotalLevel()` — sum of all job levels
- `totalXp`: `useJobStore.getTotalXp()` — sum of all job XP
- `bankCap`: `calculateBankCap(totalLevel)` — computed in `useGameTick`
- Step statistics (streaks, averages): computed by `src/utils/step-stats.ts`

---

## Cross-Store Communication

Stores are independent — they never import each other. Communication happens
through the `useGameTick` hook, which is the **only** place where multiple
stores interact.

```
useStepStore  ──subscribe()──▶  useGameTick  ──getState()──▶  usePlayerStore
                                    │                          useJobStore
                                    │
                                    ▼ applyTickResult / addXp / addItems / pushEvents
                               usePlayerStore
                               useJobStore
                               useInventoryStore
                               useEventStore
```

**Pattern:** Subscribe to one store, read from others via `getState()`, write
results to all affected stores. This avoids circular dependencies.

---

## The Headless Subscription Pattern

`useGameTick` (`src/hooks/useGameTick.ts`) uses **Zustand's vanilla
`subscribe()` API**, not a React selector. This is intentional:

- Game ticks run as **store-to-store side effects**, not React renders
- No component re-renders when steps are processed
- The subscribe callback reads from multiple stores via `getState()`
- Results are applied via store actions (`applyTickResult`, `addXp`, etc.)

### Why not a React selector?
A selector like `useStepStore((s) => s.todaySteps)` would trigger a React
re-render on every step update, then the component would need to call store
actions — mixing UI rendering with game logic. The headless pattern keeps
game processing in the store layer where it belongs.

### Mount guard
`subscribedRef` prevents double-subscription on hot reload. The hook is
mounted once at the root layout (`app/_layout.tsx`) and persists for the
entire app lifecycle.

### Change filtering
The subscribe callback fires on **any** state change in `useStepStore`.
It tracks `prevTodaySteps` and only processes when `todaySteps` actually
changed, avoiding redundant ticks from goal updates or history changes.

---

## Persistence and Migration

### Storage adapter (`src/stores/storage.ts`)
Single-line wrapper around AsyncStorage:
```typescript
export const zustandStorage = createJSONStorage(() => AsyncStorage);
```
All stores import this. To migrate to MMKV: change this one import.

### Version migration
Zustand's `persist` middleware supports versioned migrations:

```typescript
persist(storeConfig, {
  name: 'longwalk-steps',
  storage: zustandStorage,
  version: 1,
  migrate: (persisted, version) => {
    if (version === 0) {
      return { ...state, newField: defaultValue };
    }
    return state;
  },
});
```

**Current migrations:**
- `useStepStore` v0 → v1: adds `pendingDailyStepGoal` (null), clamps
  `dailyStepGoal` minimum to 1000
- `usePlayerStore` v0 → v1: resets `currentZoneId` to new starting zone if the
  player was in a removed placeholder zone (homestead, whispering_woods,
  silver_brook, ironpeak_ridge). Clears activity and travel state on reset.
- `useInventoryStore` v0 → v1: adds `showAllItems` (false)

**To add a migration:** increment `version`, add a case to `migrate` function.
Each case handles upgrading from the previous version to the current.

---

## Mutual Exclusion (Player State)

`usePlayerStore` enforces that the player can only be in one mode:

| Action | Sets | Clears |
|--------|------|--------|
| `startActivity(id)` | `activityProgress` | `travel` |
| `startTravel(state)` | `travel` | `activityProgress` |
| `stopActivity()` | — | `activityProgress` |

This prevents impossible states like traveling and doing an activity
simultaneously. The game tick respects this: Phase 1 (travel) and Phase 2
(activity) are mutually exclusive paths.

---

## Key Files

| File | Role |
|------|------|
| `src/stores/storage.ts` | Persistence adapter (AsyncStorage, single point of change) |
| `src/stores/useStepStore.ts` | Step state, goal tracking, day rollover |
| `src/stores/usePlayerStore.ts` | Player location, mode, bank, lastProcessedSteps |
| `src/stores/useJobStore.ts` | Job XP/levels, totalLevel computation |
| `src/stores/useInventoryStore.ts` | Item accumulation, discovery toggle |
| `src/stores/useBiomeStore.ts` | Biome discovery/connection tracking |
| `src/stores/useEventStore.ts` | Ephemeral event queue (not persisted) |
| `src/hooks/useGameTick.ts` | Cross-store bridge (headless subscription) |
