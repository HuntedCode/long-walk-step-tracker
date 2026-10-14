# LongWalk — Project CLAUDE.md

> This file contains project-specific standards. See `~/.claude/CLAUDE.md` for universal collaboration, workflow, and quality standards that apply across all projects.

## Project Overview

**LongWalk** (working title: "The Long Walk To X") is a step-counting RPG mobile app
that gamifies daily walking with RuneScape-inspired mechanics. Steps fuel RPG
progression: leveling stats, training jobs, completing quests, and engaging in combat.

- **Target platforms**: Android and iOS (personal use first, eventual release)
- **Art direction**: Text/UI-heavy with procedural/geometric visuals. The visual layer
  is swappable: art can be upgraded later without rewriting game logic.
- **Development philosophy**: Lean from day one. DRY code, modular game systems,
  data-driven content, regular code audits, feature branches, conventional commits.

### Development Phases

1. **MVP**: Skill system (22 jobs): steps fuel job XP, activities produce items
2. **Phase 2**: Quest system: step goals unlock quests and story progression
3. **Phase 3**: Combat and loot system: steps generate encounters and rewards

---

## Game Design: Skills (Jobs)

### 22 Skills organized into 4 categories

| Category | Skills |
| -------- | ------ |
| Combat (6) | Might, Marksmanship, Resonance, Fortitude, Vitality, Devotion |
| Gathering (5) | Mining, Woodcutting, Fishing, Foraging, Salvaging |
| Production (7) | Cooking, Smithing, Alchemy, Tinkering, Runecraft, Construction, Firemaking |
| Wayfaring (4) | Wayfinding, Hunting, Divination, Connection |

Steps fuel job activities. Activities grant XP for their parent job.
New jobs can be added by editing `src/data/jobs.ts`, no engine changes required.

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
LongWalk/
├── app/                          # Expo Router, file-based routing
│   ├── _layout.tsx               # Root layout (providers, global setup)
│   ├── index.tsx                 # Entry redirect or splash
│   ├── (tabs)/                   # Tab navigator group
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── dashboard.tsx         # Main screen: steps, XP, quick stats
│   │   ├── skills.tsx            # Skills view (22 jobs grouped by category)
│   │   ├── journal.tsx           # Activity log / quest log (Phase 2)
│   │   └── profile.tsx           # Player profile and settings
│   └── (modals)/                 # Modal screens
│       ├── _layout.tsx
│       ├── skill-detail.tsx      # Individual skill deep-dive
│       ├── level-up.tsx          # Level-up celebration
│       └── settings.tsx          # App settings
│
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Generic primitives (ProgressBar, Button, etc.)
│   │   ├── jobs/                 # Job/skill-specific components
│   │   ├── steps/                # Step tracking components
│   │   └── layout/               # Layout wrappers
│   │
│   ├── game/                     # CORE GAME ENGINE, pure TS, no React
│   │   ├── jobs/                 # Job/skill system engine
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
│   │   ├── jobs.ts               # Job/skill definitions (22 skills)
│   │   ├── milestones.ts         # Step milestone definitions
│   │   ├── quests.ts             # Quest definitions (Phase 2)
│   │   └── items.ts              # Item definitions (Phase 3)
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── usePlayerStore.ts     # Player identity, lifetime stats
│   │   ├── useStepStore.ts       # Step sessions, daily counts, history
│   │   ├── useJobStore.ts        # Job progress
│   │   └── storage.ts            # Persistence adapter
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePedometer.ts       # expo-sensors Pedometer wrapper
│   │   ├── useGameTick.ts        # Steps -> game events bridge
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
- No `any` types: use `unknown` and type narrowing
- Prefer `interface` for object shapes, `type` for unions and computed types
- Export types explicitly: `export interface Stat { ... }`
- Use `as const` for static data to get literal types

### Naming

| Thing                  | Convention           | Example                    |
| ---------------------- | -------------------- | -------------------------- |
| Component files        | PascalCase.tsx       | `StatCard.tsx`             |
| Non-component files    | kebab-case.ts        | `job-engine.ts`            |
| Interfaces/Types       | PascalCase           | `JobDefinition`            |
| Zustand stores         | camelCase with `use` | `useJobStore`              |
| Hooks                  | camelCase with `use` | `usePedometer`             |
| Constants              | SCREAMING_SNAKE_CASE | `MAX_STAT_LEVEL`           |
| Functions              | camelCase            | `calculateXpForLevel`      |
| React components       | PascalCase           | `SkillCard`                |
| Game data arrays       | camelCase plural     | `jobDefinitions`           |

### Component Patterns

- Functional components only (no class components)
- Named exports for all components except route screens
- Route screens use default exports (Expo Router requirement)
- Props interface named `{ComponentName}Props`, defined above the component
- Route screens in `app/` are thin: they compose components, not logic

```typescript
interface SkillCardProps {
  job: JobDefinition;
  state: JobState;
  isActive: boolean;
}

export function SkillCard({ job, state, isActive }: SkillCardProps) {
  // ...
}
```

### Game Logic Rules

- `src/game/` is React-free: no imports from `react` or `react-native`
- All game formulas in dedicated files, not scattered across components
- Data-driven content: new jobs/quests added by editing `src/data/` files
- Engine functions are pure: same inputs = same outputs, no side effects

---

## State Management

### Zustand Store Design

Each game system gets its own store. Stores are independent but can read from each
other via `getState()`.

```
usePlayerStore    — Player identity, total lifetime stats
useStepStore      — Pedometer session, daily step counts, history
useJobStore       — Job/skill progress and levels (22 skills)
useQuestStore     — Quest status (Phase 2)
useInventoryStore — Items, equipment (Phase 3)
```

### Persistence

All stores use Zustand's `persist` middleware with AsyncStorage:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      jobs: createInitialJobs(),
      addXp: (rewards) => {
        // Apply XP rewards from activity completions
      },
    }),
    {
      name: 'longwalk-jobs',
      storage: zustandStorage,
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
    → Zustand Stores (useJobStore, useInventoryStore, etc.)
    → React Components (re-render via selectors)
```

---

## Git Commit Scopes

Scopes for this project: `jobs`, `steps`, `quests`, `combat`, `ui`, `nav`, `store`, `config`

---

## Documentation

The `docs/` folder contains system documentation that must stay current.

| Document | Scope |
|----------|-------|
| `docs/world-bible.md` | Narrative design, world-building, themes, biome structure |
| `docs/step-pipeline.md` | Step flow from sensor to game state (pedometer, game tick, bank) |
| `docs/game-systems.md` | Jobs, activities, zones, travel, inventory, events, how they interconnect |
| `docs/store-architecture.md` | Zustand stores, persistence, cross-store patterns |
| `docs/step-stats-and-goals.md` | Streaks, daily goals, step statistics |

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

- New job/skill: add entry to `src/data/jobs.ts` with category. Done.
- New quest (Phase 2): add entry to `src/data/quests.ts`. The quest engine
  automatically evaluates conditions on each game tick.

---

## Art / Asset Pipeline

### MVP: Procedural and Text-Based

- Icons: geometric shapes via `react-native-svg` or Unicode placeholders
- Progress: animated rings, bars, number counters via Reanimated
- Color system: each stat/job has a theme color for UI
- Typography-first: large, satisfying numbers for XP gains and level-ups
- Celebrations: simple geometric particle effects

### Architecture for Future Visual Upgrades

The visual layer is decoupled from game logic:
- Engine outputs events (`{ type: 'LEVEL_UP', stat: 'power', newLevel: 15 }`)
- Components render events: swap the component, change the visuals
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
- `__tests__/game/jobs/job-engine.test.ts`
- `__tests__/stores/useJobStore.test.ts`

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

- **Dashboard** (tab): Steps today, total XP, daily goal ring, top skills summary
- **Skills** (tab): 22 skills grouped by category, levels and progress bars
- **Journal** (tab): Daily step history, activity feed ("Gained 150 Mining XP")
- **Profile** (tab): Player name, lifetime steps, combined level, settings
- **Skill Detail** (modal): Full skill info, XP progress, history chart
- **Level Up** (modal): Celebration with animation and new level display

### Core Gameplay Loop

```
1. User opens app
2. Backfill historical steps (iOS) → distribute XP
3. Pedometer subscribes for real-time steps
4. Every N steps, game tick runs:
   a. Progress active activity, award job XP on completion
   b. Update job XP in store
   c. Check for level-ups → trigger celebration modal
5. Dashboard updates in real-time
6. On close: state persists via Zustand middleware
7. On reopen: restore state, repeat cycle
```
