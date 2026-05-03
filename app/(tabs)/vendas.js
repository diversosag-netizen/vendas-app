import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function VendasScreen() {
  const router = useRouter();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [produto, setProduto] = useState('');
  const [valor, setValor] = useState('');
  // 1. Lista de vendas realizadas (Memória local)
  const [vendasRealizadas, setVendasRealizadas] = useState([]);

  // 2. Cálculo do total automático
  const totalGeral = vendasRealizadas.reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);

  const salvarVenda = () => {
    if (!produto || !valor) {
      alert("Preencha produto e valor!");
      return;
    }

    const novaVenda = {
      id: Date.now().toString(),
      produto,
      valor: valor.replace(',', '.'), // Garante que o cálculo aceite vírgula
      data: new Date().toLocaleTimeString()
    };

    // Adiciona a nova venda no topo da lista
    setVendasRealizadas([novaVenda, ...vendasRealizadas]);
    
    // Limpa e fecha
    setProduto('');
    setValor('');
    setMostrarForm(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vendas de Hoje</Text>
        <Text style={styles.totalDestaque}>R$ {totalGeral.toFixed(2).replace('.', ',')}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.btnPrincipal, { backgroundColor: mostrarForm ? '#FF3B30' : '#007AFF' }]} 
        onPress={() => setMostrarForm(!mostrarForm)}
      >
        <Ionicons name={mostrarForm ? "close-circle" : "add-circle"} size={24} color="white" />
        <Text style={styles.btnText}>{mostrarForm ? "Cancelar" : "Registrar Nova Venda"}</Text>
      </TouchableOpacity>

      {mostrarForm && (
        <View style={styles.formulario}>
          <Text style={styles.label}>Serviço/Produto</Text>
          <TextInput style={styles.input} value={produto} onChangeText={setProduto} placeholder="Ex: Câmera Intelbras" />
          
          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput style={styles.input} value={valor} onChangeText={setValor} keyboardType="numeric" placeholder="0,00" />
          
          <TouchableOpacity style={styles.btnSalvar} onPress={salvarVenda}>
            <Ionicons name="checkmark-circle" size={22} color="white" />
            <Text style={styles.btnText}>Confirmar Venda</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.historicoContainer}>
        <Text style={styles.subtitle}>Últimos Registros</Text>
        {vendasRealizadas.length === 0 ? (
          <Text style={styles.txtVazio}>Nenhuma venda registrada ainda.</Text>
        ) : (
          vendasRealizadas.map((item) => (
            <View key={item.id} style={styles.cardVenda}>
              <View>
                <Text style={styles.itemProduto}>{item.produto}</Text>
                <Text style={styles.itemHora}>{item.data}</Text>
              </View>
              <Text style={styles.itemValor}>R$ {parseFloat(item.valor).toFixed(2)}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  header: { alignItems: 'center', marginBottom: 25, marginTop: 20 },
  title: { fontSize: 18, color: '#666' },
  totalDestaque: { fontSize: 42, fontWeight: 'bold', color: '#28A745' },
  btnPrincipal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12, gap: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  formulario: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginTop: 15, elevation: 4, borderLeftWidth: 6, borderLeftColor: '#007AFF' },
  input: { borderBottomWidth: 1, borderBottomColor: '#DDD', marginBottom: 15, paddingVertical: 8, fontSize: 16 },
  btnSalvar: { backgroundColor: '#28A745', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  historicoContainer: { marginTop: 30, paddingBottom: 40 },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  cardVenda: { backgroundColor: 'white', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, elevation: 2 },
  itemProduto: { fontSize: 16, fontWeight: '600' },
  itemHora: { fontSize: 12, color: '#999' },
  itemValor: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  txtVazio: { textAlign: 'center', color: '#999', fontStyle: 'italic', marginTop: 20 }
});
