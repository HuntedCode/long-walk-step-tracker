import { ScrollView, View, Text, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePedometer } from '@/src/hooks/usePedometer';
import { useStepStore } from '@/src/stores/useStepStore';
import { StepCounter } from '@/src/components/steps/StepCounter';
import { StepSimulator } from '@/src/components/steps/StepSimulator';
import { StepBankDisplay } from '@/src/components/game/StepBankDisplay';
import { ZoneCard } from '@/src/components/game/ZoneCard';
import { ActivityCard } from '@/src/components/game/ActivityCard';
import { ZonePicker } from '@/src/components/game/ZonePicker';
import { ActivityPicker } from '@/src/components/game/ActivityPicker';

export default function DashboardScreen() {
  const {
    isAvailable,
    permissionStatus,
    isTracking,
    error,
    backfillDebug,
    requestPermission,
  } = usePedometer();
  const todaySteps = useStepStore((s) => s.todaySteps);
  const lifetimeSteps = useStepStore((s) => s.lifetimeSteps);
  const todayDate = useStepStore((s) => s.todayDate);
  const lastUpdated = useStepStore((s) => s.lastUpdated);

  return (
    <SafeAreaView className="flex-1 bg-base-100" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xs font-semibold text-neutral-content mx-4 mb-4 tracking-widest">
          STEPS
        </Text>

        <StepCounter
          todaySteps={todaySteps}
          lifetimeSteps={lifetimeSteps}
          isTracking={isTracking}
          error={error}
          onRequestPermission={requestPermission}
        />

        <StepBankDisplay />
        <ZoneCard />
        <ActivityCard />
        <ZonePicker />
        <ActivityPicker />

        {__DEV__ ? (
          <>
            <StepSimulator />

            <View className="mx-4 mt-4 mb-6 bg-base-300 rounded-xl p-4">
              <Text className="text-sm font-semibold text-warning text-center mb-3">
                Debug Info
              </Text>

              <DebugRow label="Platform" value={Platform.OS} />
              <DebugRow label="Pedometer available" value={String(isAvailable)} />
              <DebugRow label="Permission" value={permissionStatus} />
              <DebugRow label="Tracking" value={String(isTracking)} />
              <DebugRow label="Today date" value={todayDate} />
              <DebugRow label="Last updated" value={lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'never'} />

              <Text className="text-xs font-semibold text-neutral-content mt-3 mb-1">
                Backfill
              </Text>
              <DebugRow label="Last attempt" value={backfillDebug.lastAttempt ?? 'none'} />
              <DebugRow label="Steps returned" value={String(backfillDebug.stepsReturned ?? '—')} />
              {backfillDebug.error ? (
                <DebugRow label="Error" value={backfillDebug.error} />
              ) : null}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function DebugRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-0.5">
      <Text className="text-xs text-neutral-content">{label}</Text>
      <Text className="text-xs text-base-content font-mono">{value}</Text>
    </View>
  );
}
