import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
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
    
    if (!valor.trim()) {
      Alert.alert('Erro', 'Digite o valor da venda');
      return;
    }
    
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }
    
    const novaVenda = {
      id: Date.now().toString(),
      produto: produto.trim(),
      valor: valorNumerico,
      quantidade: parseInt(quantidade) || 1,
      data: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      loja: nomeLoja
    };
    
    adicionarVenda(novaVenda);
    
    Alert.alert('Sucesso', 'Venda registrada com sucesso!', [
      {
        text: 'OK',
        onPress: () => {
          // Limpar formulário
          setProduto('');
          setValor('');
          setQuantidade('1');
          setMostrarForm(false);
          selecionarProduto(null);
          router.push('/');
        }
      }
    ]);
  };

  const handleCancelar = () => {
    setProduto('');
    setValor('');
    setQuantidade('1');
    setMostrarForm(false);
    selecionarProduto(null);
    router.push('/');
  };

  const renderVenda = (item) => (
    <View style={styles.vendaCard}>
      <View style={styles.vendaHeader}>
        <Text style={styles.vendaProduto}>{item.produto}</Text>
        <Text style={styles.vendaValor}>R$ {item.valor.toFixed(2)}</Text>
      </View>
      <View style={styles.vendaDetails}>
        <Text style={styles.vendaInfo}>Quantidade: {item.quantidade}</Text>
        <Text style={styles.vendaInfo}>Data: {item.data}</Text>
        <Text style={styles.vendaInfo}>Hora: {item.hora}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: corLoja }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Nova Venda</Text>
          <Text style={styles.headerSubtitle}>{nomeLoja}</Text>
        </View>
      </View>

      {/* Formulário */}
      {mostrarForm ? (
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Produto</Text>
            <TextInput
              style={styles.input}
              value={produto}
              onChangeText={setProduto}
              placeholder="Nome do produto"
              editable={false}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Valor (R$)</Text>
            <TextInput
              style={styles.input}
              value={valor}
              onChangeText={setValor}
              placeholder="0,00"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              style={styles.input}
              value={quantidade}
              onChangeText={setQuantidade}
              placeholder="1"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
              <Ionicons name="close-circle" size={20} color="#666" />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: corLoja }]} onPress={handleSalvarVenda}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.saveButtonText}>Salvar Venda</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={60} color="#CCC" />
          <Text style={styles.emptyTitle}>Nenhuma venda em andamento</Text>
          <Text style={styles.emptySubtitle}>Selecione um produto no catálogo para começar</Text>
          <TouchableOpacity 
            style={[styles.emptyButton, { backgroundColor: corLoja }]} 
            onPress={() => router.push('/catalogo')}
          >
            <Ionicons name="storefront-outline" size={20} color="white" />
            <Text style={styles.emptyButtonText}>Ver Catálogo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Histórico de Vendas */}
      {vendas && vendas.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Histórico de Vendas</Text>
          {vendas.map(renderVenda)}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40
  },
  backButton: {
    marginRight: 15
  },
  headerContent: {
    flex: 1
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
  formContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  formGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA'
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600'
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center'
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 20
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  historyContainer: {
    padding: 20
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  vendaCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1
  },
  vendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
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
    gap: 5
  },
  vendaInfo: {
    fontSize: 12,
    color: '#666'
  }
});
