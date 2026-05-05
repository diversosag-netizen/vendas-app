import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import Header from './components/Header';

export default function CatalogoScreen() {
  const router = useRouter();
  const { produtos, selecionarProduto, lojaAtual, bannerLojaAtual, adicionarProduto, removerProduto } = useApp();
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

  // ✅ RENDER DE PRODUTOS PARA ESTOQUE
  const renderProdutoEstoque = ({ item }) => (
    <View style={styles.produtoCard}>
      <Image
        source={{ uri: item.imagem }}
        style={styles.produtoImage}
        resizeMode="cover"
      />
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoCategoria}>{item.categoria}</Text>
        <Text style={styles.produtoMarca}>{item.marca}</Text>
        <Text style={styles.produtoPreco}>R$ {item.preco_medio?.toFixed(2) || '0,00'}</Text>
        <Text style={styles.produtoEstoque}>Estoque: {item.estoque || '0'}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoverProduto(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color="white" />
          <Text style={styles.removeButtonText}>Remover</Text>
        </TouchableOpacity>
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

      {/* ✅ ABAS INTEGRADAS: Catálogo e Estoque */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'catalogo' && styles.tabActive]}
          onPress={() => setAbaAtiva('catalogo')}
        >
          <Text style={[styles.tabText, abaAtiva === 'catalogo' && styles.tabTextActive]}>
            Catálogo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'estoque' && styles.tabActive]}
          onPress={() => setAbaAtiva('estoque')}
        >
          <Text style={[styles.tabText, abaAtiva === 'estoque' && styles.tabTextActive]}>
            Gerenciar Estoque
          </Text>
        </TouchableOpacity>
      </View>

      {abaAtiva === 'catalogo' ? (
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
            </View>
          )}
        </>
      ) : (
        <>
          {/* ✅ CONTEÚDO DE ESTOQUE INTEGRADO */}
          {/* Botão Adicionar Produto */}
          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: lojaAtual?.cor || '#4CAF50' }
              ]}
              onPress={() => setMostrarFormEstoque(!mostrarFormEstoque)}
            >
              <Ionicons name="add-outline" size={24} color="white" />
              <Text style={styles.addButtonText}>
                {mostrarFormEstoque ? 'Cancelar' : 'Adicionar Produto'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Formulário de Estoque */}
          {mostrarFormEstoque && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Novo Produto</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nome *</Text>
                <TextInput
                  style={styles.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Nome do produto"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Categoria</Text>
                <TextInput
                  style={styles.input}
                  value={categoria}
                  onChangeText={setCategoria}
                  placeholder="Categoria"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Marca</Text>
                <TextInput
                  style={styles.input}
                  value={marca}
                  onChangeText={setMarca}
                  placeholder="Marca"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Especificações</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={especificacoes}
                  onChangeText={setEspecificacoes}
                  placeholder="Especificações do produto"
                  multiline
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Preço *</Text>
                  <TextInput
                    style={styles.input}
                    value={preco_medio}
                    onChangeText={setPrecoMedio}
                    placeholder="0.00"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Estoque *</Text>
                  <TextInput
                    style={styles.input}
                    value={estoque}
                    onChangeText={setEstoque}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>URL da Imagem</Text>
                <TextInput
                  style={styles.input}
                  value={imagem}
                  onChangeText={setImagem}
                  placeholder="URL da imagem (opcional)"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: lojaAtual?.cor || '#4CAF50' }
                ]}
                onPress={salvarProduto}
              >
                <Ionicons name="save-outline" size={20} color="white" />
                <Text style={styles.saveButtonText}>Salvar Produto</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de Produtos em Estoque */}
          <View style={styles.produtosContainer}>
            <Text style={styles.sectionTitle}>Produtos em Estoque</Text>
            
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
          </View>
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
  // ✅ ESTILOS DO BOTÃO VOLTAR
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
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
  // ✅ ESTILOS DO BOTÃO VOLTAR
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000
  }
});
