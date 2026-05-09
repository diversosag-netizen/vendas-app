import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import Header from './components/Header';

export default function VendasScreen() {
  const router = useRouter();
  const { vendas, adicionarVenda, produtoSelecionado, selecionarProduto, lojaAtual, userRole, currentUser, carrinho } = useApp();
  const [abaAtiva, setAbaAtiva] = useState('vendas'); // 'vendas' ou 'carrinho'
  const [mostrarForm, setMostrarForm] = useState(false);
  const [produto, setProduto] = useState('');
  const [valor, setValor] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  
  // SOLUÇÃO: Cor neutra caso nenhuma loja tenha sido clicada
  const corLoja = lojaAtual?.cor || '#4CAF50';
  const nomeLoja = lojaAtual?.nome || 'Loja';
  
  // Se veio da vitrine com produto selecionado
  useEffect(() => {
    if (produtoSelecionado) {
      setProduto(produtoSelecionado.nome);
      setValor(produtoSelecionado.preco_medio.toString().replace('.', ','));
      setMostrarForm(true);
    }
  }, [produtoSelecionado]);

  const handleSalvarVenda = () => {
    if (!produto.trim()) {
      Alert.alert('Erro', 'Digite o nome do produto');
      return;
    }
    
    if (!valor.trim() || isNaN(parseFloat(valor.replace(',', '.')))) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }
    
    if (!quantidade.trim() || isNaN(parseInt(quantidade)) || parseInt(quantidade) <= 0) {
      Alert.alert('Erro', 'Digite uma quantidade válida');
      return;
    }

    const novaVenda = {
      id: Date.now().toString(),
      produto: produto.trim(),
      valor: parseFloat(valor.replace(',', '.')),
      quantidade: parseInt(quantidade),
      data: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      lojaId: lojaAtual?.id || '1'
    };

    adicionarVenda(novaVenda);
    
    // Limpar formulário
    setProduto('');
    setValor('');
    setQuantidade('1');
    setMostrarForm(false);
    selecionarProduto(null);
    
    Alert.alert('Sucesso', 'Venda registrada com sucesso!');
  };

  const handleCancelar = () => {
    setProduto('');
    setValor('');
    setQuantidade('1');
    setMostrarForm(false);
    selecionarProduto(null);
  };

  const totalVendas = vendas.reduce((acc, venda) => acc + (venda.valor || 0), 0);
  const vendasHoje = vendas.filter(venda => venda?.data === new Date().toLocaleDateString());

  const renderCartItem = (item, index) => (
    <View key={item.id || index} style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.produto || 'Produto'}</Text>
        <Text style={styles.itemDetails}>
          Quantidade: {item.quantidade || 1} | Data: {item.data || 'N/A'}
        </Text>
        <Text style={styles.itemPrice}>R$ {(item.valor || 0).toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* ✅ CABEÇALHO DINÂMICO: Componente único com props */}
      <Header 
        title={userRole === 'admin' ? 'Vendas' : 'Meus Pedidos'}
        subtitle={nomeLoja}
        showBackButton={false}
        backgroundColor={corLoja}
      />

      {/* 🔐 VENDAS 3.2: ABAS DIFERENCIADAS - Admin vs Cliente */}
      <View style={styles.tabsContainer}>
        {userRole === 'admin' ? (
          <>
            {/* Abas para Admin */}
            <TouchableOpacity
              style={[styles.tab, abaAtiva === 'vendas' && styles.tabActive]}
              onPress={() => setAbaAtiva('vendas')}
            >
              <Text style={[styles.tabText, abaAtiva === 'vendas' && styles.tabTextActive]}>
                Registrar Venda
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, abaAtiva === 'carrinho' && styles.tabActive]}
              onPress={() => setAbaAtiva('carrinho')}
            >
              <Text style={[styles.tabText, abaAtiva === 'carrinho' && styles.tabTextActive]}>
                Carrinho ({carrinho.length})
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Abas para Cliente */}
            <TouchableOpacity
              style={[styles.tab, abaAtiva === 'pedidos' && styles.tabActive]}
              onPress={() => setAbaAtiva('pedidos')}
            >
              <Text style={[styles.tabText, abaAtiva === 'pedidos' && styles.tabTextActive]}>
                Meus Pedidos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, abaAtiva === 'carrinho' && styles.tabActive]}
              onPress={() => setAbaAtiva('carrinho')}
            >
              <Text style={[styles.tabText, abaAtiva === 'carrinho' && styles.tabTextActive]}>
                Carrinho ({carrinho.length})
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 🔐 VENDAS 3.2: Conteúdo Diferenciado - Admin vs Cliente */}
      {userRole === 'admin' ? (
        <>
          {/* Estatísticas para Admin */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>R$ {totalVendas.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Vendas Totais</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{vendasHoje.length}</Text>
              <Text style={styles.statLabel}>Vendas Hoje</Text>
            </View>
          </View>

          {abaAtiva === 'vendas' ? (
            <>
              {/* Botão Nova Venda */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: corLoja }
                  ]}
                  onPress={() => setMostrarForm(!mostrarForm)}
                >
                  <Ionicons name="add-outline" size={24} color="white" />
                  <Text style={styles.primaryButtonText}>
                    {mostrarForm ? 'Cancelar' : 'Registrar Venda'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Formulário de Venda */}
              {mostrarForm && (
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>Registrar Venda</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Produto *</Text>
                    <TextInput
                      style={styles.input}
                      value={produto}
                      onChangeText={setProduto}
                      placeholder="Nome do produto"
                      autoFocus
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>Valor *</Text>
                      <TextInput
                        style={styles.input}
                        value={valor}
                        onChangeText={setValor}
                        placeholder="0,00"
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>Quantidade *</Text>
                      <TextInput
                        style={styles.input}
                        value={quantidade}
                        onChangeText={setQuantidade}
                        placeholder="1"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.secondaryButton, { backgroundColor: '#CCC' }]}
                      onPress={handleCancelar}
                    >
                      <Text style={styles.secondaryButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.primaryButton,
                        { backgroundColor: corLoja }
                      ]}
                      onPress={handleSalvarVenda}
                    >
                      <Ionicons name="save-outline" size={20} color="white" />
                      <Text style={styles.primaryButtonText}>Salvar Venda</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Vendas Recentes */}
              <View style={styles.vendasContainer}>
                <Text style={styles.sectionTitle}>Vendas Recentes</Text>
                
                {vendas.length > 0 ? (
                  vendas.slice(-5).reverse().map((venda) => (
                    <View key={venda.id} style={styles.vendaCard}>
                      <View style={styles.vendaHeader}>
                        <Text style={styles.vendaProduto}>{venda.produto}</Text>
                        <Text style={styles.vendaValor}>R$ {venda.valor.toFixed(2)}</Text>
                      </View>
                      <View style={styles.vendaDetails}>
                        <Text style={styles.vendaInfo}>Qtd: {venda.quantidade}</Text>
                        <Text style={styles.vendaInfo}>{venda.data}</Text>
                        <Text style={styles.vendaInfo}>{venda.hora}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="receipt-outline" size={60} color="#CCC" />
                    <Text style={styles.emptyStateTitle}>Nenhuma venda registrada</Text>
                    <Text style={styles.emptyStateSubtitle}>Registre sua primeira venda</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              {/* Carrinho para Admin */}
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Resumo da Compra</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Itens no Carrinho:</Text>
                  <Text style={styles.summaryValue}>{carrinho.length}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total:</Text>
                  <Text style={styles.summaryValue}>R$ {carrinho.reduce((total, item) => total + (item.subtotal || 0), 0).toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.itemsContainer}>
                <Text style={styles.sectionTitle}>Itens do Carrinho</Text>
                
                {carrinho.length > 0 ? (
                  carrinho.map((item, index) => (
                    <View key={item.id || index} style={styles.cartItem}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.nome || 'Produto'}</Text>
                        <Text style={styles.itemDetails}>
                          Quantidade: {item.quantidade || 1}
                        </Text>
                        <Text style={styles.itemPrice}>R$ {(item.preco_medio || 0).toFixed(2)}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="cart-outline" size={60} color="#CCC" />
                    <Text style={styles.emptyStateTitle}>
                      Carrinho Vazio
                    </Text>
                    <Text style={styles.emptyStateSubtitle}>
                      Adicione produtos ao carrinho para continuar
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.continueButton,
                        { backgroundColor: corLoja }
                      ]}
                      onPress={() => router.push('/catalogo')}
                    >
                      <Ionicons name="storefront-outline" size={20} color="white" />
                      <Text style={styles.continueButtonText}>Ver Catálogo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {carrinho.length > 0 && (
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.checkoutButton,
                      { backgroundColor: corLoja }
                    ]}
                    onPress={() => router.push('/pagamento')}
                  >
                    <Ionicons name="credit-card-outline" size={20} color="white" />
                    <Text style={styles.checkoutButtonText}>
                      Pagar Agora (R$ {carrinho.reduce((total, item) => total + (item.subtotal || 0), 0).toFixed(2)})
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {/* 🛒 VENDAS 3.2: Conteúdo para Clientes - Meus Pedidos */}
          {abaAtiva === 'pedidos' ? (
            <View style={styles.pedidosContainer}>
              <Text style={styles.sectionTitle}>Meus Pedidos</Text>
              
              {/* Placeholder para histórico de pedidos */}
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={60} color="#CCC" />
                <Text style={styles.emptyStateTitle}>Nenhum pedido encontrado</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Seus pedidos aparecerão aqui após finalizar suas compras
                </Text>
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    { backgroundColor: corLoja }
                  ]}
                  onPress={() => router.push('/catalogo')}
                >
                  <Ionicons name="storefront-outline" size={20} color="white" />
                  <Text style={styles.continueButtonText}>Ver Produtos</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {/* Carrinho para Clientes */}
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Resumo da Compra</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Itens no Carrinho:</Text>
                  <Text style={styles.summaryValue}>{carrinho.length}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total:</Text>
                  <Text style={styles.summaryValue}>R$ {carrinho.reduce((total, item) => total + (item.subtotal || 0), 0).toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.itemsContainer}>
                <Text style={styles.sectionTitle}>Itens do Carrinho</Text>
                
                {carrinho.length > 0 ? (
                  carrinho.map((item, index) => (
                    <View key={item.id || index} style={styles.cartItem}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.nome || 'Produto'}</Text>
                        <Text style={styles.itemDetails}>
                          Quantidade: {item.quantidade || 1}
                        </Text>
                        <Text style={styles.itemPrice}>R$ {(item.preco_medio || 0).toFixed(2)}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="cart-outline" size={60} color="#CCC" />
                    <Text style={styles.emptyStateTitle}>
                      Carrinho Vazio
                    </Text>
                    <Text style={styles.emptyStateSubtitle}>
                      Adicione produtos ao carrinho para continuar
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.continueButton,
                        { backgroundColor: corLoja }
                      ]}
                      onPress={() => router.push('/catalogo')}
                    >
                      <Ionicons name="storefront-outline" size={20} color="white" />
                      <Text style={styles.continueButtonText}>Ver Catálogo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {carrinho.length > 0 && (
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.checkoutButton,
                      { backgroundColor: corLoja }
                    ]}
                    onPress={() => router.push('/pagamento')}
                  >
                    <Ionicons name="credit-card-outline" size={20} color="white" />
                    <Text style={styles.checkoutButtonText}>
                      Pagar Agora (R$ {carrinho.reduce((total, item) => total + (item.subtotal || 0), 0).toFixed(2)})
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </>
      )}
      
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
    </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
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
    color: '#333'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  buttonContainer: {
    padding: 20
  },
  primaryButton: {
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
  primaryButtonText: {
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
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA'
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600'
  },
  vendasContainer: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  vendaCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  vendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  vendaProduto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  vendaValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  vendaDetails: {
    flexDirection: 'row',
    gap: 15
  },
  vendaInfo: {
    fontSize: 12,
    color: '#666'
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
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
  summaryContainer: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666'
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  itemsContainer: {
    padding: 20
  },
  cartItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  itemDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  actionsContainer: {
    padding: 20
  },
  checkoutButton: {
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
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  pedidosContainer: {
    padding: 20
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
