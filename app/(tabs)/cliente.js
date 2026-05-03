import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ClienteDashboard() {
  const router = useRouter();
  
  const ferramentas = [
    { label: 'Meus Pedidos', icon: 'receipt-outline', color: '#2196F3', route: '/pedidos' },
    { label: 'Catálogo', icon: 'book-outline', color: '#4CAF50', route: '/catalogo' },
    { label: 'Falar com Atendente', icon: 'logo-whatsapp', color: '#25D366', action: 'whatsapp' },
    { label: 'Meus Pontos', icon: 'star-outline', color: '#FFD700', route: '/pontos' },
  ];

  const handleCardPress = (ferramenta) => {
    if (ferramenta.action === 'whatsapp') {
      alert('Abrir WhatsApp para falar com atendente');
    } else {
      alert(`${ferramenta.label} - Funcionalidade em desenvolvimento`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Área do Cliente 👤</Text></View>
      <View style={styles.grid}>
        {ferramentas.map((item, index) => (
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { padding: 40, backgroundColor: '#f8f8f8', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold' },
  grid: { padding: 20 },
  btn: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', marginBottom: 15, borderRadius: 12, elevation: 2, borderLeftWidth: 5, borderLeftColor: '#2196F3' },
  label: { marginLeft: 20, fontSize: 16, fontWeight: '500' }
});
