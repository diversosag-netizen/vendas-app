import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function EstoqueScreen() {
  const { produtos, adicionarProduto, removerProduto } = useApp();
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

  const salvarProduto = () => {
    if (!nome || !preco_medio || !estoque) {
      alert('Preencha nome, preço e estoque!');
      return;
    }

    const novoProduto = {
      id: id || Date.now().toString(),
      nome: nome.trim(),
      categoria: categoria.trim(),
      marca: marca.trim(),
      especificacoes: especificacoes.trim(),
      preco_medio: preco_medio.replace(',', '.'),
      estoque: estoque.trim(),
      imagem: imagem.trim(),
      data: new Date().toLocaleDateString()
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
  };

  const editarProduto = (produto) => {
    setId(produto.id);
    setNome(produto.nome);
    setCategoria(produto.categoria);
    setMarca(produto.marca);
    setEspecificacoes(produto.especificacoes);
    setPrecoMedio(produto.preco_medio.toString().replace('.', ','));
    setEstoque(produto.estoque);
    setImagem(produto.imagem);
    setMostrarForm(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Estoque</Text>
      
      <TouchableOpacity 
        style={[styles.btnPrincipal, { backgroundColor: mostrarForm ? '#FF3B30' : '#4CAF50' }]} 
        onPress={() => setMostrarForm(!mostrarForm)}
      >
        <Ionicons name={mostrarForm ? "close-circle" : "add-circle"} size={24} color="white" />
        <Text style={styles.btnText}>{mostrarForm ? "Cancelar" : "Adicionar Produto"}</Text>
      </TouchableOpacity>

      {mostrarForm && (
        <View style={styles.formulario}>
          <Text style={styles.label}>Nome do Produto *</Text>
          <TextInput 
            style={styles.input} 
            value={nome} 
            onChangeText={setNome} 
            placeholder="Ex: Câmera Intelbras" 
          />

          <Text style={styles.label}>Categoria</Text>
          <TextInput 
            style={styles.input} 
            value={categoria} 
            onChangeText={setCategoria} 
            placeholder="Ex: Segurança" 
          />

          <Text style={styles.label}>Marca/Fabricante</Text>
          <TextInput 
            style={styles.input} 
            value={marca} 
            onChangeText={setMarca} 
            placeholder="Ex: Intelbras" 
          />

          <Text style={styles.label}>Especificações Técnicas</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={especificacoes} 
            onChangeText={setEspecificacoes} 
            placeholder="Ex: Full HD 1080p, Visão noturna, Áudio 2 vias"
            multiline
            numberOfLines={3}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Preço Médio (R$) *</Text>
              <TextInput 
                style={styles.input} 
                value={preco_medio} 
                onChangeText={setPrecoMedio} 
                keyboardType="numeric" 
                placeholder="0,00" 
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Estoque *</Text>
              <TextInput 
                style={styles.input} 
                value={estoque} 
                onChangeText={setEstoque} 
                keyboardType="numeric" 
                placeholder="0" 
              />
            </View>
          </View>

          <Text style={styles.label}>URL da Imagem</Text>
          <TextInput 
            style={styles.input} 
            value={imagem} 
            onChangeText={setImagem} 
            placeholder="https://exemplo.com/imagem.jpg" 
          />
          
          <TouchableOpacity style={styles.btnSalvar} onPress={salvarProduto}>
            <Ionicons name="checkmark-circle" size={22} color="white" />
            <Text style={styles.btnText}>{id ? "Atualizar Produto" : "Salvar Produto"}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.listaContainer}>
        <Text style={styles.subtitle}>Produtos Cadastrados ({produtos.length})</Text>
        {produtos.length === 0 ? (
          <Text style={styles.txtVazio}>Nenhum produto cadastrado ainda.</Text>
        ) : (
          produtos.map((item) => (
            <View key={item.id} style={styles.cardProduto}>
              <View style={styles.infoContainer}>
                <Text style={styles.nomeProduto}>{item.nome}</Text>
                <Text style={styles.categoria}>{item.categoria} | {item.marca}</Text>
                <Text style={styles.info}>Estoque: {item.estoque} unidades</Text>
                <Text style={styles.data}>Cadastrado: {item.data}</Text>
              </View>
              <View style={styles.valorContainer}>
                <Text style={styles.preco}>R$ {parseFloat(item.preco_medio).toFixed(2)}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={() => editarProduto(item)} style={styles.btnEdit}>
                    <Ionicons name="create-outline" size={18} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removerProduto(item.id)} style={styles.btnDelete}>
                    <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  btnPrincipal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12, gap: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  formulario: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginTop: 15, elevation: 4, borderLeftWidth: 6, borderLeftColor: '#4CAF50' },
  label: { fontWeight: 'bold', marginBottom: 8, color: '#333', fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 10 },
  halfWidth: { flex: 1 },
  btnSalvar: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  listaContainer: { marginTop: 30, paddingBottom: 40 },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  cardProduto: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  infoContainer: { flex: 1 },
  nomeProduto: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  categoria: { fontSize: 14, color: '#666', marginTop: 2, fontWeight: '500' },
  info: { fontSize: 12, color: '#999', marginTop: 2 },
  data: { fontSize: 11, color: '#999', marginTop: 2 },
  valorContainer: { alignItems: 'flex-end' },
  preco: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50', marginBottom: 10 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  btnEdit: { backgroundColor: '#E3F2FD', padding: 8, borderRadius: 6 },
  btnDelete: { backgroundColor: '#FFEBEE', padding: 8, borderRadius: 6 },
  txtVazio: { textAlign: 'center', color: '#999', fontStyle: 'italic', marginTop: 20 }
});
