import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../context/AppContext';

export default function ConfigScreen() {
  const router = useRouter();
  const { lojaAtual, atualizarBannerLoja } = useApp();
  
  // 2. OPTIONAL CHAINING: Verificação de existência para objeto de usuário e loja
  const nomeLoja = lojaAtual?.nome || 'Configurações Gerais';
  const corLoja = lojaAtual?.cor || '#4CAF50';
  const bannerExistente = lojaAtual?.bannerImage || '';
  
  // Verificação de usuário (se existir no contexto)
  const usuarioNome = 'Usuário'; // Valor padrão para usuário
  const usuarioPerfil = 'admin'; // Valor padrão para perfil
  
  const [bannerUrl, setBannerUrl] = useState(bannerExistente);
  const [previewUrl, setPreviewUrl] = useState(bannerExistente);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const bannerHeight = 150;

  // Função para selecionar imagem com permissões corretas
  const pickImage = async () => {
    try {
      setIsLoading(true);
      
      // Solicitar permissão no Android
      if (Platform.OS === 'android') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para selecionar imagens.');
          return;
        }
      }

      // Abrir galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setBannerUrl(selectedAsset.uri);
        setPreviewUrl(selectedAsset.uri);
        Alert.alert('Sucesso', 'Imagem selecionada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para visualizar banner
  const handlePreview = () => {
    if (!bannerUrl || !bannerUrl.trim()) {
      Alert.alert('ATENÇÃO', 'Digite uma URL ou selecione uma imagem!');
      return;
    }
    
    setPreviewUrl(bannerUrl.trim());
    Alert.alert('PREVIEW ATUALIZADO', 'Preview atualizado com sucesso!');
  };

  // Função para salvar banner
  const handleSave = () => {
    if (!bannerUrl || !bannerUrl.trim()) {
      Alert.alert('ATENÇÃO', 'Digite uma URL ou selecione uma imagem!');
      return;
    }

    setIsUploading(true);
    
    // Simular salvamento
    setTimeout(() => {
      if (atualizarBannerLoja) {
        atualizarBannerLoja(lojaAtual?.id || '1', bannerUrl.trim());
      }
      
      Alert.alert('SUCESSO', 'Banner salvo com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.push('/')
        }
      ]);
      setIsUploading(false);
    }, 1500);
  };

  // Função para remover banner
  const handleRemoveBanner = () => {
    Alert.alert(
      'REMOVER BANNER',
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
            if (atualizarBannerLoja) {
              atualizarBannerLoja(lojaAtual?.id || '1', null);
            }
            Alert.alert('SUCESSO', 'Banner removido com sucesso!');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: corLoja }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Configurações</Text>
          <Text style={styles.headerSubtitle}>{nomeLoja}</Text>
        </View>
      </View>

      {/* Informações do Usuário */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.sectionTitle}>Informações do Usuário</Text>
        <View style={styles.userInfoCard}>
          <View style={styles.userInfoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.userInfoLabel}>Nome:</Text>
            <Text style={styles.userInfoValue}>{usuarioNome}</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Ionicons name="settings-outline" size={20} color="#666" />
            <Text style={styles.userInfoLabel}>Perfil:</Text>
            <Text style={styles.userInfoValue}>{usuarioPerfil === 'admin' ? 'Administrador' : 'Cliente'}</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Ionicons name="storefront-outline" size={20} color="#666" />
            <Text style={styles.userInfoLabel}>Loja:</Text>
            <Text style={styles.userInfoValue}>{nomeLoja}</Text>
          </View>
        </View>
      </View>

      {/* Banner Preview */}
      <View style={styles.bannerContainer}>
        <Text style={styles.sectionTitle}>Banner da Loja</Text>
        
        {previewUrl ? (
          <Image
            source={{ uri: previewUrl }}
            style={[
              styles.bannerPreview,
              { width: screenWidth - 40, height: bannerHeight }
            ]}
            resizeMode="cover"
          />
        ) : (
          <View style={[
            styles.bannerPlaceholder,
            { backgroundColor: corLoja, width: screenWidth - 40, height: bannerHeight }
          ]}>
            <Ionicons name="image-outline" size={40} color="white" />
            <Text style={styles.bannerPlaceholderText}>
              Nenhum banner configurado
            </Text>
          </View>
        )}
      </View>

      {/* URL Input */}
      <View style={styles.urlContainer}>
        <Text style={styles.sectionTitle}>URL do Banner</Text>
        <TextInput
          style={styles.urlInput}
          value={bannerUrl}
          onChangeText={setBannerUrl}
          placeholder="https://exemplo.com/banner.jpg"
          multiline
        />
        <Text style={styles.urlHint}>
          Digite a URL de uma imagem ou use o botão abaixo para selecionar do dispositivo
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.previewButton} 
          onPress={handlePreview}
          disabled={isLoading || isUploading}
        >
          <Ionicons name="eye-outline" size={20} color="#007AFF" />
          <Text style={styles.previewButtonText}>Visualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.selectButton} 
          onPress={pickImage}
          disabled={isLoading || isUploading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <Ionicons name="image-outline" size={20} color="#4CAF50" />
          )}
          <Text style={styles.selectButtonText}>
            {isLoading ? 'Carregando...' : 'Selecionar Imagem'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Save and Remove */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: corLoja }]} 
          onPress={handleSave}
          disabled={isLoading || isUploading}
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

        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={handleRemoveBanner}
          disabled={isLoading || isUploading}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={styles.removeButtonText}>Remover Banner</Text>
        </TouchableOpacity>
      </View>

      {/* Recommendations */}
      <View style={styles.recommendations}>
        <Text style={styles.recommendationsTitle}>Recomendações</Text>
        <Text style={styles.recommendationsText}>
          • Use imagens com proporção 16:9 (ex: 800x450px)
          {'\n'}• Formatos aceitos: JPG, PNG, WebP
          {'\n'}• Tamanho máximo: 2MB
          {'\n'}• URLs devem ser acessíveis publicamente
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
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  userInfoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10
  },
  userInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1
  },
  userInfoValue: {
    fontSize: 14,
    color: '#333',
    flex: 2
  },
  bannerContainer: {
    padding: 20,
    alignItems: 'center'
  },
  bannerPreview: {
    borderRadius: 12,
    backgroundColor: '#F0F0F0'
  },
  bannerPlaceholder: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  bannerPlaceholderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  urlContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  urlInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    minHeight: 60,
    textAlignVertical: 'top'
  },
  urlHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    lineHeight: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 8
  },
  previewButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600'
  },
  selectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    gap: 8
  },
  selectButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600'
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginTop: 10
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    gap: 8
  },
  removeButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600'
  },
  recommendations: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  recommendationsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  }
});
