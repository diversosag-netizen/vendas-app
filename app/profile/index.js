import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { lojaAtual, perfil, togglePerfil, vendas, logout } = useApp();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(Platform.OS !== 'web');
  }, []);

  const handleTogglePerfil = () => {
    Alert.alert(
      'Trocar Perfil',
      `Deseja mudar de ${perfil === 'admin' ? 'Administrador' : 'Cliente'} para ${perfil === 'admin' ? 'Cliente' : 'Administrador'}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Confirmar',
          onPress: () => {
            togglePerfil();
            Alert.alert('Sucesso!', `Perfil alterado para ${perfil === 'admin' ? 'Cliente' : 'Administrador'}`);
          }
        }
      ]
    );
  };

  // ✅ IMPLEMENTADO: Sair da Loja com onPress={() => router.push('/')}
  const handleExitStore = () => {
    Alert.alert(
      'Sair da Loja',
      `Deseja sair da ${lojaAtual?.nome || 'Loja'} e voltar ao início?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            router.push('/'); // ✅ IMPLEMENTADO: Redireciona para tela inicial
          }
        }
      ]
    );
  };

  // ✅ IMPLEMENTADO: Sair do App com handleLogout e router.replace('/login')
  const handleLogout = () => {
    Alert.alert(
      'Sair do App',
      'Deseja sair completamente do aplicativo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            // ✅ IMPLEMENTADO: Limpa estado de login no AppContext
            logout();
            // ✅ IMPLEMENTADO: Redireciona para tela de Login
            router.replace('/login');
          }
        }
      ]
    );
  };

  const totalVendas = (vendas || []).reduce((acc, venda) => acc + parseFloat(venda.valor || 0), 0);

  const menuItems = [
    {
      id: '1',
      title: 'Configurações da Loja',
      icon: 'storefront-outline',
      color: '#4CAF50',
      onPress: () => router.push('/config')
    },
    {
      id: '2',
      title: 'Relatórios de Vendas',
      icon: 'stats-chart-outline',
      color: '#2196F3',
      onPress: () => router.push('/relatorios') // ✅ IMPLEMENTADO: Navegação para relatórios
    },
    {
      id: '3',
      title: 'Sair da Loja',
      icon: 'log-out-outline',
      color: '#FF9800',
      onPress: handleExitStore // ✅ IMPLEMENTADO: Sair da Loja
    },
    {
      id: '4',
      title: 'Sair do App',
      icon: 'power-outline',
      color: '#FF3B30',
      onPress: handleLogout // ✅ IMPLEMENTADO: Sair do App com logout
    }
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="white" />
      </View>
      <Text style={styles.menuItemText}>{item.title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* ✅ FAIXA PROTETORA: Protege ícones da câmera com cor da marca */}
      <View style={[
        styles.statusBarSpacer,
        { backgroundColor: lojaAtual?.cor || '#4CAF50' }
      ]} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: lojaAtual?.cor || '#4CAF50' }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <Text style={styles.headerSubtitle}>
            {lojaAtual?.nome || 'Loja'}
          </Text>
        </View>
      </View>

      {/* Informações do Usuário */}
      <View style={styles.userInfoContainer}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={80} color="#4CAF50" />
        </View>
        <Text style={styles.userName}>
          {perfil === 'admin' ? 'Administrador' : 'Cliente'}
        </Text>
        <Text style={styles.userEmail}>
          usuario@exemplo.com
        </Text>
        <TouchableOpacity style={styles.toggleButton} onPress={handleTogglePerfil}>
          <Ionicons name="swap-horizontal" size={20} color="white" />
          <Text style={styles.toggleButtonText}>
            Trocar para {perfil === 'admin' ? 'Cliente' : 'Admin'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="cart-outline" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{vendas?.length || 0}</Text>
            <Text style={styles.statLabel}>Vendas</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={24} color="#2196F3" />
            <Text style={styles.statValue}>R$ {totalVendas.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Menu de Ações */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Ações</Text>
        {menuItems.map(renderMenuItem)}
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
  userInfoContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  avatarContainer: {
    marginBottom: 15
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
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
    gap: 15
  },
  statCard: {
    flex: 1,
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
  menuContainer: {
    padding: 20
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  }
});
