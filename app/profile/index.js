import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { lojaAtual, perfil, togglePerfil, vendas } = useApp();
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

  const handleExitStore = () => {
    Alert.alert(
      'Sair da Loja',
      `Deseja sair da ${lojaAtual.nome} e voltar ao início?`,
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
            router.push('/lobby');
          }
        }
      ]
    );
  };

  const totalVendas = vendas.reduce((acc, venda) => acc + parseFloat(venda.valor || 0), 0);

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Meus Dados',
      subtitle: 'Informações pessoais',
      onPress: () => Alert.alert('Meus Dados', 'Funcionalidade em desenvolvimento')
    },
    {
      icon: 'location-outline',
      title: 'Endereços',
      subtitle: 'Gerenciar endereços de entrega',
      onPress: () => Alert.alert('Endereços', 'Funcionalidade em desenvolvimento')
    },
    {
      icon: 'card-outline',
      title: 'Formas de Pagamento',
      subtitle: 'Cartões e métodos de pagamento',
      onPress: () => Alert.alert('Pagamentos', 'Funcionalidade em desenvolvimento')
    },
    {
      icon: 'receipt-outline',
      title: 'Histórico de Compras',
      subtitle: 'Ver compras anteriores',
      onPress: () => Alert.alert('Histórico', 'Funcionalidade em desenvolvimento')
    },
    {
      icon: 'notifications-outline',
      title: 'Notificações',
      subtitle: 'Preferências de notificação',
      onPress: () => Alert.alert('Notificações', 'Funcionalidade em desenvolvimento')
    },
    {
      icon: 'help-circle-outline',
      title: 'Ajuda e Suporte',
      subtitle: 'Central de ajuda',
      onPress: () => Alert.alert('Ajuda', 'Funcionalidade em desenvolvimento')
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: lojaAtual.cor }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name={lojaAtual.logo} size={isMobile ? 28 : 32} color="white" />
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, isMobile && styles.headerTitleMobile]}>
              Perfil
            </Text>
            <Text style={[styles.headerSubtitle, isMobile && styles.headerSubtitleMobile]}>
              {lojaAtual.nome}
            </Text>
          </View>
        </View>
      </View>

      {/* Informações do Usuário */}
      <View style={styles.userSection}>
        <View style={styles.userAvatar}>
          <Ionicons name="person-outline" size={isMobile ? 40 : 50} color={lojaAtual.cor} />
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, isMobile && styles.userNameMobile]}>
            {perfil === 'admin' ? 'Administrador' : 'Cliente'}
          </Text>
          <Text style={[styles.userEmail, isMobile && styles.userEmailMobile]}>
            {perfil === 'admin' ? lojaAtual.admin : 'cliente@exemplo.com'}
          </Text>
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalVendas.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Compras</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>R$ {totalVendas.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu de Opções */}
      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
          Configurações
        </Text>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={[styles.menuIcon, { backgroundColor: lojaAtual.cor }]}>
              <Ionicons name={item.icon} size={isMobile ? 20 : 24} color="white" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, isMobile && styles.menuTitleMobile]}>
                {item.title}
              </Text>
              <Text style={[styles.menuSubtitle, isMobile && styles.menuSubtitleMobile]}>
                {item.subtitle}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={isMobile ? 16 : 20} color="#CCC" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: lojaAtual.cor }]}
          onPress={handleTogglePerfil}
        >
          <Ionicons name="swap-horizontal" size={isMobile ? 20 : 24} color="white" />
          <Text style={[styles.actionButtonText, isMobile && styles.actionButtonTextMobile]}>
            Trocar para {perfil === 'admin' ? 'Cliente' : 'Admin'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.exitStoreButton]}
          onPress={handleExitStore}
        >
          <Ionicons name="storefront-outline" size={isMobile ? 20 : 24} color="#FF9800" />
          <Text style={[styles.actionButtonText, isMobile && styles.actionButtonTextMobile]}>
            Sair da Loja
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={isMobile ? 20 : 24} color="#FF3B30" />
          <Text style={[styles.actionButtonText, isMobile && styles.actionButtonTextMobile]}>
            Sair do App
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  backButton: {
    marginRight: 15
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  headerText: {
    marginLeft: 12
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  headerTitleMobile: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 2
  },
  headerSubtitleMobile: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 2
  },
  userSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  userNameMobile: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15
  },
  userEmailMobile: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12
  },
  userStats: {
    flexDirection: 'row',
    gap: 20
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  menuSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 15,
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
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  sectionTitleMobile: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingTop: 15
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  menuContent: {
    flex: 1
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  menuTitleMobile: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666'
  },
  menuSubtitleMobile: {
    fontSize: 12,
    color: '#666'
  },
  actionsSection: {
    padding: 20,
    gap: 15
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  actionButtonTextMobile: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  exitStoreButton: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FF9800'
  },
  logoutButton: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FF3B30'
  }
});
