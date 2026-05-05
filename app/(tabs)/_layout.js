import { Tabs } from 'expo-router';
import { useApp } from '../context/AppContext';

// ✅ FLAG DE SEGURANÇA: Controlar exibição da barra inferior
const EXIBIR_BARRA_INFERIOR = false; // Mudar para true se precisar reativar

export default function TabLayout() {
  const { isAuthenticated, userRole } = useApp();
  
  // 🔐 VENDAS 3.0: Route Guard - Proteção Apenas para Config (Vitrines Abertas)
  // Permitir acesso livre ao Dashboard e Catálogo
  // Bloquear apenas área administrativa
  
  // Se tentar acessar config sem ser admin, redirecionar para login-admin
  if (userRole !== 'admin') {
    return (
      <Tabs 
        screenOptions={{ 
          headerShown: false,
          tabBarStyle: { display: 'none' },
          tabBar: () => null
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Início' }} />
        <Tabs.Screen name="catalogo" options={{ title: 'Catálogo' }} />
        <Tabs.Screen name="vendas" options={{ title: 'Vendas' }} />
        {/* Config removido - acesso via gatilho específico */}
      </Tabs>
    );
  }
  
  // Comportamento original (fallback seguro) - SEM BARRA INFERIOR
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { display: 'none' },
        tabBar: () => null
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="catalogo" options={{ title: 'Catálogo' }} />
      <Tabs.Screen name="vendas" options={{ title: 'Vendas' }} />
      <Tabs.Screen name="config/index" options={{ title: 'Config' }} />
    </Tabs>
  );
}
