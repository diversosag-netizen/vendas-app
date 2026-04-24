import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ClienteProdutos() {
  const produtos = [
    { id: 1, nome: 'Notebook Dell', preco: 3500.00, categoria: 'Eletrônicos' },
    { id: 2, nome: 'Camiseta Nike', preco: 89.90, categoria: 'Roupas' },
    { id: 3, nome: 'Café 500g', preco: 15.50, categoria: 'Alimentos' },
    { id: 4, nome: 'Mesa Escritório', preco: 450.00, categoria: 'Móveis' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <ThemedText type="title">Produtos</ThemedText>
          <ThemedText>Encontre os melhores produtos!</ThemedText>
        </View>
        
        <View style={styles.productsContainer}>
          {produtos.map((produto) => (
            <TouchableOpacity key={produto.id} style={styles.productCard}>
              <View style={styles.productImage}>
                <ThemedText style={styles.imagePlaceholder}>IMG</ThemedText>
              </View>
              <View style={styles.productInfo}>
                <ThemedText style={styles.productName}>{produto.nome}</ThemedText>
                <ThemedText style={styles.productCategory}>{produto.categoria}</ThemedText>
                <ThemedText style={styles.productPrice}>R$ {produto.preco.toFixed(2)}</ThemedText>
              </View>
              <TouchableOpacity style={styles.addToCartButton}>
                <ThemedText style={styles.buttonText}>+</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productsContainer: {
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  imagePlaceholder: {
    color: '#6c757d',
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  addToCartButton: {
    width: 30,
    height: 30,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
