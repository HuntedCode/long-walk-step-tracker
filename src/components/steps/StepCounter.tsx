import { View, Text } from 'react-native';

interface StepCounterProps {
  todaySteps: number;
  lifetimeSteps: number;
  isTracking: boolean;
  error: string | null;
  onRequestPermission?: () => void;
}

export function StepCounter({
  todaySteps,
  lifetimeSteps,
  isTracking,
  error,
  onRequestPermission,
}: StepCounterProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-6xl font-bold text-primary">
        {todaySteps.toLocaleString()}
      </Text>
      <Text className="mt-2 text-lg text-neutral-content">
        steps today
      </Text>

      <View className="mt-6 flex-row items-center">
        <View
          className={`h-3 w-3 rounded-full mr-2 ${
            isTracking ? 'bg-success' : 'bg-error'
          }`}
        />
        <Text className="text-sm text-neutral-content">
          {isTracking ? 'Tracking active' : 'Not tracking'}
        </Text>
      </View>

      {error ? (
        <View className="mt-4 bg-base-300 rounded-lg p-4 mx-4">
          <Text className="text-sm text-warning text-center">
            {error}
          </Text>
          {onRequestPermission ? (
            <Text
              className="text-sm text-primary text-center mt-2 underline"
              onPress={onRequestPermission}
            >
              Grant Permission
            </Text>
          ) : null}
        </View>
      ) : null}

      <View className="mt-8 bg-base-200 rounded-xl p-4 w-full">
        <Text className="text-sm text-neutral-content text-center">
          Lifetime Steps
        </Text>
        <Text className="text-2xl font-semibold text-base-content text-center mt-1">
          {lifetimeSteps.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}
