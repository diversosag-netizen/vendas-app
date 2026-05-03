import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function CatalogoScreen() {
  const router = useRouter();
  const { produtos, selecionarProduto, lojaAtual, bannerLojaAtual } = useApp();
  const [isMobile, setIsMobile] = useState(Platform.OS !== 'web');

  const screenWidth = Dimensions.get('window').width;
  const bannerHeight = 150;

  // SOLUÇÃO: Garantir que produtos seja sempre um array
  const produtosSeguros = produtos || [];

  const handleSelecionarProduto = (produto) => {
    selecionarProduto(produto);
    router.push('/vendas');
  };

  // ✅ IMPLEMENTAÇÃO: Atalho de navegação direta para Estoque
  const handleGerenciarEstoque = () => {
    router.push('/estoque');
  };

  const renderProduto = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.produtoCard,
        isMobile && styles.produtoCardMobile
      ]}
      onPress={() => handleSelecionarProduto(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ 
          uri: item.imagem || `https://picsum.photos/seed/${item.id}/100/100.jpg` 
        }}
        style={[
          styles.produtoImage,
          isMobile && styles.produtoImageMobile
        ]}
        resizeMode="cover"
      />
      <View style={styles.produtoInfo}>
        <Text style={[
          styles.produtoNome,
          isMobile && styles.produtoNomeMobile
        ]}>
          {item.nome}
        </Text>
        <Text style={[
          styles.produtoCategoria,
          isMobile && styles.produtoCategoriaMobile
        ]}>
          {item.categoria}
        </Text>
        <Text style={[
          styles.produtoPreco,
          isMobile && styles.produtoPrecoMobile
        ]}>
          R$ {item.preco_medio?.toFixed(2) || '0,00'}
        </Text>
        <Text style={[
          styles.produtoEstoque,
          isMobile && styles.produtoEstoqueMobile
        ]}>
          Estoque: {item.estoque || '0'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* ✅ FAIXA PROTETORA: Protege ícones da câmera com cor da marca */}
      <View style={[
        styles.statusBarSpacer,
        { backgroundColor: lojaAtual?.cor || '#4CAF50' }
      ]} />

      <View style={[
        styles.header,
        { 
          backgroundColor: lojaAtual?.cor || '#4CAF50',
          zIndex: 1000
        }
      ]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Catálogo - {lojaAtual?.nome || 'Loja'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {produtosSeguros.length} produtos disponíveis
          </Text>
        </View>
      </View>

      {/* Banner */}
      {bannerLojaAtual ? (
        <Image
          source={{ uri: bannerLojaAtual }}
          style={[
            styles.banner,
            { width: screenWidth, height: bannerHeight }
          ]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.bannerPlaceholder, { backgroundColor: lojaAtual?.cor || '#4CAF50' }]}>
          <Ionicons name="storefront-outline" size={40} color="white" />
          <Text style={styles.bannerText}>
            {lojaAtual?.nome || 'Catálogo'}
          </Text>
        </View>
      )}

      {/* Lista de Produtos */}
      {produtosSeguros.length > 0 ? (
        <FlatList
          data={produtosSeguros}
          renderItem={renderProduto}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.produtosList}
          numColumns={isMobile ? 1 : 2}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={60} color="#CCC" />
          <Text style={styles.emptyStateTitle}>
            Nenhum produto encontrado
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            Adicione produtos ao estoque para começar a vender
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={handleGerenciarEstoque}
          >
            <Ionicons name="arrow-forward-outline" size={20} color="white" />
            <Text style={styles.emptyStateButtonText}>
              Ir para Estoque
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    gap: 5
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
    height: 150,
    backgroundColor: '#F0F0F0'
  },
  bannerPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  produtosList: {
    padding: 20
  },
  produtoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    margin: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  produtoCardMobile: {
    marginHorizontal: 10,
    marginVertical: 5
  },
  produtoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F0F0'
  },
  produtoImageMobile: {
    width: 60,
    height: 60
  },
  produtoInfo: {
    flex: 1
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  produtoNomeMobile: {
    fontSize: 14
  },
  produtoCategoria: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5
  },
  produtoCategoriaMobile: {
    fontSize: 11
  },
  produtoPreco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5
  },
  produtoPrecoMobile: {
    fontSize: 16
  },
  produtoEstoque: {
    fontSize: 12,
    color: '#666'
  },
  produtoEstoqueMobile: {
    fontSize: 11
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white'
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    textAlign: 'center'
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 20
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  }
});
