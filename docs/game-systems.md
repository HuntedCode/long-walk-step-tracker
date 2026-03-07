# Game Systems

> How jobs, activities, zones, travel, inventory, and events interconnect.
> Individual systems are self-evident from their files — this document
> covers the relationships between them.

---

## System Relationships

```
┌────────────────────────────────────────────────────────────┐
│                        ZONES                                │
│  Each zone has:                                             │
│    • connections to other zones (travel routes)              │
│    • unlock requirements (totalLevel gate)                   │
│    • available activities                                    │
└────────────┬───────────────────────────┬────────────────────┘
             │                           │
     Travel routes                Activities
             │                           │
             ▼                           ▼
┌─────────────────┐          ┌─────────────────────────┐
│     TRAVEL      │          │      ACTIVITIES          │
│                 │          │                           │
│ Steps → travel  │          │  Steps → completions     │
│ progress until  │          │    → XP rewards           │
│ arrival         │          │    → Item rewards          │
└─────────────────┘          └──────┬──────────┬─────────┘
                                    │          │
                              XP rewards   Item rewards
                                    │          │
                                    ▼          ▼
                          ┌──────────┐  ┌────────────┐
                          │   JOBS   │  │ INVENTORY  │
                          │          │  │            │
                          │ XP→level │  │ item qty++ │
                          └────┬─────┘  └────────────┘
                               │
                      totalLevel (sum of all job levels)
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        Zone unlock gates           Step bank capacity
        (totalLevel >= N)           (1000 + totalLevel × 100)
```

---

## Jobs and the XP Curve

### RuneScape formula (`src/game/jobs/job-formulas.ts`)

```
xpForLevel(level) = floor( sum(floor(i + 300 × 2^(i/7))) / 4 )  for i = 1 to level-1
```

| Level | XP Required | Typical effort |
|-------|-------------|----------------|
| 1 | 0 | Starting |
| 2 | 83 | Minutes |
| 10 | 1,154 | A few walks |
| 30 | 13,363 | Days |
| 50 | 101,333 | Weeks |
| 70 | 737,627 | Months |
| 99 | 13,034,431 | Serious dedication |

### Level calculation
- `levelFromXp(xp)`: linear scan from level 2 to 99, returns first level
  where `xpForLevel(level) > xp`. Acceptable performance because MAX_LEVEL = 99.
- `levelProgress(xp)`: returns 0–1 fraction within the current level bracket.
- `xpToNextLevel(xp)`: XP remaining until next level. Returns 0 at level 99.

### Total level
`totalLevel` = sum of all job levels. Starts at 3 (3 jobs × level 1).
Computed via `useJobStore.getTotalLevel()`. Used for:
- Zone unlock gates (`totalLevel >= zone.unlockRequirement.totalLevel`)
- Step bank capacity (`1000 + totalLevel × 100`)

### Current jobs (`src/data/jobs.ts`)
Woodcutting, Fishing, Mining — all max level 99. New jobs: add to `JOB_IDS`
and `jobDefinitions`. No engine changes needed.

---

## Activities: The Core Content Unit

Activities are the primary way players earn XP and items. Each activity
belongs to exactly one job and one zone.

### Definition (`src/game/jobs/job-types.ts:ActivityDefinition`)

| Field | Purpose |
|-------|---------|
| `jobId` | Which job gains XP |
| `zoneId` | Which zone this is available in |
| `stepsRequired` | Steps per completion |
| `itemRewards[]` | Items granted per completion |
| `xpRewards[]` | XP granted per completion |
| `requirements[]` | Job level gates (all must be met) |

### Multi-completion (`src/game/jobs/job-engine.ts:processActivitySteps`)
Activities loop until `progress < stepsRequired`:
```
1000 steps on a 150-step activity = 6 completions + 100 steps carried over
```
Rewards are aggregated: `quantity × completions` for each reward entry.

### Inline level-up detection
After awarding XP, the game tick runs `applyXpRewards()` → `detectLevelUps()`.
This compares old vs. new job states and emits `LEVEL_UP` events in the same
tick as the activity completion. Players see both notifications together.

### Requirement checking (`src/game/jobs/job-engine.ts:meetsRequirements`)
All `LevelRequirement` entries must be satisfied. The UI (`ActivityPicker`)
filters activities by both zone match and requirement check.

---

## Zones and Travel

### Zone definitions (`src/data/zones.ts`)
4 zones currently: Homestead (start), Whispering Woods, Silver Brook,
Ironpeak Ridge (requires totalLevel 5). Each has connections to other zones
with step costs.

### Travel flow (`src/game/zones/zone-engine.ts`)
1. `startTravel(currentZone, destinationId)` → creates `TravelState`
   (progress=0, required=connection.stepsRequired)
2. `processTravelSteps(travel, steps)` → advances progress
3. On arrival: returns `arrivedAtZone` and `stepsRemaining` (cascade to Phase 2/3)

### Mutual exclusion
In `usePlayerStore`:
- `startActivity()` clears travel state
- `startTravel()` clears activity state
Player can only be traveling OR doing an activity, never both.

### Zone unlock
`isZoneUnlocked(zone, totalLevel)` — checks the *destination* zone's
requirement, not the origin. `getAvailableDestinations()` filters connections
by this check.

---

## Inventory (`src/stores/useInventoryStore.ts`)

Simple accumulation: items keyed by ID with quantities. `addItems(rewards)`
increments quantities. No advanced mechanics yet (no equipment, no selling,
no stacking limits).

Items defined in `src/data/items.ts`: 3 log types, 2 fish types, 3 ore types.

---

## Game Events (`src/stores/useEventStore.ts`)

Ephemeral notification queue — **not persisted**.

| Event type | Triggered by |
|-----------|-------------|
| `ACTIVITY_COMPLETED` | Activity completion in game tick |
| `ARRIVED_AT_ZONE` | Travel arrival in game tick |
| `LEVEL_UP` | Inline detection after XP award |
| `BANK_DEPOSIT` | Idle steps banked |
| `BANK_WITHDRAWAL` | Banked steps consumed during activity |

`pushEvents()` filters out `BANK_DEPOSIT` and `BANK_WITHDRAWAL` (too noisy).
`GameEventToast` component displays the first event for ~3 seconds, then
calls `shiftEvent()` to show the next.

---

## Adding New Content

All content is data-driven. No engine changes required for any of these:

| Content | File | What to do |
|---------|------|-----------|
| New job | `src/data/jobs.ts` | Add to `JOB_IDS` + `jobDefinitions` |
| New zone | `src/data/zones.ts` | Add to `ZONE_IDS` + `zoneDefinitions` with connections |
| New activity | `src/data/activities.ts` | Add to `activityDefinitions`, reference job + zone IDs |
| New item | `src/data/items.ts` | Add to `ITEM_IDS` + `itemDefinitions` |
| New item category | `src/game/jobs/job-types.ts` | Add to `ItemCategory` union type |

Activities auto-appear in the UI when the player is in the matching zone and
meets the requirements. Items auto-appear in inventory when earned.

---

## Key Files

| File | Role |
|------|------|
| `src/game/jobs/job-formulas.ts` | XP curve, level calculation, progress fraction |
| `src/game/jobs/job-engine.ts` | Activity processing, XP application, level-up detection |
| `src/game/jobs/job-types.ts` | All type definitions (Job, Activity, Item, rewards, requirements) |
| `src/game/zones/zone-engine.ts` | Travel processing, zone unlock checking |
| `src/game/zones/zone-types.ts` | Zone and travel type definitions |
| `src/data/jobs.ts` | Job content definitions |
| `src/data/zones.ts` | Zone content definitions |
| `src/data/activities.ts` | Activity content definitions |
| `src/data/items.ts` | Item content definitions |
| `src/stores/useJobStore.ts` | Job XP/level state, totalLevel |
| `src/stores/useInventoryStore.ts` | Item quantities |
| `src/stores/useEventStore.ts` | Ephemeral event queue |
