import { View, Text, Pressable } from 'react-native';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { activityDefinitionMap } from '@/src/data/activities';
import { jobDefinitionMap } from '@/src/data/jobs';

const TEXT_COLOR = '#ECF9FF';
const DESC_COLOR = '#8899AA';
const IDLE_ACCENT = '#8899AA';

export function ActivityCard() {
  const activityProgress = usePlayerStore((s) => s.activityProgress);
  const stopActivity = usePlayerStore((s) => s.stopActivity);

  if (!activityProgress) {
    return (
      <View
        className="mx-4 mb-3 rounded-xl overflow-hidden"
        style={{
          backgroundColor: '#0D1117',
          borderWidth: 1,
          borderColor: '#1E2530',
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
            backgroundColor: IDLE_ACCENT,
            opacity: 0.3,
          }}
        />

        <View className="pl-5 pr-4 py-3">
          <Text className="text-xs" style={{ color: DESC_COLOR }}>
            Activity
          </Text>
          <Text className="text-xs mt-1" style={{ color: DESC_COLOR }}>
            No activity selected. Pick one below.
          </Text>
        </View>
      </View>
    );
  }

  const activity = activityDefinitionMap[activityProgress.activityId];
  const name = activity?.name ?? activityProgress.activityId;
  const stepsRequired = activity?.stepsRequired ?? 1;
  const progress = stepsRequired > 0
    ? activityProgress.stepsProgress / stepsRequired
    : 0;

  const jobDef = activity ? jobDefinitionMap[activity.jobId] : undefined;
  const accentColor = jobDef?.color ?? IDLE_ACCENT;

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
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xs" style={{ color: DESC_COLOR }}>
              Activity
            </Text>
            <Text className="text-sm font-bold" style={{ color: TEXT_COLOR }}>
              {name}
            </Text>
          </View>
          <Pressable
            className="px-3 py-1.5 rounded"
            style={{ backgroundColor: accentColor + '22' }}
            onPress={stopActivity}
          >
            <Text className="text-xs font-semibold" style={{ color: accentColor }}>
              Stop
            </Text>
          </Pressable>
        </View>

        <View className="mt-2">
          <View className="flex-row justify-between mb-1">
            <Text className="text-xs" style={{ color: accentColor }}>
              {Math.round(progress * 100)}%
            </Text>
            <Text className="text-xs" style={{ color: DESC_COLOR }}>
              {activityProgress.stepsProgress} / {stepsRequired} steps
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
                backgroundColor: accentColor,
                borderRadius: 4,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
