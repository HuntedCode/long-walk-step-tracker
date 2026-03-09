import { View, Text, Pressable } from 'react-native';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { useJobStore } from '@/src/stores/useJobStore';
import { zoneDefinitionMap } from '@/src/data/zones';
import { getAvailableDestinations, startTravel } from '@/src/game/zones/zone-engine';

const TEXT_COLOR = '#ECF9FF';
const DESC_COLOR = '#8899AA';

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
    <View className="mx-4 mt-1">
      <Text className="text-xs font-semibold text-neutral-content mb-3 tracking-widest">
        TRAVEL TO
      </Text>
      {destinations.map((conn) => {
        const destZone = zoneDefinitionMap[conn.targetZoneId];
        const destName = destZone?.name ?? conn.targetZoneId;
        const destColor = destZone?.color ?? '#8899AA';

        return (
          <Pressable
            key={conn.targetZoneId}
            className="mb-3 rounded-xl overflow-hidden"
            style={{
              backgroundColor: '#0D1117',
              borderWidth: 1,
              borderColor: '#1E2530',
            }}
            onPress={() => handleTravel(conn.targetZoneId)}
          >
            {/* Colored left accent bar */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                backgroundColor: destColor,
                opacity: 0.6,
              }}
            />

            <View className="pl-5 pr-4 py-3 flex-row justify-between items-center">
              <Text className="text-sm font-bold" style={{ color: TEXT_COLOR }}>
                {destName}
              </Text>
              <Text className="text-xs" style={{ color: DESC_COLOR }}>
                {conn.stepsRequired} steps
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
