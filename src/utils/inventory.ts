import type { ItemCategory, ItemDefinition } from '../game/jobs/job-types';
import type { ItemRarity } from '../game/loot/loot-types';

/** Display metadata for each item category, in presentation order. */
export const ITEM_CATEGORY_ORDER: {
  key: ItemCategory;
  label: string;
  /** Short label for filter chips. */
  shortLabel: string;
  icon: string;
}[] = [
  // Gathering materials (most commonly obtained early)
  { key: 'log', label: 'LOGS', shortLabel: 'Logs', icon: 'leaf-outline' },
  { key: 'ore', label: 'ORES', shortLabel: 'Ores', icon: 'diamond-outline' },
  { key: 'fish', label: 'FISH', shortLabel: 'Fish', icon: 'fish-outline' },
  { key: 'herb', label: 'HERBS', shortLabel: 'Herbs', icon: 'flower-outline' },
  { key: 'gem', label: 'GEMS', shortLabel: 'Gems', icon: 'sparkles-outline' },
  { key: 'hide', label: 'HIDES', shortLabel: 'Hides', icon: 'layers-outline' },
  { key: 'bone', label: 'BONES', shortLabel: 'Bones', icon: 'skull-outline' },
  // Production outputs
  { key: 'food', label: 'FOOD', shortLabel: 'Food', icon: 'restaurant-outline' },
  { key: 'potion', label: 'POTIONS', shortLabel: 'Potions', icon: 'flask-outline' },
  { key: 'rune', label: 'RUNES', shortLabel: 'Runes', icon: 'code-slash-outline' },
  { key: 'component', label: 'COMPONENTS', shortLabel: 'Components', icon: 'construct-outline' },
  { key: 'building_material', label: 'BUILDING MATERIALS', shortLabel: 'Materials', icon: 'home-outline' },
  // Advanced / special
  { key: 'equipment', label: 'EQUIPMENT', shortLabel: 'Equipment', icon: 'shield-outline' },
  { key: 'energy', label: 'ENERGY', shortLabel: 'Energy', icon: 'flash-outline' },
  { key: 'misc', label: 'MISCELLANEOUS', shortLabel: 'Misc', icon: 'cube-outline' },
];

/** Hex colors for item rarity (used for accent bars and inline styles). */
export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#8899AA',
  uncommon: '#62EFBD',
  rare: '#009FFF',
  epic: '#8C93FF',
  legendary: '#FFEA2C',
};

/** Human-readable rarity labels. */
export const RARITY_LABELS: Record<ItemRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

/** Group items by category, preserving ITEM_CATEGORY_ORDER. Returns only non-empty groups. */
export function groupItemsByCategory(
  items: ItemDefinition[],
): { key: ItemCategory; label: string; shortLabel: string; icon: string; items: ItemDefinition[] }[] {
  return ITEM_CATEGORY_ORDER.map((cat) => ({
    ...cat,
    items: items.filter((item) => item.category === cat.key),
  })).filter((group) => group.items.length > 0);
}
