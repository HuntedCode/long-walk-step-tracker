import { View, Text } from 'react-native';
import { usePlayerStore } from '@/src/stores/usePlayerStore';
import { useJobStore } from '@/src/stores/useJobStore';
import { calculateBankCap } from '@/src/game/core/formulas';

const ACCENT_COLOR = '#28EBFF';
const TEXT_COLOR = '#ECF9FF';
const DESC_COLOR = '#8899AA';

export function StepBankDisplay() {
  const stepBank = usePlayerStore((s) => s.stepBank);
  const totalLevel = useJobStore((s) => s.getTotalLevel());
  const bankCap = calculateBankCap(totalLevel);
  const progress = bankCap > 0 ? stepBank / bankCap : 0;

  return (
    <View
      className="mx-4 mb-3 rounded-xl overflow-hidden"
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
          backgroundColor: ACCENT_COLOR,
          opacity: 0.6,
        }}
      />

      <View className="pl-5 pr-4 py-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs font-semibold" style={{ color: TEXT_COLOR }}>
            Step Bank
          </Text>
          <Text className="text-xs" style={{ color: DESC_COLOR }}>
            {stepBank.toLocaleString()} / {bankCap.toLocaleString()}
          </Text>
        </View>

        {/* Progress bar */}
        <View
          className="rounded-full overflow-hidden"
          style={{ height: 4, backgroundColor: '#1E2530' }}
        >
          <View
            style={{
              height: 4,
              width: `${Math.round(progress * 100)}%`,
              backgroundColor: ACCENT_COLOR,
              borderRadius: 4,
            }}
          />
        </View>
      </View>
    </View>
  );
}
