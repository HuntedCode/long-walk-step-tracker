# Step Stats and Goals

> How step statistics, streaks, and the daily goal system work.
> This is a self-contained domain with several non-obvious behaviors.

---

## Daily Step Goal Lifecycle

### Setting a goal (`useStepStore.setDailyStepGoal`)

Setting a new goal does **not** immediately change the active goal. It sets
`pendingDailyStepGoal` instead.

```
setDailyStepGoal(5000)
  → dailyStepGoal stays at 1000 (unchanged)
  → pendingDailyStepGoal = 5000

[next day rollover]
  → dailyStepGoal = 5000
  → pendingDailyStepGoal = null
```

**Why:** Changing the goal mid-day could retroactively break a streak. If the
player has 3000 steps and raises the goal from 2000 to 5000, they'd lose today's
goal-met status and break their streak. The pending system prevents this.

**Special case:** If the new goal equals the current goal, `pendingDailyStepGoal`
is cleared (cancel the change).

### Goal constraints
- Range: 1,000–100,000 (clamped)
- Default: 1,000

### Goal promotion
The pending goal promotes to active in three places — wherever day rollover
is detected:
1. `checkDayRollover()` — called on app foreground
2. `addSteps()` — inline check before adding
3. `backfillToday()` — inline check before backfilling

---

## Goal Met Tracking

### `goalMetDates` — the single source of truth for streaks

`goalMetDates` is a **sorted array of `YYYY-MM-DD` strings** where the daily
goal was met. This is the only data structure used for streak calculation.

### How dates are added (`checkGoalMet`)
Called on every step update (`addSteps` / `backfillToday`):
```
if todaySteps >= dailyStepGoal AND today not already in goalMetDates:
  append today, re-sort
```

### How dates are removed (debug only)
`removeSteps()` checks if steps drop below the goal and removes today from
`goalMetDates`. This is a debug/testing feature, not normal gameplay.

---

## Streak Calculation

Streaks are calculated by `calculateStreaks()` in `src/utils/step-stats.ts`.
The algorithm has three key behaviors.

### Current streak — walk backwards from today

```
Build a Set from goalMetDates for O(1) lookups

If today's goal is met (live check OR today is in goalMetDates):
  streak = 1
  walk backwards: yesterday, day before, etc.
  each day in the Set adds 1 to streak
  first missing day stops the walk

Else if yesterday is in the Set (but today isn't):
  streak = yesterday's streak value
  streakAtRisk = true
  walk backwards from 2 days ago

Else:
  streak = 0
```

### "At risk" state

When yesterday was a goal-met day but today's goal isn't yet met:
- `streak` shows the **yesterday streak value** (not 0)
- `streakAtRisk = true`

The UI displays this as "5 — at risk" rather than dropping to 0 during the
day. This encourages the player to complete today's goal without punishing
them prematurely. The streak only breaks when a full day passes without
meeting the goal.

### Best streak — full scan

Scans the sorted `goalMetDates` array for the longest consecutive run:
```
for each date in sorted array:
  if (date - previousDate) === 1 day: currentRun++
  else: currentRun = 1
  bestStreak = max(bestStreak, currentRun)
```

Today is included in the scan if the goal is met (even if not yet persisted
to `goalMetDates`). The current streak is also compared — whichever is
larger wins.

### Lookahead optimization
`maxLookback = metSet.size + 1` — the backward walk can never find more
consecutive days than there are goal-met dates. This prevents scanning
unnecessarily far back on long histories.

---

## Week/Month Aggregations

### Calendar week (Monday-based)

```typescript
const dow = todayParsed.getDay(); // 0=Sun
const daysSinceMonday = dow === 0 ? 6 : dow - 1;
const daysInWeekSoFar = daysSinceMonday + 1;
```

- `weekSteps`: sum from Monday through today
- `weekAvg`: `weekSteps / daysInWeekSoFar` — divides by actual days elapsed,
  not 7. On Tuesday, divides by 2.
- `prevWeekSteps`: sum of the 7 days immediately before this Monday

### Calendar month

```typescript
const dayOfMonth = todayParsed.getDate(); // 1-indexed
```

- `monthSteps`: sum from the 1st of the month through today
- `monthAvg`: `monthSteps / dayOfMonth` — divides by actual days, not 30

### Today's data
Today's steps come from the live `todaySteps` value, not from `dailyHistory`.
Today hasn't been archived yet — it's still accumulating. The `stepsForDate()`
helper handles this:
```typescript
if (date === todayDate) return todaySteps;
return dailyHistory[date]?.steps ?? 0;
```

---

## Timezone Handling

All date operations use **local timezone**, not UTC.

`getTodayDateString()` in `src/utils/time.ts`:
```typescript
const year = d.getFullYear();   // local
const month = d.getMonth() + 1; // local
const day = d.getDate();        // local
```

**Why not `toISOString().slice(0,10)`?** That produces a UTC date string.
At 11pm in UTC-5 (Eastern), `toISOString()` returns tomorrow's date. This
would cause steps to be attributed to the wrong day, streaks to break
incorrectly, and day rollover to trigger at the wrong time.

All date comparisons in the store use `YYYY-MM-DD` string equality — no
Date object comparison, no UTC conversion.

---

## Key Files

| File | Role |
|------|------|
| `src/utils/step-stats.ts` | All stat calculations (streaks, averages, best day, goal progress) |
| `src/stores/useStepStore.ts` | Goal state, goalMetDates, pending goal, day rollover |
| `src/utils/time.ts` | Local timezone date strings, date formatting |
| `src/types/steps.ts` | StepStoreState, DailyStepRecord type definitions |
| `src/components/ui/StreakCard.tsx` | Streak display with at-risk indicator |
