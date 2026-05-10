import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useApp } from '../../context/AppContext';
import Header from '../components/Header';

export default function ConfigScreen() {
  const router = useRouter();
  const { lojaAtual } = useApp();
  
  const nomeLoja = lojaAtual?.nome || 'Minha Loja';
  const corLoja = lojaAtual?.cor || '#4CAF50';

  // 📋 Cards de Configuração - Layout Moderno
  const configCards = [
    {
      id: 'loja',
      title: 'Loja',
      subtitle: 'Banner e identidade visual',
      icon: 'storefront-outline',
      color: '#4CAF50',
      onPress: () => router.push('/(tabs)/config/identidade-visual')
    },
    {
      id: 'catalogo',
      title: 'Gerenciar Catálogo',
      subtitle: 'Adicionar e editar produtos',
      icon: 'settings-outline',
      color: '#1976D2',
      onPress: () => router.push('/(tabs)/config/gestao-produtos')
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      subtitle: 'Vendas e faturamento',
      icon: 'stats-chart-outline',
      color: '#9C27B0',
      onPress: () => router.push('/(tabs)/config/relatorios')
    },
    {
      id: 'perfil',
      title: 'Perfil',
      subtitle: 'Dados do usuário e segurança',
      icon: 'person-outline',
      color: '#FF9800',
      onPress: () => router.push('/(tabs)/config/perfil')
    },
    {
      id: 'cadastros',
      title: 'Cadastros',
      subtitle: 'Admins e clientes',
      icon: 'people-outline',
      color: '#F44336',
      onPress: () => router.push('/(tabs)/config/cadastros')
    },
    {
      id: 'ajuda',
      title: 'Ajuda',
      subtitle: 'Suporte e documentação',
      icon: 'help-circle-outline',
      color: '#607D8B',
      onPress: () => Alert.alert('Ajuda', 'Funcionalidade de Ajuda - Em desenvolvimento')
    }
  ];

  const renderCard = (card) => (
    <TouchableOpacity
      key={card.id}
      style={styles.card}
      onPress={card.onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.cardIcon, { backgroundColor: card.color }]}>
        <Ionicons name={card.icon} size={28} color="white" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
      </View>
      <View style={styles.cardArrow}>
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header Principal */}
        <Header 
          title="Configurações"
          subtitle={nomeLoja}
          backgroundColor={corLoja}
        />
        
        {/* 📋 Grid de Cards - Layout Responsivo */}
        <View style={styles.cardsContainer}>
          {configCards.map(renderCard)}
        </View>

        {/* 📊 Cards de Informações Rápidas */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: corLoja }]}>
              <Ionicons name="information-circle-outline" size={24} color="white" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Painel de Configurações</Text>
              <Text style={styles.infoSubtitle}>
                Acesse todas as funcionalidades de gestão da sua loja.
                Clique nos cards para navegar entre as seções.
              </Text>
            </View>
          </View>
        </View>

        {/* 🧪 Botões de Teste */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <TouchableOpacity
            style={styles.testButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
            <Text style={styles.testButtonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: '#2196F3' }]}
            onPress={() => Alert.alert('Suporte', 'Central de ajuda em desenvolvimento!')}
          >
            <Ionicons name="help-circle-outline" size={20} color="white" />
            <Text style={styles.testButtonText}>Ajuda</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* 🚨 Botão de Emergência - Voltar */}
      <View style={styles.emergencyButtonContainer}>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={16} color="white" />
          <Text style={styles.emergencyButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  // 📋 Estilos dos Cards
  cardsContainer: {
    padding: 20,
    gap: 16
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    gap: 16
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContent: {
    flex: 1,
    alignItems: 'flex-start'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666'
  },
  cardArrow: {
    alignItems: 'center'
  },
  // 📊 Estilos de Informações
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 16
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoContent: {
    flex: 1
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  // 🧪 Estilos de Teste
  testSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 12
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  // 🚨 Botão de Emergência
  emergencyButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  }
});
