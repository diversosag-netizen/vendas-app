import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import Header from './components/Header';

export default function PromocoesScreen() {
  const router = useRouter();
  const { produtos, lojaAtual, bannerLojaAtual, adicionarAoCarrinho, userRole } = useApp();
  const [isMobile] = useState(Platform.OS !== 'web');
  
  const screenWidth = Dimensions.get('window').width;
  const bannerHeight = 120;

  // 🎯 VENDAS 3.2: Produtos em promoção (simulados)
  const produtosSeguros = produtos || [];
  const produtosPromocao = produtosSeguros.map(produto => ({
    ...produto,
    precoPromocional: produto.preco_medio * 0.8, // 20% de desconto
    desconto: 20,
    validade: 'Oferta por tempo limitado'
  }));

  const handleAdicionarAoCarrinho = (produto) => {
    if (!produto.estoque || produto.estoque <= 0) {
      Alert.alert('Produto Indisponível', 'Este produto está sem estoque no momento.');
      return;
    }

    adicionarAoCarrinho(produto, 1);
    
    Alert.alert(
      '🎉 Oferta Adicionada!',
      `${produto.nome} com ${produto.desconto}% de desconto está no seu carrinho!`,
      [
        {
          text: 'Continuar Comprando',
          style: 'cancel'
        },
        {
          text: 'Finalizar Compra',
          onPress: () => router.push('/cart')
        }
      ]
    );
  };

  const renderPromocao = ({ item }) => (
    <TouchableOpacity
      style={styles.promocaoCard}
      onPress={() => handleAdicionarAoCarrinho(item)}
      activeOpacity={0.8}
    >
      {/* Badge de Desconto */}
      <View style={styles.discountBadge}>
        <Text style={styles.discountBadgeText}>-{item.desconto}%</Text>
      </View>
      
      {/* Imagem do Produto */}
      <Image
        source={{ 
          uri: item.imagem || `https://picsum.photos/seed/promocao-${item.id || Math.random().toString(36).substring(7)}/200/200.jpg` 
        }}
        style={styles.promocaoImage}
        resizeMode="contain"
      />
      
      {/* Informações da Promoção */}
      <View style={styles.promocaoInfo}>
        {/* Código do Produto */}
        <Text style={styles.productCode}>Cód: {item.id || 'SKU-' + Math.floor(Math.random() * 10000)}</Text>
        
        {/* Nome do Produto */}
        <Text style={styles.promocaoNome} numberOfLines={2}>{item.nome}</Text>
        
        {/* Texto de Referência */}
        <Text style={styles.promocaoReferencia} numberOfLines={2}>
          {item.especificacoes || item.categoria || 'Produto de alta qualidade'}
        </Text>
        
        {/* Preços - Original e Promocional */}
        <View style={styles.priceContainer}>
          <View style={styles.originalPriceContainer}>
            <Text style={styles.originalPrice}>R$ {item.preco_medio?.toFixed(2) || '0,00'}</Text>
            <Text style={styles.originalPriceLabel}>De:</Text>
          </View>
          <View style={styles.promotionalPriceContainer}>
            <Text style={styles.promotionalPrice}>R$ {item.precoPromocional?.toFixed(2) || '0,00'}</Text>
            <Text style={styles.promotionalPriceLabel}>Por apenas:</Text>
          </View>
        </View>
        
        {/* Indicador de Economia */}
        <View style={styles.savingsContainer}>
          <Ionicons name="cash-outline" size={16} color="#4CAF50" />
          <Text style={styles.savingsText}>
            Você economiza R$ {(item.preco_medio - item.precoPromocional).toFixed(2)}
          </Text>
        </View>
        
        {/* Validade da Oferta */}
        <Text style={styles.validadeText}>
          <Ionicons name="time-outline" size={12} color="#FF9800" />
          {' '}{item.validade}
        </Text>
        
        {/* Botão de Compra */}
        <TouchableOpacity
          style={[
            styles.buyButton,
            { backgroundColor: lojaAtual?.cor || '#4CAF50' }
          ]}
          onPress={() => handleAdicionarAoCarrinho(item)}
          activeOpacity={0.8}
          disabled={item.estoque <= 0}
        >
          <Ionicons name="cart-outline" size={18} color="white" />
          <Text style={styles.buyButtonText}>
            {item.estoque > 0 ? 'Aproveitar Oferta' : 'Esgotado'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* ✅ CABEÇALHO DINÂMICO */}
      <Header 
        title="Promoções"
        subtitle={`${lojaAtual?.nome || 'Loja'} - ${produtosPromocao.length} ofertas`}
        backgroundColor={lojaAtual?.cor || '#FF9800'}
      />

      {/* Banner de Promoções */}
      <View style={[styles.promoBanner, { backgroundColor: lojaAtual?.cor || '#FF9800' }]}>
        <Ionicons name="flash-outline" size={40} color="white" />
        <Text style={styles.promoBannerTitle}>🔥 Ofertas Imperdíveis 🔥</Text>
        <Text style={styles.promoBannerSubtitle}>Até 20% de desconto em produtos selecionados</Text>
      </View>

      {/* Lista de Promoções */}
      {produtosPromocao.length > 0 ? (
        <FlatList
          data={produtosPromocao}
          renderItem={renderPromocao}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.promocoesList}
          numColumns={1}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="pricetag-outline" size={60} color="#CCC" />
          <Text style={styles.emptyStateTitle}>
            Nenhuma promoção no momento
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            Volte em breve para conferir nossas ofertas!
          </Text>
          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: lojaAtual?.cor || '#FF9800' }
            ]}
            onPress={() => router.push('/catalogo')}
          >
            <Ionicons name="storefront-outline" size={20} color="white" />
            <Text style={styles.continueButtonText}>Ver Catálogo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Seção de Destaques */}
      <View style={styles.destaquesContainer}>
        <Text style={styles.destaquesTitle}>🌟 Destaques da Semana</Text>
        <View style={styles.destaquesGrid}>
          <View style={styles.destaqueCard}>
            <Ionicons name="truck-outline" size={24} color="#4CAF50" />
            <Text style={styles.destaqueTitle}>Frete Grátis</Text>
            <Text style={styles.destaqueSubtitle}>Em compras acima de R$ 100</Text>
          </View>
          <View style={styles.destaqueCard}>
            <Ionicons name="card-outline" size={24} color="#2196F3" />
            <Text style={styles.destaqueTitle}>Parcele em 3x</Text>
            <Text style={styles.destaqueSubtitle}>Sem juros no cartão</Text>
          </View>
          <View style={styles.destaqueCard}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#9C27B0" />
            <Text style={styles.destaqueTitle}>Garantia</Text>
            <Text style={styles.destaqueSubtitle}>30 dias garantidos</Text>
          </View>
        </View>
      </View>

      {/* ✅ BOTÃO VOLTAR */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back-outline" size={14} color="white" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1' // Fundo amarelo claro para promoções
  },
  promoBanner: {
    padding: 20,
    alignItems: 'center',
    margin: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8
  },
  promoBannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 4
  },
  promoBannerSubtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9
  },
  promocoesList: {
    paddingVertical: 10,
    paddingHorizontal: 0
  },
  promocaoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 15,
    width: '100%'
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1
  },
  discountBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  promocaoImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F5F5F5',
    borderRadius: 0,
    alignSelf: 'center'
  },
  promocaoInfo: {
    padding: 16
  },
  productCode: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4
  },
  promocaoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22
  },
  promocaoReferencia: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18
  },
  priceContainer: {
    marginBottom: 12
  },
  originalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8
  },
  originalPriceLabel: {
    fontSize: 12,
    color: '#999'
  },
  promotionalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  promotionalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F44336',
    marginRight: 8
  },
  promotionalPriceLabel: {
    fontSize: 12,
    color: '#F44336'
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8
  },
  savingsText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4
  },
  validadeText: {
    fontSize: 12,
    color: '#FF9800',
    marginBottom: 12,
    fontStyle: 'italic'
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    margin: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 8
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8
  },
  continueButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  destaquesContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  destaquesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center'
  },
  destaquesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  destaqueCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    backgroundColor: '#F8F9FA',
    borderRadius: 12
  },
  destaqueTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center'
  },
  destaqueSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000
  },
  backButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    gap: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  }
});
