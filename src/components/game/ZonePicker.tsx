import { View, Text, Pressable } from 'react-native';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { useJobStore } from '@/src/stores/useJobStore';
import { zoneDefinitionMap } from '@/src/data/zones';
import { getAvailableDestinations, startTravel } from '@/src/game/zones/zone-engine';

export function ZonePicker() {
  const currentZoneId = usePlayerStore((s) => s.currentZoneId);
  const travel = usePlayerStore((s) => s.travel);
  const activityProgress = usePlayerStore((s) => s.activityProgress);
  const setTravel = usePlayerStore((s) => s.startTravel);
  const totalLevel = useJobStore((s) => s.getTotalLevel());

  // Hide while traveling or doing an activity
  if (travel || activityProgress) return null;

  const currentZone = zoneDefinitionMap[currentZoneId];
  if (!currentZone) return null;

  const destinations = getAvailableDestinations(
    currentZone,
    zoneDefinitionMap,
    totalLevel,
  );

  if (destinations.length === 0) return null;

  const handleTravel = (destinationZoneId: string) => {
    const travelState = startTravel(currentZone, destinationZoneId);
    if (travelState) {
      setTravel(travelState);
    }
  };

  return (
    <View className="mx-4 mt-3">
      <Text className="text-xs text-neutral-content mb-2">Travel To</Text>
      {destinations.map((conn) => {
        const destZone = zoneDefinitionMap[conn.targetZoneId];
        const destName = destZone?.name ?? conn.targetZoneId;

        return (
          <Pressable
            key={conn.targetZoneId}
            className="bg-base-200 rounded-lg p-3 mb-2 flex-row justify-between items-center active:bg-base-300"
            onPress={() => handleTravel(conn.targetZoneId)}
          >
            <Text className="text-sm font-semibold text-base-content">
              {destName}
            </Text>
            <Text className="text-xs text-neutral-content">
              {conn.stepsRequired} steps
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
