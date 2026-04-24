import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ClienteHome() {
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

  const handleCategoryPress = (category: string) => {
    console.log(`Categoria selecionada: ${category}`);
    Alert.alert('Categoria', `Você selecionou: ${category}`);
  };

  const handleActionPress = (action: string) => {
    console.log(`Ação selecionada: ${action}`);
    // Mostrar informações funcionais enquanto as páginas não existem
    Alert.alert('Funcionalidade', `${action} - Em desenvolvimento!`);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <ThemedText type="title">Minha Loja</ThemedText>
          <ThemedText>Bem-vindo, {user?.nome || 'Cliente'}!</ThemedText>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <ThemedText style={styles.logoutText}>Sair</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoriesContainer}>
          <ThemedText type="subtitle">Categorias</ThemedText>
          <View style={styles.categoryGrid}>
            <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress('Eletrônicos')}>
              <ThemedText>Eletrônicos</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress('Roupas')}>
              <ThemedText>Roupas</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress('Alimentos')}>
              <ThemedText>Alimentos</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress('Móveis')}>
              <ThemedText>Móveis</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.promotionsContainer}>
          <ThemedText type="subtitle">Promoções do Dia</ThemedText>
          <View style={styles.promotionCard}>
            <ThemedText style={styles.promotionTitle}>Super Oferta!</ThemedText>
            <ThemedText>20% OFF em eletrônicos</ThemedText>
            <TouchableOpacity style={styles.promotionButton} onPress={() => handleActionPress('Ver Ofertas')}>
              <ThemedText style={styles.buttonText}>Ver Ofertas</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.quickActions}>
          <ThemedText type="subtitle">Ações Rápidas</ThemedText>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleActionPress('Ver Produtos')}>
              <ThemedText>Ver Produtos</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleActionPress('Meu Carrinho')}>
              <ThemedText>Meu Carrinho</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleActionPress('Meus Pedidos')}>
              <ThemedText>Meus Pedidos</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleActionPress('Meu Perfil')}>
              <ThemedText>Meu Perfil</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  promotionsContainer: {
    marginBottom: 30,
  },
  promotionCard: {
    backgroundColor: '#FFE5E5',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promotionButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  quickActions: {
    marginBottom: 30,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 10,
  },
  actionButton: {
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
