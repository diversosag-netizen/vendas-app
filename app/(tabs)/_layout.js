import { Tabs } from 'expo-router';
import { useApp } from '../context/AppContext';

// ✅ FLAG DE SEGURANÇA: Controlar exibição da barra inferior
const EXIBIR_BARRA_INFERIOR = false; // Mudar para true se precisar reativar

export default function TabLayout() {
  const { isAuthenticated, userRole } = useApp();
  
  // 🔐 VENDAS 3.2: Guard de Proteção - Bloqueio de Rota Config
  // Se não estiver autenticado como admin, remove acesso à Config
  
  if (!isAuthenticated || userRole !== 'admin') {
    return (
      <Tabs 
        screenOptions={{ 
          headerShown: false,
          tabBarStyle: { display: 'none' },
          tabBar: () => null
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ title: 'Início' }}
        />
        <Tabs.Screen 
          name="catalogo" 
          options={{ title: 'Catálogo' }}
        />
        <Tabs.Screen 
          name="promocoes" 
          options={{ title: 'Promoções' }}
        />
        <Tabs.Screen 
          name="pagamento" 
          options={{ title: 'Pagamento' }}
        />
        <Tabs.Screen 
          name="recibo" 
          options={{ title: 'Recibo' }}
        />
        <Tabs.Screen 
          name="vendas" 
          options={{ title: 'Vendas' }}
        />
        {/* Config bloqueado - acesso apenas via login-admin */}
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
      <Tabs.Screen name="promocoes" options={{ title: 'Promoções' }} />
      <Tabs.Screen name="pagamento" options={{ title: 'Pagamento' }} />
      <Tabs.Screen name="recibo" options={{ title: 'Recibo' }} />
      <Tabs.Screen name="vendas" options={{ title: 'Vendas' }} />
      <Tabs.Screen name="config/index" options={{ title: 'Config' }} />
    </Tabs>
  );
}
