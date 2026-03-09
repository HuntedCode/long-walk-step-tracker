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
│ arrival         │          │    → Loot table rolls      │
└─────────────────┘          └──────┬──────────┬─────────┘
                                    │          │
                              XP rewards   Loot rewards
                                    │      (guaranteed + rolled)
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
`totalLevel` = sum of all job levels. Starts at 22 (22 jobs × level 1).
Computed via `useJobStore.getTotalLevel()`. Used for:
- Zone unlock gates (`totalLevel >= zone.unlockRequirement.totalLevel`)
- Step bank capacity (`1000 + totalLevel × 100`)

### Current jobs (`src/data/jobs.ts`)
22 skills organized into 4 categories — all max level 99:
- **Combat** (6): Might, Marksmanship, Resonance, Fortitude, Vitality, Devotion
- **Gathering** (5): Mining, Woodcutting, Fishing, Foraging, Salvaging
- **Production** (7): Cooking, Smithing, Alchemy, Tinkering, Runecraft, Construction, Firemaking
- **Wayfaring** (4): Wayfinding, Hunting, Divination, Connection

New jobs: add to `JOB_IDS` and `jobDefinitions` with a `category`. No engine changes needed.

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
| `itemRewards[]` | Legacy fallback items (used when no lootTable) |
| `xpRewards[]` | XP granted per completion |
| `requirements[]` | Job level gates (all must be met) |
| `lootTable?` | Probabilistic loot table (overrides itemRewards when present) |

### Loot tables (`src/game/loot/`)
Each activity can define a `LootTable` with two layers:
- **Guaranteed drops**: always awarded (e.g., 1 Normal Log per chop)
- **Roll table**: weighted random selection for bonus drops, with a `nothingWeight`
  for "no bonus" outcomes

The game tick rolls each completion independently using `SeededRNG`. Higher
job levels boost rare drop weights via `applyJobLevelBonus()` — a level 50
miner finds rare items more often than a level 5 miner.

Non-common drops emit a `RARE_DROP` event for UI celebration.

### Multi-completion (`src/game/jobs/job-engine.ts:processActivitySteps`)
Activities loop until `progress < stepsRequired`:
```
1000 steps on a 150-step activity = 6 completions + 100 steps carried over
```
Each completion rolls the loot table independently (6 completions = 6 chances
at rare drops). Results are aggregated by item ID.

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

Items keyed by ID with quantities. Stackable items accumulate without limit.

**Actions:**
- `addItems(rewards)` — increment quantities from loot/activity rewards
- `removeItems(itemId, quantity)` — consume items (returns false if insufficient)
- `getItemCount(itemId)` / `hasItems(itemId, quantity)` — query helpers

**Item definitions** (`src/data/items.ts`): Each item has `rarity`, `value`,
`stackable`, and `category`. Current items are placeholders — names and
descriptions will be refined as the world bible evolves.

**Item categories**: log, fish, ore, gem, herb, food, equipment, misc,
component, potion, rune, hide, bone, energy, building_material.

**Rarity tiers**: common, uncommon, rare, epic, legendary.

---

## Game Events (`src/stores/useEventStore.ts`)

Ephemeral notification queue — **not persisted**.

| Event type | Triggered by |
|-----------|-------------|
| `ACTIVITY_COMPLETED` | Activity completion in game tick |
| `ARRIVED_AT_ZONE` | Travel arrival in game tick |
| `LEVEL_UP` | Inline detection after XP award |
| `RARE_DROP` | Non-common item rolled from loot table |
| `BANK_DEPOSIT` | Idle steps banked |
| `BANK_WITHDRAWAL` | Banked steps consumed during activity |

`pushEvents()` filters out `BANK_DEPOSIT` and `BANK_WITHDRAWAL` (too noisy).
`GameEventToast` component displays the first event for ~3 seconds, then
calls `shiftEvent()` to show the next.

---

## Combat System (Phase 3)

> Design spec for the combat system. Not yet implemented. See `docs/world-bible.md`
> Section 9 for narrative context, enemy lore, and dungeon concepts.

### Core Design

Combat uses the existing step tick system. Each step tick = one combat turn.
The player selects a combat encounter (which contains one or more enemies),
and each tick resolves one round of combat. XP is earned every tick regardless
of outcome. Loot only drops when enemies are killed.

**Key principle: steps are never wasted.** In a walking game where steps cost
real physical effort, every tick must produce progression. Combat earns XP on
every turn, win or lose.

### The Combat Loop

```
1. Player selects encounter in current zone
2. Encounter contains ordered enemy list (e.g., 3x Dust Wolf, 1x Razorback)
3. Fight enemies one at a time, in order
4. Each step tick = one combat turn:
   a. Player attacks enemy → damage from weapon style + attack skill
   b. Enemy attacks player → damage reduced by Fortitude + armor
   c. Auto-eat: if HP < threshold, consume lowest-tier food
   d. Auto-potion: apply/re-apply buff potions as needed
   e. Award XP for relevant combat skills (always)
5. Enemy HP → 0: loot drops, next enemy begins
6. Player HP → 0: retreat with 1 HP, fight ends
   → No loot for this encounter
   → No XP loss, no gear loss, no penalty
   → Can immediately re-engage (enemy sequence resets)
7. All enemies cleared: encounter complete, can restart or pick another
```

### Encounter Scale

Single-enemy and multi-enemy encounters use the same system. The difference
is framing and payout:

| Type | Enemies | Loot Timing | Purpose |
|------|---------|-------------|---------|
| **Grinding** | 1 enemy | Drops on each kill, repeatable | Daily XP/loot farming |
| **Dungeon / Raid** | 3-10+ sequential | Drops only after FULL clear | High-risk, high-reward |

Retreating mid-dungeon resets the entire sequence. This makes dungeons a
genuine endurance test: enough food, enough potions, enough damage to clear
the whole chain.

### Combat Triangle

Weapon determines combat style. Equipping a weapon sets which attack skill
is used and trained:

| Weapon Type | Attack Skill | Strong Against | Weak Against |
|------------|-------------|---------------|-------------|
| Melee (swords, axes, maces) | Might | Light armor / ranged enemies | Magic barriers |
| Ranged (bows, crossbows, thrown) | Marksmanship | Magic users / casters | Heavy armor |
| Magic (staves, wands, resonance tools) | Resonance | Heavy armor / fortified | Ranged / mobile |

Enemies have a primary defense type. Matching weapon to weakness increases
accuracy and damage. Mismatching reduces effectiveness but does not prevent
fighting.

### The 6 Combat Skills

| Skill | Role | Determines |
|-------|------|-----------|
| **Might** | Melee offense | Melee accuracy and max hit |
| **Marksmanship** | Ranged offense | Ranged accuracy and max hit |
| **Resonance** | Magic offense | Magic accuracy and max hit |
| **Fortitude** | Defense | Damage reduction %. Applies to all incoming styles |
| **Vitality** | Health | Max HP pool and healing effectiveness of food/potions |
| **Devotion** | Passive buffs | Prayer-like bonuses (accuracy, DR, healing). Drains a resource |

**XP distribution per tick:**
- Active attack skill (Might/Marksmanship/Resonance) gets offensive XP
- Fortitude gets XP when you take damage
- Vitality gets XP when food/potions heal you
- Devotion gets XP when active devotion buffs are running

### Enemy Data Definition

Each enemy is a data entry (future `src/data/enemies.ts`):

| Field | Type | Purpose |
|-------|------|---------|
| `id` | string | Machine identifier (e.g., `'dust_wolf'`) |
| `name` | string | Display name |
| `description` | string | Flavor text |
| `combatLevel` | number | Aggregate difficulty indicator |
| `maxHp` | number | Hit points |
| `attackStyle` | `'melee' \| 'ranged' \| 'magic'` | How they attack |
| `maxHit` | number | Maximum damage per tick |
| `accuracy` | number | Hit chance rating |
| `defenseRating` | number | Defense against player attacks |
| `defenseType` | `'light' \| 'heavy' \| 'magic'` | Combat triangle weakness |
| `attackSpeed` | number | Ticks per attack (most = 1) |
| `lootTable` | LootTable | Reuses existing loot system |
| `xpReward` | XpReward[] | Bonus XP on kill (on top of per-tick XP) |

### Encounter Data Definition

Each encounter is a data entry (future `src/data/encounters.ts`):

| Field | Type | Purpose |
|-------|------|---------|
| `id` | string | Machine identifier |
| `name` | string | Narrative framing (e.g., "Defend the Trade Route") |
| `description` | string | Flavor text |
| `zoneId` | ZoneId | Which zone this encounter is in |
| `enemies` | `{ enemyId, count }[]` | Ordered list of enemies in sequence |
| `requirements` | LevelRequirement[] | Combat level gates |
| `stepsPerTick` | number | Steps per combat turn (like activity stepsRequired) |

### Equipment Slots

| Slot | Accepts |
|------|---------|
| Head | Helms, coifs, hoods |
| Body | Plate, leather, robes |
| Legs | Platelegs, chaps, robe bottoms |
| Feet | Boots |
| Hands | Gloves, vambraces |
| Main hand | Weapons |
| Off hand | Shields, secondary weapons, books |
| Ammo | Arrows, bolts, runes |

### Gear Tiers (Universal, RS-Style)

Gear is universal (not biome-specific). Each tier spans all three combat
styles (melee/ranged/magic).

| Tier | Material | Lvl Range | Key Ingredients |
|------|----------|-----------|----------------|
| 1 | **Scrap** | 1-10 | Copper Ore, Normal Logs |
| 2 | **Iron** | 10-20 | Iron Ore, Normal Logs |
| 3 | **Tempered** | 20-30 | Iron Ore, Oak Logs, Dust Wolf Hide |
| 4 | **Steel** | 30-40 | Steel Alloy (iron + coal), Oak Logs |
| 5 | **Plated** | 40-50 | Silver Ore, Ironhide Chitin |
| 6 | **Resonant** | 50-60 | Drift Cores, Fracture Shards, Steel |
| 7 | **Runic** | 60-70 | Fractured Runestones, Resonant components |
| 8 | **Ashen** | 70-80 | Ashen Heartwood, rare ores, Echo Fragments |
| 9 | **Masterwork** | 80-90 | Multi-biome rare materials |
| 10 | **Relic** | 90-99 | Boss drops, legendary fragments |

**Production skill mapping:**
- **Smithing**: Melee weapons + heavy (plate) armor
- **Tinkering**: Ranged weapons + leather armor (uses hides from combat)
- **Runecraft**: Magic weapons + robes + rune ammo

### Consumables

**Food (Cooking):** Heals HP. Auto-consumed when HP drops below threshold.
Lowest-tier food consumed first.

| Tier | Food | Cooking Lvl | Source |
|------|------|-------------|--------|
| 1 | Cooked Shrimp | 1 | Raw Shrimp (Fishing) |
| 2 | Cooked Trout | 15 | Raw Trout (Fishing) |
| 3 | Grilled Venison | 25 | Raw Venison (Hunting) |
| 4 | Herb-Crusted Fish | 40 | Raw Salmon + Wild Herbs |
| 5 | Trail Rations | 55 | Multiple ingredients |
| 6 | Spiced Stew | 70 | Multiple ingredients |
| 7 | Feast Portion | 85 | Rare ingredients |

**Potions (Alchemy):** Temporary stat boosts. Auto-applied at fight start.

| Potion | Effect | Alchemy Lvl | Key Ingredient |
|--------|--------|-------------|----------------|
| Strength Tonic | +Might damage | 5 | Wild Herbs |
| Accuracy Serum | +Hit chance | 15 | Barbed Feather + Herbs |
| Fortification Brew | +Damage reduction | 25 | Crystalline Spine + Herbs |
| Resonance Draught | +Magic damage | 35 | Drift Core + Herbs |
| Vitality Elixir | +Max HP | 50 | Rare herbs + energy |
| Composite Tonic | +Multiple stats | 70 | Multiple rare ingredients |

**Devotion items:** Bones, energy fragments. Fuel passive buffs. Consumed
over time while buffs are active.

> Food, potion, and enemy lists are initial rosters. They will expand as
> biomes and content grow.

### Combat-Only Drops

Materials that drop exclusively from combat, feeding back into production:

| Drop | Source | Category | Used By |
|------|--------|----------|---------|
| Dust Wolf Hide | Dust Wolves | hide | Tinkering (leather armor) |
| Crystalline Spine | Razorbacks | bone | Smithing, Alchemy |
| Barbed Feather | Thornwings | component | Tinkering (ammo), Alchemy |
| Serpent Scale | Ridge Serpents | hide | Smithing (scale armor) |
| Ironhide Chitin | Ironhide Crawlers | hide | Smithing (heavy plates) |
| Flicker Essence | Flicker Stalkers | energy | Runecraft, Devotion |
| Ashen Pelt | Ash Bears | hide | Tinkering (mid-tier leather) |
| Drift Core | Drifts | energy | Runecraft, Alchemy |
| Echo Fragment | Echoes | misc | Divination, Runecraft |
| Fracture Shard | Fracture Golems | rune | Runecraft (high-tier) |
| Wraith Residue | Pulse Wraiths | energy | Alchemy (potions) |
| Warden Sigil | Rift Wardens | rune | Runecraft (endgame) |
| Shade Essence | Cataclysm Shades | energy | Relic-tier crafting |

### Economy Loop

```
Gathering ──→ Production ──→ Combat ──→ Zone Access ──→ Better Gathering
   │              │             │
   │              │             └── Drops unique materials ──┐
   │              │                 (hides, bones, energy)   │
   │              └── Food, potions, gear ←──────────────────┘
   │
   └── Raw materials for production
```

| Skill Pair | Produces | For |
|-----------|---------|-----|
| Mining + Smithing | Melee weapons, heavy armor | Might-focused combat |
| Woodcutting + Tinkering | Ranged weapons, leather armor | Marksmanship combat |
| Foraging + Alchemy | Potions (combat buffs) | All combat styles |
| Fishing + Cooking | Food (HP healing) | All combat styles |
| Salvaging + Tinkering | Mechanical components | Ranged gear, gadgets |
| Runecraft | Magic weapons, robes, runes | Resonance combat |
| Firemaking | Utility (campfire healing, light) | **[OPEN]** |
| Construction | Fortifications | **[OPEN]** |

### Zone Gating via Combat

Combat levels gate access to:
1. **Dangerous zones** within biomes (higher-tier resources for all skills)
2. **Dungeons / raids** (combat-focused side paths with unique loot)
3. **Biome transitions** (some require minimum combat stats alongside totalLevel)

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
| New enemy | `src/data/enemies.ts` (Phase 3) | Add to enemy definitions with stats and loot table |
| New encounter | `src/data/encounters.ts` (Phase 3) | Add encounter referencing enemy IDs and zone ID |

Activities auto-appear in the UI when the player is in the matching zone and
meets the requirements. Items auto-appear in inventory when earned.

---

## Key Files

| File | Role |
|------|------|
| `src/game/jobs/job-formulas.ts` | XP curve, level calculation, progress fraction |
| `src/game/jobs/job-engine.ts` | Activity processing, XP application, level-up detection |
| `src/game/jobs/job-types.ts` | All type definitions (Job, Activity, Item, rewards, requirements) |
| `src/game/loot/loot-types.ts` | Loot table, loot entry, rarity type definitions |
| `src/game/loot/loot-engine.ts` | Loot rolling, job level bonus, reward aggregation |
| `src/game/core/rng.ts` | Seeded PRNG (mulberry32) for deterministic loot rolls |
| `src/game/zones/zone-engine.ts` | Travel processing, zone unlock checking |
| `src/game/zones/zone-types.ts` | Zone and travel type definitions |
| `src/data/jobs.ts` | Job content definitions |
| `src/data/zones.ts` | Zone content definitions |
| `src/data/activities.ts` | Activity content definitions (with loot tables) |
| `src/data/items.ts` | Item content definitions (with rarity, value, stackable) |
| `src/stores/useJobStore.ts` | Job XP/level state, totalLevel |
| `src/stores/useInventoryStore.ts` | Item quantities, add/remove/query |
| `src/stores/useEventStore.ts` | Ephemeral event queue |
| `src/game/combat/` (Phase 3) | Combat engine: turn resolution, damage calc, auto-eat |
| `src/data/enemies.ts` (Phase 3) | Enemy definitions (bestiary) |
| `src/data/encounters.ts` (Phase 3) | Encounter definitions (enemies + zones) |
