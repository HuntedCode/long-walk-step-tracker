import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function SettingsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: '#191E24' },
          headerTintColor: '#ECF9FF',
        }}
      />
      <View className="flex-1 items-center justify-center bg-base-100">
        <Text className="text-xl font-semibold text-base-content">
          Settings
        </Text>
        <Text className="mt-2 text-sm text-neutral-content">
          Coming soon
        </Text>
      </View>
    </>
  );
}
