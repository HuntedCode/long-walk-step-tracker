# Step Pipeline

> How steps get from the phone's hardware sensor to game state changes.
> This pipeline spans 8 files across 4 directories.

---

## Overview

Every step the player takes flows through a pipeline:

```
Hardware Sensor
  → pedometer.ts        (platform abstraction)
  → usePedometer.ts     (React hook, lifecycle management)
  → useStepStore        (Zustand, persisted step counts)
  → useGameTick.ts      (headless hook, delta calculation)
  → game-tick.ts        (pure function, three-phase dispatcher)
  → stores              (player, jobs, inventory, events)
```

Each stage has different semantics. Getting them wrong causes double-counting,
lost steps, or broken game state.

---

## 1. Platform Differences

The pedometer service (`src/services/pedometer.ts`) abstracts platform differences,
but the *semantics* of the callback data differ:

| Platform | Package | Callback `steps` value | Store action called |
|----------|---------|----------------------|-------------------|
| Android | `expo-android-pedometer` (lazy-loaded) | Today's total from sensor since midnight | `backfillToday(steps)` |
| iOS | `expo-sensors` Pedometer | Cumulative since subscription start | `addSteps(delta)` |
| Web | N/A (unavailable) | — | Use StepSimulator |

> **Lazy loading:** `expo-android-pedometer` is loaded via `require()` on first
> use rather than a top-level import. This prevents import failures on iOS, where
> the native Android module is not available.

**Why this matters:** `backfillToday` and `addSteps` have completely different
semantics. Android sends the same total repeatedly — only the high-water mark
pattern prevents double-counting. iOS sends a running sum that requires delta
calculation via `lastCumulativeRef`.

### Android flow (`src/hooks/usePedometer.ts:59-62`)
```
sensor callback → backfillToday(result.steps)
```

### iOS flow (`src/hooks/usePedometer.ts:64-73`)
```
sensor callback → delta = steps - lastCumulativeRef → addSteps(delta)
```
First callback is discarded (sets the baseline). Subsequent callbacks compute
deltas from the previous cumulative value.

---

## 2. High-Water Mark Pattern

`backfillToday(total)` in `useStepStore` (`src/stores/useStepStore.ts:96-127`)
only adjusts `todaySteps` upward:

```
if (total > state.todaySteps) {
  backfilledDelta = total - state.todaySteps
  todaySteps = total
  lifetimeSteps += backfilledDelta
}
```

**Why:** Android sends today's total on every callback. If the sensor reports
5000 three times, the high-water mark ensures we count 5000 steps total, not
15000. The delta (`total - todaySteps`) is what gets added to `lifetimeSteps`.

This pattern also handles background recovery — when the app returns to
foreground, `getTodaySteps()` queries the native sensor database and
`backfillToday()` picks up any steps walked while backgrounded.

---

## 3. Step-to-Game-Tick Bridge

The `useGameTick` hook (`src/hooks/useGameTick.ts`) is the critical bridge.
It uses **Zustand's vanilla `subscribe()` API** (not a React selector) so game
ticks run as store-to-store side effects without triggering React re-renders.

### How it works

1. Subscribes to `useStepStore` state changes
2. Filters: only processes when `todaySteps` actually changed
3. Computes delta: `stepDelta = todaySteps - lastProcessedSteps`
4. Guards: if `stepDelta <= 0`, resets baseline on day rollover and returns
5. Builds `GameTickInput` from player, job, and step stores
6. Calls `processGameTick()` (pure function)
7. Applies result to all affected stores

### `lastProcessedSteps` synchronization

`lastProcessedSteps` lives in `usePlayerStore` (persisted). It tracks the
`todaySteps` value at the end of the last game tick.

- **Normal tick:** `setLastProcessedSteps(todaySteps)` after applying result
- **Day rollover:** `todaySteps` resets to 0 (or a small backfill value) which
  is less than `lastProcessedSteps`. The hook detects this (`todaySteps <
  lastProcessedSteps`) and resets the baseline, preventing negative deltas.
- **App restart:** Persisted `lastProcessedSteps` ensures steps aren't
  reprocessed. The delta picks up exactly where it left off.

### Mount guard

Mounted once at root layout (`app/_layout.tsx`), guarded by `subscribedRef`
to prevent double-subscription on hot reload.

---

## 4. The Three-Phase Game Tick

`processGameTick()` in `src/game/core/game-tick.ts` is a pure function that
routes steps through three phases. **Leftover steps cascade between phases.**

```
                    ┌──────────────────┐
  stepDelta ──────▶ │   Phase 1:       │
                    │   TRAVEL         │
                    │                  │
                    │   Steps → travel │
                    │   progress       │
                    └────────┬─────────┘
                             │ stepsRemaining (on arrival)
                             ▼
                    ┌──────────────────┐
                    │   Phase 2:       │
                    │   ACTIVITY       │
                    │                  │
                    │   Steps (+bank)  │
                    │   → completions  │
                    │   → XP + items   │
                    └────────┬─────────┘
                             │ remainingSteps = 0
                             ▼
                    ┌──────────────────┐
                    │   Phase 3:       │
                    │   BANK           │
                    │                  │
                    │   Idle steps     │
                    │   → step bank    │
                    └──────────────────┘
```

### Phase 1: Travel
- If `travel` state exists and `remainingSteps > 0`, steps advance travel progress
- On arrival: zone changes, `ARRIVED_AT_ZONE` event emits, **remaining steps
  fall through** to Phase 2 or 3
- If not traveling: skipped entirely, all steps go to Phase 2

### Phase 2: Activity
- Requires both `activeActivity` (definition) and `activityProgress` (runtime state)
- **Bank bonus:** `effectiveSteps = realSteps + min(realSteps, bankedSteps)` — 2x
  progress while bank has balance
- **Multi-completion:** loops until `progress < stepsRequired`, with remainder
  rolling over. 1000 steps on a 150-step activity = 6 completions + 100 remaining
- Each completion aggregates XP and item rewards
- **Inline level-up detection:** after awarding XP, compares old and new job
  states to emit `LEVEL_UP` events in the same tick
- Consumes all remaining steps (`remainingSteps = 0`)

### Phase 3: Bank
- Only runs when idle (no travel AND no active activity)
- Also runs if activity definition lookup failed (prevents silent step loss)
- `deposit = min(remainingSteps, bankCap - currentBank)`
- Emits `BANK_DEPOSIT` event

### Critical behavior: cascade
Arriving at a zone mid-tick immediately starts working on an activity (or
banking) in the same tick. This means a single game tick can produce travel
arrival + activity completions + level-ups all at once.

---

## 5. Step Bank

The step bank rewards players who walk without an activity set by storing
steps for later use.

| Formula | Value |
|---------|-------|
| Capacity | `1000 + totalLevel × 100` |
| Starting cap (3 jobs × level 1) | 1,300 steps |
| Max cap (3 jobs × level 99) | 30,700 steps |

**Withdrawal:** When an activity is active, banked steps are consumed 1:1
with real steps. 50 real steps + 50 banked = 100 effective steps (2x progress).
Bank depletes as it's used.

**Design intent** (`src/game/core/formulas.ts`): Intentionally generous cap
so players aren't punished for walking without an activity set.

---

## 6. Day Rollover

Day rollover is detected by comparing `getTodayDateString()` against stored
`todayDate`. It can trigger in three places:

1. **`checkDayRollover()`** — called on app foreground via `AppState` listener
   in `usePedometer.ts`
2. **`addSteps()`** — checks inline before adding steps
3. **`backfillToday()`** — checks inline before backfilling

When rollover happens:
1. Current day archived to `dailyHistory` as a `DailyStepRecord`
2. `todaySteps` resets to 0
3. `pendingDailyStepGoal` promotes to `dailyStepGoal` (if set)
4. `todayDate` updates to current date

### Background recovery
On app foreground (`usePedometer.ts:163-186`):
1. `checkDayRollover()` runs first (archives yesterday if needed)
2. `recoverBackgroundSteps()` calls `getTodaySteps()` (native API query)
3. Result passed to `backfillToday()` — high-water mark picks up any
   steps walked while backgrounded

---

## Key Files

| File | Role |
|------|------|
| `src/services/pedometer.ts` | Platform abstraction — sensor availability, permissions, subscription, today's steps query |
| `src/hooks/usePedometer.ts` | React lifecycle — init, subscribe, AppState handling, background recovery |
| `src/stores/useStepStore.ts` | Step state — todaySteps, lifetime, history, goals, high-water mark |
| `src/hooks/useGameTick.ts` | Bridge — headless subscription, delta calculation, tick dispatch |
| `src/game/core/game-tick.ts` | Engine — three-phase pure function dispatcher |
| `src/game/core/formulas.ts` | Math — bank cap, effective steps, bank deposit |
| `src/types/game.ts` | Types — GameTickInput, GameTickResult, GameEvent |
| `src/utils/time.ts` | Dates — local timezone date strings, prevents UTC off-by-one |
