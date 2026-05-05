import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Dimensions, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { perfil, vendas, lojaAtual, lojas, bannerLojaAtual, produtos } = useApp();
  
  // 2. BLINDAGEM: Optional Chaining e fallbacks para evitar Type Errors
  const produtosSeguros = produtos || [];
  const vendasSeguras = vendas || [];
  const totalVendas = vendasSeguras.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  
  // ✅ CORREÇÃO: Formato de data compatível com mobile
  const getDataAtual = () => {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR');
  };
  
  const vendasHoje = vendasSeguras.filter(venda => venda.data === getDataAtual());
  const totalItens = (lojas || []).reduce((acc, curr) => acc + 1, 0);
  const corLojaSegura = lojaAtual?.cor || '#4CAF50';
  const nomeLojaSeguro = lojaAtual?.nome || 'Loja';
  
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;
  
  // ✅ CARDS MODULARES DO HUB CENTRAL
  const cardsModulares = [
    {
      id: 'estoque',
      title: 'Gestão de Estoque',
      icon: 'cube-outline',
      color: '#FF9800',
      route: '/catalogo',
      stats: {
        total: produtosSeguros.length,
        baixoEstoque: produtosSeguros.filter(p => (p.estoque || 0) < 5).length,
        categorias: [...new Set(produtosSeguros.map(p => p.categoria).filter(Boolean))].length
      },
      alertas: produtosSeguros.filter(p => (p.estoque || 0) < 3).length > 0 ? `${produtosSeguros.filter(p => (p.estoque || 0) < 3).length} críticos` : null
    },
    {
      id: 'vendas',
      title: 'Vendas do Dia',
      icon: 'cart-outline',
      color: '#4CAF50',
      route: '/vendas',
      stats: {
        total: totalVendas,
        hoje: vendasHoje.length,
        media: totalVendas > 0 ? totalVendas / (vendasSeguras.length || 1) : 0
      },
      alertas: vendasHoje.length === 0 ? 'Sem vendas hoje' : null
    },
    {
      id: 'config',
      title: 'Configurações',
      icon: 'settings-outline',
      color: '#607D8B',
      route: '/config',
      stats: {
        lojaAtiva: nomeLojaSeguro,
        perfil: perfil || 'admin',
        bannerConfigurado: !!bannerLojaAtual
      },
      alertas: !bannerLojaAtual ? 'Banner não configurado' : null
    },
    {
      id: 'suporte',
      title: 'Suporte Rápido',
      icon: 'logo-whatsapp',
      color: '#25D366',
      action: 'whatsapp',
      stats: {
        status: 'Online',
        resposta: 'Imediata'
      }
    }
  ];


  const handleCardPress = (card) => {
    if (card.action === 'whatsapp') {
      const message = 'Olá! Preciso de suporte com o Vendas App.';
      const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
      Alert.alert('Suporte', 'Abrindo WhatsApp...', [
        {
          text: 'OK',
          onPress: () => {
            // ✅ CORREÇÃO: Usar Linking para URLs externas no mobile
            Linking.openURL(whatsappUrl).catch(() => {
              console.log('Erro ao abrir WhatsApp');
            });
          }
        }
      ]);
    } else {
      router.push(card.route);
    }
  };

  // ✅ RENDERIZAÇÃO DE CARD MODULAR VISUAL
  const renderCardModular = (card) => {
    if (card.adminOnly && perfil !== 'admin') return null;
    
    const temAlerta = card.alertas;
    
    return (
      <TouchableOpacity
        key={card.id}
        style={[
          styles.cardModular,
          { backgroundColor: card.color },
          isMobile && styles.cardModularMobile
        ]}
        onPress={() => handleCardPress(card)}
        activeOpacity={0.8}
      >
        {/* Cabeçalho do Card */}
        <View style={styles.cardHeader}>
          <Ionicons name={card.icon} size={28} color="white" />
          {temAlerta && (
            <View style={styles.alertaBadge}>
              <Ionicons name="warning-outline" size={12} color="white" />
            </View>
          )}
        </View>
        
        {/* Título */}
        <Text style={styles.cardTitle}>{card.title}</Text>
        
        {/* Estatísticas */}
        <View style={styles.cardStats}>
          {card.id === 'estoque' && (
            <>
              <Text style={styles.cardStatValue}>{card.stats.total}</Text>
              <Text style={styles.cardStatLabel}>Produtos</Text>
              <Text style={styles.cardStatSmall}>{card.stats.baixoEstoque} com estoque baixo</Text>
            </>
          )}
          {card.id === 'vendas' && (
            <>
              <Text style={styles.cardStatValue}>R$ {card.stats.total.toFixed(2)}</Text>
              <Text style={styles.cardStatLabel}>Total em Vendas</Text>
              <Text style={styles.cardStatSmall}>{card.stats.hoje} vendas hoje</Text>
            </>
          )}
          {card.id === 'config' && (
            <>
              <Text style={styles.cardStatValue}>{card.stats.lojaAtiva}</Text>
              <Text style={styles.cardStatLabel}>Loja Ativa</Text>
              <Text style={styles.cardStatSmall}>Perfil: {card.stats.perfil}</Text>
            </>
          )}
          {card.id === 'suporte' && (
            <>
              <Text style={styles.cardStatValue}>24/7</Text>
              <Text style={styles.cardStatLabel}>Suporte</Text>
              <Text style={styles.cardStatSmall}>Resposta {card.stats.resposta}</Text>
            </>
          )}
        </View>
        
        {/* Alerta */}
        {temAlerta && (
          <View style={styles.cardAlerta}>
            <Ionicons name="alert-circle-outline" size={14} color="white" />
            <Text style={styles.cardAlertaText}>{card.alertas}</Text>
          </View>
        )}
        
        {/* Footer */}
        <View style={styles.cardFooter}>
          <Ionicons name="arrow-forward-outline" size={16} color="white" />
          <Text style={styles.cardFooterText}>Acessar</Text>
        </View>
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

        {/* ✅ CARDS MODULARES DO HUB CENTRAL */}
        <View style={styles.modularCardsContainer}>
          <Text style={styles.sectionTitle}>Centro de Controle</Text>
          <View style={styles.modularCardsGrid}>
            {cardsModulares.map(renderCardModular)}
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
  },
  // ✅ ESTILOS DOS CARDS MODULARES DO HUB CENTRAL
  modularCardsContainer: {
    padding: 20
  },
  modularCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15
  },
  cardModular: {
    width: '48%',
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    position: 'relative',
    minHeight: 160
  },
  cardModularMobile: {
    width: '100%',
    minHeight: 140,
    padding: 15
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  alertaBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center'
  },
  cardStats: {
    alignItems: 'center',
    marginBottom: 12
  },
  cardStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4
  },
  cardStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
    textAlign: 'center'
  },
  cardStatSmall: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center'
  },
  cardAlerta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    marginBottom: 12
  },
  cardAlertaText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600'
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)'
  },
  cardFooterText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600'
  }
});
