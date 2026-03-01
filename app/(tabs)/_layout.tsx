import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#28EBFF',
        tabBarInactiveTintColor: '#E4E4E7',
        tabBarStyle: {
          backgroundColor: '#191E24',
          borderTopColor: '#15191E',
        },
        headerStyle: {
          backgroundColor: '#191E24',
        },
        headerTintColor: '#ECF9FF',
        headerShown: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="skills" options={{ title: 'Skills' }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
