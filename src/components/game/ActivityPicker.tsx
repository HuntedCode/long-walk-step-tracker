import { View, Text, Pressable } from 'react-native';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { useJobStore } from '@/src/stores/useJobStore';
import { getActivitiesForZone } from '@/src/data/activities';
import { jobDefinitionMap } from '@/src/data/jobs';
import { itemDefinitionMap } from '@/src/data/items';
import { meetsRequirements } from '@/src/game/jobs/job-engine';

const TEXT_COLOR = '#ECF9FF';
const DESC_COLOR = '#8899AA';

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
    <View className="mx-4 mt-1">
      <Text className="text-xs font-semibold text-neutral-content mb-3 tracking-widest">
        ACTIVITIES
      </Text>
      {activities.map((act) => {
        const locked = !meetsRequirements(act.requirements, jobs);
        const isActive = activityProgress?.activityId === act.id;
        const jobDef = jobDefinitionMap[act.jobId];
        const accentColor = jobDef?.color ?? '#8899AA';

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
            className="mb-3 rounded-xl overflow-hidden"
            style={{
              backgroundColor: isActive ? '#141920' : '#0D1117',
              borderWidth: 1,
              borderColor: isActive ? accentColor : '#1E2530',
              opacity: locked ? 0.6 : 1,
            }}
            onPress={() => {
              if (!locked) startActivity(act.id);
            }}
            disabled={locked}
          >
            {/* Colored left accent bar */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                backgroundColor: locked ? '#3D4A55' : accentColor,
                opacity: isActive ? 1 : locked ? 0.3 : 0.6,
              }}
            />

            <View className="pl-5 pr-4 py-3">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-sm font-bold"
                  style={{ color: isActive ? accentColor : locked ? '#3D4A55' : TEXT_COLOR }}
                >
                  {act.name}
                  {isActive ? ' (Active)' : ''}
                </Text>
                <Text className="text-xs" style={{ color: DESC_COLOR }}>
                  {act.stepsRequired} steps
                </Text>
              </View>

              <View className="flex-row justify-between mt-1">
                <Text className="text-xs" style={{ color: DESC_COLOR }}>
                  {rewardText}
                </Text>
                {locked ? (
                  <Text className="text-xs" style={{ color: '#B8860B' }}>
                    Requires {lockText}
                  </Text>
                ) : null}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
