import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();
  
  const cards = [
    { label: 'Nova Venda', icon: 'cart-outline', color: '#4CAF50', route: '/vendas' },
    { label: 'Estoque', icon: 'list-outline', color: '#2196F3', route: '/estoque' },
    { label: 'Clientes', icon: 'people-outline', color: '#FF9800', route: '/clientes' },
    { label: 'Relatórios', icon: 'stats-chart-outline', color: '#9C27B0', route: '/relatorios' },
    { label: 'Configurações', icon: 'settings-outline', color: '#607D8B', route: '/configuracoes' },
    { label: 'Suporte', icon: 'logo-whatsapp', color: '#25D366', action: 'whatsapp' },
  ];

  const handleCardPress = (card) => {
    if (card.action === 'whatsapp') {
      // Abre WhatsApp (pode ser implementado depois)
      alert('Abrir WhatsApp para suporte');
    } else if (card.route === '/vendas') {
      // Navega para tela de vendas (já existe)
      router.push('/vendas');
    } else {
      // Para outras rotas, mostra alerta temporário
      alert(`${card.label} - Funcionalidade em desenvolvimento`);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={styles.header}>
        <Text style={styles.statsTitle}>Vendas de Hoje</Text>
        <Text style={styles.statsValue}>R$ 0,00</Text>
      </View>
      <View style={styles.grid}>
        {cards.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.card, { borderLeftColor: item.color }]}
            onPress={() => handleCardPress(item)}
          >
            <Ionicons name={item.icon} size={30} color={item.color} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#1A1A1A', padding: 30, alignItems: 'center' },
  statsTitle: { color: '#AAA', fontSize: 14 },
  statsValue: { color: '#4CAF50', fontSize: 32, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 10 },
  card: { backgroundColor: '#FFF', width: '45%', height: 100, borderRadius: 12, marginVertical: 10, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 6, elevation: 3 },
  label: { marginTop: 8, fontWeight: 'bold', fontSize: 13, color: '#444' }
});
