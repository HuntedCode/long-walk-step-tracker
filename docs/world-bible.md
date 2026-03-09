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

### 5.3 Surrounding Zones

4–8 zones around Al Fakhr. Each serves a gameplay function (grinding, resources,
exploration) while subtly connecting to the theme:

**Seed concepts** (not final names or designs):
- A quarry where builders compete over output — pride as fuel and motivation
- A garden tended by one person who refuses all help — pride as isolation
- Ruins of something far too ambitious that was never finished — pride as downfall
- A workshop where an artisan teaches their craft to anyone willing — pride as
  generosity and legacy

**[OPEN]**: Specific zone names, detailed descriptions, activities, items, and
connection data. These will be defined when this biome is implemented in
`src/data/zones.ts` and `src/data/activities.ts`.

### 5.4 Connection Questline

The connection quest for Al Fakhr involves mediating between factions whose pride
prevents cooperation. The player does not defeat anyone. They witness enough
stories to understand why the pride exists — where it came from, what it protects,
what it costs.

The questline concludes with the connection being made — Al Fakhr joined to the
network, its people able to reach (and be reached by) the wider world. The game
does not tell the player whether this is a triumph or a compromise. It's both.

**[OPEN]**: Specific quest steps, NPC names, dialogue, and mechanical
requirements. This depends on the Phase 2 quest system.

### 5.5 NPCs — Seed Concepts

These are archetypes, not finished characters. Each represents one facet of pride:

- **The Builder**: Rebuilt more of the city than anyone. Genuinely skilled,
  genuinely dedicated. But can't delegate, can't rest, can't admit when a design
  doesn't work. Pride as drive that becomes self-destruction.
- **The Elder**: Remembers the old world and measures everything against it.
  Nothing is ever good enough because nothing is what it was. Pride as grief
  disguised as standards.
- **The Newcomer**: Arrived after the collapse, has no memory of "before." Builds
  without the weight of comparison. Represents pride that isn't tethered to loss —
  but is dismissed by those who were there.
- **The Rival**: Runs a competing project to the Builder. Their conflict isn't
  personal — it's two visions of what the city should become, neither willing to
  bend. Pride as principle that becomes stubbornness.

**[OPEN]**: Full NPC designs, dialogue, character arcs, and how they interweave
with the connection questline.

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

The current placeholder zones (Homestead, Whispering Woods, Silver Brook,
Ironpeak Ridge) will be re-contextualized or replaced as narrative biomes are
implemented. Homestead may become the starting settlement where the player
begins their walk.

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

## 9. Open Questions

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
| How placeholder zones transition to narrative biomes | Homestead likely becomes starting settlement; others TBD |
| Biome ordering and emotional arc of the full journey | Which emotions come early vs. late matters thematically |
