import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Header from '../(tabs)/components/Header';
import { useApp } from '../context/AppContext';

export default function CartScreen() {
  const router = useRouter();
  const { 
    carrinho, 
    lojaAtual, 
    removerDoCarrinho, 
    atualizarQuantidadeCarrinho, 
    getTotalCarrinho,
    abrirCheckout,
    isAuthenticated,
    userRole
  } = useApp();

  const nomeLoja = lojaAtual?.nome || 'Minha Loja';
  const corLoja = lojaAtual?.cor || '#4CAF50';
  const totalCarrinho = getTotalCarrinho();

  const handleFinalizarCompra = () => {
    if (carrinho.length === 0) {
      Alert.alert('Carrinho Vazio', 'Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
      return;
    }

    // 🛒 VENDAS 3.1: Gatilho de autenticação no checkout
    if (!isAuthenticated) {
      Alert.alert(
        'Login Necessário',
        'Para finalizar sua compra, você precisa fazer login. Deseja continuar?',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Fazer Login',
            onPress: () => router.push('/login-cliente')
          }
        ]
      );
      return;
    }

    // Se já está autenticado, abre o checkout
    if (abrirCheckout()) {
      router.push('/checkout');
    }
  };

  const handleRemoverItem = (produtoId, produtoNome) => {
    Alert.alert(
      'Remover Item',
      `Deseja remover "${produtoNome}" do carrinho?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Remover',
          onPress: () => removerDoCarrinho(produtoId),
          style: 'destructive'
        }
      ]
    );
  };

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <Text style={styles.itemDetails}>{item.marca} - {item.categoria}</Text>
        <Text style={styles.itemPrice}>R$ {parseFloat(item.preco_medio).toFixed(2)}</Text>
      </View>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => atualizarQuantidadeCarrinho(item.id, item.quantidade - 1)}
        >
          <Ionicons name="remove-outline" size={16} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantidade}</Text>
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => atualizarQuantidadeCarrinho(item.id, item.quantidade + 1)}
        >
          <Ionicons name="add-outline" size={16} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.itemSubtotal}>
        <Text style={styles.subtotalText}>
          R$ {parseFloat(item.subtotal || (item.preco_medio * item.quantidade)).toFixed(2)}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoverItem(item.id, item.nome)}
        >
          <Ionicons name="trash-outline" size={18} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carrinho.length === 0) {
    return (
      <>
        <ScrollView style={styles.container}>
          <Header 
            title="Carrinho"
            subtitle={nomeLoja}
            backgroundColor={corLoja}
          />
          
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={80} color="#CCC" />
            <Text style={styles.emptyTitle}>Carrinho Vazio</Text>
            <Text style={styles.emptySubtitle}>
              Seu carrinho está vazio. Adicione produtos para continuar comprando.
            </Text>
            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: corLoja }]}
              onPress={() => router.push('/(tabs)/catalogo')}
            >
              <Text style={styles.continueButtonText}>Continuar Comprando</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        {/* Botão Voltar */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/catalogo')}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back-outline" size={14} color="white" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <Header 
          title="Carrinho"
          subtitle={`${carrinho.length} itens`}
          backgroundColor={corLoja}
        />
        
        <View style={styles.content}>
          <View style={styles.itemsList}>
            {carrinho.map(renderCartItem)}
          </View>
          
          <View style={styles.summary}>
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
          
          <TouchableOpacity
            style={[styles.checkoutButton, { backgroundColor: corLoja }]}
            onPress={handleFinalizarCompra}
            activeOpacity={0.8}
          >
            <Ionicons name="lock-closed-outline" size={20} color="white" />
            <Text style={styles.checkoutButtonText}>
              {isAuthenticated ? 'Finalizar Compra' : 'Fazer Login e Comprar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Botão Voltar */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/catalogo')}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back-outline" size={14} color="white" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  content: {
    padding: 20
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 10
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30
  },
  continueButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  itemsList: {
    marginBottom: 20
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  itemInfo: {
    flex: 1,
    marginBottom: 12
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  itemPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500'
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 30,
    textAlign: 'center'
  },
  itemSubtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  removeButton: {
    padding: 8
  },
  summary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666'
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 8
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50'
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 20,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  }
});
