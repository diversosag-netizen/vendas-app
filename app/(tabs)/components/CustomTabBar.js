import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useApp } from '../../context/AppContext';

export default function CustomTabBar({ state, descriptors, navigation }) {
  const router = useRouter();
  const pathname = usePathname();
  const { lojaAtual, trocarLoja } = useApp();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(Platform.OS !== 'web');
  }, []);

  // Optional Chaining e fallbacks para evitar Type Errors
  const corLojaSegura = lojaAtual?.cor || '#2196F3';
  const nomeLojaSeguro = lojaAtual?.nome || 'Loja';

  // ✅ CORRIGIDO: Mapeamento correto para arquivos existentes
  const handleTabPress = (routeName) => {
    if (routeName === 'index') {
      router.push('/'); // Rota index -> Dashboard
    } else if (routeName === 'catalogo') {
      router.push('/catalogo'); // Rota catalogo -> Catálogo
    } else if (routeName === 'vendas') {
      router.push('/vendas'); // ✅ CORRIGIDO: Rota vendas -> Vendas (arquivo existente)
    } else if (routeName === 'config') {
      router.push('/config'); // ✅ CORRIGIDO: Rota config -> Configurações (arquivo existente)
    }
  };

  const handleExitStore = () => {
    Alert.alert(
      'Sair da Loja',
      `Deseja sair da ${nomeLojaSeguro} e voltar ao início?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            router.push('/lobby');
          }
        }
      ]
    );
  };

  // Aba ativa
  const getActiveTab = () => {
    if (pathname === '/' || pathname.includes('index')) return 'index';
    if (pathname.includes('catalogo')) return 'catalogo';
    if (pathname.includes('vendas')) return 'vendas';
    if (pathname.includes('config')) return 'config';
    return 'index';
  };

  const activeTab = getActiveTab();

  return (
    <View style={styles.container}>
      {/* ✅ FAIXA PROTETORA: Protege ícones da câmera com cor da marca */}
      <View style={[
        styles.statusBarSpacer,
        { backgroundColor: corLojaSegura }
      ]} />

      {/* Botões Principais */}
      <View style={styles.mainTabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'index' && styles.activeTab,
            isMobile && styles.tabMobile
          ]}
          onPress={() => handleTabPress('index')}
        >
          <Ionicons 
            name="home-outline" 
            size={isMobile ? 20 : 24} 
            color={activeTab === 'index' ? '#007AFF' : '#666'} 
          />
          {!isMobile && (
            <Text style={[
              styles.tabText,
              activeTab === 'index' && styles.activeTabText
            ]}>
              Início
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'catalogo' && styles.activeTab,
            isMobile && styles.tabMobile
          ]}
          onPress={() => handleTabPress('catalogo')}
        >
          <Ionicons 
            name="storefront-outline" 
            size={isMobile ? 20 : 24} 
            color={activeTab === 'catalogo' ? '#007AFF' : '#666'} 
          />
          {!isMobile && (
            <Text style={[
              styles.tabText,
              activeTab === 'catalogo' && styles.activeTabText
            ]}>
              Catálogo
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'vendas' && styles.activeTab,
            isMobile && styles.tabMobile
          ]}
          onPress={() => handleTabPress('vendas')}
        >
          <Ionicons 
            name="cart-outline" 
            size={isMobile ? 20 : 24} 
            color={activeTab === 'vendas' ? '#007AFF' : '#666'} 
          />
          {!isMobile && (
            <Text style={[
              styles.tabText,
              activeTab === 'vendas' && styles.activeTabText
            ]}>
              Vendas
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'config' && styles.activeTab,
            isMobile && styles.tabMobile
          ]}
          onPress={() => handleTabPress('config')}
        >
          <Ionicons 
            name="settings-outline" 
            size={isMobile ? 20 : 24} 
            color={activeTab === 'config' ? '#007AFF' : '#666'} 
          />
          {!isMobile && (
            <Text style={[
              styles.tabText,
              activeTab === 'config' && styles.activeTabText
            ]}>
              Config
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Botão Sair (opcional) */}
      {isMobile && (
        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleExitStore}
        >
          <Ionicons name="log-out-outline" size={18} color="#FF3B30" />
          <Text style={styles.exitButtonText}>Sair</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  // ✅ FAIXA PROTETORA: Altura da StatusBar para proteger ícones
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000
  },
  containerMobile: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    elevation: 6,
    shadowOffset: { width: 0, height: -1 },
    shadowRadius: 3
  },
  mainTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 10,
    marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) : 20
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    minWidth: 80,
    gap: 6
  },
  tabMobile: {
    flexDirection: 'column',
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 60,
    gap: 2
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  activeTabText: {
    color: '#007AFF'
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    gap: 6
  },
  exitButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30'
  }
});
