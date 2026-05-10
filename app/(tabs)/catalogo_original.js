import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import Header from './components/Header';

export default function CatalogoScreen() {
  const router = useRouter();
  const { produtos, selecionarProduto, lojaAtual, bannerLojaAtual, adicionarProduto, removerProduto, adicionarAoCarrinho, userRole } = useApp();
  const [isMobile] = useState(Platform.OS !== 'web');
  const [abaAtiva, setAbaAtiva] = useState('catalogo'); // 'catalogo' ou 'estoque'
  const [mostrarFormEstoque, setMostrarFormEstoque] = useState(false);
  
  // ✅ CAMPOS DO FORMULÁRIO DE ESTOQUE INTEGRADOS
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [especificacoes, setEspecificacoes] = useState('');
  const [preco_medio, setPrecoMedio] = useState('');
  const [estoque, setEstoque] = useState('');
  const [imagem, setImagem] = useState('');

  const screenWidth = Dimensions.get('window').width;
  const bannerHeight = 150;

  // SOLUÇÃO: Garantir que produtos seja sempre um array
  const produtosSeguros = produtos || [];

  const handleSelecionarProduto = (produto) => {
    selecionarProduto(produto);
    router.push('/vendas');
  };

  // ✅ FUNÇÕES DE ESTOQUE INTEGRADAS
  const salvarProduto = () => {
    if (!nome || !preco_medio || !estoque) {
      Alert.alert('Erro', 'Preencha nome, preço e estoque!');
      return;
    }

    const novoProduto = {
      id: id || Date.now().toString(),
      nome,
      categoria,
      marca,
      especificacoes,
      preco_medio: parseFloat(preco_medio),
      estoque: parseInt(estoque),
      imagem: imagem || `https://picsum.photos/seed/${id || Date.now()}/100/100.jpg`
    };

    adicionarProduto(novoProduto);
    
    // Limpar formulário
    setId('');
    setNome('');
    setCategoria('');
    setMarca('');
    setEspecificacoes('');
    setPrecoMedio('');
    setEstoque('');
    setImagem('');
    setMostrarFormEstoque(false);
    
    Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
  };

  const handleRemoverProduto = (produtoId) => {
    Alert.alert(
      'Remover Produto',
      'Deseja remover este produto do estoque?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            removerProduto(produtoId);
            Alert.alert('Sucesso', 'Produto removido com sucesso!');
          }
        }
      ]
    );
  };

  const handleAdicionarAoCarrinho = (produto) => {
    if (!produto.estoque || produto.estoque <= 0) {
      Alert.alert('Produto Indisponível', 'Este produto está sem estoque no momento.');
      return;
    }

    adicionarAoCarrinho(produto, 1);
    
    if (userRole === 'admin') {
      Alert.alert(
        'Adicionado ao Carrinho',
        `${produto.nome} foi adicionado ao seu carrinho!`,
        [
          {
            text: 'Continuar Comprando',
            style: 'cancel'
          },
          {
            text: 'Ver Carrinho',
            onPress: () => router.push('/cart')
          }
        ]
      );
    } else {
      Alert.alert(
        'Produto Adicionado!',
        `${produto.nome} está no seu carrinho `,
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
    }
  };

  const renderProduto = ({ item }) => {
    // 🎯 VENDAS 3.2: Design diferenciado para Cliente vs Admin
    if (userRole !== 'admin') {
      // 🛒 VITRINE PARA CLIENTES - Foco em conversão
      return (
        <TouchableOpacity
          style={styles.vitrineCard}
          onPress={() => handleAdicionarAoCarrinho(item)}
          activeOpacity={0.8}
        >
          {/* Foto Grande do Produto */}
          <Image
            source={{ 
              uri: item.imagem || `https://picsum.photos/seed/produto-${item.id || Math.random().toString(36).substring(7)}/300/300.jpg` 
            }}
            style={styles.vitrineImage}
            resizeMode="contain"
          />
          
          {/* Badge de Estoque */}
          {item.estoque > 0 ? (
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>Disponível</Text>
            </View>
          ) : (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockBadgeText}>Esgotado</Text>
            </View>
          )}
          
          {/* Informações do Produto */}
          <View style={styles.vitrineInfo}>
            {/* Código do Produto */}
            <Text style={styles.productCode}>Cód: {item.id || 'SKU-' + Math.floor(Math.random() * 10000)}</Text>
            
            {/* Nome do Produto */}
            <Text style={styles.vitrineNome} numberOfLines={2}>{item.nome}</Text>
            
            {/* Texto de Referência/Descrição */}
            <Text style={styles.vitrineReferencia} numberOfLines={2}>
              {item.especificacoes || item.categoria || 'Produto de alta qualidade'}
            </Text>
            
            {/* Preço em Negrito - Tema Azul/Energia */}
            <View style={styles.priceContainer}>
              <Text style={styles.vitrinePreco}>
                R$ {item.preco_medio?.toFixed(2) || '0,00'}
              </Text>
              {item.categoria && (
                <Text style={styles.categoryBadge}>{item.categoria}</Text>
              )}
              {item.estoque > 5 && (
                <Text style={styles.availabilityText}>Em estoque</Text>
              )}
            </View>
            
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
                {item.estoque > 0 ? 'Comprar' : 'Esgotado'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
    
    // 🔧 VISUAL ADMIN - Funcionalidade de gestão
    return (
      <TouchableOpacity
        style={[
          styles.produtoCard,
          isMobile && styles.produtoCardMobile
        ]}
        onPress={() => selecionarProduto(item)}
      >
        <Image
          source={{ 
            uri: item.imagem || `https://picsum.photos/seed/admin-${item.id || Math.random().toString(36).substring(7)}/100/100.jpg` 
          }}
          style={[
            styles.produtoImage,
            isMobile && styles.produtoImageMobile
          ]}
          resizeMode="contain"
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
            <TouchableOpacity
              style={[
                styles.buyButton,
                { backgroundColor: lojaAtual?.cor || '#4CAF50' }
              ]}
              onPress={() => handleAdicionarAoCarrinho(item)}
              activeOpacity={0.8}
            >
              <Ionicons name="cart-outline" size={16} color="white" />
              <Text style={styles.buyButtonText}>Adicionar ao Orçamento</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProdutoEstoque = ({ item }) => (
    <View style={styles.produtoCard}>
      <Image
        source={{ 
          uri: item.imagem || `https://picsum.photos/seed/estoque-${item.id || Math.random().toString(36).substring(7)}/100/100.jpg` 
        }}
        style={styles.produtoImage}
        resizeMode="contain"
      />
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoCategoria}>{item.categoria}</Text>
        <Text style={styles.produtoMarca}>{item.marca}</Text>
        <Text style={styles.produtoPreco}>R$ {item.preco_medio?.toFixed(2) || '0,00'}</Text>
        <Text style={styles.produtoEstoque}>Estoque: {item.estoque || '0'}</Text>
        
        {/* 🔐 VENDAS 3.2: Botão Remover apenas para Admins */}
        {userRole === 'admin' && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoverProduto(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color="white" />
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <>
    <ScrollView style={styles.container}>
      {/* ✅ CABEÇALHO DINÂMICO: Componente único com props */}
      <Header 
        title="Catálogo"
        subtitle={`${lojaAtual?.nome || 'Loja'} - ${produtosSeguros.length} produtos`}
        backgroundColor={lojaAtual?.cor || '#4CAF50'}
      />

      {/* 🔐 VENDAS 3.2: ABAS - Catálogo para todos, Estoque apenas para Admins */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'catalogo' && styles.tabActive]}
          onPress={() => setAbaAtiva('catalogo')}
        >
          <Text style={[styles.tabText, abaAtiva === 'catalogo' && styles.tabTextActive]}>
            Catálogo
          </Text>
        </TouchableOpacity>
        
        {/* 🔐 VENDAS 3.2: Aba de Estoque apenas para Admins */}
        {userRole === 'admin' && (
          <TouchableOpacity
            style={[styles.tab, abaAtiva === 'estoque' && styles.tabActive]}
            onPress={() => setAbaAtiva('estoque')}
          >
            <Text style={[styles.tabText, abaAtiva === 'estoque' && styles.tabTextActive]}>
              Gerenciar Estoque
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {abaAtiva === 'catalogo' || (abaAtiva === 'estoque' && userRole !== 'admin') ? (
        <>
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
              numColumns={1}
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
            </View>
          )}
        </>
      ) : (
        <>
          {/* ✅ CONTEÚDO DE ESTOQUE INTEGRADO */}
          {/* 🔐 VENDAS 3.2: Botão Gestão de Produtos apenas para Admins */}
          {userRole === 'admin' && (
            <View style={styles.addButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  { backgroundColor: lojaAtual?.cor || '#4CAF50' }
                ]}
                onPress={() => router.push('/(tabs)/config/gestao-produtos')}
              >
                <Ionicons name="settings-outline" size={24} color="white" />
                <Text style={styles.addButtonText}>
                  Gestão de Produtos
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 🔐 VENDAS 3.2: Formulário movido para área restrita de configurações */}
          {/* O formulário de cadastro de produtos foi movido para: 
              app/(tabs)/config/gestao-produtos.js 
              Apenas administradores têm acesso através do botão "Gestão de Produtos" */}
          {produtosSeguros.length > 0 ? (
            produtosSeguros.map(renderProdutoEstoque)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={60} color="#CCC" />
              <Text style={styles.emptyStateTitle}>
                Nenhum produto cadastrado
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                Adicione produtos para começar a gerenciar seu estoque
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
    
    {/* ✅ BOTÃO VOLTAR - Parte inferior direita */}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  tabActive: {
    backgroundColor: '#4CAF50'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  tabTextActive: {
    color: 'white'
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
    paddingVertical: 10,
    paddingHorizontal: 0
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
    backgroundColor: '#F0F0F0',
    alignSelf: 'center'
  },
  produtoImageMobile: {
    width: 60,
    height: 60,
    alignSelf: 'center'
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
  produtoMarca: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5
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
  },
  // 🛒 VENDAS 3.2: ESTILOS DE VITRINE PARA CLIENTES
  vitrineCard: {
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
  vitrineImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#F5F5F5',
    borderRadius: 0,
    alignSelf: 'center'
  },
  stockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  stockBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600'
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  outOfStockBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600'
  },
  vitrineInfo: {
    padding: 16
  },
  productCode: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4
  },
  vitrineNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24
  },
  vitrineReferencia: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  vitrinePreco: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    flex: 1
  },
  availabilityText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600'
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
  // ✅ ESTILOS DE ESTOQUE INTEGRADOS
  addButtonContainer: {
    padding: 20
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: 15
  },
  inputRow: {
    flexDirection: 'row',
    gap: 15
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#F8F9FA'
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top'
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
    marginTop: 10
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  produtosContainer: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
    alignSelf: 'flex-start'
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  // VENDAS 3.1: Estilos do Botão Adicionar ao Carrinho
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  // ESTILOS DO BOTÃO VOLTAR
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 20,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  // ESTILOS PARA TEMA AZUL/ENERGIA
  categoryBadge: {
    fontSize: 12,
    color: '#1976D2',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    fontWeight: '500'
  },
  availabilityText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: 2
  }
});
