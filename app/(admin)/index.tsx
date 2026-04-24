import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair do sistema?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: () => logout() }
      ]
    );
  };

  const handleNavigation = (route: string) => {
    console.log(`Navegando para: ${route}`);
    // Usar rotas existentes ou mostrar alerta informativo
    Alert.alert('Navegação', `Funcionalidade ${route} em desenvolvimento!`);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Painel Administrativo</ThemedText>
        <ThemedText>Bem-vindo, {user?.nome || 'Administrador'}!</ThemedText>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutText}>Sair</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText type="subtitle">Total de Produtos</ThemedText>
          <ThemedText style={styles.statNumber}>24</ThemedText>
        </View>
        
        <View style={styles.statCard}>
          <ThemedText type="subtitle">Total de Vendas</ThemedText>
          <ThemedText style={styles.statNumber}>156</ThemedText>
        </View>
        
        <View style={styles.statCard}>
          <ThemedText type="subtitle">Usuários Ativos</ThemedText>
          <ThemedText style={styles.statNumber}>89</ThemedText>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <ThemedText type="subtitle">Ações Rápidas</ThemedText>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigation('/(admin)/products')}>
            <ThemedText>Gerenciar Produtos</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigation('/(admin)/reports')}>
            <ThemedText>Ver Relatórios</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigation('/(admin)/users')}>
            <ThemedText>Gerenciar Usuários</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  actionsContainer: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
