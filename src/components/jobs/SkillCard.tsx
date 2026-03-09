import { View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { JobDefinition, JobState } from '@/src/game/jobs/job-types';
import { levelProgress, xpToNextLevel } from '@/src/game/jobs/job-formulas';

interface SkillCardProps {
  job: JobDefinition;
  state: JobState;
  /** True when this job's activity is currently active. */
  isActive: boolean;
  /** 0–1 progress of the current activity cycle, if active. */
  activityProgress?: number;
  /** Name of the currently running activity, if active. */
  activityName?: string;
}

export function SkillCard({
  job,
  state,
  isActive,
  activityProgress,
  activityName,
}: SkillCardProps) {
  const accentColor = job.color;
  const textColor = '#ECF9FF';
  const descColor = '#8899AA';
  const progress = levelProgress(state.xp);
  const remaining = xpToNextLevel(state.xp);

  return (
    <View
      className="mx-4 mb-3 rounded-xl overflow-hidden"
      style={{
        backgroundColor: isActive ? '#141920' : '#0D1117',
        borderWidth: 1,
        borderColor: isActive ? accentColor : '#1E2530',
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
          opacity: isActive ? 1 : 0.6,
        }}
      />

      <View className="pl-5 pr-4 py-3">
        {/* Header row: icon + name + level */}
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center gap-2 flex-1">
            {job.iconLibrary === 'MaterialCommunityIcons' ? (
              <MaterialCommunityIcons
                name={job.icon as any}
                size={16}
                color={accentColor}
              />
            ) : (
              <Ionicons
                name={job.icon as any}
                size={16}
                color={accentColor}
              />
            )}
            <Text
              className="text-sm font-bold"
              style={{ color: textColor }}
              numberOfLines={1}
            >
              {job.name}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            {isActive && (
              <View
                className="px-2 py-0.5 rounded"
                style={{ backgroundColor: accentColor + '22' }}
              >
                <Text className="text-xs font-bold" style={{ color: accentColor }}>
                  ACTIVE
                </Text>
              </View>
            )}
            <Text className="text-xs font-semibold" style={{ color: accentColor }}>
              Lv {state.level}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-xs mb-2" style={{ color: descColor }} numberOfLines={1}>
          {job.description}
        </Text>

        {/* XP progress bar */}
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

        {/* XP footer */}
        <View className="flex-row justify-between mt-1">
          <Text className="text-xs" style={{ color: descColor }}>
            {state.xp.toLocaleString()} XP
          </Text>
          <Text className="text-xs" style={{ color: descColor }}>
            {state.level >= 99
              ? 'MAX'
              : `${remaining.toLocaleString()} to Lv ${state.level + 1}`}
          </Text>
        </View>

        {/* Activity progress (when active) */}
        {isActive && activityName != null && activityProgress != null && (
          <View className="mt-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-xs" style={{ color: accentColor }}>
                {activityName}
              </Text>
              <Text className="text-xs" style={{ color: accentColor }}>
                {Math.round(activityProgress * 100)}%
              </Text>
            </View>
            <View
              className="rounded-full overflow-hidden"
              style={{ height: 4, backgroundColor: '#1E2530' }}
            >
              <View
                style={{
                  height: 4,
                  width: `${Math.round(activityProgress * 100)}%`,
                  backgroundColor: accentColor,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
