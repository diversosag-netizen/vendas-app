import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import Header from './components/Header';

export default function PagamentoScreen() {
  const router = useRouter();
  const { carrinho, lojaAtual, userRole } = useApp();
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [parcelas, setParcelas] = useState('1');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeTitular, setNomeTitular] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [processando, setProcessando] = useState(false);

  const corLoja = lojaAtual?.cor || '#4CAF50';
  const totalCarrinho = carrinho.reduce((total, item) => total + (item.subtotal || 0), 0);

  // 🎯 VENDAS 3.2: Métodos de pagamento modernos
  const metodosPagamento = [
    {
      id: 'pix',
      nome: 'PIX',
      descricao: 'Transferência instantânea',
      icone: 'flash-outline',
      taxas: 'Taxa: R$ 0,00',
      tempo: 'Imediato',
      popular: true
    },
    {
      id: 'pix_credito',
      nome: 'PIX com Cartão',
      descricao: 'Parcelar em até 18x',
      icone: 'card-outline',
      taxas: 'Taxa: 4,99%',
      tempo: 'Imediato',
      parcelas: true
    },
    {
      id: 'cartao_credito',
      nome: 'Cartão de Crédito',
      descricao: 'Débito automático',
      icone: 'card-outline',
      taxas: 'Taxa: R$ 0,00',
      tempo: '30 dias',
      parcelas: true
    },
    {
      id: 'cartao_debito',
      nome: 'Cartão de Débito',
      descricao: 'Débito em conta',
      icone: 'card-outline',
      taxas: 'Taxa: R$ 0,00',
      tempo: 'Imediato'
    },
    {
      id: 'boleto',
      nome: 'Boleto Bancário',
      descricao: 'Pagamento até 3 dias',
      icone: 'document-text-outline',
      taxas: 'Taxa: R$ 2,99',
      tempo: '3 dias úteis'
    },
    {
      id: 'apple_pay',
      nome: 'Apple Pay',
      descricao: 'Pagamento por aproximação',
      icone: 'phone-portrait-outline',
      taxas: 'Taxa: R$ 0,00',
      tempo: 'Imediato',
      wallet: true
    },
    {
      id: 'google_pay',
      nome: 'Google Pay',
      descricao: 'Pagamento por aproximação',
      icone: 'logo-google',
      taxas: 'Taxa: R$ 0,00',
      tempo: 'Imediato',
      wallet: true
    }
  ];

  const metodoSelecionado = metodosPagamento.find(m => m.id === metodoPagamento);

  const calcularTotalComTaxas = () => {
    if (!metodoSelecionado) return totalCarrinho;
    
    switch (metodoSelecionado.id) {
      case 'pix_credito':
        return totalCarrinho * 1.0499; // 4,99% de taxa
      case 'boleto':
        return totalCarrinho + 2.99; // Taxa fixa
      default:
        return totalCarrinho;
    }
  };

  const handleProcessarPagamento = async () => {
    setProcessando(true);
    
    // Simulação de processamento
    setTimeout(() => {
      setProcessando(false);
      
      Alert.alert(
        '✅ Pagamento Aprovado!',
        `Pagamento de R$ ${calcularTotalComTaxas().toFixed(2)} processado com sucesso via ${metodoSelecionado?.nome}`,
        [
          {
            text: 'Ver Recibo',
            onPress: () => router.push('/recibo')
          },
          {
            text: 'Voltar às Compras',
            onPress: () => router.push('/')
          }
        ]
      );
    }, 2000);
  };

  const renderMetodoPagamento = (metodo) => (
    <TouchableOpacity
      key={metodo.id}
      style={[
        styles.metodoCard,
        metodoPagamento === metodo.id && styles.metodoCardSelected
      ]}
      onPress={() => setMetodoPagamento(metodo.id)}
    >
      <View style={styles.metodoHeader}>
        <View style={[styles.metodoIcon, { backgroundColor: corLoja }]}>
          <Ionicons name={metodo.icone} size={24} color="white" />
        </View>
        <View style={styles.metodoInfo}>
          <Text style={styles.metodoNome}>{metodo.nome}</Text>
          <Text style={styles.metodoDescricao}>{metodo.descricao}</Text>
          {metodo.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
        </View>
        <View style={styles.metodoRadio}>
          <View style={[
            styles.radioCircle,
            metodoPagamento === metodo.id && styles.radioCircleSelected
          ]} />
        </View>
      </View>
      <View style={styles.metodoDetails}>
        <Text style={styles.metodoTaxas}>{metodo.taxas}</Text>
        <Text style={styles.metodoTempo}>{metodo.tempo}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* ✅ CABEÇALHO */}
      <Header 
        title="Pagamento"
        subtitle={`${lojaAtual?.nome || 'Loja'} - Finalizar compra`}
        backgroundColor={corLoja}
      />

      {/* 📊 Resumo da Compra */}
      <View style={styles.resumoContainer}>
        <Text style={styles.resumoTitle}>Resumo da Compra</Text>
        <View style={styles.resumoItem}>
          <Text style={styles.resumoLabel}>Produtos ({carrinho.length})</Text>
          <Text style={styles.resumoValue}>R$ {totalCarrinho.toFixed(2)}</Text>
        </View>
        {metodoSelecionado && (
          <View style={styles.resumoItem}>
            <Text style={styles.resumoLabel}>Taxas</Text>
            <Text style={styles.resumoValue}>
              R$ {(calcularTotalComTaxas() - totalCarrinho).toFixed(2)}
            </Text>
          </View>
        )}
        <View style={[styles.resumoTotal, { borderTopColor: corLoja }]}>
          <Text style={styles.resumoTotalLabel}>Total</Text>
          <Text style={[styles.resumoTotalValue, { color: corLoja }]}>
            R$ {calcularTotalComTaxas().toFixed(2)}
          </Text>
        </View>
      </View>

      {/* 💳 Métodos de Pagamento */}
      <View style={styles.pagamentoContainer}>
        <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
        {metodosPagamento.map(renderMetodoPagamento)}
      </View>

      {/* 📋 Formulário de Pagamento */}
      {metodoPagamento && (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Detalhes do Pagamento</Text>
          
          {/* PIX */}
          {metodoPagamento === 'pix' && (
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Chave PIX</Text>
              <TextInput
                style={styles.input}
                value={pixKey}
                onChangeText={setPixKey}
                placeholder="CPF, CNPJ, Email ou Telefone"
                keyboardType="email-address"
              />
              <TouchableOpacity style={styles.qrButton}>
                <Ionicons name="qr-code-outline" size={20} color={corLoja} />
                <Text style={styles.qrButtonText}>Escanear QR Code</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* PIX com Cartão */}
          {(metodoPagamento === 'pix_credito' || metodoPagamento === 'cartao_credito') && (
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Número do Cartão</Text>
              <TextInput
                style={styles.input}
                value={numeroCartao}
                onChangeText={setNumeroCartao}
                placeholder="0000 0000 0000 0000"
                keyboardType="numeric"
                maxLength={19}
              />
              
              <Text style={styles.formLabel}>Nome do Titular</Text>
              <TextInput
                style={styles.input}
                value={nomeTitular}
                onChangeText={setNomeTitular}
                placeholder="Como está no cartão"
              />
              
              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Text style={styles.formLabel}>Validade</Text>
                  <TextInput
                    style={styles.input}
                    value={validade}
                    onChangeText={setValidade}
                    placeholder="MM/AA"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.formLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              {metodoSelecionado?.parcelas && (
                <>
                  <Text style={styles.formLabel}>Número de Parcelas</Text>
                  <View style={styles.parcelasContainer}>
                    {[1, 2, 3, 6, 12].map(num => (
                      <TouchableOpacity
                        key={num}
                        style={[
                          styles.parcelaButton,
                          parcelas === num.toString() && styles.parcelaButtonSelected
                        ]}
                        onPress={() => setParcelas(num.toString())}
                      >
                        <Text style={[
                          styles.parcelaText,
                          parcelas === num.toString() && styles.parcelaTextSelected
                        ]}>
                          {num}x
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </View>
          )}

          {/* Carteira Digital */}
          {(metodoPagamento === 'apple_pay' || metodoPagamento === 'google_pay') && (
            <View style={styles.walletSection}>
              <TouchableOpacity style={styles.walletButton}>
                <Ionicons 
                  name={metodoPagamento === 'apple_pay' ? 'logo-apple' : 'logo-google'} 
                  size={24} 
                  color={corLoja} 
                />
                <Text style={styles.walletButtonText}>
                  Pagar com {metodoSelecionado?.nome}
                </Text>
              </TouchableOpacity>
              <Text style={styles.walletDescription}>
                Pagamento seguro por aproximação ou biometria
              </Text>
            </View>
          )}

          {/* Boleto */}
          {metodoPagamento === 'boleto' && (
            <View style={styles.boletoSection}>
              <Text style={styles.boletoText}>
                O boleto será gerado após confirmação e enviado para seu e-mail.
                Vencimento em 3 dias úteis.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* 🎯 Botão de Pagamento */}
      {metodoPagamento && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.payButton,
              { backgroundColor: corLoja },
              processando && styles.payButtonDisabled
            ]}
            onPress={handleProcessarPagamento}
            disabled={processando}
          >
            {processando ? (
              <Text style={styles.payButtonText}>Processando...</Text>
            ) : (
              <>
                <Ionicons name="lock-closed-outline" size={20} color="white" />
                <Text style={styles.payButtonText}>
                  Pagar R$ {calcularTotalComTaxas().toFixed(2)}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 🔒 Segurança */}
      <View style={styles.segurancaContainer}>
        <Ionicons name="shield-checkmark-outline" size={20} color="#4CAF50" />
        <Text style={styles.segurancaText}>
          Pagamento 100% seguro com criptografia de ponta a ponta
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
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
  resumoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  resumoItem: {
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
  pagamentoContainer: {
    margin: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  metodoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  metodoCardSelected: {
    borderWidth: 2,
    borderColor: '#4CAF50'
  },
  metodoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  metodoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  metodoInfo: {
    flex: 1
  },
  metodoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  metodoDescricao: {
    fontSize: 14,
    color: '#666'
  },
  popularBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  popularText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600'
  },
  metodoRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent'
  },
  radioCircleSelected: {
    backgroundColor: '#4CAF50'
  },
  metodoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  metodoTaxas: {
    fontSize: 12,
    color: '#666'
  },
  metodoTempo: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600'
  },
  formContainer: {
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
  formSection: {
    marginBottom: 20
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    marginBottom: 16
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12
  },
  inputHalf: {
    flex: 1
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    gap: 8
  },
  qrButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  parcelasContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  parcelaButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 60
  },
  parcelaButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50'
  },
  parcelaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  parcelaTextSelected: {
    color: 'white'
  },
  walletSection: {
    alignItems: 'center',
    padding: 20
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    gap: 12,
    marginBottom: 12
  },
  walletButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  walletDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  boletoSection: {
    padding: 20,
    alignItems: 'center'
  },
  boletoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20
  },
  actionContainer: {
    padding: 20,
    gap: 12
  },
  payButton: {
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
  payButtonDisabled: {
    backgroundColor: '#CCC',
    elevation: 0
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600'
  },
  segurancaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8
  },
  segurancaText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600'
  }
});
