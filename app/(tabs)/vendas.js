import { View, Text, StyleSheet } from 'react-native';

export default function VendasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Vendas</Text>
      <Text style={styles.info}>Aqui listaremos seus serviços e produtos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 40,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});
