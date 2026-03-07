import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { zoneDefinitions, zoneDefinitionMap } from '@/src/data/zones';
import { activityDefinitions } from '@/src/data/activities';
import { jobDefinitionMap } from '@/src/data/jobs';
import { isZoneUnlocked, startTravel } from '@/src/game/zones/zone-engine';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { useJobStore } from '@/src/stores/useJobStore';
import { ZoneListCard } from '@/src/components/map/ZoneListCard';
import type { ZoneCardState, JobChip } from '@/src/components/map/ZoneListCard';

const JOB_ICONS: Record<string, { icon: string; iconLibrary: 'Ionicons' | 'MaterialCommunityIcons' }> = {
  woodcutting: { icon: 'axe', iconLibrary: 'MaterialCommunityIcons' },
  fishing: { icon: 'fish-outline', iconLibrary: 'Ionicons' },
  mining: { icon: 'pickaxe', iconLibrary: 'MaterialCommunityIcons' },
};

export default function MapScreen() {
  const currentZoneId = usePlayerStore((s) => s.currentZoneId);
  const travel = usePlayerStore((s) => s.travel);
  const setTravel = usePlayerStore((s) => s.startTravel);
  const totalLevel = useJobStore((s) => s.getTotalLevel());
  const jobs = useJobStore((s) => s.jobs);

  const currentZone = zoneDefinitionMap[currentZoneId];

  const travelProgress = travel
    ? travel.stepsProgress / travel.stepsRequired
    : 0;

  function handleTravel(destinationZoneId: string) {
    if (!currentZone) return;
    const travelState = startTravel(currentZone, destinationZoneId);
    if (travelState) setTravel(travelState);
  }

  function resolveState(zoneId: string): ZoneCardState {
    if (zoneId === currentZoneId) return 'current';
    if (travel?.destinationZoneId === zoneId) return 'traveling';
    const zone = zoneDefinitionMap[zoneId];
    if (!zone || !isZoneUnlocked(zone, totalLevel)) return 'locked';
    return 'available';
  }

  /** Steps required to reach a given zone from the current zone. */
  function stepsTo(zoneId: string): number | undefined {
    return currentZone?.connections.find((c) => c.targetZoneId === zoneId)?.stepsRequired;
  }

  function getJobChip(zoneId: string): JobChip | undefined {
    const zoneActivities = activityDefinitions.filter((a) => a.zoneId === zoneId);
    if (zoneActivities.length === 0) return undefined;
    const jobId = zoneActivities[0].jobId;
    const jobName = jobDefinitionMap[jobId]?.name ?? jobId;
    const qualified = zoneActivities.some((a) =>
      a.requirements.every((r) => (jobs[r.jobId]?.level ?? 1) >= r.level)
    );
    const iconDef = JOB_ICONS[jobId] ?? { icon: 'ellipse-outline', iconLibrary: 'Ionicons' as const };
    return { jobName, ...iconDef, qualified };
  }

  return (
    <SafeAreaView className="flex-1 bg-base-100" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xs font-semibold text-neutral-content mx-4 mb-4 tracking-widest">
          ZONES
        </Text>

        {zoneDefinitions.map((zone) => {
          const state = resolveState(zone.id);
          return (
            <ZoneListCard
              key={zone.id}
              zone={zone}
              state={state}
              stepsRequired={stepsTo(zone.id)}
              travelProgress={state === 'traveling' ? travelProgress : undefined}
              jobChip={getJobChip(zone.id)}
              onTravel={handleTravel}
            />
          );
        })}

        {travel && (
          <View className="mx-4 mt-2">
            <Text className="text-xs text-neutral-content text-center">
              Traveling · switch to another activity to cancel
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
