import { View, Text } from 'react-native';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { useJobStore } from '@/src/stores/useJobStore';
import { calculateBankCap } from '@/src/game/core/formulas';
import { ProgressBar } from '@/src/components/ui/ProgressBar';

export function StepBankDisplay() {
  const stepBank = usePlayerStore((s) => s.stepBank);
  const totalLevel = useJobStore((s) => s.getTotalLevel());
  const bankCap = calculateBankCap(totalLevel);
  const progress = bankCap > 0 ? stepBank / bankCap : 0;

  return (
    <View className="mx-4 mt-3 bg-base-200 rounded-xl p-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xs text-neutral-content">Step Bank</Text>
        <Text className="text-xs text-neutral-content">
          {stepBank.toLocaleString()} / {bankCap.toLocaleString()}
        </Text>
      </View>
      <ProgressBar progress={progress} color="bg-info" height="h-1.5" />
    </View>
  );
}
