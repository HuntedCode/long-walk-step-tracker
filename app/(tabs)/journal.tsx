import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ScrollView as ScrollViewType } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from '@react-navigation/native';
import { useStepStore } from '@/src/stores/useStepStore';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { GoalRing } from '@/src/components/ui/GoalRing';
import { BarChart } from '@/src/components/ui/BarChart';
import { AnimatedCounter } from '@/src/components/ui/AnimatedCounter';
import { GoalCelebration } from '@/src/components/ui/GoalCelebration';
import { StreakCard } from '@/src/components/ui/StreakCard';
import { calculateStepStats, getRecentDays } from '@/src/utils/step-stats';
import { getDayLabel } from '@/src/utils/time';
import {
  getStepCountFlavor,
  getRestDayFlavor,
  getGoalMetFlavor,
  getNearGoalFlavor,
} from '@/src/utils/flavor-text';
import {
  getDailyChartData,
  getWeeklyChartData,
  getMonthlyChartData,
  getYearlyChartData,
} from '@/src/utils/chart-data';

const GOAL_PRESETS = [1000, 2500, 5000, 10000] as const;
const TIME_SCALES = ['D', 'W', 'M', 'Y'] as const;
type TimeScale = (typeof TIME_SCALES)[number];

/** Measured height of the goal editor content (presets + custom input + padding). */
const EDITOR_HEIGHT = 195;

const TIMING_CONFIG = { duration: 250, easing: Easing.out(Easing.cubic) };

export default function StepsScreen() {
  const todaySteps = useStepStore((s) => s.todaySteps);
  const todayDate = useStepStore((s) => s.todayDate);
  const lifetimeSteps = useStepStore((s) => s.lifetimeSteps);
  const dailyHistory = useStepStore((s) => s.dailyHistory);
  const dailyStepGoal = useStepStore((s) => s.dailyStepGoal);
  const goalMetDates = useStepStore((s) => s.goalMetDates) ?? [];
  const pendingDailyStepGoal = useStepStore((s) => s.pendingDailyStepGoal);
  const setDailyStepGoal = useStepStore((s) => s.setDailyStepGoal);
  const clearPendingGoal = useStepStore((s) => s.clearPendingGoal);

  const [customGoalText, setCustomGoalText] = useState('');
  const [timeScale, setTimeScale] = useState<TimeScale>('D');
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Increment on tab focus to remount GoalRing, replaying its fill animation
  const [ringKey, setRingKey] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const celebratedRef = useRef(false);
  const prevGoalMetRef = useRef(false);

  useFocusEffect(useCallback(() => {
    setRingKey((k) => k + 1);
    setShowCelebration(false);
    const state = useStepStore.getState();
    const goalMet = state.todaySteps >= state.dailyStepGoal;
    if (goalMet && !celebratedRef.current) {
      celebratedRef.current = true;
      const timer = setTimeout(() => {
        setShowCelebration(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, []));

  // Detect live goal crossing while on the tab
  useEffect(() => {
    const goalMet = todaySteps >= dailyStepGoal;
    if (goalMet && !prevGoalMetRef.current && !celebratedRef.current) {
      celebratedRef.current = true;
      setShowCelebration(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    prevGoalMetRef.current = goalMet;
  }, [todaySteps, dailyStepGoal]);

  const editorOpen = useSharedValue(0); // 0 = closed, 1 = open
  const [isOpen, setIsOpen] = useState(false);

  const scrollRef = useRef<ScrollViewType>(null);
  // Track the editor's Y position within the scroll content via onLayout
  const editorYRef = useRef(0);
  // Save scroll position before focusing input, restore on blur
  const savedScrollY = useRef(0);
  const currentScrollY = useRef(0);

  const stats = useMemo(
    () => calculateStepStats({ dailyHistory, todaySteps, todayDate, goalMetDates, dailyStepGoal }),
    [dailyHistory, todaySteps, todayDate, goalMetDates, dailyStepGoal],
  );
  const recentDays = useMemo(
    () => getRecentDays(dailyHistory, todaySteps, todayDate, 14),
    [dailyHistory, todaySteps, todayDate],
  );
  const goalMetSet = useMemo(() => new Set(goalMetDates), [goalMetDates]);

  const stepsRemaining = dailyStepGoal - todaySteps;
  const flavorText = stats.goalMet
    ? getGoalMetFlavor(todayDate)
    : getNearGoalFlavor(stepsRemaining) ?? getStepCountFlavor(todaySteps);

  const chartData = useMemo(() => {
    if (timeScale === 'D') return getDailyChartData(dailyHistory, todaySteps, todayDate, 7);
    if (timeScale === 'W') return getWeeklyChartData(dailyHistory, todaySteps, todayDate);
    if (timeScale === 'M') return getMonthlyChartData(dailyHistory, todaySteps, todayDate);
    return getYearlyChartData(dailyHistory, todaySteps, todayDate);
  }, [timeScale, dailyHistory, todaySteps, todayDate]);

  const chartGoalLine =
    timeScale === 'D'
      ? dailyStepGoal
      : timeScale === 'W'
        ? dailyStepGoal * 7
        : undefined;

  const toggleGoalEditor = () => {
    const next = !isOpen;
    setIsOpen(next);
    editorOpen.value = withTiming(next ? 1 : 0, TIMING_CONFIG);
    Haptics.impactAsync(
      next ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
    );
  };

  const editorAnimatedStyle = useAnimatedStyle(() => ({
    height: editorOpen.value * EDITOR_HEIGHT,
    opacity: editorOpen.value,
    marginTop: editorOpen.value * 8,
    paddingTop: editorOpen.value * 16,
    paddingBottom: editorOpen.value * 16,
    paddingLeft: editorOpen.value * 20,
    paddingRight: editorOpen.value * 16,
    borderWidth: editorOpen.value,
    overflow: 'hidden' as const,
    marginHorizontal: 16,
  }));

  return (
    <SafeAreaView className="flex-1 bg-base-100" edges={['bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={(e) => {
          currentScrollY.current = e.nativeEvent.contentOffset.y;
        }}
      >
        <Text className="text-xs font-semibold text-neutral-content mx-4 mb-4 tracking-widest">
          STEPS
        </Text>

        {/* Hero: Goal Ring + Today's Steps */}
        <View className="items-center pt-6 pb-4">
          <View style={{ width: 180, height: 180, overflow: 'visible' }}>
            <GoalRing
              key={ringKey}
              progress={stats.goalProgress}
              size={180}
              strokeWidth={10}
              color={stats.goalMet ? '#00C853' : '#28EBFF'}
              pulse={showCelebration}
            >
              <AnimatedCounter
                to={todaySteps}
                className={`text-4xl font-bold ${
                  stats.goalMet ? 'text-success' : 'text-primary'
                }`}
              />
            </GoalRing>
            <GoalCelebration active={showCelebration} size={180} />
          </View>
          <Text className="text-sm text-neutral-content mt-2">
            {stats.goalMet
              ? 'Goal reached!'
              : `${(todaySteps ?? 0).toLocaleString()} / ${(dailyStepGoal ?? 0).toLocaleString()} steps (${Math.round((stats.goalProgress ?? 0) * 100)}%)`}
          </Text>
          <Text className="text-sm text-neutral-content mt-2 mx-8 text-center italic">
            {flavorText}
          </Text>
        </View>

        {/* Streak Card */}
        <StreakCard
          streak={stats.streak}
          streakAtRisk={stats.streakAtRisk}
          bestStreak={stats.bestStreak}
          goalMet={stats.goalMet}
          goalMetDates={goalMetDates}
          todayDate={todayDate}
          stepsRemaining={stepsRemaining}
        />

        {/* Goal Setting Row */}
        <Pressable
          className="mx-4 mt-2 rounded-xl overflow-hidden"
          style={{
            backgroundColor: '#0D1117',
            borderWidth: 1,
            borderColor: '#1E2530',
          }}
          onPress={toggleGoalEditor}
        >
          {/* Colored left accent bar */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: '#28EBFF',
              opacity: 0.6,
            }}
          />
          <View className="pl-5 pr-4 py-3 flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold" style={{ color: '#ECF9FF' }}>
                Daily Goal: {(dailyStepGoal ?? 0).toLocaleString()} steps
              </Text>
              {pendingDailyStepGoal !== null && (
                <Text className="text-xs mt-0.5" style={{ color: '#B8860B' }}>
                  Tomorrow: {pendingDailyStepGoal.toLocaleString()} steps
                </Text>
              )}
            </View>
            <Ionicons
              name={isOpen ? 'chevron-up' : 'create-outline'}
              size={18}
              color="#28EBFF"
            />
          </View>
        </Pressable>

        {/* Goal Editor (animated expand/collapse) */}
        <Animated.View
          style={[{ borderColor: '#1E2530', backgroundColor: '#141920', borderRadius: 12 }, editorAnimatedStyle]}
          onLayout={(e) => {
            editorYRef.current = e.nativeEvent.layout.y;
          }}
        >
          <Text className="text-xs mb-4" style={{ color: '#8899AA' }}>
            Goal changes take effect tomorrow
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {GOAL_PRESETS.map((preset) => {
              const isSelected = (pendingDailyStepGoal ?? dailyStepGoal) === preset;
              return (
                <Pressable
                  key={preset}
                  className="px-4 py-2 rounded-lg"
                  style={isSelected
                    ? { backgroundColor: '#28EBFF' }
                    : { backgroundColor: '#0D1117', borderWidth: 1, borderColor: '#1E2530' }
                  }
                  onPress={() => {
                    setDailyStepGoal(preset);
                    setCustomGoalText('');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: isSelected ? '#0D1117' : '#ECF9FF' }}
                  >
                    {preset.toLocaleString()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View className="flex-row items-center mt-4 gap-2">
            <TextInput
              className="flex-1 rounded-lg px-3 py-2 text-sm"
              style={{ backgroundColor: '#0D1117', color: '#ECF9FF', borderWidth: 1, borderColor: '#1E2530' }}
              placeholder="Custom goal..."
              placeholderTextColor="#8899AA"
              keyboardType="number-pad"
              value={customGoalText}
              onChangeText={setCustomGoalText}
              onFocus={() => {
                savedScrollY.current = currentScrollY.current;
                setTimeout(() => {
                  scrollRef.current?.scrollTo({
                    y: editorYRef.current - 60,
                    animated: true,
                  });
                }, 300);
              }}
              onBlur={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollTo({
                    y: savedScrollY.current,
                    animated: true,
                  });
                }, 100);
              }}
              onSubmitEditing={() => {
                const val = parseInt(customGoalText, 10);
                if (!isNaN(val) && val > 0) {
                  setDailyStepGoal(val);
                }
              }}
            />
            <Pressable
              className="rounded-lg px-4 py-2"
              style={{ backgroundColor: '#28EBFF' }}
              onPress={() => {
                const val = parseInt(customGoalText, 10);
                if (!isNaN(val) && val > 0) {
                  setDailyStepGoal(val);
                  setCustomGoalText('');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <Text className="text-sm font-semibold" style={{ color: '#0D1117' }}>
                Set
              </Text>
            </Pressable>
          </View>
          {pendingDailyStepGoal !== null && (
            <Pressable
              className="mt-4"
              onPress={() => {
                clearPendingGoal();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text className="text-xs text-center" style={{ color: '#8899AA' }}>
                Cancel pending change
              </Text>
            </Pressable>
          )}
        </Animated.View>

        {/* Stats Grid: 2x2 */}
        <View className="mx-4 mt-3 flex-row gap-3">
          <StatCard
            label="This Week"
            value={(stats.weekSteps ?? 0).toLocaleString()}
            sub={(() => {
              if (!stats.prevWeekSteps) return 'No previous week';
              const delta = (stats.weekSteps ?? 0) - stats.prevWeekSteps;
              const sign = delta >= 0 ? '+' : '';
              return `${sign}${delta.toLocaleString()} vs last week`;
            })()}
          />
          <StatCard
            label="This Month"
            value={(stats.monthSteps ?? 0).toLocaleString()}
            sub={`${(stats.monthAvg ?? 0).toLocaleString()} avg/day`}
          />
        </View>
        <View className="mx-4 mt-3 flex-row gap-3">
          <StatCard
            label="Best Day"
            value={stats.bestDay ? stats.bestDay.steps.toLocaleString() : '—'}
            sub={stats.bestDay ? stats.bestDay.date : 'No data yet'}
            valueColor="#28EBFF"
          />
          <StatCard
            label="Lifetime"
            value={(lifetimeSteps ?? 0).toLocaleString()}
            sub={`${stats.totalDaysActive ?? 0} days active`}
          />
        </View>

        {/* Step History Chart */}
        <View
          className="mx-4 mt-5 rounded-xl overflow-hidden"
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
              backgroundColor: '#28EBFF',
              opacity: 0.6,
            }}
          />
          <View className="pl-5 pr-4 py-3">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xs font-semibold" style={{ color: '#ECF9FF' }}>Step History</Text>
            <View className="flex-row rounded-lg overflow-hidden" style={{ backgroundColor: '#1E2530' }}>
              {TIME_SCALES.map((scale) => (
                <Pressable
                  key={scale}
                  className={`px-3 py-1.5 ${
                    timeScale === scale ? 'bg-primary' : ''
                  }`}
                  onPress={() => {
                    setTimeScale(scale);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      timeScale === scale
                        ? 'text-primary-content'
                        : 'text-neutral-content'
                    }`}
                  >
                    {scale}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <BarChart data={chartData} goalLine={chartGoalLine} />
          </View>
        </View>

        {/* Recent Days — only show if there's any step data */}
        {recentDays.some((d) => d.steps > 0) && <View
          className="mx-4 mt-5 rounded-xl overflow-hidden"
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
              backgroundColor: '#28EBFF',
              opacity: 0.6,
            }}
          />
          <View className="pl-5 pr-4 py-3">
          <Text className="text-xs font-semibold mb-3" style={{ color: '#ECF9FF' }}>
            Last 14 Days
          </Text>
          {recentDays.map((day, index) => {
            const isToday = day.date === todayDate;
            const effectiveGoal = isToday
              ? dailyStepGoal
              : (day.goalAtTime ?? dailyStepGoal);
            const metGoal =
              isToday ? stats.goalMet : goalMetSet.has(day.date);
            const isRestDay = !isToday && day.steps < effectiveGoal * 0.5;
            const barColor = isToday
              ? 'bg-primary'
              : metGoal
                ? 'bg-success'
                : 'bg-warning';
            const isExpanded = expandedDate === day.date;
            const pct = effectiveGoal > 0 ? Math.min(100, Math.round((day.steps / effectiveGoal) * 100)) : 0;
            const isLast = index === recentDays.length - 1;

            return (
              <Pressable
                key={day.date}
                className={`py-3 ${!isLast ? 'border-b border-base-content/10' : ''}`}
                onPress={() => {
                  setExpandedDate(isExpanded ? null : day.date);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                {/* Row 1: Day label + step count + chevron */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    {metGoal ? (
                      <View className="w-2.5 h-2.5 rounded-full bg-success mr-2" />
                    ) : (
                      <View className="w-2.5 mr-2" />
                    )}
                    <Text
                      className={`text-sm ${
                        isToday
                          ? 'text-primary font-semibold'
                          : 'text-base-content'
                      }`}
                    >
                      {getDayLabel(day.date, todayDate)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text
                      className={`text-sm font-mono mr-2 ${
                        isToday
                          ? 'text-primary font-semibold'
                          : metGoal
                            ? 'text-success'
                            : 'text-base-content'
                      }`}
                    >
                      {day.steps.toLocaleString()}
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                      size={14}
                      color="#71717A"
                    />
                  </View>
                </View>

                {/* Row 2: Progress bar or rest day quip */}
                {isRestDay ? (
                  <Text className="text-xs text-neutral-content/50 italic mt-2">
                    {getRestDayFlavor(day.date)}
                  </Text>
                ) : (
                  <View className="flex-row items-center mt-2">
                    <View className="flex-1 mr-2">
                      <ProgressBar
                        progress={day.steps / effectiveGoal}
                        color={barColor}
                        height="h-2.5"
                      />
                    </View>
                    <Text className="text-xs text-neutral-content w-10 text-right">
                      {pct}%
                    </Text>
                  </View>
                )}

                {/* Expanded detail */}
                {isExpanded && (
                  <View className="mt-2 pt-2 border-t border-base-300">
                    <Text className="text-xs text-base-content">
                      {day.steps.toLocaleString()} / {effectiveGoal.toLocaleString()} steps
                    </Text>
                    <Text className="text-xs text-neutral-content italic mt-1">
                      {metGoal
                        ? getGoalMetFlavor(day.date)
                        : day.steps >= effectiveGoal * 0.5
                          ? `${(effectiveGoal - day.steps).toLocaleString()} steps short`
                          : getRestDayFlavor(day.date)}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
          </View>
        </View>}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
}) {
  return (
    <View
      className="flex-1 rounded-xl p-4 items-center"
      style={{
        backgroundColor: '#0D1117',
        borderWidth: 1,
        borderColor: '#1E2530',
      }}
    >
      <Text className="text-xs" style={{ color: '#8899AA' }}>{label}</Text>
      <Text
        className="text-xl font-bold mt-1"
        style={{ color: valueColor ?? '#ECF9FF' }}
      >
        {value}
      </Text>
      <Text className="text-xs mt-1" style={{ color: '#8899AA' }}>{sub}</Text>
    </View>
  );
}
