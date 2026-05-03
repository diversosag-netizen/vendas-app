import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function EstoqueScreen() {
  const { produtos, adicionarProduto, removerProduto, lojaAtual } = useApp();
  const [mostrarForm, setMostrarForm] = useState(false);
  
  // Campos do formulário
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [especificacoes, setEspecificacoes] = useState('');
  const [preco_medio, setPrecoMedio] = useState('');
  const [estoque, setEstoque] = useState('');
  const [imagem, setImagem] = useState('');

  // SOLUÇÃO: Garantir que produtos seja sempre um array
  const produtosSeguros = produtos || [];

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
    setMostrarForm(false);
    
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
    <ScrollView style={styles.container}>
      {/* ✅ FAIXA PROTETORA: Protege ícones da câmera com cor da marca */}
      <View style={[
        styles.statusBarSpacer,
        { backgroundColor: lojaAtual?.cor || '#4CAF50' }
      ]} />

      {/* Header */}
      <View style={[
        styles.header,
        { backgroundColor: lojaAtual?.cor || '#4CAF50' }
      ]}>
        <View style={styles.headerContent}>
          <Ionicons name="list-outline" size={32} color="white" />
          <Text style={styles.headerTitle}>Estoque</Text>
          <Text style={styles.headerSubtitle}>
            {produtosSeguros.length} produtos cadastrados
          </Text>
        </View>
      </View>

      {/* Botão Adicionar Produto */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: lojaAtual?.cor || '#4CAF50' }
          ]}
          onPress={() => setMostrarForm(!mostrarForm)}
        >
          <Ionicons name="add-outline" size={24} color="white" />
          <Text style={styles.addButtonText}>
            {mostrarForm ? 'Cancelar' : 'Adicionar Produto'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulário */}
      {mostrarForm && (
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

      {/* Lista de Produtos */}
      <View style={styles.produtosContainer}>
        <Text style={styles.sectionTitle}>Produtos em Estoque</Text>
        
        {produtosSeguros.length > 0 ? (
          produtosSeguros.map(renderProduto)
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
  produtoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    gap: 15
  },
  produtoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F0F0'
  },
  produtoInfo: {
    flex: 1
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  produtoCategoria: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3
  },
  produtoMarca: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5
  },
  produtoPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 3
  },
  produtoEstoque: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10
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
