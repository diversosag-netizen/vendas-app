import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { perfil, vendas, lojaAtual, lojas, bannerLojaAtual, produtos, userRole, isAuthenticated, setLojaAtiva, logout, temaAtual } = useApp();
  
  // Versão simplificada para testar no mobile
  const produtosSeguros = produtos || [];
  const vendasSeguras = vendas || [];
  const totalVendas = vendasSeguras.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const corLojaSegura = lojaAtual?.cor || '#4CAF50';
  const nomeLojaSeguro = lojaAtual?.nome || 'Loja';
  
  // 🔐 VENDAS 3.0: Gatilho para área administrativa
  const handleConfigAccess = () => {
    if (userRole === 'admin') {
      router.push('/(tabs)/config');
    } else {
      // Criar tela de login específica para admin
      router.push('/login-admin');
    }
  };

  // 🏪 VENDAS 3.2: Botão para voltar ao lobby (escolher outra loja)
  const handleBackToLobby = () => {
    // Resetar loja ativa para padrão
    setLojaAtiva('1');
    // Voltar para lobby
    router.replace('/lobby');
  };

  // 🔐 VENDAS 3.2: Fluxo de saída administrativa
  const handleAdminLogout = () => {
    // Limpar estado de admin
    logout();
    // Voltar para lobby
    router.replace('/lobby');
  };
  
  // Cards dinâmicos baseados no tema da loja atual
  const cardsSimples = [
    {
      id: 'catalogo',
      title: 'Catálogo',
      icon: 'storefront-outline',
      color: temaAtual?.primary || '#FF9800',
      route: '/catalogo'
    },
    {
      id: 'promocoes',
      title: 'Promoções',
      icon: 'flash-outline',
      color: temaAtual?.secondary || '#FF9800',
      route: '/promocoes'
    },
    {
      id: 'vendas',
      title: 'Vendas',
      icon: 'cart-outline',
      color: temaAtual?.accent || '#4CAF50',
      route: '/vendas'
    },
    {
      id: 'config',
      title: 'Config',
      icon: 'settings-outline',
      color: temaAtual?.text || '#607D8B',
      action: handleConfigAccess // Gatilho especial
    }
  ];

  const handleCardPress = (card) => {
    if (card.action) {
      card.action(); // Gatilho especial para config
    } else {
      router.push(card.route); // Rotas normais
    }
  };

  const renderCardSimples = (card) => (
    <TouchableOpacity
      key={card.id}
      style={[
        styles.cardSimples,
        { backgroundColor: card.color }
      ]}
      onPress={() => handleCardPress(card)}
      activeOpacity={0.8}
    >
      <Ionicons name={card.icon} size={32} color="white" />
      <Text style={styles.cardSimplesText}>{card.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={[
        styles.statusBarSpacer,
        { backgroundColor: corLojaSegura }
      ]} />

      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={[
          styles.header,
          { backgroundColor: corLojaSegura }
        ]}>
          <Text style={styles.headerTitle}>{nomeLojaSeguro}</Text>
          <Text style={styles.headerSubtitle}>Dashboard</Text>
        </View>

        {/* Cards Simples - Vitrine Aberta */}
        <View style={styles.cardsContainer}>
          <Text style={styles.sectionTitle}>Menu Rápido</Text>
          <View style={styles.cardsGrid}>
            {cardsSimples.map(renderCardSimples)}
          </View>
        </View>

        {/* 🔐 VENDAS 3.2: Estatísticas - Apenas para Admins */}
        {userRole === 'admin' && (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Estatísticas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>R$ {totalVendas.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Vendas Totais</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{produtosSeguros.length}</Text>
                <Text style={styles.statLabel}>Produtos</Text>
              </View>
            </View>
          </View>
        )}

        {/* 🛒 VENDAS 3.2: Indicador para Clientes */}
        {userRole !== 'admin' && (
          <View style={styles.customerInfoContainer}>
            <Text style={styles.sectionTitle}>Bem-vindo à Loja</Text>
            <View style={styles.customerInfoCard}>
              <Ionicons name="home-outline" size={40} color="#4CAF50" />
              <Text style={styles.customerInfoTitle}>Modo Visitante</Text>
              <Text style={styles.customerInfoSubtitle}>
                Navegue pelo catálogo e faça suas compras. Para acessar as ferramentas de gestão, 
                clique em "Config" e faça login como administrador.
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* 🏪 Botão Flutuante para Voltar ao Lobby */}
      <TouchableOpacity
        style={styles.backToLobbyButton}
        onPress={handleBackToLobby}
        activeOpacity={0.8}
      >
        <Ionicons name="storefront-outline" size={20} color="white" />
        <Text style={styles.backToLobbyButtonText}>Trocar Loja</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
    width: '100%'
  },
  mainContainer: {
    flex: 1
  },
  header: {
    padding: 20,
    alignItems: 'center'
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
  cardsContainer: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  cardsGrid: {
    flexDirection: 'column',
    gap: 15
  },
  cardSimples: {
    height: 80,
    width: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15
  },
  cardSimplesText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  statsContainer: {
    padding: 20
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
    alignItems: 'center'
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  backToLobbyButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000
  },
  backToLobbyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  customerInfoContainer: {
    padding: 20
  },
  customerInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  customerInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8
  },
  customerInfoSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20
  }
});
