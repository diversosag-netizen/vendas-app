import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import Header from '../components/Header';

// ✅ CORRIGIDO: Variável bannerHeight definida fora do componente
const bannerHeight = 150;

export default function ConfigScreen() {
  const router = useRouter();
  const { lojaAtual, atualizarBannerLoja, perfil, togglePerfil, vendas, logout } = useApp();
  const [abaAtiva, setAbaAtiva] = useState('config'); // 'config', 'profile' ou 'relatorios'
  
  // Estados para o banner
  const [bannerUrl, setBannerUrl] = useState(lojaAtual?.banner || '');
  const [previewUrl, setPreviewUrl] = useState(lojaAtual?.banner || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Dados do usuário e loja
  const nomeLoja = lojaAtual?.nome || 'Minha Loja';
  const corLoja = lojaAtual?.cor || '#4CAF50';
  const usuarioNome = perfil?.nome || 'Usuário';

  // ✅ FUNÇÕES DO BANNER INTEGRADAS
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

  // ✅ FUNÇÕES DO PROFILE INTEGRADAS
  const handleTogglePerfil = () => {
    togglePerfil();
    Alert.alert('Sucesso', 'Perfil alternado com sucesso!');
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
          style: 'destructive',
          onPress: () => {
            // Lógica para sair da loja
            router.push('/');
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair do App',
      'Deseja sair do aplicativo?',
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
            router.push('/');
          }
        }
      ]
    );
  };

  // ✅ FUNÇÕES DE RELATÓRIOS INTEGRADAS
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

  // ✅ DADOS DE RELATÓRIOS
  const vendasPorData = {};
  (vendas || []).forEach(venda => {
    const data = venda.data || 'Sem data';
    if (!vendasPorData[data]) {
      vendasPorData[data] = [];
    }
    vendasPorData[data].push(venda);
  });

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
    <>
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
          {/* ✅ CARDS MODERNOS - Layout em Grade */}
          <View style={styles.cardsContainer}>
            {/* Card Banner */}
            <View style={styles.configCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="image-outline" size={24} color={corLoja} />
                <Text style={styles.cardTitle}>Banner da Loja</Text>
              </View>
              
              <View style={styles.cardContent}>
                {previewUrl ? (
                  <Image
                    source={{ uri: previewUrl }}
                    style={styles.bannerCardImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.bannerCardPlaceholder, { backgroundColor: corLoja }]}>
                    <Ionicons name="image-outline" size={40} color="white" />
                    <Text style={styles.bannerPlaceholderText}>Nenhum banner</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.cardButton, { backgroundColor: corLoja }]}
                  onPress={pickImage}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="image-outline" size={20} color="white" />
                  )}
                  <Text style={styles.cardButtonText}>Selecionar</Text>
                </TouchableOpacity>
                
                {bannerUrl && (
                  <TouchableOpacity
                    style={[styles.cardButton, styles.saveCardButton]}
                    onPress={uploadBanner}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Ionicons name="save-outline" size={20} color="white" />
                    )}
                    <Text style={styles.cardButtonText}>Salvar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </>
      ) : (
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
              <Text style={styles.toggleButtonText}>Alternar Perfil</Text>
            </TouchableOpacity>
          </View>

          {/* Menu */}
          <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>Ações do Perfil</Text>
            {menuItems.map(renderMenuItem)}
          </View>
        </>
      )}
      
      {abaAtiva === 'relatorios' && (
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
                Análise de Vendas
              </Text>
            </View>
          </View>

          {/* Statistics Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{vendas?.length || 0}</Text>
              <Text style={styles.statLabel}>Vendas Realizadas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{Object.keys(vendasPorData).length}</Text>
              <Text style={styles.statLabel}>Dias com Vendas</Text>
            </View>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  // ✅ ESTILOS DAS ABAS
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  tabActive: {
    backgroundColor: '#F0F0F0'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666'
  },
  tabTextActive: {
    color: '#333',
    fontWeight: '600'
  },
  // ✅ ESTILOS DOS CARDS MODERNOS
  cardsContainer: {
    padding: 20,
    gap: 20
  },
  configCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
    gap: 12
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 12
  },
  bannerCardImage: {
    width: '100%',
    height: 120,
    borderRadius: 8
  },
  bannerCardPlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bannerPlaceholderText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8
  },
  cardActions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 12,
    gap: 12
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    flex: 1
  },
  saveCardButton: {
    backgroundColor: '#4CAF50'
  },
  cardButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  // ✅ ESTILOS DO PROFILE (mantidos)
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  backButton: {
    padding: 8
  },
  headerContent: {
    flex: 1,
    marginLeft: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)'
  },
  userInfoContainer: {
    alignItems: 'center',
    padding: 40
  },
  avatarContainer: {
    marginBottom: 20
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
    marginBottom: 8
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  menuContainer: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    marginRight: 16
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  // ✅ ESTILOS DOS RELATÓRIOS (mantidos)
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16
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
    color: '#333'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  exportContainer: {
    padding: 20
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
