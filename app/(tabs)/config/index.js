import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, Dimensions, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../context/AppContext';

// ✅ CORRIGIDO: Variável bannerHeight definida fora do componente
const bannerHeight = 150;

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

  return (
    <ScrollView style={styles.container}>
      {/* ✅ FAIXA PROTETORA: Protege ícones da câmera com cor da marca */}
      <View style={[
        styles.statusBarSpacer,
        { backgroundColor: corLoja }
      ]} />

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
  }
});
