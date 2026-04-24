import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { authService } from '@/src/services/authService';

export default function DebugAuthScreen() {
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('=== DEBUG AUTH SCREEN ===');
    console.log('Loading:', loading);
    console.log('IsAuthenticated:', isAuthenticated);
    console.log('User:', user);
    
    // Teste direto do serviço
    const testAuthService = async () => {
      try {
        console.log('Testando authService.getCurrentUser()...');
        const result = await authService.getCurrentUser();
        console.log('Resultado getCurrentUser:', result);
        
        if (result.user) {
          console.log('Testando authService.getProfile()...');
          const profile = await authService.getProfile(result.user.id);
          console.log('Resultado getProfile:', profile);
        }
      } catch (error) {
        console.error('Erro no teste:', error);
      }
    };
    
    testAuthService();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>DEBUG AUTH</Text>
      
      <Text>Loading: {loading ? 'SIM' : 'NÃO'}</Text>
      <Text>Authenticated: {isAuthenticated ? 'SIM' : 'NÃO'}</Text>
      
      {user ? (
        <View style={{ marginTop: 20 }}>
          <Text>User ID: {user.id}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Role: {user.role}</Text>
          <Text>Nome: {user.nome}</Text>
        </View>
      ) : (
        <Text style={{ marginTop: 20, color: 'red' }}>NENHUM USUÁRIO ENCONTRADO</Text>
      )}
      
      <Text style={{ marginTop: 30, fontSize: 12, textAlign: 'center' }}>
        Verifique o console do navegador para mais detalhes
      </Text>
    </View>
  );
}
