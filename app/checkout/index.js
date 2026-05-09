import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import Header from '../(tabs)/components/Header';

export default function CheckoutScreen() {
  const router = useRouter();
  const { 
    carrinho, 
    lojaAtual, 
    getTotalCarrinho, 
    currentUser,
    userRole,
    isAuthenticated,
    limparCarrinho,
    fecharCheckout
  } = useApp();

  const nomeLoja = lojaAtual?.nome || 'Minha Loja';
  const corLoja = lojaAtual?.cor || '#4CAF50';
  const totalCarrinho = getTotalCarrinho();

  // 🛒 VENDAS 3.1: Formulário de checkout
  const [formData, setFormData] = useState({
    nome: currentUser?.nome || '',
    email: currentUser?.email || '',
    telefone: '',
    endereco: '',
    cidade: '',
    cep: '',
    observacoes: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['nome', 'email', 'telefone', 'endereco', 'cidade', 'cep'];
    
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        Alert.alert('Campos Obrigatórios', `Por favor, preencha o campo ${field}.`);
        return false;
      }
    }

    // Validação de email simples
    if (!formData.email.includes('@')) {
      Alert.alert('Email Inválido', 'Por favor, informe um email válido.');
      return false;
    }

    return true;
  };

  const handleFinalizarPedido = () => {
    if (!validateForm()) {
      return;
    }

    if (carrinho.length === 0) {
      Alert.alert('Carrinho Vazio', 'Seu carrinho está vazio.');
      return;
    }

    setIsProcessing(true);

    // 🛒 VENDAS 3.1: Simulação de processamento de pedido
    setTimeout(() => {
      // Em produção, enviar para API real
      const pedido = {
        id: Date.now().toString(),
        cliente: formData,
        itens: carrinho,
        total: totalCarrinho,
        loja: lojaAtual,
        data: new Date().toISOString(),
        status: 'pendente'
      };

      console.log('Pedido criado:', pedido);

      Alert.alert(
        'Pedido Confirmado!',
        `Seu pedido #${pedido.id} foi recebido com sucesso!\n\nTotal: R$ ${totalCarrinho.toFixed(2)}\n\nVocê receberá atualizações sobre o status do seu pedido.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpar carrinho e redirecionar
              limparCarrinho();
              fecharCheckout();
              router.replace('/(tabs)/catalogo');
            }
          }
        ]
      );

      setIsProcessing(false);
    }, 2000);
  };

  const handleVoltarCarrinho = () => {
    router.back();
  };

  const renderResumoItem = (item, index) => (
    <View key={index} style={styles.resumoItem}>
      <View style={styles.resumoItemInfo}>
        <Text style={styles.resumoItemNome}>{item.nome}</Text>
        <Text style={styles.resumoItemDetalhes}>
          {item.quantidade}x R$ {parseFloat(item.preco_medio).toFixed(2)}
        </Text>
      </View>
      <Text style={styles.resumoItemSubtotal}>
        R$ {parseFloat(item.subtotal || (item.preco_medio * item.quantidade)).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <Header 
          title="Checkout"
          subtitle="Finalizar Compra"
          backgroundColor={corLoja}
        />
        
        <View style={styles.content}>
          {/* 📦 Resumo do Pedido */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
            <View style={styles.resumoItens}>
              {carrinho.map(renderResumoItem)}
            </View>
            <View style={styles.resumoTotal}>
              <Text style={styles.resumoTotalLabel}>Total:</Text>
              <Text style={styles.resumoTotalValue}>R$ {totalCarrinho.toFixed(2)}</Text>
            </View>
          </View>

          {/* 👤 Informações do Cliente */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações de Entrega</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome Completo *</Text>
              <TextInput
                style={styles.input}
                value={formData.nome}
                onChangeText={(value) => handleInputChange('nome', value)}
                placeholder="Seu nome completo"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Telefone *</Text>
              <TextInput
                style={styles.input}
                value={formData.telefone}
                onChangeText={(value) => handleInputChange('telefone', value)}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Endereço *</Text>
              <TextInput
                style={styles.input}
                value={formData.endereco}
                onChangeText={(value) => handleInputChange('endereco', value)}
                placeholder="Rua, número, complemento"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Cidade *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.cidade}
                  onChangeText={(value) => handleInputChange('cidade', value)}
                  placeholder="Sua cidade"
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>CEP *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.cep}
                  onChangeText={(value) => handleInputChange('cep', value)}
                  placeholder="00000-000"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Observações (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.observacoes}
                onChangeText={(value) => handleInputChange('observacoes', value)}
                placeholder="Informações adicionais para entrega..."
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* 💳 Forma de Pagamento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
            <View style={styles.paymentOption}>
              <Ionicons name="cash-outline" size={24} color="#4CAF50" />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Pagamento na Entrega</Text>
                <Text style={styles.paymentDescription}>Pague quando receber seu pedido</Text>
              </View>
            </View>
          </View>

          {/* 🚫 Ações */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleVoltarCarrinho}
              disabled={isProcessing}
            >
              <Text style={styles.secondaryButtonText}>Voltar ao Carrinho</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, { backgroundColor: corLoja }]}
              onPress={handleFinalizarPedido}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Text style={styles.primaryButtonText}>Processando...</Text>
              ) : (
                <Text style={styles.primaryButtonText}>Finalizar Pedido</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  resumoItens: {
    marginBottom: 16
  },
  resumoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  resumoItemInfo: {
    flex: 1
  },
  resumoItemNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2
  },
  resumoItemDetalhes: {
    fontSize: 14,
    color: '#666'
  },
  resumoItemSubtotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  resumoTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#4CAF50'
  },
  resumoTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  resumoTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50'
  },
  formGroup: {
    marginBottom: 16
  },
  formRow: {
    flexDirection: 'row'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  paymentInfo: {
    marginLeft: 16,
    flex: 1
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  paymentDescription: {
    fontSize: 14,
    color: '#666'
  },
  actions: {
    gap: 12
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  primaryButton: {
    backgroundColor: '#4CAF50'
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600'
  }
});
