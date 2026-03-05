import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useStepStore } from '@/src/stores/useStepStore';

const PRESET_AMOUNTS = [10, 100, 500, 1000] as const;
const STREAK_PRESETS = [0, 3, 7, 14, 30, 100] as const;
const MAX_CUSTOM_STEPS = 1_000_000;

export function StepSimulator() {
  const [customAmount, setCustomAmount] = useState('');
  const addSteps = useStepStore((s) => s.addSteps);
  const removeSteps = useStepStore((s) => s.removeSteps);
  const debugSetStreak = useStepStore((s) => s.debugSetStreak);

  const parseCustomAmount = (): number | null => {
    const parsed = parseInt(customAmount, 10);
    return !isNaN(parsed) && parsed > 0 && parsed <= MAX_CUSTOM_STEPS ? parsed : null;
  };

  const handleAddCustom = () => {
    const amount = parseCustomAmount();
    if (amount) { addSteps(amount); setCustomAmount(''); }
  };

  const handleRemoveCustom = () => {
    const amount = parseCustomAmount();
    if (amount) { removeSteps(amount); setCustomAmount(''); }
  };

  return (
    <View className="mx-4 mt-4 mb-6 bg-base-300 rounded-xl p-4">
      <Text className="text-sm font-semibold text-accent text-center mb-3">
        Step Simulator (Dev Mode)
      </Text>

      <View className="flex-row justify-center gap-2 mb-2">
        {PRESET_AMOUNTS.map((amount) => (
          <Pressable
            key={amount}
            onPress={() => addSteps(amount)}
            className="bg-secondary/20 rounded-lg px-3 py-2"
          >
            <Text className="text-sm font-medium text-secondary">
              +{amount}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-row justify-center gap-2 mb-3">
        {PRESET_AMOUNTS.map((amount) => (
          <Pressable
            key={amount}
            onPress={() => removeSteps(amount)}
            className="bg-error/20 rounded-lg px-3 py-2"
          >
            <Text className="text-sm font-medium text-error">
              -{amount}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-row items-center gap-2">
        <TextInput
          className="flex-1 bg-base-200 rounded-lg px-3 py-2 text-base-content border border-base-100"
          value={customAmount}
          onChangeText={setCustomAmount}
          placeholder="Custom steps"
          placeholderTextColor="#E4E4E7"
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={handleAddCustom}
        />
        <Pressable
          onPress={handleAddCustom}
          className="bg-accent rounded-lg px-4 py-2"
        >
          <Text className="text-sm font-medium text-accent-content">Add</Text>
        </Pressable>
        <Pressable
          onPress={handleRemoveCustom}
          className="bg-error rounded-lg px-4 py-2"
        >
          <Text className="text-sm font-medium text-error-content">Sub</Text>
        </Pressable>
      </View>

      <Text className="text-xs font-semibold text-info text-center mt-4 mb-2">
        Set Streak (days)
      </Text>
      <View className="flex-row justify-center gap-2">
        {STREAK_PRESETS.map((days) => (
          <Pressable
            key={days}
            onPress={() => debugSetStreak(days)}
            className="bg-info/20 rounded-lg px-3 py-2"
          >
            <Text className="text-sm font-medium text-info">
              {days}d
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
