import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function ClienteDashboard() {
  const router = useRouter();
  const { perfil, produtos, vendas } = useApp();
  
  const ferramentas = [
    { label: 'Meus Pedidos', icon: 'receipt-outline', color: '#2196F3', route: '/pedidos', adminOnly: false },
    { label: 'Catálogo', icon: 'book-outline', color: '#4CAF50', route: '/catalogo', adminOnly: false },
    { label: 'Falar com Atendente', icon: 'logo-whatsapp', color: '#25D366', action: 'whatsapp', adminOnly: false },
    { label: 'Meus Pontos', icon: 'star-outline', color: '#FFD700', route: '/pontos', adminOnly: false },
  ];

  const handleCardPress = (ferramenta) => {
    if (ferramenta.action === 'whatsapp') {
      alert('Abrir WhatsApp para falar com atendente');
    } else if (ferramenta.route === '/catalogo') {
      router.push('/catalogo');
    } else if (ferramenta.route === '/pedidos') {
      router.push('/pedidos');
    } else {
      alert(`${ferramenta.label} - Funcionalidade em desenvolvimento`);
    }
  };

  // Filtrar ferramentas baseado no perfil (cliente vê tudo, admin vê menos)
  const ferramentasDisponiveis = ferramentas.filter(ferramenta => !ferramenta.adminOnly || perfil === 'admin');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Área do Cliente 👤</Text>
        <Text style={styles.subtitle}>Bem-vindo ao nosso sistema</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="cube-outline" size={24} color="#4CAF50" />
          <View>
            <Text style={styles.statNumber}>{produtos.length}</Text>
            <Text style={styles.statLabel}>Produtos</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="receipt-outline" size={24} color="#2196F3" />
          <View>
            <Text style={styles.statNumber}>{vendas.length}</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        {ferramentasDisponiveis.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.btn}
            onPress={() => handleCardPress(item)}
          >
            <Ionicons name={item.icon} size={30} color={item.color} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Prévia de Produtos */}
      {produtos.length > 0 && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Destaques do Catálogo</Text>
          <FlatList
            data={produtos.slice(0, 3)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.previewCard}>
                <Text style={styles.previewNome}>{item.produto}</Text>
                <Text style={styles.previewPreco}>R$ {parseFloat(item.preco).toFixed(2)}</Text>
              </View>
            )}
          />
          <TouchableOpacity style={styles.verTodosBtn} onPress={() => router.push('/catalogo')}>
            <Text style={styles.verTodosText}>Ver todos os produtos</Text>
            <Ionicons name="arrow-forward" size={16} color="#007AFF" />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { padding: 40, backgroundColor: '#f8f8f8', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: '#f8f8f8' },
  statCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, elevation: 2, flex: 1, marginHorizontal: 5 },
  statNumber: { fontSize: 24, fontWeight: 'bold', marginLeft: 10 },
  statLabel: { fontSize: 12, color: '#666' },
  grid: { padding: 20 },
  btn: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', marginBottom: 15, borderRadius: 12, elevation: 2, borderLeftWidth: 5, borderLeftColor: '#2196F3' },
  label: { marginLeft: 20, fontSize: 16, fontWeight: '500' },
  previewContainer: { marginTop: 20, paddingHorizontal: 20 },
  previewTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  previewCard: { backgroundColor: '#f8f8f8', padding: 15, borderRadius: 10, marginRight: 10, width: 150 },
  previewNome: { fontSize: 14, fontWeight: '600' },
  previewPreco: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50', marginTop: 5 },
  verTodosBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, marginTop: 10 },
  verTodosText: { color: '#007AFF', fontWeight: '500', marginRight: 5 }
});
