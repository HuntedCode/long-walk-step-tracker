# World Bible — The Long Walk to El Qabul

> Living document. Sections marked **[OPEN]** are intentionally undecided.
> This is the canonical narrative reference for the game. For technical
> conventions and project structure, see [CLAUDE.md](../CLAUDE.md).

---

## 1. Identity

### 1.1 Title

**The Long Walk to El Qabul**

*El Qabul* (القبول) is Arabic for "acceptance." The title is both literal — the
player walks — and thematic — the journey is toward acceptance. Players who never
look up the meaning still have an evocative, distinctive title. Players who do
discover the game just told them what it's really about.

### 1.2 Logline

A post-cataclysm pilgrimage where real-world steps fuel RPG progression, and the
act of walking becomes the act of rebuilding — both a broken world and a broken self.

### 1.3 Tone & Aesthetic

- **Genre blend**: Dark sci-fi + fantasy ruins. Not medieval (that's WalkScape's
  territory), not pure cyberpunk. Closest references: Horizon Zero Dawn's
  post-collapse beauty, Dark Souls' atmospheric weight, Death Stranding's
  connection-as-purpose.
- **Visual identity**: Cyan (#28EBFF) accent on dark gray (#191E24). This emerged
  naturally from early UI decisions and is the right aesthetic — lean into it.
- **Emotional register**: Contemplative, intimate, occasionally brutal, never
  manipulative. The game earns its emotional moments through accumulation, not
  manufactured drama.
- **Typography-first**: The story lives in text and voice, not in imagery. Large,
  satisfying numbers for progression. Geometric/procedural visuals for the world.
  Art can be upgraded later without rewriting anything.

### 1.4 Dual-Layer Design

The game operates on two independent layers:

| Layer | What it is | Who it's for |
|-------|-----------|--------------|
| **The Skeleton** | Skills (22 jobs), gear, levels, items, step-driven progression | Every player — the "number go up" experience |
| **The Soul** | Biomes, NPCs, companion narration, emotional themes, connection quests | Players who choose to engage — optional but rewarding |

Neither layer is lesser. The game does not punish disengagement with the narrative.
A player who ignores every story beat still has a full RuneScape-style progression
game. A player who pays attention discovers something deeper.

---

## 2. The World

### 2.1 Before the Collapse

The world was connected, advanced, prosperous — and hollow. The rot was gradual:
a slow falling away from God, rampant individualism, the hubris of believing
self-sufficiency was the highest virtue. Communities that once depended on each
other turned inward. Technology advanced while the fabric between people frayed.

Different NPCs remember the old world differently:
- Some with nostalgia for its comfort
- Some with anger at its blindness
- Some with relief that the pretense is over
- Some who barely remember it at all

The game never presents a single authoritative account of what the world was.

### 2.2 The Cataclysm

The gradual decay was finished off by one sudden, catastrophic event. The world
didn't end slowly — it ended all at once, after decades of slowly dying.

**Ambiguity here is intentional and non-negotiable.** The game never gives a
definitive account of what happened. Different NPCs offer different explanations:

- Natural disaster beyond any scale previously seen
- Divine judgment for humanity's arrogance
- A war that spiraled beyond control
- An accident — the systems holding everything together simply failed
- A curse, a punishment, a mercy

The player is never given a "true" version. The ambiguity mirrors how real people
process collective trauma — everyone has their own story about what went wrong.

**[OPEN]**: Specific NPC accounts and theories to be written per biome.

### 2.3 The World Now

Communities have reformed in pockets. People live, things grow, settlements
function — but something essential is fractured. The connections between places
are broken. Travel is difficult. Trust is scarce.

The rebuilding is twofold:
- **Material**: Land, infrastructure, trade routes, shelter, tools. This is where
  jobs (mining, woodcutting, cooking) find their narrative purpose — you're not
  grinding for XP, you're rebuilding a world.
- **Spiritual**: Trust, community, meaning, faith, the fabric of shared life.
  This is where the connection quests and NPC stories live. You can't mine your
  way to wholeness.

The world is not a wasteland. It is broken but alive, grieving but rebuilding.
The tone is melancholic, not nihilistic.

**[OPEN]**: How much time has passed since the collapse.

### 2.4 Geography & Scale

The world is organized in concentric biome clusters:

```
                ┌─────────────┐
           ┌────┤  Zone  Zone  ├────┐
      Zone │    │    Zone      │    │ Zone
           │    │  ┌────────┐  │    │
      Zone │    │  │ CENTRAL│  │    │ Zone
           │    │  │  CITY  │  │    │
           │    │  └────────┘  │    │
      Zone │    │    Zone      │    │ Zone
           └────┤  Zone  Zone  ├────┘
                └─────────────┘
```

- **Central city**: Arabic-named, where the biome's emotional theme concentrates.
  Story-dense, NPC-rich, connection questline lives here.
- **Surrounding zones**: Lighter in tone. Good for grinding, resource gathering,
  exploration. They subtly support the theme without being heavy-handed.
- **Estimated scale**: 6–10 major biomes, each with 4–8 surrounding zones.
  30–80+ zones total. Built incrementally — not all needed at launch.
- **Discovery**: The map is not revealed all at once. New biomes must be walked
  to before they can be traveled to.

---

## 3. Themes

### 3.1 Core Thematic Statement

The game explores the full range of human emotion and experience — depression,
pain, loneliness, joy, pride, Godliness, and everything between. It shows that
struggle manifests in different ways, that even the best of times carry hardship,
and that the depths of human experience hold unexpected good.

The goal is **acceptance and wisdom through experience**, not manufactured catharsis.

**Rules for thematic content:**
- Subtlety is paramount. Themes are embedded in world detail, NPC behavior, zone
  atmosphere, and quest structure. They are never stated outright.
- Space for the player to draw their own conclusions is sacred. The game presents;
  it does not prescribe.
- No biome concludes with "[emotion] is bad" or "[emotion] is good." Each biome
  concludes with the connection being made, and the player walks on carrying
  whatever they took from it.

### 3.2 Theme-Per-Biome Structure

Each central city embodies one facet of the human experience. Its Arabic name
reflects the theme — players are never told the meaning in-game.

- If a player looks up the translation, it clicks.
- If they don't, the zone still works on its own terms.
- The naming convention adds mysticism and cultural texture without being didactic.

The biome's NPCs, quests, environment, and activities all orbit the central theme
without announcing it. A zone near "Al Huzn" (sorrow) might feel quieter, emptier,
with fewer NPCs and longer distances between landmarks. The player might not
consciously register why it feels different, but it does.

### 3.3 Biome Roster

#### Decided

| Arabic Name | Meaning | Status |
|------------|---------|--------|
| Al Fakhr (الفخر) | Pride | First biome — fully designed (see Section 5) |
| El Qabul (القبول) | Acceptance | The destination — see Section 4.4 |

#### Potential Emotions to Explore

This is a working list, not a commitment. Biomes should be added based on what
feels authentic and explorable, not to fill a quota.

- Grief / Sorrow
- Hope
- Anger / Wrath
- Fear
- Love
- Shame
- Faith / Doubt
- Envy
- Gratitude
- Loneliness
- Joy

**[OPEN]**: Final biome roster, ordering, and which emotions pair or contrast
across the journey.

---

## 4. The Player's Journey

### 4.1 The Player Character

A blank slate with echoes.

- **Before**: The character existed before the collapse. They lost something — we
  never say what. A home, a person, a faith, a purpose — the player fills in the
  blank with their own experience.
- **Fragments**: The past surfaces occasionally. A half-memory triggered by a place.
  A reaction to an NPC's story that implies recognition. Never explicit, never
  resolved.
- **Role**: Not a hero. Not a chosen one. A walker, a connector, a witness. The
  player character does not speak in narration — the companion speaks. The character
  acts through gameplay choices.
- **Mirror**: The character becomes a surface the player projects onto. Someone
  grieving a relationship reads the fragments one way. Someone processing faith
  reads them another. The character accommodates both without prescribing either.

### 4.2 The Connection Mechanic

Inspired by Death Stranding. The player's purpose is to connect the broken world's
cities to each other — not to conquer, not to save, just to link.

**The loop:**
1. Walk to a new biome (discover surrounding zones along the way)
2. Reach the central city
3. Begin the connection questline (engage with the city's people and themes)
4. Complete the connection — fast travel to this city unlocked
5. Surrounding zones remain walkable content for grinding, side stories, resources
6. Walk to the next biome

**Travel rules:**
- Fast travel is available between connected central cities only
- Surrounding zones always require walking to visit
- New biomes must be walked to before they can be traveled to
- The walking *is* the point — shortcuts exist for convenience, not avoidance

The act of connecting — not conquering — is thematically perfect. The player is
rebuilding the network that the collapse destroyed. Every connection makes the
world a little more whole.

### 4.3 Progression Arc

| Phase | World State | Companion Tone | Theme |
|-------|-----------|----------------|-------|
| Early | Isolated, fragmented, sparse | Guarded, observational | Discovery and uncertainty |
| Mid | Connections multiply, the network grows | Warming, more personal | Complexity and contradiction |
| Late | Patterns emerge across biomes, El Qabul looms | Vulnerable, reflective | Integration and understanding |

### 4.4 El Qabul — The Destination

El Qabul is the end of the walk. Or it isn't. Nobody knows.

- NPCs speak of it in whispers and rumors
- Some claim to have been there. Some think it's a myth people tell themselves
  to keep putting one foot in front of the other
- Some believe it's a real city. Some think it's a state of mind, not a place
- The player's overarching goal is to investigate — to walk far enough and
  connect enough of the world to find out

The uncertainty is the game's most powerful narrative tool. If El Qabul definitively
exists and the player arrives, the game says: "acceptance is a destination you
reach." If it doesn't exist, the game says: "acceptance was the walking itself."
Both are true. The tension between them is where the meaning lives.

**[OPEN]**: Whether El Qabul actually exists as a reachable location or remains
an idea. This is the single biggest unresolved narrative question and should remain
open until the full biome roster is defined and the late-game arc is clear.

---

## 5. Biome Template: Al Fakhr (Pride)

> This is the first fully-designed biome. Its structure serves as the template
> for all future biome design.

### 5.1 Overview

- **Arabic name**: Al Fakhr (الفخر) — pronounced: al-FAKH-r
- **Meaning**: Pride
- **Visual character**: A region that was clearly great once. Impressive ruins,
  ambitious infrastructure half-rebuilt, grandeur that is both inspiring and sad.
- **Atmospheric keywords**: Ambition, defiance, fragility, craftsmanship,
  stubbornness, legacy

### 5.2 The Central City

Al Fakhr rebuilt itself faster than anywhere else. It looks impressive — tall
structures, organized streets, visible progress. But spend time there and the
cracks show.

**The duality of pride:**

| Light side | Shadow side |
|-----------|-------------|
| Craftspeople who take genuine pride in their work | Leaders who won't admit mistakes |
| A community that survived because it refused to give up | Rivalries that stall progress |
| Real accomplishments worth celebrating | People who'd rather fail alone than succeed together |
| Passion and ambition driving rebuilding | Measuring everything against the past |

The city works because it doesn't resolve this tension. Pride is not a villain.
Pride is complex. The player witnesses both sides and forms their own judgment.

### 5.3 Zones (18 zones, 6 clusters)

Al Fakhr specializes in **Mining, Construction, and Smithing** (deep, multi-tier
content). Secondary skills (Foraging, Woodcutting, Cooking, Fishing) have lighter
coverage. Activities span levels 1-25.

#### The City (central hub)
| Zone | Thematic role |
|------|--------------|
| **The Promenade** (central zone) | Main street, markets, gathering places. Ambitious grandeur. |
| The Forge Quarter | Industrial heart. Furnaces, smiths, relentless heat. |
| The High Archive | Library atop old ruins. Knowledge preserved and hoarded. |
| The Builder's Terrace | Scaffolding and cranes. Always building higher, always reaching. |

#### Quarry Highlands
| Zone | Thematic role |
|------|--------------|
| The Quarry Face | Open pit mine. Crews compete over output. Pride as fuel. |
| Amber Ridge (totalLevel 10) | High ground, wind-scoured, rich veins in the rock. |
| The Cutting Yard | Where raw stone becomes shaped blocks. Chisels never stop. |

#### The Greenwood
| Zone | Thematic role |
|------|--------------|
| The Lone Garden | Overgrown garden tended by one person who refuses help. Pride as isolation. |
| The Hidden Spring | Quiet pool in the garden depths. Few know it exists. |
| Ironwood Grove | Old-growth forest. Trees predate the collapse, wood hard as metal. |

#### The Ruins
| Zone | Thematic role |
|------|--------------|
| The Old Foundation | Where the original city stood. Memories are heavy here. |
| The Unfinished Reach | Half-built monument no one can agree on. Pride as downfall. |
| The Collapsed Gallery (totalLevel 12) | Buried chambers, machinery humming faintly. |

#### Outskirts
| Zone | Thematic role |
|------|--------------|
| Dustfall Edge | Border between known and unknown. Entry point from The Cairn. |
| Pilgrim's Rest | Waystation for travelers. Simple fires, shared stories. |

#### Story Zones (NPC-associated)
| Zone | Thematic role |
|------|--------------|
| Karam's Scaffold (totalLevel 15) | The Builder's personal tower. No one else may touch it. |
| The Rival's Camp | Competing settlement. Two visions, neither willing to bend. |
| The Newcomer's Workshop | Open-air workshop near the Greenwood. No one turned away. |

### 5.4 Connection Questline: "The Weight of Ambition"

The connection quest for Al Fakhr involves mediating between factions whose pride
prevents cooperation. All four NPCs (Karam, Safiya, Reza, Tariq) are involved.
The player does not defeat anyone. They witness enough stories to understand why
the pride exists, where it came from, what it protects, what it costs.

The questline concludes with the connection being made, Al Fakhr joined to the
network, its people able to reach (and be reached by) the wider world. The game
does not tell the player whether this is a triumph or a compromise. It's both.

**[OPEN]**: Specific quest steps, dialogue, and mechanical requirements. Depends
on the Phase 2 quest system.

### 5.5 NPCs

Four named NPCs, each representing one facet of pride. Each is assigned to a
story zone in `src/data/biomes.ts`.

| Name | Archetype | Zone | Facet of pride |
|------|-----------|------|---------------|
| **Karam** | The Builder | Karam's Scaffold | Rebuilt more of the city than anyone. Skilled, dedicated, incapable of rest or delegation. Pride as drive that becomes self-destruction. |
| **Safiya** | The Elder | The Old Foundation | Remembers the old world. Measures everything against what was lost. Her standards are grief in disguise. |
| **Reza** | The Newcomer | The Newcomer's Workshop | Arrived after the collapse. Builds without the weight of comparison, but is dismissed by those who were there. |
| **Tariq** | The Rival | The Rival's Camp | Runs a competing project to Karam. Two visions of what the city should become, neither willing to bend. |

**[OPEN]**: Full dialogue, character arcs, and how they interweave with the
connection questline. Depends on Phase 2 quest system.

---

## 6. The Companion Narrator

### 6.1 Who They Are

A character who walks with the player from the beginning. They are present in the
world — they experience events alongside the player, have their own emotional
responses, and carry their own unspoken history.

The companion is not a guide, not a mentor, not comic relief. They are a fellow
traveler. They chose to walk with the player for reasons that emerge slowly.

**[OPEN]**: Name, backstory, why they travel with the player, what they lost in
the collapse, their relationship to El Qabul.

### 6.2 Narrative Voice Rules

The companion is the narrator of the game's voiced story beats. Their voice
follows strict rules:

1. **Perspective**: First-person from the companion, third-person references to
   the player character ("they," "them" — never "you").
2. **What they narrate**: What happened. What they saw. How it felt to witness it.
   Their own reactions and reflections.
3. **What they never narrate**: The player character's thoughts, feelings, or
   motivations. The companion observes behavior and draws their own conclusions,
   but never claims to know what the player character is thinking.
4. **Style**: Closer to memoir than omniscient narration. Sentences that breathe.
   Pauses and silence are part of the voice.
5. **Evolution**: Early narration is guarded, formal, observational — the companion
   is still figuring out the player character (and themselves). Later narration
   becomes more vulnerable, more willing to admit uncertainty, more personal.

**Example passages:**

> *Early game:*
> "We reached Al Fakhr at dusk. They hadn't spoken in hours. I wanted to say
> something but the silence felt earned, so I let it be."

> *Mid game:*
> "I've been thinking about what the Elder said — that nothing we build will
> ever match what was lost. I used to believe that. Watching them work, I'm
> not sure anymore."

> *Late game:*
> "I don't know if El Qabul is real. I don't know if it matters. What I know
> is that I've walked further than I thought I could, and I'm not the same
> person who started. Neither are they. Maybe that's enough."

### 6.3 Voice Narration Design

The developer will provide voice-over narration for story beats. This is a
distinguishing feature — most games in this space are text-only.

**Format:**
- Short, self-contained pieces: 2–5 minutes each
- Contemplative, intimate tone — like someone telling a story by a fire
- Paced for audio delivery — sentences that work spoken aloud, not just on screen
- Unlockable and replayable — a narration library the player builds over time

**When narration triggers:**
- Entering a new biome for the first time
- Completing a connection questline
- Major story beats within a biome
- Companion reflections between biomes (walking narration)

**What stays text-based:**
- NPC dialogue
- Quest objectives and instructions
- Zone descriptions and UI text

Players can listen to narration while walking. The voice-over plays during active
pedometer sessions, turning story beats into something closer to a podcast
experience — which is exactly what people already consume while moving.

### 6.4 Companion Arc

| Phase | Behavior | Voice quality |
|-------|----------|--------------|
| Early | Reserved, observational, careful with opinions | Formal, measured, descriptive |
| Mid | More willing to share, begins referencing their own past | Warmer, more conversational, occasional humor |
| Late | Vulnerable, reflective, the relationship has deepened | Intimate, honest, comfortable with silence |

The companion's arc runs parallel to the world's healing. As the player connects
more of the world, the companion becomes more connected to the player — and to
themselves.

**[OPEN]**: Specific arc beats, the companion's personal connection to the
collapse, whether they have a destination of their own, their relationship to
El Qabul.

---

## 7. Narrative-to-Systems Bridge

> How world-building translates to the data-driven game architecture.
> For full technical details, see [CLAUDE.md](../CLAUDE.md).

### 7.1 Zone Data Mapping

Each narrative biome maps to a cluster of `ZoneDefinition` entries in
`src/data/zones.ts`.

| ZoneDefinition field | Narrative purpose |
|---------------------|-------------------|
| `id` | Machine identifier (e.g., `'al_fakhr'`, `'al_fakhr_quarry'`) |
| `name` | Display name — Arabic for central cities, evocative for surrounding zones |
| `description` | 1–2 sentence flavor text carrying the zone's atmospheric tone |
| `biome` | Biome cluster label (e.g., `'AL_FAKHR'`) — groups zones into narrative biomes |
| `color` | Accent color reinforcing the biome's emotional palette |
| `icon` | Ionicon name for the zone |
| `connections` | Physical geography — travel distances between zones |
| `unlockRequirement` | Progression gate (total level required to enter) |

The hub biome (The Cairn) serves as the starting settlement. Al Fakhr is
the first narrative biome with full zone, activity, and item content.

### 7.2 Activity & Item Flavor

Activities (`src/data/activities.ts`) are zone-specific and job-tied. When
narrative biomes are implemented:

- Activity `name` and `description` fields carry biome flavor. Mining in Al Fakhr
  might reference the city's ambitious construction. Woodcutting near Al Fakhr
  might reference building materials for a project that's too grand.
- Items (`src/data/items.ts`) can be biome-specific. "Al Fakhr Marble" instead of
  generic "Stone." Items carry the world's texture into the inventory screen.
- Jobs remain universal (Mining, Woodcutting, Fishing, etc.) but their expression
  varies per biome. The *what* is the same; the *why* is different.

### 7.3 Quest System (Phase 2)

Connection questlines require the quest system described in CLAUDE.md Phase 2.

The quest engine will need to support:
- Step goals (walk X steps within a zone)
- Zone-visit triggers (enter a zone for the first time)
- NPC interaction flags (speak to a character, witness a scene)
- Multi-stage questlines (sequential steps with branching optional paths)
- Connection completion (gates fast-travel unlock for the biome's central city)

Quest definitions will live in `src/data/quests.ts`. Each biome's connection
questline is a quest chain that unlocks fast travel upon completion.

### 7.4 Narrative Game Events

The current `GameEvent` type (`src/types/game.ts`) supports:
- `ACTIVITY_COMPLETED`
- `ARRIVED_AT_ZONE`
- `LEVEL_UP`
- `BANK_DEPOSIT`
- `BANK_WITHDRAWAL`

New narrative event types will be needed:
- `BIOME_ENTERED` — first visit to a biome cluster, triggers companion narration
- `CONNECTION_COMPLETED` — questline finished, unlocks fast travel, triggers narration
- `NARRATION_UNLOCKED` — a voice-over piece becomes available in the narration library

These events flow through `processGameTick` in `src/game/core/game-tick.ts`.

### 7.5 Voice Narration Pipeline

**[OPEN]**: Technical implementation of voice narration.

Considerations:
- Audio file format and storage (bundled assets vs. downloadable content)
- Narration trigger system (when to play, how to queue)
- Narration library UI (browse, replay, track unlocked pieces)
- Integration with pedometer sessions (audio plays while walking)
- File size management for mobile

---

## 8. Content Creation Guidelines

### 8.1 Writing Principles

1. **Show, never tell.** Embed themes in detail, behavior, and atmosphere.
   If you can name the emotion the scene is about, you've been too explicit.
2. **Respect the player's intelligence.** Never explain a theme. Never have an
   NPC say what the biome "means."
3. **Every NPC has their own perspective.** No NPC speaks as the author's
   mouthpiece. They have biases, blind spots, and incomplete information.
4. **Ambiguity is a feature.** When in doubt, leave space for interpretation.
   The player's reading is always valid.
5. **Three distinct voices.** The companion narrates (voiced). NPCs speak (text).
   The game world implies (environment, atmosphere, design). Never cross these.

### 8.2 Arabic Naming Conventions

- Central cities have Arabic names reflecting the emotion they represent
- Players are **never** told the meaning in-game — no tooltips, no glossary, no
  loading screen translations
- Surrounding zones are not constrained to Arabic — they can use any naming style
  that fits the biome's atmosphere
- All Arabic names must be linguistically accurate — verify with authoritative
  sources
- Include a pronunciation guide for each Arabic name in this document
- Arabic names should feel natural and evocative to English-speaking players,
  even without translation

### 8.3 Tone by Context

| Content type | Tone | Length |
|-------------|------|--------|
| Zone descriptions (data files) | Brief, evocative, functional | 1–2 sentences |
| NPC dialogue (text) | Conversational, character-specific, reveals personality through speech patterns | Varies — keep exchanges tight |
| Companion narration (voice scripts) | Literary, intimate, paced for audio delivery. Sentences that breathe. | 2–5 minutes when read aloud |
| Quest text | Clear objectives with flavor wrapping the clarity | Brief — players need to know what to do |

### 8.4 Content Checklist

Before any narrative content is considered complete:

- [ ] Does this content serve the biome's theme without stating it?
- [ ] Does this NPC have a perspective that differs from other NPCs in the biome?
- [ ] Does this zone description make the player want to explore?
- [ ] Is the companion narration script under 5 minutes when read aloud?
- [ ] Would this content still be interesting to a player who skips all dialogue?
- [ ] Does this avoid prescribing a moral or emotional conclusion?
- [ ] Is the Arabic name linguistically verified?

---

## 9. Combat and Danger

> The world is dangerous. Not because it wants to hurt you, but because the
> things that kept people safe are gone.

### 9.1 Combat Philosophy

Combat in The Long Walk is survival and protection, not heroic conquest. The player
fights because the world demands it: wildlife mutated by the cataclysm, residual
energy that coalesced into hostile forms, and desperate people who chose violence
over trust.

The player does not seek battle. They endure it, prepare for it, and when
overwhelmed, they retreat. The game never frames combat as glorious. Encounter
descriptions emphasize *what you're protecting* or *what you're clearing a path
through*, not the act of killing itself:

- "Defend the Trade Route" (protecting the connections you've built)
- "Clear the Collapsed Tunnel" (making paths safe for others)
- "Disrupt the Anomaly" (containing cataclysm remnants before they spread)
- "Hold the Watchtower" (guarding a settlement through the night)

**Retreat, not death.** When the player is overwhelmed, they pull back with 1 HP.
No dramatic death screen, no respawn timer. A survivor knows when to leave. This
is thematically consistent with the player character: a walker, a connector, not
a martyr.

### 9.2 Three Sources of Danger

#### Mutated Wildlife

The cataclysm rewrote the natural world. Animals adapted to a broken environment
in ways nobody predicted. They are bigger, stranger, and less afraid of people.
Ecosystems that once avoided human settlements now overlap with them.

The mutations are not uniform. Some creatures grew crystalline structures along
their bodies. Others developed sensitivity to cataclysm energy, flickering in and
out of perception near residual hotspots. None of them are "monsters" in the
traditional sense. They are animals responding to a world that changed faster than
evolution should allow.

**Seed creatures** (living roster, will expand per biome):

| Creature | Description | Tier |
|----------|-------------|------|
| Dust Wolf | Pack hunters adapted to ash wastes. Lean, fast, coordinated. Not individually dangerous, but they rarely travel alone. | Starting |
| Thornwing | Large birds with barbed feathers that shed like caltrops. Territorial around nesting grounds in ruins. | Starting |
| Razorback | Boar-like creature with crystalline growths along its spine. Aggressively territorial. The crystals hum faintly. | Early |
| Ridge Serpent | Constrictor adapted to rocky terrain. Ambush predator. Settlers call them "the patient ones." | Early-Mid |
| Ironhide Crawler | Insectoid, heavily armored, slow. Burrows through ruins and collapsed infrastructure. Settlers avoid their tunnels. | Mid |
| Flicker Stalker | Predator that phases in and out of visibility near cataclysm scars. Nobody agrees on what it actually looks like. | Mid |
| Ash Bear | Massive, heat-resistant. Dens in volcanic fissures and geothermal vents that opened during the cataclysm. | Mid-Late |
| Spire Raptor | Nests on the highest ruins. Dive-attacks anything that enters its territory. Feathers conduct static charge. | Late |
| Deepmaw | Lives in subterranean ruins. Eyeless, navigates by vibration. Settlers hear them before they see them. | Late |
| Colossus Beetle | The size of a cart. Chitin plates thick enough to deflect blades. Slow, but devastating when provoked. | Endgame |

#### Cataclysm Remnants

The cataclysm left scars in the world that never healed. In some places, the
energy that broke everything still pools, condenses, and moves. These are not
creatures in any biological sense. They are phenomena: patterns of force that
behave as if they have intent.

Different settlements have different names for them. Some call them ghosts. Some
call them echoes. Some call them the world's immune response, trying to purge
whatever is left. Diviners walk toward them. Everyone else walks away.

| Entity | Description | Tier |
|--------|-------------|------|
| Drift | Formless energy clusters that float near cataclysm scars. Erratic, harmless until disturbed. Then violent. | Starting-Early |
| Echo | Humanoid silhouettes that repeat actions from before the collapse. Walk the same path, mime the same gestures. Harmless until threatened, then they remember violence too. | Mid |
| Pulse Wraith | Concentrated energy that moves with purpose through ruins. Leaves a residue that makes skin tingle and metal corrode. | Mid |
| Fracture Golem | Chunks of terrain held together by cataclysm energy. Walls, floor, debris assembled into a roughly bipedal form. Slow. Each hit scatters pieces that reassemble. | Late |
| Rift Warden | Stationary entities that guard cataclysm epicenters. They do not chase. They do not leave. But anything that enters their space does not leave easily either. | Late |
| Cataclysm Shade | The rarest and most dangerous remnant. Appears only in the deepest ruins, where the cataclysm hit hardest. Some diviners believe they are fragments of whatever caused the collapse itself. | Endgame |

#### Human Threats

Not all survivors chose to rebuild. Some chose to take. The game does not frame
human enemies as evil. They are desperate, misguided, or broken in ways the player
might recognize. A scavenger stealing supplies is not a villain. They are someone
whose settlement failed.

The nuance matters: the Zealots who worship the cataclysm are not cartoonish
cultists. They are people who found meaning in destruction because the alternative
was meaninglessness. The game presents them as wrong, but understandably wrong.

| Threat | Description | Tier |
|--------|-------------|------|
| Scavenger | Solo operators who strip ruins and defend their claims. Not organized, not malicious. Just territorial. | Starting |
| Drifter | Nomads who travel between settlements, taking what they need. Some trade fairly. Some don't. | Early-Mid |
| Raider | Organized bands that control territory through force. Often former settlement members whose community collapsed a second time. | Mid |
| Zealot Acolyte | Followers of groups that venerate the cataclysm as divine judgment. They believe the world *should* have ended and resent those rebuilding it. | Mid-Late |
| Zealot Champion | Zealot leaders, trained and equipped. Their conviction makes them dangerous. They fight for meaning, not resources. | Late |
| Warlord | Rare figures who've consolidated enough power to rule through force. They build something that looks like a settlement but functions like a cage. | Endgame |

### 9.3 Dungeons and Raids

Each biome can have dedicated combat areas: side paths, ruins, and underground
complexes that branch off the main zone map. These are combat-focused challenges
with longer enemy sequences, higher difficulty, and unique rewards.

Dungeons are narratively tied to their biome's theme:

- **Al Fakhr**: "The Unfinished Tower." A construction project so ambitious it
  attracted cataclysm energy. The builders' pride created something they couldn't
  control. Now the half-built structure is full of Fracture Golems assembled from
  the building materials, and Echoes of the workers who refused to stop.
- **Future biomes**: Each dungeon concept should emerge from the biome's emotional
  theme, not from generic "there's a cave with monsters" design.

**[OPEN]**: Specific dungeon designs per biome. These depend on the biome roster
being finalized.

### 9.4 Combat and the Economy

Combat drops materials that cannot be obtained any other way. This creates a
closed loop where every skill category depends on every other:

- **Hides** (from mutated wildlife): Used by Tinkering and Smithing for armor
- **Bones and spines** (from kills): Fuel for Devotion, ingredients for Alchemy
- **Energy and residue** (from cataclysm remnants): Used by Runecraft and Alchemy
- **Salvage and tokens** (from human threats): Used by Tinkering, or traded

The player who only gathers will eventually need combat drops to craft better gear.
The player who only fights will run out of food and potions without gathering and
production. Every skill feeds every other skill. No path is self-sufficient.

---

## 10. Open Questions

A living inventory of unresolved design decisions. Items are removed when resolved
(with the resolution documented in the relevant section above) — not accumulated
indefinitely.

| Question | Notes |
|----------|-------|
| Full biome roster and emotion mapping | Working list in Section 3.3 — needs curation and ordering |
| Whether El Qabul exists as a reachable location | The biggest narrative question. Leave open until late-game arc is clear |
| Companion's name, backstory, and character arc | Core character — needs dedicated design work |
| How skill categories map to narrative themes | Combat, Gathering, Production, and Wayfaring should each resonate with biome emotions |
| NPC theories about the cataclysm | Per-biome writing task — different perspectives per region |
| Whether the game has a definitive ending | Tied to El Qabul's existence question |
| How much time has passed since the collapse | Affects NPC ages, memory of "before," reconstruction progress |
| The player character's specific loss | May be better left permanently undefined |
| Voice narration production pipeline | Recording, editing, format, integration — see Section 7.6 |
| Biome specialty balance across the full roster | Each biome needs 2-3 deep skills; the full set should cover all 22 skills |
| Biome ordering and emotional arc of the full journey | Which emotions come early vs. late matters thematically |
| Combat formula specifics | Accuracy, max hit, damage reduction equations. To be defined during Phase 3 implementation |
| Auto-eat threshold design | Fixed percentage (e.g., 50% HP) or tiered upgrade system (like Melvor Idle)? |
| Devotion skill mechanics | Prayer points, drain rate, buff selection UI, which items fuel it |
| Dungeon encounter design per biome | Each dungeon should emerge from the biome's emotional theme |
| Combat level and zone gating interaction | How combat stats interact with totalLevel for zone unlock requirements |
| Creature expansion per biome | Each new biome needs region-specific wildlife, remnants, and human threats |
