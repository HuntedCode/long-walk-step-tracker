import { View, Text, Pressable } from 'react-native';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { useJobStore } from '@/src/stores/useJobStore';
import { getActivitiesForZone } from '@/src/data/activities';
import { jobDefinitionMap } from '@/src/data/jobs';
import { itemDefinitionMap } from '@/src/data/items';
import { meetsRequirements } from '@/src/game/jobs/job-engine';

export function ActivityPicker() {
  const currentZoneId = usePlayerStore((s) => s.currentZoneId);
  const travel = usePlayerStore((s) => s.travel);
  const activityProgress = usePlayerStore((s) => s.activityProgress);
  const startActivity = usePlayerStore((s) => s.startActivity);
  const jobs = useJobStore((s) => s.jobs);

  // Hide while traveling
  if (travel) return null;

  const activities = getActivitiesForZone(currentZoneId);
  if (activities.length === 0) return null;

  return (
    <View className="mx-4 mt-3">
      <Text className="text-xs text-neutral-content mb-2">Activities</Text>
      {activities.map((act) => {
        const locked = !meetsRequirements(act.requirements, jobs);
        const isActive = activityProgress?.activityId === act.id;

        // Build reward summary text
        const rewardText = act.itemRewards
          .map((r) => {
            const item = itemDefinitionMap[r.itemId];
            return `${r.quantity} ${item?.name ?? r.itemId}`;
          })
          .join(', ');

        // Build lock reason text
        const lockText = act.requirements
          .map((req) => {
            const job = jobDefinitionMap[req.jobId];
            return `${job?.name ?? req.jobId} Lv ${req.level}`;
          })
          .join(', ');

        return (
          <Pressable
            key={act.id}
            className={`rounded-lg p-3 mb-2 ${
              isActive
                ? 'bg-secondary/20 border border-secondary'
                : locked
                  ? 'bg-base-300 opacity-50'
                  : 'bg-base-200 active:bg-base-300'
            }`}
            onPress={() => {
              if (!locked) startActivity(act.id);
            }}
            disabled={locked}
          >
            <View className="flex-row justify-between items-center">
              <Text
                className={`text-sm font-semibold ${
                  isActive ? 'text-secondary' : 'text-base-content'
                }`}
              >
                {act.name}
                {isActive ? ' (Active)' : ''}
              </Text>
              <Text className="text-xs text-neutral-content">
                {act.stepsRequired} steps
              </Text>
            </View>

            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-neutral-content">{rewardText}</Text>
              {locked ? (
                <Text className="text-xs text-warning">Requires {lockText}</Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
