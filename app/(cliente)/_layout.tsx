import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';

export default function ClienteLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // ou um loading spinner
  }

  if (!user || user.role !== 'cliente') {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Minha Loja' }} />
      <Stack.Screen name="produtos" options={{ title: 'Produtos' }} />
      <Stack.Screen name="carrinho" options={{ title: 'Carrinho' }} />
      <Stack.Screen name="pedidos" options={{ title: 'Meus Pedidos' }} />
      <Stack.Screen name="perfil" options={{ title: 'Meu Perfil' }} />
    </Stack>
  );
}
