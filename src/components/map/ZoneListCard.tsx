import { View, Text, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ZoneDefinition } from '@/src/game/zones/zone-types';

export type ZoneCardState = 'current' | 'traveling' | 'available' | 'locked';

export interface JobChip {
  jobName: string;
  icon: string;
  iconLibrary?: 'Ionicons' | 'MaterialCommunityIcons';
  qualified: boolean;
}

interface ZoneListCardProps {
  zone: ZoneDefinition;
  state: ZoneCardState;
  /** Steps required to travel here (from current zone's connection). */
  stepsRequired?: number;
  /** 0–1 progress, only when state === 'traveling'. */
  travelProgress?: number;
  /** Activity type available in this zone, with qualification status. */
  jobChip?: JobChip;
  onTravel: (zoneId: string) => void;
}

export function ZoneListCard({
  zone,
  state,
  stepsRequired,
  travelProgress = 0,
  jobChip,
  onTravel,
}: ZoneListCardProps) {
  const isLocked = state === 'locked';
  const isCurrent = state === 'current';
  const isTraveling = state === 'traveling';

  const accentColor = isLocked ? '#3D4A55' : zone.color;
  const textColor = isLocked ? '#3D4A55' : '#ECF9FF';
  const descColor = isLocked ? '#2A323C' : '#8899AA';
  const biomeColor = isLocked ? '#2A323C' : accentColor;

  return (
    <View
      className="mx-4 mb-3 rounded-xl overflow-hidden"
      style={{
        backgroundColor: isCurrent ? '#141920' : '#0D1117',
        borderWidth: 1,
        borderColor: isCurrent ? accentColor : isLocked ? '#1E2530' : '#1E2530',
        opacity: isLocked ? 0.6 : 1,
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
          opacity: isLocked ? 0.3 : isCurrent ? 1 : 0.6,
        }}
      />

      <View className="pl-5 pr-4 py-3">
        {/* Header row: icon + name + biome tag */}
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center gap-2 flex-1">
            <Ionicons
              name={zone.icon as any}
              size={16}
              color={accentColor}
              style={{ opacity: isLocked ? 0.4 : 1 }}
            />
            <Text
              className="text-sm font-bold"
              style={{ color: textColor }}
              numberOfLines={1}
            >
              {zone.name}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            {isCurrent && (
              <View
                className="px-2 py-0.5 rounded"
                style={{ backgroundColor: accentColor + '22' }}
              >
                <Text className="text-xs font-bold" style={{ color: accentColor }}>
                  HERE
                </Text>
              </View>
            )}
            <Text className="text-xs font-semibold" style={{ color: biomeColor }}>
              {zone.biome}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-xs mb-2" style={{ color: descColor }} numberOfLines={1}>
          {zone.description}
        </Text>

        {/* Activity chip */}
        {jobChip && (
          <View className="flex-row items-center gap-1 mb-2">
            {jobChip.iconLibrary === 'MaterialCommunityIcons' ? (
              <MaterialCommunityIcons
                name={jobChip.icon as any}
                size={11}
                color={jobChip.qualified ? accentColor : '#3D4A55'}
              />
            ) : (
              <Ionicons
                name={jobChip.icon as any}
                size={11}
                color={jobChip.qualified ? accentColor : '#3D4A55'}
              />
            )}
            <Text
              className="text-xs"
              style={{ color: jobChip.qualified ? accentColor : '#3D4A55' }}
            >
              {jobChip.jobName}
            </Text>
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 3,
                backgroundColor: jobChip.qualified ? accentColor : '#2A323C',
                marginLeft: 2,
              }}
            />
          </View>
        )}

        {/* Footer: travel cost / progress / status */}
        {isCurrent ? null : isTraveling ? (
          <View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-xs" style={{ color: accentColor }}>
                Traveling...
              </Text>
              <Text className="text-xs" style={{ color: accentColor }}>
                {Math.round(travelProgress * 100)}%
              </Text>
            </View>
            <View
              className="rounded-full overflow-hidden"
              style={{ height: 4, backgroundColor: '#1E2530' }}
            >
              <View
                style={{
                  height: 4,
                  width: `${Math.round(travelProgress * 100)}%`,
                  backgroundColor: accentColor,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        ) : isLocked ? (
          <View className="flex-row items-center gap-1">
            <Ionicons name="lock-closed-outline" size={12} color="#3D4A55" />
            <Text className="text-xs" style={{ color: '#3D4A55' }}>
              Requires level {zone.unlockRequirement?.totalLevel}
            </Text>
          </View>
        ) : (
          <Pressable
            className="flex-row items-center justify-between active:opacity-70"
            onPress={() => onTravel(zone.id)}
          >
            <Text className="text-xs" style={{ color: descColor }}>
              {stepsRequired?.toLocaleString()} steps to travel
            </Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-xs font-semibold" style={{ color: accentColor }}>
                Travel
              </Text>
              <Ionicons name="arrow-forward" size={12} color={accentColor} />
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}
