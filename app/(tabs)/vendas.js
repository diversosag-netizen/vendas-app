import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Platform, StatusBar, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Header from './components/Header';

export default function VendasScreen() {
  const router = useRouter();
  const { vendas, adicionarVenda, produtoSelecionado, selecionarProduto, lojaAtual } = useApp();
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

  // ✅ LÓGICA DO CART INTEGRADA
  const vendasSeguras = vendas || [];
  const carrinhoAtual = lojaAtual?.id 
    ? vendasSeguras.filter(venda => venda.lojaId === lojaAtual.id)
    : vendasSeguras;
  const carrinhoSeguro = carrinhoAtual || [];
  const carrinhoLength = carrinhoSeguro.length;
  const totalCarrinho = carrinhoSeguro.reduce((acc, curr) => acc + (curr.valor || 0), 0);

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

  const handleVoltar = () => {
    router.push('/catalogo');
  };

  // ✅ FUNÇÕES DO CART
  const handleRemoverItem = (vendaId) => {
    Alert.alert(
      'Remover Item',
      'Deseja remover este item do carrinho?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            // Aqui você implementaria a lógica para remover a venda
            Alert.alert('Sucesso', 'Item removido do carrinho!');
          }
        }
      ]
    );
  };

  const handleFinalizarCompra = () => {
    if (carrinhoLength === 0) {
      Alert.alert('Carrinho Vazio', 'Seu carrinho está vazio!');
      return;
    }

    Alert.alert(
      'Finalizar Compra',
      `Total: R$ ${totalCarrinho.toFixed(2)}\n\nDeseja finalizar a compra?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Finalizar',
          onPress: () => {
            Alert.alert('Sucesso', 'Compra finalizada com sucesso!');
            router.push('/');
          }
        }
      ]
    );
  };

  const totalVendas = vendasSeguras.reduce((acc, venda) => acc + (venda.valor || 0), 0);
  const vendasHoje = vendasSeguras.filter(venda => venda.data === new Date().toLocaleDateString());

  const renderCartItem = (item, index) => (
    <View key={item.id || index} style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.produto || 'Produto'}</Text>
        <Text style={styles.itemDetails}>
          Quantidade: {item.quantidade || 1} | Data: {item.data || 'N/A'}
        </Text>
        <Text style={styles.itemPrice}>R$ {(item.valor || 0).toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoverItem(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* ✅ CABEÇALHO DINÂMICO: Componente único com props */}
      <Header 
        title="Vendas"
        subtitle={nomeLoja}
        showBackButton={true}
        onBackPress={handleVoltar}
        backgroundColor={corLoja}
      />

      {/* ✅ ABAS INTEGRADAS: Vendas e Carrinho */}
      <View style={styles.tabsContainer}>
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
            Carrinho ({carrinhoLength})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Estatísticas Rápidas */}
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
            
            {vendasSeguras.length > 0 ? (
              vendasSeguras.slice(-5).reverse().map((venda) => (
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
                <Ionicons name="cart-outline" size={60} color="#CCC" />
                <Text style={styles.emptyStateTitle}>
                  Nenhuma venda registrada
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  Comece a registrar suas vendas
                </Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <>
          {/* ✅ CONTEÚDO DO CART INTEGRADO */}
          {/* Resumo do Carrinho */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Resumo da Compra</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Itens no Carrinho:</Text>
              <Text style={styles.summaryValue}>{carrinhoLength}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>R$ {totalCarrinho.toFixed(2)}</Text>
            </View>
          </View>

          {/* Itens do Carrinho */}
          <View style={styles.itemsContainer}>
            <Text style={styles.sectionTitle}>Itens do Carrinho</Text>
            
            {carrinhoLength > 0 ? (
              carrinhoSeguro.map(renderCartItem)
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
                  onPress={() => setAbaAtiva('vendas')}
                >
                  <Ionicons name="storefront-outline" size={20} color="white" />
                  <Text style={styles.continueButtonText}>Registrar Venda</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Botões de Ação */}
          {carrinhoLength > 0 && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[
                  styles.checkoutButton,
                  { backgroundColor: corLoja }
                ]}
                onPress={handleFinalizarCompra}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                <Text style={styles.checkoutButtonText}>
                  Finalizar Compra (R$ {totalCarrinho.toFixed(2)})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.continueShoppingButton}
                onPress={() => setAbaAtiva('vendas')}
              >
                <Ionicons name="arrow-back-outline" size={20} color="#666" />
                <Text style={styles.continueShoppingButtonText}>Registrar Nova Venda</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
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
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#F8F9FA'
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
    flex: 1
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
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
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    textAlign: 'center'
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center'
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    marginTop: 20
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  // ✅ ESTILOS DO CART INTEGRADOS
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
    alignItems: 'center',
    paddingVertical: 5
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666'
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  itemsContainer: {
    padding: 20
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center'
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
  removeButton: {
    backgroundColor: '#FF3B30',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15
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
    marginBottom: 15,
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
  continueShoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
    backgroundColor: '#F0F0F0'
  },
  continueShoppingButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600'
  }
});
