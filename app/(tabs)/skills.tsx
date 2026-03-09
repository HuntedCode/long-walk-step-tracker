import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJobStore } from '@/src/stores/useJobStore';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { jobDefinitions } from '@/src/data/jobs';
import { activityDefinitionMap } from '@/src/data/activities';
import { SkillCard } from '@/src/components/jobs/SkillCard';

export default function SkillsScreen() {
  const jobs = useJobStore((s) => s.jobs);
  const totalLevel = useJobStore((s) => s.getTotalLevel());
  const totalXp = useJobStore((s) => s.getTotalXp());
  const activityProgress = usePlayerStore((s) => s.activityProgress);

  const activeActivity = activityProgress
    ? activityDefinitionMap[activityProgress.activityId]
    : undefined;

  return (
    <SafeAreaView className="flex-1 bg-base-100" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xs font-semibold text-neutral-content mx-4 mb-4 tracking-widest">
          SKILLS
        </Text>

        {/* Summary */}
        <View className="flex-row mx-4 mb-3 gap-3">
          <View
            className="flex-1 rounded-xl p-4 items-center"
            style={{
              backgroundColor: '#0D1117',
              borderWidth: 1,
              borderColor: '#1E2530',
            }}
          >
            <Text className="text-xs" style={{ color: '#8899AA' }}>
              Total Level
            </Text>
            <Text className="text-2xl font-bold text-primary mt-1">
              {totalLevel}
            </Text>
          </View>
          <View
            className="flex-1 rounded-xl p-4 items-center"
            style={{
              backgroundColor: '#0D1117',
              borderWidth: 1,
              borderColor: '#1E2530',
            }}
          >
            <Text className="text-xs" style={{ color: '#8899AA' }}>
              Total XP
            </Text>
            <Text className="text-2xl font-bold text-secondary mt-1">
              {totalXp.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Job Cards */}
        {jobDefinitions.map((def) => {
          const job = jobs[def.id];
          if (!job) return null;

          const isActive = activeActivity?.jobId === def.id;

          return (
            <SkillCard
              key={def.id}
              job={def}
              state={job}
              isActive={isActive}
              activityProgress={
                isActive && activityProgress
                  ? activityProgress.stepsProgress / activeActivity!.stepsRequired
                  : undefined
              }
              activityName={isActive ? activeActivity?.name : undefined}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
