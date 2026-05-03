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
      <Tabs.Screen name="cart" options={{ title: 'Carrinho' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
