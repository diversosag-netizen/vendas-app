import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import Header from './components/Header';

export default function ReciboScreen() {
  const router = useRouter();
  const { carrinho, lojaAtual } = useApp();
  const [detalhesPagamento, setDetalhesPagamento] = useState(null);

  const corLoja = lojaAtual?.cor || '#4CAF50';
  const totalCarrinho = carrinho.reduce((total, item) => total + (item.subtotal || 0), 0);

  useEffect(() => {
    // Simulação de dados do pagamento
    setDetalhesPagamento({
      id: 'PAY-' + Date.now(),
      data: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      metodo: 'Cartão de Crédito',
      parcelas: '3x',
      status: 'Aprovado',
      autorizacao: '123456789',
      total: totalCarrinho,
      taxas: 0,
      liquido: totalCarrinho
    });
  }, []);

  const handleCompartilhar = () => {
    Alert.alert(
      'Compartilhar Recibo',
      'Deseja compartilhar este recibo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartilhar', onPress: () => console.log('Compartilhando...') }
      ]
    );
  };

  const handleImprimir = () => {
    Alert.alert(
      'Imprimir Recibo',
      'Deseja imprimir este recibo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Imprimir', onPress: () => console.log('Imprimindo...') }
      ]
    );
  };

  const renderCartItem = (item, index) => (
    <View key={index} style={styles.reciboItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome || 'Produto'}</Text>
        <Text style={styles.itemDetalhes}>
          Quantidade: {item.quantidade || 1} | R$ {(item.preco_medio || 0).toFixed(2)} cada
        </Text>
      </View>
      <Text style={styles.itemTotal}>
        R$ {((item.preco_medio || 0) * (item.quantidade || 1)).toFixed(2)}
      </Text>
    </View>
  );

  if (!detalhesPagamento) {
    return (
      <ScrollView style={styles.container}>
        <Header 
          title="Carregando..."
          subtitle="Processando informações"
          backgroundColor={corLoja}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* ✅ CABEÇALHO */}
      <Header 
        title="Recibo de Pagamento"
        subtitle={`${lojaAtual?.nome || 'Loja'} - Compra concluída`}
        backgroundColor={corLoja}
      />

      {/* 🎉 Status do Pagamento */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIcon, { backgroundColor: '#4CAF50' }]}>
          <Ionicons name="checkmark-circle" size={32} color="white" />
        </View>
        <Text style={styles.statusTitle}>Pagamento Aprovado!</Text>
        <Text style={styles.statusSubtitle}>
          Sua compra foi processada com sucesso
        </Text>
      </View>

      {/* 📋 Detalhes da Transação */}
      <View style={styles.detalhesContainer}>
        <Text style={styles.sectionTitle}>Detalhes da Transação</Text>
        
        <View style={styles.detalheRow}>
          <Text style={styles.detalheLabel}>Número do Pedido</Text>
          <Text style={styles.detalheValue}>{detalhesPagamento.id}</Text>
        </View>
        
        <View style={styles.detalheRow}>
          <Text style={styles.detalheLabel}>Data</Text>
          <Text style={styles.detalheValue}>{detalhesPagamento.data}</Text>
        </View>
        
        <View style={styles.detalheRow}>
          <Text style={styles.detalheLabel}>Hora</Text>
          <Text style={styles.detalheValue}>{detalhesPagamento.hora}</Text>
        </View>
        
        <View style={styles.detalheRow}>
          <Text style={styles.detalheLabel}>Forma de Pagamento</Text>
          <Text style={styles.detalheValue}>{detalhesPagamento.metodo}</Text>
        </View>
        
        {detalhesPagamento.parcelas && (
          <View style={styles.detalheRow}>
            <Text style={styles.detalheLabel}>Parcelamento</Text>
            <Text style={styles.detalheValue}>{detalhesPagamento.parcelas}</Text>
          </View>
        )}
        
        <View style={styles.detalheRow}>
          <Text style={styles.detalheLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{detalhesPagamento.status}</Text>
          </View>
        </View>
        
        <View style={styles.detalheRow}>
          <Text style={styles.detalheLabel}>Autorização</Text>
          <Text style={styles.detalheValue}>{detalhesPagamento.autorizacao}</Text>
        </View>
      </View>

      {/* 🛒 Itens da Compra */}
      <View style={styles.itensContainer}>
        <Text style={styles.sectionTitle}>Itens da Compra</Text>
        {carrinho.map(renderCartItem)}
      </View>

      {/* 💰 Resumo Financeiro */}
      <View style={styles.resumoContainer}>
        <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
        
        <View style={styles.resumoRow}>
          <Text style={styles.resumoLabel}>Subtotal</Text>
          <Text style={styles.resumoValue}>R$ {detalhesPagamento.total.toFixed(2)}</Text>
        </View>
        
        <View style={styles.resumoRow}>
          <Text style={styles.resumoLabel}>Taxas</Text>
          <Text style={styles.resumoValue}>R$ {detalhesPagamento.taxas.toFixed(2)}</Text>
        </View>
        
        <View style={[styles.resumoTotal, { borderTopColor: corLoja }]}>
          <Text style={styles.resumoTotalLabel}>Total Pago</Text>
          <Text style={[styles.resumoTotalValue, { color: corLoja }]}>
            R$ {detalhesPagamento.liquido.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* 🏪 Informações da Loja */}
      <View style={styles.lojaContainer}>
        <Text style={styles.sectionTitle}>Informações da Loja</Text>
        
        <View style={styles.lojaInfo}>
          <Text style={styles.lojaNome}>{lojaAtual?.nome || 'Loja'}</Text>
          <Text style={styles.lojaEndereco}>
            {lojaAtual?.endereco || 'Endereço não informado'}
          </Text>
          <Text style={styles.lojaContato}>
            {lojaAtual?.telefone || 'Telefone não informado'}
          </Text>
          <Text style={styles.lojaCnpj}>
            CNPJ: {lojaAtual?.cnpj || '00.000.000/0000-00'}
          </Text>
        </View>
      </View>

      {/* 🔧 Ações */}
      <View style={styles.acoesContainer}>
        <TouchableOpacity
          style={[styles.acaoButton, { backgroundColor: corLoja }]}
          onPress={handleCompartilhar}
        >
          <Ionicons name="share-outline" size={20} color="white" />
          <Text style={styles.acaoButtonText}>Compartilhar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.acaoButton, { backgroundColor: '#2196F3' }]}
          onPress={handleImprimir}
        >
          <Ionicons name="print-outline" size={20} color="white" />
          <Text style={styles.acaoButtonText}>Imprimir</Text>
        </TouchableOpacity>
      </View>

      {/* 🏠 Botão Voltar */}
      <View style={styles.voltarContainer}>
        <TouchableOpacity
          style={[styles.voltarButton, { backgroundColor: corLoja }]}
          onPress={() => router.push('/')}
        >
          <Ionicons name="home-outline" size={20} color="white" />
          <Text style={styles.voltarButtonText}>Voltar às Compras</Text>
        </TouchableOpacity>
      </View>

      {/* 📧 Suporte */}
      <View style={styles.suporteContainer}>
        <Text style={styles.suporteText}>
          Dúvidas sobre sua compra? Entre em contato com nosso suporte
        </Text>
        <TouchableOpacity style={styles.suporteButton}>
          <Ionicons name="mail-outline" size={16} color={corLoja} />
          <Text style={styles.suporteButtonText}>Falar com Suporte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  statusContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  detalhesContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  detalheRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  detalheLabel: {
    fontSize: 14,
    color: '#666'
  },
  detalheValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600'
  },
  itensContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  reciboItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  itemInfo: {
    flex: 1
  },
  itemNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  itemDetalhes: {
    fontSize: 12,
    color: '#666'
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  resumoContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  resumoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  resumoLabel: {
    fontSize: 14,
    color: '#666'
  },
  resumoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  resumoTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 2,
    marginTop: 8
  },
  resumoTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  resumoTotalValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  lojaContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  lojaInfo: {
    gap: 8
  },
  lojaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  lojaEndereco: {
    fontSize: 14,
    color: '#666'
  },
  lojaContato: {
    fontSize: 14,
    color: '#666'
  },
  lojaCnpj: {
    fontSize: 12,
    color: '#999'
  },
  acoesContainer: {
    flexDirection: 'row',
    gap: 12,
    margin: 20
  },
  acaoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  acaoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  voltarContainer: {
    margin: 20
  },
  voltarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  voltarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  suporteContainer: {
    alignItems: 'center',
    padding: 20,
    gap: 12
  },
  suporteText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8
  },
  suporteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    gap: 8
  },
  suporteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  }
});
