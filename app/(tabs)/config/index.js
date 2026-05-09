import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useApp } from '../../context/AppContext';
import Header from '../components/Header';

// ✅ CORRIGIDO: Variável bannerHeight definida fora do componente
const bannerHeight = 150;

export default function ConfigScreen() {
  const router = useRouter();
  const { lojaAtual, atualizarBannerLoja, logout, setLojaAtiva, userRole, isAuthenticated, salvarProdutoFirebase } = useApp();
  
  // Estados para o banner
  const [bannerUrl, setBannerUrl] = useState(lojaAtual?.banner || '');
  const [previewUrl, setPreviewUrl] = useState(lojaAtual?.banner || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 🔐 VENDAS 3.2: Gatilho de Bloqueio - Proteção de Bastidores
  useEffect(() => {
    if (!isAuthenticated || userRole !== 'admin') {
      Alert.alert(
        'Acesso Restrito',
        'Esta área é restrita a administradores. Você será redirecionado para a tela de login.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login-admin')
          }
        ]
      );
    }
  }, [isAuthenticated, userRole, router]);

  // ✅ Dados do usuário e loja
  const nomeLoja = lojaAtual?.nome || 'Minha Loja';
  const corLoja = lojaAtual?.cor || '#4CAF50';

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

  // 🔐 VENDAS 3.2: Fluxo de Saída Administrativa - Reset Completo
  const handleLogout = () => {
    Alert.alert(
      'Sair da Área Administrativa',
      'Deseja sair da área administrativa e voltar ao lobby?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            // Limpar estado de admin completamente
            logout();
            setLojaAtiva('1'); // Reset para loja padrão
            
            // Redirecionar para lobby
            if (Platform.OS === 'web') {
              window.location.href = '/lobby';
            } else {
              router.replace('/lobby');
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* ✅ CABEÇALHO DINÂMICO: Componente único com props */}
        <Header 
          title="Configurações"
          subtitle={nomeLoja}
          backgroundColor={corLoja}
        />
        
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

            {/* ✅ CARDS DE AÇÕES RÁPIDAS - Grade 2x2 */}
            <View style={styles.quickActionsGrid}>
              {/* Card Relatórios */}
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/config/relatorios')}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: '#2196F3' }]}>
                  <Ionicons name="stats-chart-outline" size={20} color="white" />
                </View>
                <View style={styles.quickActionContent}>
                  <Text style={styles.quickActionTitle}>Relatórios</Text>
                  <Text style={styles.quickActionSubtitle}>Ver vendas</Text>
                </View>
              </TouchableOpacity>

              {/* 🎨 Card Identidade Visual - NOVO */}
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/config/identidade-visual')}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: '#9C27B0' }]}>
                  <Ionicons name="palette-outline" size={20} color="white" />
                </View>
                <View style={styles.quickActionContent}>
                  <Text style={styles.quickActionTitle}>Identidade Visual</Text>
                  <Text style={styles.quickActionSubtitle}>Personalizar tema</Text>
                </View>
              </TouchableOpacity>

              {/* Card Perfil */}
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/config/perfil')}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: '#9C27B0' }]}>
                  <Ionicons name="person-outline" size={20} color="white" />
                </View>
                <View style={styles.quickActionContent}>
                  <Text style={styles.quickActionTitle}>Perfil</Text>
                  <Text style={styles.quickActionSubtitle}>Meus dados</Text>
                </View>
              </TouchableOpacity>

              {/* 🔐 VENDAS 3.2: Card Sair da Área Administrativa */}
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: '#F44336' }]}>
                  <Ionicons name="log-out-outline" size={20} color="white" />
                </View>
                <View style={styles.quickActionContent}>
                  <Text style={styles.quickActionTitle}>Sair Admin</Text>
                  <Text style={styles.quickActionSubtitle}>Voltar ao modo visitante</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
      </ScrollView>
      
      {/* ✅ BOTÃO VOLTAR - Parte inferior direita */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')}
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
  // ✅ ESTILOS DOS CARDS DE AÇÕES RÁPIDAS - Botões Uniformes como o "Selecionar"
  quickActionsGrid: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 8
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 12,
    width: '100%' // Botões de largura total uniformes
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickActionContent: {
    flex: 1,
    alignItems: 'flex-start'
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  quickActionSubtitle: {
    fontSize: 13,
    color: '#666'
  },
  // ✅ ESTILOS ADICIONAIS
  fullWidthCard: {
    width: '100%'
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
