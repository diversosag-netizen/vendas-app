import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function VendasScreen() {
  const router = useRouter();
  const { vendas, adicionarVenda, produtoSelecionado, selecionarProduto, lojaAtual } = useApp();
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

  const handleVoltar = () => {
    router.push('/catalogo');
  };

  const vendasSeguras = vendas || [];
  const totalVendas = vendasSeguras.reduce((acc, venda) => acc + (venda.valor || 0), 0);
  const vendasHoje = vendasSeguras.filter(venda => venda.data === new Date().toLocaleDateString());

  return (
    <ScrollView style={styles.container}>
      {/* ✅ FAIXA PROTETORA: Protege ícones da câmera com cor da marca */}
      <View style={[
        styles.statusBarSpacer,
        { backgroundColor: corLoja }
      ]} />

      {/* Header */}
      <View style={[
        styles.header,
        { backgroundColor: corLoja }
      ]}>
        <View style={styles.headerContent}>
          <Ionicons name="cart-outline" size={32} color="white" />
          <Text style={styles.headerTitle}>Nova Venda</Text>
          <Text style={styles.headerSubtitle}>{nomeLoja}</Text>
        </View>
      </View>

      {/* Estatísticas Rápidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>R$ {totalVendas.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total de Vendas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{vendasHoje.length}</Text>
          <Text style={styles.statLabel}>Vendas Hoje</Text>
        </View>
      </View>

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

      {/* Botão Voltar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: '#666' }]}
          onPress={handleVoltar}
        >
          <Ionicons name="arrow-back-outline" size={20} color="white" />
          <Text style={styles.secondaryButtonText}>Voltar para Catálogo</Text>
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
  // ✅ FAIXA PROTETORA: Altura da StatusBar para proteger ícones
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
    width: '100%'
  },
  header: {
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
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
  }
});
