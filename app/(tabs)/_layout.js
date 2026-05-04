import { Tabs } from 'expo-router';
import CustomTabBar from './components/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBar: (props) => <CustomTabBar {...props} />
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="catalogo" options={{ title: 'Catálogo' }} />
      <Tabs.Screen name="vendas" options={{ title: 'Vendas' }} />
      <Tabs.Screen name="config/index" options={{ title: 'Config' }} />
    </Tabs>
  );
}
