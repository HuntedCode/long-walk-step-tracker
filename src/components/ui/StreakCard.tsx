import { useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { getDateNDaysAgo } from '@/src/utils/time';
import { getStreakFlavor } from '@/src/utils/flavor-text';

const STREAK_MILESTONES = [7, 14, 30, 60, 100] as const;
const EASE_IN_OUT = Easing.inOut(Easing.ease);

// --- Props ---

interface StreakCardProps {
  streak: number;
  streakAtRisk: boolean;
  bestStreak: number;
  goalMet: boolean;
  goalMetDates: string[];
  todayDate: string;
  stepsRemaining: number;
}

// --- Main Component ---

export function StreakCard({
  streak,
  streakAtRisk,
  bestStreak,
  goalMet,
  goalMetDates,
  todayDate,
  stepsRemaining,
}: StreakCardProps) {
  // Enhancement 4: Border glow
  const borderOpacity = useSharedValue(0);

  useEffect(() => {
    if (streak === 0) {
      borderOpacity.value = withTiming(0, { duration: 300 });
    } else if (streakAtRisk) {
      borderOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 800, easing: EASE_IN_OUT }),
          withTiming(0.2, { duration: 800, easing: EASE_IN_OUT }),
        ),
        -1,
        true,
      );
    } else {
      borderOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1200, easing: EASE_IN_OUT }),
          withTiming(0.15, { duration: 1200, easing: EASE_IN_OUT }),
        ),
        -1,
        true,
      );
    }
  }, [streak, streakAtRisk]);

  const borderGlowStyle = useAnimatedStyle(() => ({
    borderWidth: streak > 0 ? 1.5 : 0,
    borderColor: streakAtRisk
      ? `rgba(255, 234, 44, ${borderOpacity.value})`
      : `rgba(98, 239, 189, ${borderOpacity.value})`,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
  }));

  return (
    <Animated.View style={borderGlowStyle}>
      <View
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: '#0D1117',
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
            backgroundColor: streakAtRisk ? '#FFEA2C' : '#62EFBD',
            opacity: streak > 0 ? 1 : 0.3,
          }}
        />

        <View className="pl-5 pr-4 py-3">
          {/* Row 1: Streak number + flame + label + best badge */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className={`text-3xl font-bold ${streakAtRisk ? 'text-warning' : 'text-success'}`}>
                {streak}
              </Text>
              {streak > 0 ? (
                <StreakFlame streak={streak} streakAtRisk={streakAtRisk} />
              ) : (
                <Text className="text-sm ml-1" style={{ color: '#8899AA' }}>day streak</Text>
              )}
            </View>
            {streak > 0 && streak === bestStreak && !streakAtRisk ? (
              <Text className="text-xs font-semibold text-accent">Personal Best!</Text>
            ) : (
              <Text className="text-xs" style={{ color: '#8899AA' }}>Best: {bestStreak}</Text>
            )}
          </View>

          {/* Row 2: Milestone badges */}
          {streak > 0 && <StreakMilestones streak={streak} />}

          {/* Row 3: Goal dots */}
          <GoalDots
            goalMetDates={goalMetDates}
            todayDate={todayDate}
            goalMet={goalMet}
            streakAtRisk={streakAtRisk}
          />

          {/* Row 4: Flavor text */}
          <Text className="text-xs mt-2 italic" style={{ color: '#8899AA' }}>
            {streakAtRisk
              ? `${stepsRemaining.toLocaleString()} steps to keep it alive!`
              : getStreakFlavor(streak)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

// --- Enhancement 1: Streak Flame ---

function getFlameSizePx(streak: number): number {
  let tier = 0;
  for (const m of STREAK_MILESTONES) {
    if (streak >= m) tier++;
  }
  return 20 + tier * 2;
}

const FLAME_TIERS: readonly { min: number; color: string; title: string }[] = [
  { min: 100, color: '#28EBFF', title: 'Transcendent' },
  { min: 60, color: '#8B5CF6', title: 'Legendary' },
  { min: 30, color: '#FF1493', title: 'Blazing' },
  { min: 14, color: '#FF4500', title: 'On Fire' },
  { min: 7, color: '#FF6B35', title: 'Warming Up' },
  { min: 0, color: '#FF8C64', title: 'Kindling' },
];

function getFlameTier(streak: number): { color: string; title: string } {
  for (const tier of FLAME_TIERS) {
    if (streak >= tier.min) return { color: tier.color, title: tier.title };
  }
  return { color: '#FF8C64', title: 'Kindling' };
}

function StreakFlame({ streak, streakAtRisk }: { streak: number; streakAtRisk: boolean }) {
  const scale = useSharedValue(1);
  const { color, title } = getFlameTier(streak);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 750, easing: EASE_IN_OUT }),
        withTiming(1.0, { duration: 750, easing: EASE_IN_OUT }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="flex-row items-center">
      <Animated.View style={animatedStyle} className="ml-1">
        <Ionicons
          name="flame"
          size={getFlameSizePx(streak)}
          color={streakAtRisk ? '#FFEA2C' : color}
        />
      </Animated.View>
      <Text
        className="text-xs font-semibold ml-1"
        style={{ color: streakAtRisk ? '#FFEA2C' : color }}
      >
        {title}
      </Text>
    </View>
  );
}

// --- Enhancement 2: Milestone Badges ---

function StreakMilestones({ streak }: { streak: number }) {
  const earned = STREAK_MILESTONES.filter((m) => streak >= m);
  const nextIdx = earned.length;
  const next = nextIdx < STREAK_MILESTONES.length ? STREAK_MILESTONES[nextIdx] : null;
  const visible = next !== null ? [...earned, next] : earned;

  // If streak < 7, just show the 7d milestone as upcoming
  if (visible.length === 0) {
    return (
      <View className="flex-row mt-2 gap-1.5">
        <MilestonePill days={7} earned={false} />
      </View>
    );
  }

  return (
    <View className="flex-row mt-2 gap-1.5">
      {visible.map((m) => (
        <MilestonePill key={m} days={m} earned={streak >= m} />
      ))}
    </View>
  );
}

function MilestonePill({ days, earned }: { days: number; earned: boolean }) {
  return (
    <View
      className={`px-2 py-0.5 rounded-full ${earned ? 'bg-accent/20' : 'bg-base-300'}`}
      style={!earned ? { borderWidth: 1, borderColor: 'rgba(228, 228, 231, 0.2)' } : undefined}
    >
      <Text
        className={`text-xs font-semibold ${earned ? 'text-accent' : 'text-neutral-content/40'}`}
      >
        {days}d
      </Text>
    </View>
  );
}

// --- Enhancement 3: Goal Dots ---

interface GoalDotsProps {
  goalMetDates: string[];
  todayDate: string;
  goalMet: boolean;
  streakAtRisk: boolean;
}

function GoalDots({ goalMetDates, todayDate, goalMet, streakAtRisk }: GoalDotsProps) {
  const goalMetSet = useMemo(() => new Set(goalMetDates), [goalMetDates]);

  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (streakAtRisk && !goalMet) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 600, easing: EASE_IN_OUT }),
          withTiming(1, { duration: 600, easing: EASE_IN_OUT }),
        ),
        -1,
        true,
      );
    } else {
      pulseOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [streakAtRisk, goalMet]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const dots = [];
  for (let i = 6; i >= 0; i--) {
    const date = getDateNDaysAgo(i);
    const isToday = date === todayDate;
    const met = isToday ? goalMet : goalMetSet.has(date);

    if (isToday && streakAtRisk && !goalMet) {
      dots.push(
        <Animated.View
          key={date}
          style={[{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFEA2C' }, pulseStyle]}
        />,
      );
    } else if (met) {
      dots.push(
        <View
          key={date}
          style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#62EFBD' }}
        />,
      );
    } else {
      dots.push(
        <View
          key={date}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            borderWidth: 1.5,
            borderColor: 'rgba(228, 228, 231, 0.25)',
            backgroundColor: 'transparent',
          }}
        />,
      );
    }
  }

  return (
    <View className="flex-row items-center mt-2 gap-2">
      {dots}
    </View>
  );
}
