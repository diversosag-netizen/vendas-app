import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Admin' }} />
      <Tabs.Screen name="cliente" options={{ title: 'Cliente' }} />
    </Tabs>
  );
}
