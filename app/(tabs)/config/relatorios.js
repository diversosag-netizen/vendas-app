import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import Header from '../components/Header';

export default function RelatoriosScreen() {
  const router = useRouter();
  const { lojaAtual, vendas } = useApp();
  
  const nomeLoja = lojaAtual?.nome || 'Minha Loja';
  const corLoja = lojaAtual?.cor || '#4CAF50';

  return (
    <>
      <ScrollView style={styles.container}>
        <Header 
          title="Relatórios"
          subtitle={nomeLoja}
          backgroundColor={corLoja}
        />
        
        <View style={styles.content}>
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={80} color="#CCC" />
            <Text style={styles.emptyTitle}>Relatórios em Construção</Text>
            <Text style={styles.emptySubtitle}>
              Estamos trabalhando para trazer análises detalhadas das suas vendas
            </Text>
            <Text style={styles.emptyInfo}>
              Em breve você terá acesso a:
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Vendas por período</Text>
              <Text style={styles.featureItem}>• Produtos mais vendidos</Text>
              <Text style={styles.featureItem}>• Relatório de estoque</Text>
              <Text style={styles.featureItem}>• Análise de lucratividade</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* ✅ BOTÃO VOLTAR - Parte inferior direita */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/config')}
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
    flex: 1,
    padding: 20
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24
  },
  emptyInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  featuresList: {
    alignItems: 'flex-start',
    width: '100%'
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20
  },
  // ✅ ESTILOS DO BOTÃO VOLTAR
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
