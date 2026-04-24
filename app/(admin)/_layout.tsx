import { useAuth } from '@/src/context/AuthContext';
import { Redirect, Stack } from 'expo-router';

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // ou um loading spinner
  }

  if (!user || user.role !== 'admin') {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Painel Admin' }} />
      <Stack.Screen name="produtos" options={{ title: 'Gerenciar Produtos' }} />
      <Stack.Screen name="usuarios" options={{ title: 'Gerenciar Usuários' }} />
      <Stack.Screen name="relatorios" options={{ title: 'Relatórios' }} />
    </Stack>
  );
}
