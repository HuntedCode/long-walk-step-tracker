import { ScrollView, View, Text, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePedometer } from '@/src/hooks/usePedometer';
import { useStepStore } from '@/src/stores/useStepStore';
import { useInventoryStore } from '@/src/stores/useInventoryStore';
import { itemDefinitions } from '@/src/data/items';
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

            <InventoryDebug />
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

function InventoryDebug() {
  const items = useInventoryStore((s) => s.items);
  const addItems = useInventoryStore((s) => s.addItems);
  const removeItems = useInventoryStore((s) => s.removeItems);

  return (
    <View className="mx-4 mt-4 mb-6 bg-base-300 rounded-xl p-4">
      <Text className="text-sm font-semibold text-warning text-center mb-3">
        Inventory Debug
      </Text>

      {/* Quick add buttons */}
      <Text className="text-xs font-semibold text-neutral-content mb-2">
        Add Items
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-3">
        {itemDefinitions.map((def) => (
          <Pressable
            key={def.id}
            className="px-2 py-1 rounded"
            style={{ backgroundColor: '#0D1117', borderWidth: 1, borderColor: '#1E2530' }}
            onPress={() => addItems([{ itemId: def.id, quantity: 1 }])}
          >
            <Text className="text-xs" style={{ color: '#ECF9FF' }}>
              + {def.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Add bulk */}
      <Pressable
        className="px-3 py-1.5 rounded-lg mb-3"
        style={{ backgroundColor: '#28EBFF' }}
        onPress={() =>
          addItems(
            itemDefinitions.map((def) => ({
              itemId: def.id,
              quantity: 5,
            })),
          )
        }
      >
        <Text className="text-xs font-semibold text-center" style={{ color: '#0D1117' }}>
          Add 5 of everything
        </Text>
      </Pressable>

      {/* Current inventory with remove buttons */}
      <Text className="text-xs font-semibold text-neutral-content mb-2">
        Current Inventory
      </Text>
      {Object.keys(items).length === 0 ? (
        <Text className="text-xs" style={{ color: '#5A6A7A' }}>
          Empty
        </Text>
      ) : (
        Object.entries(items).map(([itemId, qty]) => {
          const def = itemDefinitions.find((d) => d.id === itemId);
          return (
            <View key={itemId} className="flex-row justify-between items-center py-1">
              <Text className="text-xs text-base-content">
                {def?.name ?? itemId} x{qty}
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  className="px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#FF5B71' }}
                  onPress={() => removeItems(itemId, 1)}
                >
                  <Text className="text-xs font-semibold" style={{ color: '#0D1117' }}>
                    -1
                  </Text>
                </Pressable>
                <Pressable
                  className="px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#FF5B71' }}
                  onPress={() => removeItems(itemId, qty)}
                >
                  <Text className="text-xs font-semibold" style={{ color: '#0D1117' }}>
                    All
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
