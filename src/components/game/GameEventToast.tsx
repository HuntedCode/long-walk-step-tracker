import { useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useEventStore } from '@/src/stores/useEventStore';
import { jobDefinitionMap } from '@/src/data/jobs';
import { activityDefinitionMap } from '@/src/data/activities';
import { zoneDefinitionMap } from '@/src/data/zones';
import { itemDefinitionMap } from '@/src/data/items';
import type { GameEvent } from '@/src/types/game';
import type { ItemRarity } from '@/src/game/loot/loot-types';

const TOAST_DURATION_MS = 3000;

const RARITY_COLORS: Record<ItemRarity, string> = {
  common: 'bg-base-300',
  uncommon: 'bg-success',
  rare: 'bg-info',
  epic: 'bg-secondary',
  legendary: 'bg-warning',
};

function getEventDisplay(event: GameEvent): { text: string; color: string } {
  switch (event.type) {
    case 'LEVEL_UP': {
      const job = jobDefinitionMap[event.jobId];
      const name = job?.name ?? event.jobId;
      return {
        text: `${name} leveled up! Lv ${event.oldLevel} → ${event.newLevel}`,
        color: 'bg-primary',
      };
    }
    case 'ACTIVITY_COMPLETED': {
      const activity = activityDefinitionMap[event.activityId];
      const name = activity?.name ?? event.activityId;
      const suffix = event.completions > 1 ? ` x${event.completions}` : '';
      return {
        text: `Completed ${name}${suffix}`,
        color: 'bg-secondary',
      };
    }
    case 'ARRIVED_AT_ZONE': {
      const zone = zoneDefinitionMap[event.zoneId];
      const name = zone?.name ?? event.zoneId;
      return {
        text: `Arrived at ${name}`,
        color: 'bg-accent',
      };
    }
    case 'RARE_DROP': {
      const item = itemDefinitionMap[event.itemId];
      const name = item?.name ?? event.itemId;
      const suffix = event.quantity > 1 ? ` x${event.quantity}` : '';
      return {
        text: `Rare find: ${name}${suffix}`,
        color: RARITY_COLORS[event.rarity] ?? 'bg-info',
      };
    }
    default:
      return { text: '', color: 'bg-base-300' };
  }
}

export function GameEventToast() {
  const events = useEventStore((s) => s.events);
  const shiftEvent = useEventStore((s) => s.shiftEvent);

  const currentEvent = events.length > 0 ? events[0] : null;

  const dismiss = useCallback(() => {
    shiftEvent();
  }, [shiftEvent]);

  useEffect(() => {
    if (!currentEvent) return;
    const timer = setTimeout(dismiss, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [currentEvent, dismiss]);

  if (!currentEvent) return null;

  const { text, color } = getEventDisplay(currentEvent);
  if (!text) return null;

  return (
    <View className="absolute bottom-24 left-0 right-0 z-50 px-4">
      <View className={`${color} rounded-lg px-4 py-3`}>
        <Text className="text-sm font-semibold text-primary-content text-center">
          {text}
        </Text>
      </View>
    </View>
  );
}
