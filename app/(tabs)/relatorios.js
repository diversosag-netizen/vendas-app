import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function RelatoriosScreen() {
  const router = useRouter();
  const { vendas, lojaAtual } = useApp();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(Platform.OS !== 'web');
  }, []);

  // SOLUÇÃO: Garantir que vendas seja sempre um array
  const vendasSeguras = vendas || [];

  // Cálculos de relatórios
  const totalVendas = vendasSeguras.reduce((acc, venda) => acc + (venda.valor || 0), 0);
  const totalItens = vendasSeguras.reduce((acc, venda) => acc + (venda.quantidade || 1), 0);
  const mediaPorVenda = vendasSeguras.length > 0 ? totalVendas / vendasSeguras.length : 0;

  // Agrupar vendas por data
  const vendasPorData = vendasSeguras.reduce((acc, venda) => {
    const data = venda.data || new Date().toLocaleDateString();
    if (!acc[data]) {
      acc[data] = { data, total: 0, quantidade: 0, vendas: [] };
    }
    acc[data].total += venda.valor || 0;
    acc[data].quantidade += venda.quantidade || 1;
    acc[data].vendas.push(venda);
    return acc;
  }, {});

  const vendasAgrupadas = Object.values(vendasPorData).sort((a, b) => {
    // Ordenar por data (mais recente primeiro)
    return new Date(b.data) - new Date(a.data);
  });

  const renderVenda = (venda) => (
    <View key={venda.id} style={styles.vendaItem}>
      <View style={styles.vendaHeader}>
        <Text style={styles.vendaProduto}>{venda.produto || 'Produto'}</Text>
        <Text style={styles.vendaValor}>R$ {(venda.valor || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.vendaDetails}>
        <Text style={styles.vendaInfo}>Qtd: {venda.quantidade || 1}</Text>
        <Text style={styles.vendaInfo}>Data: {venda.data || 'N/A'}</Text>
        <Text style={styles.vendaInfo}>Hora: {venda.hora || 'N/A'}</Text>
      </View>
    </View>
  );

  const renderDiaVendas = (dia) => (
    <View key={dia.data} style={styles.diaContainer}>
      <View style={styles.diaHeader}>
        <Text style={styles.diaData}>{dia.data}</Text>
        <Text style={styles.diaTotal}>R$ {dia.total.toFixed(2)}</Text>
      </View>
      <View style={styles.vendasList}>
        {dia.vendas.map(renderVenda)}
      </View>
    </View>
  );

  const handleExportarRelatorio = () => {
    Alert.alert(
      'Exportar Relatório',
      'Deseja exportar o relatório de vendas?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Exportar',
          onPress: () => {
            // Simulação de exportação
            const relatorio = {
              periodo: 'Todo o período',
              totalVendas: totalVendas,
              totalItens: totalItens,
              mediaPorVenda: mediaPorVenda,
              vendas: vendasSeguras,
              dataGeracao: new Date().toLocaleString()
            };
            
            console.log('Relatório exportado:', relatorio);
            Alert.alert('Sucesso', 'Relatório exportado com sucesso!');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* ✅ FAIXA PROTETORA: Protege ícones da câmera com cor da marca */}
      <View style={[
        styles.statusBarSpacer,
        { backgroundColor: lojaAtual?.cor || '#4CAF50' }
      ]} />

      {/* Header */}
      <View style={[
        styles.header,
        { backgroundColor: lojaAtual?.cor || '#4CAF50' }
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Relatórios</Text>
          <Text style={styles.headerSubtitle}>
            {lojaAtual?.nome || 'Loja'}
          </Text>
        </View>
      </View>

      {/* Estatísticas Gerais */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Estatísticas Gerais</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="cart-outline" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{vendasSeguras.length}</Text>
            <Text style={styles.statLabel}>Vendas</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={24} color="#2196F3" />
            <Text style={styles.statValue}>R$ {totalVendas.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cube-outline" size={24} color="#FF9800" />
            <Text style={styles.statValue}>{totalItens}</Text>
            <Text style={styles.statLabel}>Itens</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up-outline" size={24} color="#9C27B0" />
            <Text style={styles.statValue}>R$ {mediaPorVenda.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Média</Text>
          </View>
        </View>
      </View>

      {/* Ações */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.exportButton} onPress={handleExportarRelatorio}>
          <Ionicons name="download-outline" size={20} color="white" />
          <Text style={styles.exportButtonText}>Exportar Relatório</Text>
        </TouchableOpacity>
      </View>

      {/* Vendas por Dia */}
      <View style={styles.vendasContainer}>
        <Text style={styles.sectionTitle}>Vendas por Dia</Text>
        
        {vendasAgrupadas.length > 0 ? (
          vendasAgrupadas.map(renderDiaVendas)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={60} color="#CCC" />
            <Text style={styles.emptyStateTitle}>
              Nenhuma venda registrada
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              As vendas realizadas aparecerão aqui
            </Text>
          </View>
        )}
      </View>

      {/* ✅ IMPLEMENTADO: Botões Funcionais no Final da Página */}
      <View style={styles.navigationContainer}>
        <Text style={styles.sectionTitle}>Navegação</Text>
        
        <View style={styles.buttonRow}>
          {/* Opção 1: Voltar uma tela no histórico */}
          <TouchableOpacity 
            style={[styles.navButton, styles.backButtonStyle]} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back-outline" size={20} color="white" />
            <Text style={styles.navButtonText}>Voltar</Text>
          </TouchableOpacity>

          {/* ✅ CORRIGIDO: Botão Perfil com rota correta */}
          <TouchableOpacity 
            style={[styles.navButton, styles.profileButtonStyle]} 
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person-outline" size={20} color="white" />
            <Text style={styles.navButtonText}>Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          {/* Opção 3: Voltar para Dashboard */}
          <TouchableOpacity 
            style={[styles.navButton, styles.dashboardButtonStyle]} 
            onPress={() => router.push('/')}
          >
            <Ionicons name="home-outline" size={20} color="white" />
            <Text style={styles.navButtonText}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  // ✅ FAIXA PROTETORA: Altura da StatusBar para proteger ícones
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
    width: '100%'
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
  statsContainer: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  vendasContainer: {
    padding: 20
  },
  diaContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  diaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  diaData: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  diaTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  vendasList: {
    padding: 15
  },
  vendaItem: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  vendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  vendaProduto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  vendaValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  vendaDetails: {
    flexDirection: 'row',
    gap: 15
  },
  vendaInfo: {
    fontSize: 12,
    color: '#666'
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    textAlign: 'center'
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center'
  },
  // ✅ IMPLEMENTADO: Estilos dos botões de navegação
  navigationContainer: {
    padding: 20,
    paddingBottom: 40
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8
  },
  backButtonStyle: {
    backgroundColor: '#FF9800'
  },
  profileButtonStyle: {
    backgroundColor: '#2196F3'
  },
  dashboardButtonStyle: {
    backgroundColor: '#4CAF50'
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  }
});
