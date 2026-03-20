# The Long Walk to El Qabul

A step-counting RPG that turns daily walking into meaningful progression. Walk to level skills, gather resources, explore zones, and progress through a post-cataclysm pilgrimage.

## What Is This?

Steps fuel everything. Open the app, walk, and watch your character grow. 22 skills across 4 categories (Combat, Gathering, Production, Wayfaring) gain XP as you complete activities powered by real steps. Zones unlock as you level up, each with their own resources, activities, and atmosphere.

Inspired by RuneScape's skill grind and idle RPG loops, built for people who want a reason to take the long way home.

## Current State

**MVP in active development.** Core systems working:
- Step tracking (foreground pedometer on Android and iOS)
- 22 skills with RuneScape-style XP curves
- Zone travel with step costs
- Activity system (steps complete activities, activities grant XP and items)
- Inventory with search, filtering, and rarity tiers
- Biome framework (The Cairn hub + Al Fakhr, the first narrative region)
- Persistent state via Zustand + AsyncStorage

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo (managed workflow) |
| Language | TypeScript (strict) |
| Routing | Expo Router |
| State | Zustand with persist middleware |
| Styling | NativeWind (Tailwind for RN) |
| Step Tracking | expo-android-pedometer (Android), expo-sensors (iOS) |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npx expo start

# Android development build (required for pedometer)
npx expo prebuild
npx expo run:android

# Release build
npx expo run:android --variant release
```

## Project Structure

```
app/              Route screens (Expo Router, file-based)
src/
  game/           Pure TypeScript game engine (no React)
  data/           Static content definitions (jobs, zones, items, biomes)
  stores/         Zustand stores for runtime state
  components/     React Native UI components
  hooks/          Custom hooks bridging stores to UI
  services/       External integrations (pedometer)
  utils/          Pure helper functions
  constants/      App-wide constants and theme
  types/          Shared TypeScript types
docs/             System documentation
```

Game logic lives in `src/game/` and is React-free. All content is data-driven: add a new skill by editing `src/data/jobs.ts`, a new zone in `src/data/zones.ts`, etc.

See [CLAUDE.md](CLAUDE.md) for full development conventions and architecture details.
