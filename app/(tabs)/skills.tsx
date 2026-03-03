import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useJobStore } from '@/src/stores/useJobStore';
import { jobDefinitions } from '@/src/data/jobs';
import { levelProgress, xpToNextLevel } from '@/src/game/jobs/job-formulas';
import { ProgressBar } from '@/src/components/ui/ProgressBar';

export default function SkillsScreen() {
  const jobs = useJobStore((s) => s.jobs);
  const totalLevel = useJobStore((s) => s.getTotalLevel());
  const totalXp = useJobStore((s) => s.getTotalXp());

  return (
    <SafeAreaView className="flex-1 bg-base-100">
      <ScrollView contentContainerClassName="pb-6">
        {/* Summary */}
        <View className="flex-row mx-4 mt-4 gap-3">
          <View className="flex-1 bg-base-200 rounded-xl p-4 items-center">
            <Text className="text-xs text-neutral-content">Total Level</Text>
            <Text className="text-2xl font-bold text-primary mt-1">
              {totalLevel}
            </Text>
          </View>
          <View className="flex-1 bg-base-200 rounded-xl p-4 items-center">
            <Text className="text-xs text-neutral-content">Total XP</Text>
            <Text className="text-2xl font-bold text-secondary mt-1">
              {totalXp.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Job Cards */}
        {jobDefinitions.map((def) => {
          const job = jobs[def.id];
          if (!job) return null;

          const progress = levelProgress(job.xp);
          const remaining = xpToNextLevel(job.xp);

          return (
            <View key={def.id} className="mx-4 mt-3 bg-base-200 rounded-xl p-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-base-content">
                  {def.name}
                </Text>
                <Text className="text-lg font-bold text-primary">
                  Lv {job.level}
                </Text>
              </View>

              <View className="mt-2">
                <ProgressBar progress={progress} color="bg-primary" />
              </View>

              <View className="flex-row justify-between mt-1">
                <Text className="text-xs text-neutral-content">
                  {job.xp.toLocaleString()} XP
                </Text>
                <Text className="text-xs text-neutral-content">
                  {job.level >= 99
                    ? 'MAX'
                    : `${remaining.toLocaleString()} to Lv ${job.level + 1}`}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
