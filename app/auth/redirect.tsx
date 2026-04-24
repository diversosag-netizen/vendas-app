import { useAuth } from '@/src/context/AuthContext';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

export default function AuthRedirect() {
  const { user, loading } = useAuth();

  // Mostrar tela vazia durante loading para evitar loop
  if (loading) {
    return <View style={{ flex: 1 }} />;
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  // Redirecionamento baseado no role - imediato
  if (user.role === 'admin') {
    return <Redirect href="/(admin)" />;
  } else if (user.role === 'cliente') {
    return <Redirect href="/(cliente)" />;
  }

  // Fallback para login
  return <Redirect href="/auth/login" />;
}
