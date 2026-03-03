import { View, Text, Pressable } from 'react-native';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { activityDefinitionMap } from '@/src/data/activities';
import { ProgressBar } from '@/src/components/ui/ProgressBar';

export function ActivityCard() {
  const activityProgress = usePlayerStore((s) => s.activityProgress);
  const stopActivity = usePlayerStore((s) => s.stopActivity);

  if (!activityProgress) {
    return (
      <View className="mx-4 mt-3 bg-base-200 rounded-xl p-4">
        <Text className="text-xs text-neutral-content">Activity</Text>
        <Text className="text-sm text-neutral-content mt-1">
          No activity selected. Pick one below.
        </Text>
      </View>
    );
  }

  const activity = activityDefinitionMap[activityProgress.activityId];
  const name = activity?.name ?? activityProgress.activityId;
  const stepsRequired = activity?.stepsRequired ?? 1;
  const progress = stepsRequired > 0
    ? activityProgress.stepsProgress / stepsRequired
    : 0;

  return (
    <View className="mx-4 mt-3 bg-base-200 rounded-xl p-4">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-xs text-neutral-content">Activity</Text>
          <Text className="text-base font-semibold text-base-content">{name}</Text>
        </View>
        <Pressable
          className="bg-error/20 rounded-lg px-3 py-1.5"
          onPress={stopActivity}
        >
          <Text className="text-xs font-semibold text-error">Stop</Text>
        </Pressable>
      </View>

      <View className="mt-2">
        <ProgressBar progress={progress} color="bg-secondary" />
        <Text className="text-xs text-neutral-content mt-1 text-right">
          {activityProgress.stepsProgress} / {stepsRequired} steps
        </Text>
      </View>
    </View>
  );
}
