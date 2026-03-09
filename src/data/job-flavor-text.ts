import { JOB_IDS } from './jobs';

/**
 * Alternate flavor text for skills, intended for different contexts.
 *
 * - companion: Quiet & observational, the companion narrator's voice.
 *   Use for companion narration triggers (first training, milestones).
 * - survivor: Practical & wry, a survivor's dry humor.
 *   Use for loading screens, tooltips, or unlockable field notes.
 */

type JobId = (typeof JOB_IDS)[keyof typeof JOB_IDS];

interface FlavorEntry {
  companion: string;
  survivor: string;
}

export const jobFlavorText: Record<JobId, FlavorEntry> = {
  // ── Combat ──────────────────────────────────────────────
  [JOB_IDS.MIGHT]: {
    companion: 'There\'s a weight behind every swing. Yours is getting heavier.',
    survivor: 'Diplomacy is wonderful. For everything else, there\'s a sharp bit of metal.',
  },
  [JOB_IDS.MARKSMANSHIP]: {
    companion: 'Breathe out. Let the distance do the thinking.',
    survivor: 'Miss twice, you\'ve wasted an afternoon\'s work. Miss three times, you\'ve wasted your life.',
  },
  [JOB_IDS.RESONANCE]: {
    companion: 'You felt it too, that hum beneath the rubble. It\'s been there since the collapse.',
    survivor: 'It\'s not magic. Well, it might be magic. Nobody\'s written a paper on it.',
  },
  [JOB_IDS.FORTITUDE]: {
    companion: 'The ones who lasted didn\'t run. They just... didn\'t stop standing.',
    survivor: 'Getting hit is inevitable. Getting up is a skill.',
  },
  [JOB_IDS.VITALITY]: {
    companion: 'Strange how you don\'t notice your heartbeat until you almost lose it.',
    survivor: 'Hard to enjoy your loot if you\'re dead. Priorities.',
  },
  [JOB_IDS.DEVOTION]: {
    companion: 'Someone is listening. Whether it matters is a different question.',
    survivor: 'Pray if it helps. It helps more often than it should.',
  },

  // ── Gathering ───────────────────────────────────────────
  [JOB_IDS.MINING]: {
    companion: 'There\'s something honest about stone. It doesn\'t pretend to be anything else.',
    survivor: 'Rock doesn\'t argue back. That alone makes it better company than most.',
  },
  [JOB_IDS.WOODCUTTING]: {
    companion: 'The trees grew back faster than anything. Nobody talks about why.',
    survivor: 'The trees don\'t care about your problems. Very therapeutic.',
  },
  [JOB_IDS.FISHING]: {
    companion: 'Patience isn\'t waiting. It\'s listening to what the river has to say.',
    survivor: 'The fish don\'t know the world ended. Lucky them.',
  },
  [JOB_IDS.FORAGING]: {
    companion: 'You start to notice things. The color of a stem, the bend of a leaf. The land is trying to tell you something.',
    survivor: 'Half of what grows out here will feed you. The other half will make that a short meal.',
  },
  [JOB_IDS.SALVAGING]: {
    companion: 'Every ruin was someone\'s life. Take what you need. Leave the rest its dignity.',
    survivor: 'One civilization\'s collapse is another\'s hardware store.',
  },

  // ── Production ──────────────────────────────────────────
  [JOB_IDS.COOKING]: {
    companion: 'Amazing what a warm meal does. People start talking. Remembering.',
    survivor: 'Anyone can eat raw shrimp. Once.',
  },
  [JOB_IDS.SMITHING]: {
    companion: 'The forge doesn\'t care what the metal was before. Neither should you.',
    survivor: 'Hit metal until it becomes useful. Honestly, it\'s the most straightforward thing in this world.',
  },
  [JOB_IDS.ALCHEMY]: {
    companion: 'The old recipes still work. You just have to stop asking why.',
    survivor: 'Chemistry with worse equipment and higher stakes.',
  },
  [JOB_IDS.TINKERING]: {
    companion: 'Nothing\'s broken if you know what it can become instead.',
    survivor: 'If it looks stupid but it works, it\'s not stupid. It\'s tinkering.',
  },
  [JOB_IDS.RUNECRAFT]: {
    companion: 'The marks were already there, etched into the cracks. You\'re just learning to read them.',
    survivor: 'Carving symbols into rocks and hoping for the best. Surprisingly effective.',
  },
  [JOB_IDS.CONSTRUCTION]: {
    companion: 'Four walls and a roof. You\'d be surprised how much courage that gives people.',
    survivor: 'Shelter first. Existential crises second.',
  },
  [JOB_IDS.FIREMAKING]: {
    companion: 'A fire means someone\'s still here. Still trying.',
    survivor: 'Step one of every survival guide ever written. There\'s a reason.',
  },

  // ── Wayfaring ───────────────────────────────────────────
  [JOB_IDS.WAYFINDING]: {
    companion: 'The roads are gone, but the land remembers where they were.',
    survivor: 'Left or right? Wrong question. The real question is: which way has fewer teeth?',
  },
  [JOB_IDS.HUNTING]: {
    companion: 'Everything out here is watching you the same way you\'re watching it.',
    survivor: 'You\'re either the predator or the protein. Pick one.',
  },
  [JOB_IDS.DIVINATION]: {
    companion: 'The cracks in the world aren\'t empty. Something moves behind them.',
    survivor: 'Stare into the void long enough and it starts leaving useful hints.',
  },
  [JOB_IDS.CONNECTION]: {
    companion: 'Trust is built in small gestures. A name remembered. A door left open.',
    survivor: 'People are difficult. Also necessary. Figure it out.',
  },
};
