import { View, Text } from 'react-native';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { zoneDefinitionMap } from '@/src/data/zones';

const TEXT_COLOR = '#ECF9FF';
const DESC_COLOR = '#8899AA';

export function ZoneCard() {
  const currentZoneId = usePlayerStore((s) => s.currentZoneId);
  const travel = usePlayerStore((s) => s.travel);

  const zone = zoneDefinitionMap[currentZoneId];
  const zoneName = zone?.name ?? currentZoneId;
  const zoneDesc = zone?.description ?? '';
  const accentColor = zone?.color ?? '#8899AA';

  if (travel) {
    const destination = zoneDefinitionMap[travel.destinationZoneId];
    const destName = destination?.name ?? travel.destinationZoneId;
    const destColor = destination?.color ?? accentColor;
    const progress = travel.stepsRequired > 0
      ? travel.stepsProgress / travel.stepsRequired
      : 0;

    return (
      <View
        className="mx-4 mb-3 rounded-xl overflow-hidden"
        style={{
          backgroundColor: '#141920',
          borderWidth: 1,
          borderColor: destColor,
        }}
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
            opacity: 1,
          }}
        />

        <View className="pl-5 pr-4 py-3">
          <Text className="text-xs" style={{ color: DESC_COLOR }}>
            Traveling from
          </Text>
          <Text
            className="text-sm font-bold"
            style={{ color: TEXT_COLOR }}
          >
            {zoneName}
          </Text>

          <View className="mt-2">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-xs font-semibold" style={{ color: destColor }}>
                Walking to {destName}
              </Text>
              <Text className="text-xs" style={{ color: DESC_COLOR }}>
                {travel.stepsProgress} / {travel.stepsRequired}
              </Text>
            </View>
            <View
              className="rounded-full overflow-hidden"
              style={{ height: 4, backgroundColor: '#1E2530' }}
            >
              <View
                style={{
                  height: 4,
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor: destColor,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      className="mx-4 mb-3 rounded-xl overflow-hidden"
      style={{
        backgroundColor: '#141920',
        borderWidth: 1,
        borderColor: accentColor,
      }}
    >
      {/* Colored left accent bar */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: accentColor,
          opacity: 1,
        }}
      />

      <View className="pl-5 pr-4 py-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className="text-sm font-bold"
            style={{ color: TEXT_COLOR }}
          >
            {zoneName}
          </Text>
          <View
            className="px-2 py-0.5 rounded"
            style={{ backgroundColor: accentColor + '22' }}
          >
            <Text className="text-xs font-bold" style={{ color: accentColor }}>
              HERE
            </Text>
          </View>
        </View>
        <Text className="text-xs" style={{ color: DESC_COLOR }}>
          {zoneDesc}
        </Text>
      </View>
    </View>
  );
}
