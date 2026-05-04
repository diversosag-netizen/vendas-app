import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, Dimensions, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../context/AppContext';
import Header from '../components/Header';

// ✅ CORRIGIDO: Variável bannerHeight definida fora do componente
const bannerHeight = 150;

export default function ConfigScreen() {
  const router = useRouter();
  const { lojaAtual, atualizarBannerLoja, perfil, togglePerfil, vendas, logout } = useApp();
  const [abaAtiva, setAbaAtiva] = useState('config'); // 'config', 'profile' ou 'relatorios'
  
  // 2. OPTIONAL CHAINING: Verificação de existência para objeto de usuário e loja
  const nomeLoja = lojaAtual?.nome || 'Configurações Gerais';
  const corLoja = lojaAtual?.cor || '#4CAF50';
  const bannerExistente = lojaAtual?.bannerImage || '';
  
  // Verificação de usuário (se existir no contexto)
  const usuarioNome = 'Usuário'; // Valor padrão para usuário
  const usuarioPerfil = perfil || 'admin'; // Valor padrão para perfil
  
  const [bannerUrl, setBannerUrl] = useState(bannerExistente);
  const [previewUrl, setPreviewUrl] = useState(bannerExistente);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  // ✅ FUNÇÕES DO PROFILE INTEGRADAS
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
      'Deseja sair da loja atual?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
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
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  // ✅ FUNÇÕES DE RELATÓRIOS INTEGRADAS
  const totalVendas = (vendas || []).reduce((acc, venda) => acc + parseFloat(venda.valor || 0), 0);
  const vendasHoje = (vendas || []).filter(venda => venda.data === new Date().toLocaleDateString());
  const totalItens = (vendas || []).reduce((acc, venda) => acc + (venda.quantidade || 1), 0);
  const mediaPorVenda = totalVendas > 0 ? totalVendas / (vendas || []).length : 0;
  const vendasPorData = {};
  
  (vendas || []).forEach(venda => {
    const data = venda.data || 'Sem data';
    if (!vendasPorData[data]) {
      vendasPorData[data] = [];
    }
    vendasPorData[data].push(venda);
  });

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
            Alert.alert('Sucesso', 'Relatório exportado com sucesso!');
          }
        }
      ]
    );
  };

  // Função para selecionar imagem com permissões corretas
  const pickImage = async () => {
    try {
      setIsLoading(true);
      
      // Solicitar permissões da biblioteca de mídia
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos de acesso à galeria para selecionar uma imagem.');
        setIsLoading(false);
        return;
      }

      // Abrir o seletor de imagens
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        setBannerUrl(selectedImage.uri);
        setPreviewUrl(selectedImage.uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fazer upload do banner
  const uploadBanner = async () => {
    if (!bannerUrl) {
      Alert.alert('Erro', 'Por favor, selecione uma imagem primeiro.');
      return;
    }

    try {
      setIsUploading(true);
      
      // Simulação de upload (em um app real, você faria upload para um servidor)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar o banner no contexto
      await atualizarBannerLoja(bannerUrl);
      
      Alert.alert('Sucesso', 'Banner atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o banner. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  // Função para remover o banner
  const removeBanner = () => {
    Alert.alert(
      'Remover Banner',
      'Deseja remover o banner atual?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setBannerUrl('');
            setPreviewUrl('');
            Alert.alert('Sucesso', 'Banner removido com sucesso!');
          }
        }
      ]
    );
  };

  // ✅ MENU ITEMS DO PROFILE INTEGRADOS
  const menuItems = [
    {
      id: '1',
      title: 'Configurações da Loja',
      icon: 'storefront-outline',
      color: '#4CAF50',
      onPress: () => setAbaAtiva('config')
    },
    {
      id: '2',
      title: 'Relatórios de Vendas',
      icon: 'stats-chart-outline',
      color: '#2196F3',
      onPress: () => setAbaAtiva('relatorios')
    },
    {
      id: '3',
      title: 'Sair da Loja',
      icon: 'log-out-outline',
      color: '#FF9800',
      onPress: handleExitStore
    },
    {
      id: '4',
      title: 'Sair do App',
      icon: 'power-outline',
      color: '#FF3B30',
      onPress: handleLogout
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
      {/* ✅ CABEÇALHO DINÂMICO: Componente único com props */}
      <Header 
        title="Configurações"
        subtitle={nomeLoja}
        backgroundColor={corLoja}
      />

      {/* ✅ ABAS INTEGRADAS: Config, Profile e Relatórios */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'config' && styles.tabActive]}
          onPress={() => setAbaAtiva('config')}
        >
          <Text style={[styles.tabText, abaAtiva === 'config' && styles.tabTextActive]}>
            Loja
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'profile' && styles.tabActive]}
          onPress={() => setAbaAtiva('profile')}
        >
          <Text style={[styles.tabText, abaAtiva === 'profile' && styles.tabTextActive]}>
            Perfil
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'relatorios' && styles.tabActive]}
          onPress={() => setAbaAtiva('relatorios')}
        >
          <Text style={[styles.tabText, abaAtiva === 'relatorios' && styles.tabTextActive]}>
            Relatórios
          </Text>
        </TouchableOpacity>
      </View>

      {abaAtiva === 'config' ? (
        <>
          {/* Banner Preview */}
          <View style={styles.bannerContainer}>
            <Text style={styles.sectionTitle}>Banner da Loja</Text>
            
            {previewUrl ? (
              <View style={styles.bannerPreview}>
                <Image
                  source={{ uri: previewUrl }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                <View style={styles.bannerActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={removeBanner}
                  >
                    <Ionicons name="trash-outline" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={[styles.bannerPlaceholder, { backgroundColor: corLoja }]}>
                <Ionicons name="image-outline" size={40} color="white" />
                <Text style={styles.bannerPlaceholderText}>Nenhum banner configurado</Text>
              </View>
            )}
          </View>

          {/* Upload Controls */}
          <View style={styles.uploadContainer}>
            <Text style={styles.sectionTitle}>Gerenciar Banner</Text>
            
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: corLoja }]}
              onPress={pickImage}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="image-outline" size={24} color="white" />
              )}
              <Text style={styles.uploadButtonText}>
                {isLoading ? 'Carregando...' : 'Selecionar Imagem'}
              </Text>
            </TouchableOpacity>

            {bannerUrl && (
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: '#4CAF50' }]}
                onPress={uploadBanner}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="save-outline" size={20} color="white" />
                )}
                <Text style={styles.saveButtonText}>
                  {isUploading ? 'Salvando...' : 'Salvar Banner'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Store Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Informações da Loja</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nome:</Text>
                <Text style={styles.infoValue}>{nomeLoja}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cor:</Text>
                <View style={[styles.colorIndicator, { backgroundColor: corLoja }]} />
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Usuário:</Text>
                <Text style={styles.infoValue}>{usuarioNome}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Perfil:</Text>
                <Text style={styles.infoValue}>{usuarioPerfil}</Text>
              </View>
            </View>
          </View>

          {/* Additional Settings */}
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>Configurações Adicionais</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={24} color="#666" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notificações</Text>
                <Text style={styles.settingDescription}>Gerenciar alertas e notificações</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="language-outline" size={24} color="#666" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Idioma</Text>
                <Text style={styles.settingDescription}>Português (Brasil)</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="shield-outline" size={24} color="#666" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacidade</Text>
                <Text style={styles.settingDescription}>Configurar privacidade e segurança</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </>
      ) : abaAtiva === 'profile' ? (
        <>
          {/* ✅ CONTEÚDO DO PROFILE INTEGRADO */}
          {/* Header */}
          <View style={[styles.profileHeader, { backgroundColor: corLoja }]}>
            <TouchableOpacity style={styles.backButton} onPress={() => setAbaAtiva('config')}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Perfil</Text>
              <Text style={styles.headerSubtitle}>
                {nomeLoja}
              </Text>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: corLoja }]}>
                <Ionicons name="person-outline" size={40} color="white" />
              </View>
            </View>
            <Text style={styles.userName}>{usuarioNome}</Text>
            <Text style={styles.userEmail}>usuario@exemplo.com</Text>
            
            <TouchableOpacity
              style={[styles.toggleButton, { backgroundColor: '#007AFF' }]}
              onPress={handleTogglePerfil}
            >
              <Ionicons name="swap-horizontal-outline" size={20} color="white" />
              <Text style={styles.toggleButtonText}>
                Trocar para {perfil === 'admin' ? 'Cliente' : 'Administrador'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Estatísticas do Perfil</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{totalVendas.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Total em Vendas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{vendas?.length || 0}</Text>
                <Text style={styles.statLabel}>Vendas Realizadas</Text>
              </View>
            </View>
          </View>

          {/* Menu */}
          <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>Ações do Perfil</Text>
            {menuItems.map(renderMenuItem)}
          </View>
        </>
      ) : (
        <>
          {/* ✅ CONTEÚDO DE RELATÓRIOS INTEGRADO */}
          {/* Header */}
          <View style={[styles.profileHeader, { backgroundColor: corLoja }]}>
            <TouchableOpacity style={styles.backButton} onPress={() => setAbaAtiva('config')}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Relatórios</Text>
              <Text style={styles.headerSubtitle}>
                {nomeLoja}
              </Text>
            </View>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Visão Geral</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>R$ {totalVendas.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Total Vendas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{totalItens}</Text>
                <Text style={styles.statLabel}>Total Itens</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>R$ {mediaPorVenda.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Média por Venda</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{vendasHoje.length}</Text>
                <Text style={styles.statLabel}>Vendas Hoje</Text>
              </View>
            </View>
          </View>

          {/* Sales by Date */}
          <View style={styles.salesContainer}>
            <Text style={styles.sectionTitle}>Vendas por Data</Text>
            {Object.entries(vendasPorData).map(([data, vendasData]) => (
              <View key={data} style={styles.salesCard}>
                <View style={styles.salesHeader}>
                  <Text style={styles.salesDate}>{data}</Text>
                  <Text style={styles.salesTotal}>
                    R$ {vendasData.reduce((acc, v) => acc + (v.valor || 0), 0).toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.salesDetails}>
                  {vendasData.length} venda(s) • {vendasData.reduce((acc, v) => acc + (v.quantidade || 1), 0)} item(s)
                </Text>
              </View>
            ))}
          </View>

          {/* Export Button */}
          <View style={styles.exportContainer}>
            <TouchableOpacity
              style={[styles.exportButton, { backgroundColor: corLoja }]}
              onPress={handleExportarRelatorio}
            >
              <Ionicons name="download-outline" size={20} color="white" />
              <Text style={styles.exportButtonText}>Exportar Relatório</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  tabActive: {
    backgroundColor: '#4CAF50'
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666'
  },
  tabTextActive: {
    color: 'white'
  },
  // ✅ ESTILOS DE CONFIG
  bannerContainer: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  bannerPreview: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  bannerImage: {
    width: '100%',
    height: bannerHeight,
    backgroundColor: '#F0F0F0'
  },
  bannerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4
  },
  removeButton: {
    backgroundColor: '#FF3B30'
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  bannerPlaceholder: {
    height: bannerHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    gap: 10
  },
  bannerPlaceholderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  uploadContainer: {
    padding: 20
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 15
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  infoContainer: {
    padding: 20
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  infoValue: {
    fontSize: 16,
    color: '#666'
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0'
  },
  settingsContainer: {
    padding: 20
  },
  settingItem: {
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
  settingContent: {
    flex: 1,
    marginLeft: 15
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  settingDescription: {
    fontSize: 14,
    color: '#666'
  },
  // ✅ ESTILOS DO PROFILE INTEGRADOS
  profileHeader: {
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
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
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20
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
  },
  // ✅ ESTILOS DE RELATÓRIOS INTEGRADOS
  salesContainer: {
    padding: 20
  },
  salesCard: {
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
  salesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  salesDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  salesTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  salesDetails: {
    fontSize: 12,
    color: '#666'
  },
  exportContainer: {
    padding: 20
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
