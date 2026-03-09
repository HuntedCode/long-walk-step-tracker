import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useJobStore } from '@/src/stores/useJobStore';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { jobDefinitions } from '@/src/data/jobs';
import { activityDefinitionMap } from '@/src/data/activities';
import { SkillCard } from '@/src/components/jobs/SkillCard';
import type { JobCategory, JobDefinition, JobState } from '@/src/game/jobs/job-types';

const CATEGORY_ORDER: { key: JobCategory; label: string }[] = [
  { key: 'combat', label: 'COMBAT' },
  { key: 'gathering', label: 'GATHERING' },
  { key: 'production', label: 'PRODUCTION' },
  { key: 'wayfaring', label: 'WAYFARING' },
];

const jobsByCategory = CATEGORY_ORDER.map(({ key, label }) => ({
  key,
  label,
  jobs: jobDefinitions.filter((j) => j.category === key),
}));

function SkillGridItem({ job, state, count }: { job: JobDefinition; state: JobState; count: number }) {
  return (
    <View style={{ width: `${100 / count}%`, maxWidth: 56, alignItems: 'center', paddingVertical: 6 }}>
      {job.iconLibrary === 'MaterialCommunityIcons' ? (
        <MaterialCommunityIcons
          name={job.icon as any}
          size={18}
          color={job.color}
        />
      ) : (
        <Ionicons
          name={job.icon as any}
          size={18}
          color={job.color}
        />
      )}
      <Text
        className="text-xs font-semibold mt-0.5"
        style={{ color: '#ECF9FF', fontSize: 10 }}
      >
        {state.level}
      </Text>
    </View>
  );
}

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

        {/* Quick-look grid */}
        <View
          className="mx-4 mb-3 rounded-xl px-3 py-2"
          style={{
            backgroundColor: '#0D1117',
            borderWidth: 1,
            borderColor: '#1E2530',
          }}
        >
          {jobsByCategory.map(({ key, label, jobs: categoryJobs }, idx) => (
            <View key={key}>
              {idx > 0 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: '#1E2530',
                    marginVertical: 2,
                  }}
                />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                {categoryJobs.map((def) => {
                  const job = jobs[def.id];
                  if (!job) return null;
                  return <SkillGridItem key={def.id} job={def} state={job} count={categoryJobs.length} />;
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Skill Cards grouped by category */}
        {jobsByCategory.map(({ label, jobs: categoryJobs }) => (
          <View key={label}>
            <Text
              className="text-xs font-semibold mx-4 mt-4 mb-2 tracking-widest"
              style={{ color: '#8899AA' }}
            >
              {label}
            </Text>
            {categoryJobs.map((def) => {
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
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
