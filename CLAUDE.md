# CLAUDE.md — LongWalk Project Guide

## Project Overview

**LongWalk** (working title: "The Long Walk To X") is a step-counting RPG mobile app
that gamifies daily walking with RuneScape-inspired mechanics. Steps fuel RPG
progression — leveling stats, training jobs, completing quests, and engaging in combat.

- **Target platforms**: Android and iOS (personal use first, eventual release)
- **Art direction**: Text/UI-heavy with procedural/geometric visuals. The visual layer
  is swappable — art can be upgraded later without rewriting game logic.
- **Development philosophy**: Lean from day one. DRY code, modular game systems,
  data-driven content, regular code audits, feature branches, conventional commits.

### Development Phases

1. **MVP**: PLATINUM stat system + Jobs — stats level from steps, jobs use stats
2. **Phase 2**: Quest system — step goals unlock quests and story progression
3. **Phase 3**: Combat & loot system — steps generate encounters and rewards

---

## Game Design: PLATINUM Stats + Jobs

### Core Stats (PLATINUM) — leveled directly by walking

| Letter | Stat         | Description                                    |
| ------ | ------------ | ---------------------------------------------- |
| P      | Power        | Raw physical strength                          |
| L      | Luck         | Chance-based bonuses, critical hits, rare drops |
| A      | Agility      | Speed, reflexes, movement efficiency           |
| T      | Toughness    | Durability, damage resistance, stamina         |
| I      | Intelligence | Knowledge, XP efficiency bonuses               |
| N      | Navigation   | Exploration bonuses, route discovery           |
| U      | Utility      | Crafting efficiency, tool use, versatility     |
| M      | Magic        | Supernatural abilities, enchantments           |

### Jobs — trainable activities that use core stats as modifiers

| Job         | Related Stats          | Description                       |
| ----------- | ---------------------- | --------------------------------- |
| Mining      | Power + Toughness      | Extract resources from the earth  |
| Woodcutting | Power + Agility        | Harvest timber and wood           |
| Cooking     | Intelligence + Utility | Prepare food and consumables      |

Steps level PLATINUM stats directly. Jobs use stat levels as requirements and modifiers.
New jobs can be added by editing data files — no engine changes required.

---

## Tech Stack

| Layer             | Technology                                |
| ----------------- | ----------------------------------------- |
| Framework         | React Native with Expo (managed workflow) |
| Language          | TypeScript (strict mode)                  |
| Routing           | Expo Router (file-based routing)          |
| State Management  | Zustand with persist middleware           |
| Local Persistence | AsyncStorage (MVP), MMKV later            |
| Step Tracking     | expo-sensors (Pedometer API)              |
| Styling           | NativeWind (Tailwind CSS for RN)          |
| Animations        | react-native-reanimated                   |
| Testing           | Jest + React Native Testing Library       |
| Linting           | ESLint + Prettier                         |

### Why These Choices

- **Zustand**: Minimal boilerplate, excellent TS support, built-in persist middleware,
  slice pattern for modular game systems. Selectors prevent unnecessary re-renders
  during frequent step updates.
- **AsyncStorage for MVP**: Works with Expo managed workflow and Zustand persist out
  of the box. Migrate to MMKV (30x faster) when prebuild is needed anyway.
- **Expo Router**: File-based routing reduces config. Built on React Navigation.
- **NativeWind**: Utility-first styling, concise component files, dark mode support.
- **react-native-reanimated**: 60fps UI-thread animations for level-ups, progress bars.

---

## Project Structure

```
LongWalkToSomewhere/
├── app/                          # Expo Router — file-based routing
│   ├── _layout.tsx               # Root layout (providers, global setup)
│   ├── index.tsx                 # Entry redirect or splash
│   ├── (tabs)/                   # Tab navigator group
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── dashboard.tsx         # Main screen — steps, XP, quick stats
│   │   ├── skills.tsx            # PLATINUM stats + Jobs view
│   │   ├── journal.tsx           # Activity log / quest log (Phase 2)
│   │   └── profile.tsx           # Player profile and settings
│   └── (modals)/                 # Modal screens
│       ├── _layout.tsx
│       ├── skill-detail.tsx      # Individual stat/job deep-dive
│       ├── level-up.tsx          # Level-up celebration
│       └── settings.tsx          # App settings
│
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Generic primitives (ProgressBar, Button, etc.)
│   │   ├── stats/                # PLATINUM stat components
│   │   ├── jobs/                 # Job-specific components
│   │   ├── steps/                # Step tracking components
│   │   └── layout/               # Layout wrappers
│   │
│   ├── game/                     # CORE GAME ENGINE — pure TS, no React
│   │   ├── stats/                # PLATINUM stat engine
│   │   │   ├── stat-engine.ts    # XP calculation, level-up logic
│   │   │   ├── stat-formulas.ts  # XP curves, level thresholds
│   │   │   └── stat-types.ts     # TypeScript interfaces
│   │   ├── jobs/                 # Job system engine
│   │   │   ├── job-engine.ts     # Job progression logic
│   │   │   └── job-types.ts      # Job interfaces
│   │   ├── quests/               # Quest engine (Phase 2)
│   │   ├── combat/               # Combat engine (Phase 3)
│   │   └── core/                 # Shared engine utilities
│   │       ├── game-tick.ts      # Step-to-game-event dispatcher
│   │       ├── rng.ts            # Seeded random number generator
│   │       └── formulas.ts       # Shared math formulas
│   │
│   ├── data/                     # Static game content (data-driven)
│   │   ├── stats.ts              # PLATINUM stat definitions
│   │   ├── jobs.ts               # Job definitions
│   │   ├── milestones.ts         # Step milestone definitions
│   │   ├── quests.ts             # Quest definitions (Phase 2)
│   │   └── items.ts              # Item definitions (Phase 3)
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── usePlayerStore.ts     # Player identity, lifetime stats
│   │   ├── useStatStore.ts       # PLATINUM stat levels and XP
│   │   ├── useStepStore.ts       # Step sessions, daily counts, history
│   │   ├── useJobStore.ts        # Job progress
│   │   └── storage.ts            # Persistence adapter
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePedometer.ts       # expo-sensors Pedometer wrapper
│   │   ├── useGameTick.ts        # Steps -> game events bridge
│   │   ├── useStatProgress.ts    # Derived stat data for UI
│   │   └── useStepGoal.ts        # Daily step goal logic
│   │
│   ├── services/                 # External integrations
│   │   └── pedometer.ts          # Raw Pedometer API wrapper
│   │
│   ├── utils/                    # Pure utility functions
│   │   ├── format.ts             # Number formatting
│   │   ├── time.ts               # Date/time helpers
│   │   └── math.ts               # Math utilities
│   │
│   ├── constants/                # App-wide constants
│   │   ├── theme.ts              # Colors, spacing, typography
│   │   ├── config.ts             # Tuning constants
│   │   └── steps.ts              # Step conversion rates
│   │
│   └── types/                    # Shared TypeScript types
│       ├── game.ts               # Core game types
│       ├── navigation.ts         # Route parameter types
│       └── store.ts              # Store types
│
├── assets/                       # Static assets (fonts, images, sounds)
├── __tests__/                    # Tests (mirrors src/ structure)
├── CLAUDE.md                     # This file
└── README.md
```

### Directory Responsibilities

| Directory          | Contains                                          | Does NOT Contain            |
| ------------------ | ------------------------------------------------- | --------------------------- |
| `app/`             | Route screens (thin wrappers composing components) | Business logic, complex UI  |
| `src/components/`  | React components (presentational + container)      | Game engine logic           |
| `src/game/`        | Pure TypeScript game logic (no React imports)      | UI code, React hooks        |
| `src/data/`        | Static game content definitions                    | Runtime logic, calculations |
| `src/stores/`      | Zustand stores for runtime state                   | Complex derived calculations|
| `src/hooks/`       | Custom React hooks bridging stores to UI           | Raw game formulas           |
| `src/services/`    | External API wrappers                              | Game logic, UI              |
| `src/utils/`       | Pure helper functions                              | Stateful logic              |
| `src/constants/`   | Immutable configuration values                     | Runtime data                |

---

## Coding Conventions

### TypeScript

- Strict mode enabled (`"strict": true`)
- No `any` types — use `unknown` and type narrowing
- Prefer `interface` for object shapes, `type` for unions and computed types
- Export types explicitly: `export interface Stat { ... }`
- Use `as const` for static data to get literal types

### Naming

| Thing                  | Convention           | Example                    |
| ---------------------- | -------------------- | -------------------------- |
| Component files        | PascalCase.tsx       | `StatCard.tsx`             |
| Non-component files    | kebab-case.ts        | `stat-engine.ts`           |
| Interfaces/Types       | PascalCase           | `StatDefinition`           |
| Zustand stores         | camelCase with `use` | `useStatStore`             |
| Hooks                  | camelCase with `use` | `usePedometer`             |
| Constants              | SCREAMING_SNAKE_CASE | `MAX_STAT_LEVEL`           |
| Functions              | camelCase            | `calculateXpForLevel`      |
| React components       | PascalCase           | `StatProgressRing`         |
| Game data arrays       | camelCase plural     | `statDefinitions`          |

### Component Patterns

- Functional components only (no class components)
- Named exports for all components except route screens
- Route screens use default exports (Expo Router requirement)
- Props interface named `{ComponentName}Props`, defined above the component
- Route screens in `app/` are thin — they compose components, not logic

```typescript
interface StatCardProps {
  statId: string;
  onPress: (statId: string) => void;
}

export function StatCard({ statId, onPress }: StatCardProps) {
  const stat = useStatStore((s) => s.stats[statId]);
  // ...
}
```

### Game Logic Rules

- `src/game/` is React-free: no imports from `react` or `react-native`
- All game formulas in dedicated files, not scattered across components
- Data-driven content: new stats/jobs/quests added by editing `src/data/` files
- Engine functions are pure: same inputs = same outputs, no side effects

---

## State Management

### Zustand Store Design

Each game system gets its own store. Stores are independent but can read from each
other via `getState()`.

```
usePlayerStore  — Player identity, total lifetime stats
useStepStore    — Pedometer session, daily step counts, history
useStatStore    — PLATINUM stat levels and XP
useJobStore     — Job progress and levels
useQuestStore   — Quest status (Phase 2)
useInventoryStore — Items, equipment (Phase 3)
```

### Persistence

All stores use Zustand's `persist` middleware with AsyncStorage:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStatStore = create<StatStoreState>()(
  persist(
    (set, get) => ({
      stats: {},
      addXp: (statId, amount) => {
        // Delegate to src/game/stats/stat-engine.ts
      },
    }),
    {
      name: 'longwalk-stats',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Data Flow

```
Device Pedometer
    → usePedometer hook (subscribes to step events)
    → useStepStore (accumulates raw step counts)
    → useGameTick hook (converts step deltas into game events)
    → Game Engine (src/game/) — pure functions process events
    → Zustand Stores (useStatStore, useJobStore, etc.)
    → React Components (re-render via selectors)
```

---

## Development Workflow & Code Auditing

### Code Audit Checklist (Every Feature Branch)

Before any feature branch is considered complete, verify:

1. **Bug & Logic Errors**: Review all new/modified functions for off-by-one errors,
   edge cases, null/undefined handling, and incorrect assumptions
2. **Inefficiencies**: Check for unnecessary re-renders, redundant computations,
   O(n^2) where O(n) is possible, and memory leaks in hooks/subscriptions
3. **Bad Practices**: No `any` types, magic numbers, hardcoded strings, or side
   effects in pure functions
4. **DRY Violations**: If similar code exists in 2+ places, extract to a shared
   utility, hook, or engine function
5. **Code Reuse**: Before writing new code, search the codebase for existing
   utilities and patterns that already solve the problem
6. **Scope Creep**: Branch contains only changes related to its feature. No
   "while I'm here" fixes — those get their own branches
7. **Utils/Code Duplication**: Audit `src/utils/`, `src/hooks/`, and `src/game/core/`
   for overlapping functions. One function, one purpose, one location
8. **Dead Code**: No unused imports, variables, functions, or files. No
   commented-out code in commits

### Lean Development Principles

- **YAGNI**: Don't build features, abstractions, or infrastructure "for later."
  Build what's needed now
- **Single Responsibility**: Every file, function, and component does one thing.
  If a function name has "and" in it, split it
- **Minimal Abstraction**: Three similar lines of code is fine. Only abstract when
  there are 3+ concrete use cases
- **No Speculative Generalization**: No preemptive config options, feature flags,
  or extension points until there's a real need
- **Prefer Deletion Over Deprecation**: Unused code gets deleted, not wrapped or
  re-exported

### Workflow Enforcement

- Every feature branch includes audit notes confirming the checklist was followed
- First step of any feature: search existing code for reusable pieces
- Audit issues get fixed in the same branch if directly related, or in a separate
  `fix/` or `refactor/` branch

---

## Git Workflow

### Branch Strategy

- `main` — stable, working code only
- `develop` — integration branch for features
- Feature branches: `feature/<system>/<description>`
- Bug fix branches: `fix/<description>`
- Refactor branches: `refactor/<description>`

### Branch Naming Examples

```
feature/stats/xp-calculation
feature/stats/level-up-screen
feature/steps/pedometer-integration
feature/jobs/mining-system
feature/ui/dashboard-layout
fix/step-count-reset-on-midnight
refactor/extract-shared-progress-bar
```

### Commit Messages (Conventional Commits)

```
<type>(<scope>): <short description>

Types: feat, fix, refactor, style, test, docs, chore
Scopes: stats, steps, jobs, quests, combat, ui, nav, store, config
```

Examples:
```
feat(stats): add XP calculation engine with RS-style exponential curve
feat(steps): integrate expo-sensors Pedometer subscription
fix(store): persist stat state across app restarts
refactor(ui): extract ProgressBar into reusable component
test(stats): add unit tests for level-up threshold calculation
chore(config): configure NativeWind and Tailwind theme
```

---

## Game Architecture

### XP and Leveling Formula

RuneScape-inspired exponential XP curve:

```typescript
// XP required for a given level (1-indexed)
// Level 1 = 0 XP, Level 2 = 83 XP, ..., Level 99 = 13,034,431 XP
export function xpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += Math.floor(i + 300 * Math.pow(2, i / 7));
  }
  return Math.floor(total / 4);
}
```

### Modular System Pattern

Every game system follows this structure:

```
types file     → TypeScript interfaces (StatDefinition, StatState, etc.)
engine file    → Pure functions (processSteps, applyEvent, checkLevelUp)
data file      → Static content definitions (src/data/)
store file     → Zustand runtime state (calls engine, persists results)
hook file      → React bridge (selects store data, computes derived values)
component file → Pure UI (renders hook data, dispatches store actions)
```

### Adding New Content

- New stat: add entry to `src/data/stats.ts`. Done.
- New job: add entry to `src/data/jobs.ts`. Done.
- New quest (Phase 2): add entry to `src/data/quests.ts`. The quest engine
  automatically evaluates conditions on each game tick.

---

## Art / Asset Pipeline

### MVP: Procedural & Text-Based

- Icons: geometric shapes via `react-native-svg` or Unicode placeholders
- Progress: animated rings, bars, number counters via Reanimated
- Color system: each stat/job has a theme color for UI
- Typography-first: large, satisfying numbers for XP gains and level-ups
- Celebrations: simple geometric particle effects

### Architecture for Future Visual Upgrades

The visual layer is decoupled from game logic:
- Engine outputs events (`{ type: 'LEVEL_UP', stat: 'power', newLevel: 15 }`)
- Components render events — swap the component, change the visuals
- Asset references use string keys (`icon: 'power'`), resolved by a mapper function
- Pixel art, AI-generated assets, or 3D models can be added later by updating
  the resolver. No game logic changes required.

---

## Testing

### Priority

| Priority | What                               | Tool                          |
| -------- | ---------------------------------- | ----------------------------- |
| High     | Game engine pure functions         | Jest unit tests               |
| High     | XP formulas and level calculations | Jest unit tests               |
| Medium   | Zustand stores (actions + state)   | Jest + store utilities        |
| Medium   | Custom hooks                       | React Native Testing Library  |
| Low      | Component rendering                | React Native Testing Library  |

### Test Location

Tests mirror `src/` structure in `__tests__/`:
- `__tests__/game/stats/stat-engine.test.ts`
- `__tests__/stores/useStatStore.test.ts`

---

## Development Commands

```bash
# Start dev server
npx expo start

# Platform-specific
npx expo start --android
npx expo start --ios

# Tests
npx jest
npx jest --watch
npx jest --coverage

# Type check
npx tsc --noEmit

# Lint
npx eslint . --ext .ts,.tsx
npx prettier --check .

# Install packages (always use expo install for compatibility)
npx expo install <package-name>

# Development build (needed for Pedometer on Android)
npx expo prebuild
npx expo run:android
npx expo run:ios

# Clear cache
npx expo start --clear
```

### Important Notes

- Always use `npx expo install` instead of `npm install` for Expo packages
- Pedometer requires a development build on Android (Expo SDK 52+). Use Expo Go
  on iOS or mock the pedometer on Android during early dev
- TypeScript path aliases: `@/` maps to project root (`./*`) in tsconfig.json.
  Use `@/src/game/...`, `@/src/stores/...` for game code, and `@/app/...`,
  `@/components/...` for Expo template files

---

## Pedometer Integration

### Limitations

- `expo-sensors` Pedometer does NOT track steps in the background
- Historical step retrieval (`getStepCountAsync`) works on iOS only (Core Motion)
- Android requires a development build (not Expo Go) as of SDK 52

### Strategy

1. On app open: call `Pedometer.getStepCountAsync()` (iOS) to backfill steps
2. Subscribe to `Pedometer.watchStepCount()` for real-time foreground updates
3. On each step batch: run game tick to distribute XP across stats
4. Store last-known step timestamp for correct delta calculation
5. Future: investigate Health Connect (Android) for background step recovery

---

## MVP Scope

### Screens

- **Dashboard** (tab): Steps today, total XP, daily goal ring, top stats summary
- **Skills** (tab): PLATINUM stat grid + job list, levels and progress bars
- **Journal** (tab): Daily step history, activity feed ("Gained 150 Power XP")
- **Profile** (tab): Player name, lifetime steps, combined level, settings
- **Stat Detail** (modal): Full stat info, XP progress, history chart
- **Level Up** (modal): Celebration with animation and new level display

### Core Gameplay Loop

```
1. User opens app
2. Backfill historical steps (iOS) → distribute XP
3. Pedometer subscribes for real-time steps
4. Every N steps, game tick runs:
   a. Convert steps to XP for each PLATINUM stat
   b. Update stat XP in store
   c. Check for level-ups → trigger celebration modal
5. Dashboard updates in real-time
6. On close: state persists via Zustand middleware
7. On reopen: restore state, repeat cycle
```
