import { View, Text } from 'react-native';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { zoneDefinitionMap } from '@/src/data/zones';
import { ProgressBar } from '@/src/components/ui/ProgressBar';

export function ZoneCard() {
  const currentZoneId = usePlayerStore((s) => s.currentZoneId);
  const travel = usePlayerStore((s) => s.travel);

  const zone = zoneDefinitionMap[currentZoneId];
  const zoneName = zone?.name ?? currentZoneId;
  const zoneDesc = zone?.description ?? '';

  if (travel) {
    const destination = zoneDefinitionMap[travel.destinationZoneId];
    const destName = destination?.name ?? travel.destinationZoneId;
    const progress = travel.stepsRequired > 0
      ? travel.stepsProgress / travel.stepsRequired
      : 0;

    return (
      <View className="mx-4 mt-3 bg-base-200 rounded-xl p-4">
        <Text className="text-xs text-neutral-content">Traveling from</Text>
        <Text className="text-base font-semibold text-base-content">{zoneName}</Text>

        <View className="mt-3">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-sm text-accent font-semibold">
              Walking to {destName}
            </Text>
            <Text className="text-xs text-neutral-content">
              {travel.stepsProgress} / {travel.stepsRequired}
            </Text>
          </View>
          <ProgressBar progress={progress} color="bg-accent" />
        </View>
      </View>
    );
  }

  return (
    <View className="mx-4 mt-3 bg-base-200 rounded-xl p-4">
      <Text className="text-xs text-neutral-content">Current Zone</Text>
      <Text className="text-lg font-semibold text-base-content">{zoneName}</Text>
      <Text className="text-xs text-neutral-content mt-1">{zoneDesc}</Text>
    </View>
  );
}
