import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { Platform } from 'react-native';

export default function CartScreen() {
  const router = useRouter();
  const { lojaAtual, vendas } = useApp();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(Platform.OS !== 'web');
  }, []);

  // 3. VALIDAÇÃO DE TIPOS: Garantir que vendas seja array antes de acessar .length
  const vendasSeguras = vendas || [];
  
  // ISOLAMENTO: Carrinho por loja com validação
  const carrinhoAtual = lojaAtual?.id 
    ? vendasSeguras.filter(venda => venda.lojaId === lojaAtual.id)
    : vendasSeguras; // Se não houver loja, mostrar todas as vendas
    
  // Validação segura do carrinho
  const carrinhoSeguro = carrinhoAtual || [];
  const carrinhoLength = carrinhoSeguro.length;
  
  // Cálculo seguro do total
  const totalCarrinho = carrinhoSeguro.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  
  const screenWidth = Platform.OS === 'web' ? 400 : Dimensions.get('window').width;

  const handleCheckout = () => {
    if (carrinhoLength === 0) {
      Alert.alert('Carrinho Vazio', 'Adicione itens ao carrinho antes de finalizar.');
      return;
    }
    
    Alert.alert(
      'Finalizar Compra',
      `Total: R$ ${totalCarrinho.toFixed(2)}\n\nDeseja confirmar a compra?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Confirmar',
          onPress: () => {
            Alert.alert('Sucesso', 'Compra realizada com sucesso!');
            // Aqui você pode limpar o carrinho ou processar a compra
            router.push('/');
          }
        }
      ]
    );
  };

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Remover Item',
      'Deseja remover este item do carrinho?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            // Aqui você pode remover o item do carrinho
            Alert.alert('Sucesso', 'Item removido do carrinho!');
          }
        }
      ]
    );
  };

  const renderCartItem = (item) => (
    <View style={styles.cartItem}>
      <Image
        source={{ 
          uri: item.imagem || `https://picsum.photos/seed/${item.id}/80/80.jpg` 
        }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.produto || 'Produto'}</Text>
        <Text style={styles.itemQuantity}>Quantidade: {item.quantidade || 1}</Text>
        <Text style={styles.itemPrice}>R$ {(item.valor || 0).toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cart-outline" size={60} color="#CCC" />
      <Text style={styles.emptyStateTitle}>Carrinho Vazio</Text>
      <Text style={styles.emptyStateSubtitle}>
        Adicione produtos ao carrinho para começar a comprar
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => router.push('/catalogo')}
      >
        <Ionicons name="storefront-outline" size={20} color="white" />
        <Text style={styles.emptyStateButtonText}>Ver Catálogo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: lojaAtual?.cor || '#4CAF50' }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Carrinho</Text>
          <Text style={styles.headerSubtitle}>
            {lojaAtual?.nome || 'Loja'} ({carrinhoLength} itens)
          </Text>
        </View>
      </View>

      {/* Conteúdo do Carrinho */}
      {carrinhoLength > 0 ? (
        <ScrollView style={styles.content}>
          <View style={styles.itemsContainer}>
            {carrinhoSeguro.map(renderCartItem)}
          </View>
          
          {/* Resumo do Pedido */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>R$ {totalCarrinho.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frete:</Text>
              <Text style={styles.summaryValue}>Grátis</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>R$ {totalCarrinho.toFixed(2)}</Text>
            </View>
          </View>

          {/* Botão de Checkout */}
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        renderEmptyState()
      )}
    </View>
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
  content: {
    flex: 1
  },
  itemsContainer: {
    padding: 20
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F0F0'
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  removeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#FFF5F5'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    textAlign: 'center'
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 20
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  summaryContainer: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666'
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
    marginTop: 10
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
