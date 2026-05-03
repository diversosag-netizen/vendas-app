import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { perfil, togglePerfil, vendas, lojaAtual, lojas, trocarLoja, bannerLojaAtual } = useApp();
  
  const cards = [
    { label: 'Nova Venda', icon: 'cart-outline', color: '#4CAF50', route: '/catalogo', adminOnly: false },
    { label: 'Estoque', icon: 'list-outline', color: '#2196F3', route: '/estoque', adminOnly: true },
    { label: 'Clientes', icon: 'people-outline', color: '#FF9800', route: '/clientes', adminOnly: true },
    { label: 'Relatórios', icon: 'stats-chart-outline', color: '#9C27B0', route: '/relatorios', adminOnly: true },
    { label: 'Configurações', icon: 'settings-outline', color: '#607D8B', route: '/config', adminOnly: true },
    { label: 'Suporte', icon: 'logo-whatsapp', color: '#25D366', action: 'whatsapp', adminOnly: false },
  ];

  // 2. BLINDAGEM: Optional Chaining e fallbacks para evitar Type Errors
  const totalVendas = (vendas || []).reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const totalItens = (lojas || []).reduce((acc, curr) => acc + 1, 0);
  const corLojaSegura = lojaAtual?.cor || '#4CAF50';
  const nomeLojaSeguro = lojaAtual?.nome || 'Loja';

  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  const handleCardPress = (card) => {
    if (card.action === 'whatsapp') {
      const message = 'Olá! Preciso de suporte com o Vendas App.';
      const url = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      } else {
        Alert.alert('WhatsApp', 'Para abrir o WhatsApp, acesse pelo navegador.');
      }
    } else if (card.route) {
      router.push(card.route);
    }
  };

  const filteredCards = cards.filter(card => !card.adminOnly || perfil === 'admin');

  return (
    <ScrollView style={styles.container}>
      {/* Header com Banner */}
      {bannerLojaAtual ? (
        <Image 
          source={{ uri: bannerLojaAtual }} 
          style={[styles.bannerImage, { width: screenWidth, height: 150 }]} 
          resizeMode="cover" 
        />
      ) : (
        <View style={[styles.header, { backgroundColor: corLojaSegura }]}>
          <View style={styles.headerContent}>
            <Ionicons name="storefront-outline" size={32} color="white" />
            <Text style={styles.headerTitle}>
              {nomeLojaSeguro}
            </Text>
          </View>
        </View>
      )}

      {/* Cards de Ação */}
      <View style={styles.cardsContainer}>
        <Text style={styles.sectionTitle}>Painel de Controle</Text>
        <View style={styles.cardsGrid}>
          {filteredCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: card.color }]}
              onPress={() => handleCardPress(card)}
              activeOpacity={0.8}
            >
              <Ionicons name={card.icon} size={32} color="white" />
              <Text style={styles.cardLabel}>{card.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="cart-outline" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>R$ {totalVendas.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total de Vendas</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="storefront-outline" size={24} color="#2196F3" />
            <Text style={styles.statValue}>{totalItens}</Text>
            <Text style={styles.statLabel}>Lojas Ativas</Text>
          </View>
        </View>
      </View>

      {/* Perfil e Troca de Loja */}
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.profileTitle}>Perfil: {perfil === 'admin' ? 'Administrador' : 'Cliente'}</Text>
        </View>
        
        {/* Troca de Loja */}
        <View style={styles.storeSelector}>
          <Text style={styles.storeSelectorTitle}>Loja Atual:</Text>
          <View style={styles.currentStore}>
            <Text style={styles.currentStoreText}>
              {nomeLojaSeguro}
            </Text>
          </View>
          <View style={styles.storeButtons}>
            {lojas?.map((loja) => (
              <TouchableOpacity
                key={loja.id}
                style={[
                  styles.storeButton,
                  { backgroundColor: loja.cor },
                  lojaAtual?.id === loja.id && styles.storeButtonActive
                ]}
                onPress={() => trocarLoja && trocarLoja(loja.id)}
              >
                <Text style={styles.storeButtonText}>{loja.nome.split(' ')[0]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botão de Troca de Perfil */}
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={togglePerfil}
        >
          <Ionicons name="swap-horizontal" size={20} color="white" />
          <Text style={styles.toggleButtonText}>
            Trocar para {perfil === 'admin' ? 'Cliente' : 'Admin'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  headerContent: {
    alignItems: 'center',
    gap: 10
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  bannerImage: {
    height: 150,
    backgroundColor: '#F0F0F0'
  },
  cardsContainer: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15
  },
  card: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  cardLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8
  },
  statsContainer: {
    padding: 20
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4
  },
  profileContainer: {
    padding: 20
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  storeSelector: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  storeSelectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  currentStore: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15
  },
  currentStoreText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  storeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  storeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  storeButtonActive: {
    borderWidth: 2,
    borderColor: '#333'
  },
  storeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  }
});
