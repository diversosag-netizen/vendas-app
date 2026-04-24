import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TestPage() {
  const router = useRouter();

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedText type="title" style={{ marginBottom: 30 }}>PÁGINA DE TESTE</ThemedText>
      
      <ThemedText style={{ marginBottom: 20 }}>Esta página funciona!</ThemedText>
      
      <TouchableOpacity 
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 10 }}
        onPress={() => router.push('/(admin)')}
      >
        <ThemedText style={{ color: 'white' }}>Ir para Dashboard Admin</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 10 }}
        onPress={() => router.push('/(cliente)')}
      >
        <ThemedText style={{ color: 'white' }}>Ir para Dashboard Cliente</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ backgroundColor: '#FF3B30', padding: 15, borderRadius: 8 }}
        onPress={() => router.push('/auth/login')}
      >
        <ThemedText style={{ color: 'white' }}>Voltar para Login</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
