import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Alert, Platform, StatusBar } from 'react-native';
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
      const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
      Alert.alert('Suporte', 'Abrindo WhatsApp...', [
        {
          text: 'OK',
          onPress: () => router.push(whatsappUrl)
        }
      ]);
    } else {
      router.push(card.route);
    }
  };

  const renderCard = (card) => {
    if (card.adminOnly && perfil !== 'admin') return null;
    
    return (
      <TouchableOpacity
        key={card.label}
        style={[
          styles.card,
          { backgroundColor: card.color },
          isMobile && styles.cardMobile
        ]}
        onPress={() => handleCardPress(card)}
        activeOpacity={0.8}
      >
        <Ionicons name={card.icon} size={32} color="white" />
        <Text style={styles.cardText}>{card.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* ✅ FAIXA PROTETORA: Protege ícones da câmera com cor da marca */}
      <View style={[
        styles.statusBarSpacer,
        { backgroundColor: corLojaSegura }
      ]} />

      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={[
          styles.header,
          { 
            backgroundColor: corLojaSegura,
            zIndex: 1000
          }
        ]}>
          <View style={styles.headerContent}>
            <Ionicons name="storefront-outline" size={32} color="white" />
            <Text style={styles.headerTitle}>
              {nomeLojaSeguro}
            </Text>
            <Text style={styles.headerSubtitle}>
              {perfil === 'admin' ? 'Painel Administrativo' : 'Painel de Vendas'}
            </Text>
          </View>
        </View>

        {/* Banner */}
        {bannerLojaAtual ? (
          <Image
            source={{ uri: bannerLojaAtual }}
            style={styles.banner}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.bannerPlaceholder, { backgroundColor: corLojaSegura }]}>
            <Ionicons name="image-outline" size={40} color="white" />
            <Text style={styles.bannerText}>Banner da Loja</Text>
          </View>
        )}

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="cart-outline" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>R$ {totalVendas.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Vendas Totais</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="storefront-outline" size={24} color="#2196F3" />
              <Text style={styles.statValue}>{totalItens}</Text>
              <Text style={styles.statLabel}>Lojas</Text>
            </View>
          </View>
        </View>

        {/* Cards de Ação */}
        <View style={styles.cardsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.cardsGrid}>
            {cards.map(renderCard)}
          </View>
        </View>

        {/* Loja Atual */}
        <View style={styles.currentStoreContainer}>
          <Text style={styles.sectionTitle}>Loja Atual</Text>
          <View style={styles.currentStore}>
            <Text style={styles.currentStoreText}>
              {nomeLojaSeguro}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  // ✅ FAIXA PROTETORA: Altura da StatusBar para proteger ícones
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
    width: '100%'
  },
  mainContainer: {
    flex: 1
  },
  header: {
    padding: 20,
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000
  },
  headerContent: {
    alignItems: 'center',
    gap: 10
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8
  },
  banner: {
    width: '100%',
    height: 150,
    backgroundColor: '#F0F0F0'
  },
  bannerPlaceholder: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  bannerText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600'
  },
  statsContainer: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  statsGrid: {
    flexDirection: 'row',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  cardsContainer: {
    padding: 20
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15
  },
  card: {
    width: '48%',
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  cardMobile: {
    width: '100%'
  },
  cardText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  currentStoreContainer: {
    padding: 20
  },
  currentStore: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  currentStoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  }
});
