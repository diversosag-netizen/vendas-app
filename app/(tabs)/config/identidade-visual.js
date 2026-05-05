import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch
} from 'react-native';
import { useApp } from '../../context/AppContext';
import Header from '../components/Header';

export default function IdentidadeVisualScreen() {
  const router = useRouter();
  const { lojaAtual, temaAtual } = useApp();
  
  // 🎨 Temas pré-definidos
  const temasPredefinidos = {
    ocean: {
      nome: 'Ocean Blue',
      descricao: 'Tons de azul oceânico',
      cores: ['#E3F2FD', '#64B5F6', '#2196F3', '#0D47A1', '#01579B']
    },
    forest: {
      nome: 'Forest Green',
      descricao: 'Tons de verde florestal',
      cores: ['#E8F5E8', '#81C784', '#4CAF50', '#2E7D32', '#1B5E20']
    },
    sunset: {
      nome: 'Sunset Orange',
      descricao: 'Tons de laranja pôr do sol',
      cores: ['#FFF3E0', '#FFB74D', '#FF9800', '#E65100', '#BF360C']
    },
    royal: {
      nome: 'Royal Purple',
      descricao: 'Tons de roxo real',
      cores: ['#F3E5F5', '#BA68C8', '#9C27B0', '#6A1B9A', '#4A148C']
    },
    classic: {
      nome: 'Classic Silver',
      descricao: 'Tons de cinza executivo',
      cores: ['#F5F5F5', '#BDBDBD', '#757575', '#424242', '#212121']
    },
    berry: {
      nome: 'Berry Wine',
      descricao: 'Tons de roxo rosado',
      cores: ['#FCE4EC', '#F48FB1', '#E91E63', '#C2185B', '#880E4F']
    }
  };

  const [temaSelecionado, setTemaSelecionado] = useState('forest'); // Padrão
  const [gradEnabled, setGradEnabled] = useState(true);

  // Função para salvar tema
  const salvarTema = () => {
    Alert.alert(
      'Salvar Tema',
      `Deseja aplicar o tema "${temasPredefinidos[temaSelecionado].nome}" à sua loja?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Aplicar',
          onPress: () => {
            // TODO: Implementar salvamento real
            Alert.alert('Sucesso', 'Tema aplicado com sucesso!');
            router.back();
          }
        }
      ]
    );
  };

  // Renderizar preview do botão
  const renderPreviewButton = (cor, texto) => (
    <View style={styles.previewButton}>
      <View style={[styles.previewButtonInner, { backgroundColor: cor }]}>
        <Ionicons name="storefront-outline" size={16} color="white" />
        <Text style={styles.previewButtonText}>{texto}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Identidade Visual" showBack={true} />
      
      <ScrollView style={styles.content}>
        {/* 📋 Informações Atuais */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Tema Atual</Text>
          <Text style={styles.infoSubtitle}>{lojaAtual?.nome || 'Minha Loja'}</Text>
          <View style={styles.currentThemePreview}>
            <View style={[styles.currentColorBox, { backgroundColor: temaAtual?.primary || '#4CAF50' }]} />
            <Text style={styles.currentThemeText}>Tema personalizado</Text>
          </View>
        </View>

        {/* 🎨 Seletor de Paleta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seletor de Paleta</Text>
          <Text style={styles.sectionSubtitle}>Escolha um tema para sua loja</Text>
          
          <View style={styles.themesGrid}>
            {Object.entries(temasPredefinidos).map(([key, tema]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeCard,
                  temaSelecionado === key && styles.themeCardSelected
                ]}
                onPress={() => setTemaSelecionado(key)}
                activeOpacity={0.8}
              >
                <View style={styles.themeColors}>
                  {tema.cores.slice(0, 3).map((cor, index) => (
                    <View
                      key={index}
                      style={[styles.themeColorDot, { backgroundColor: cor }]}
                    />
                  ))}
                </View>
                <Text style={styles.themeName}>{tema.nome}</Text>
                <Text style={styles.themeDescription}>{tema.descricao}</Text>
                {temaSelecionado === key && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ⚙️ Configuração de Degradê */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchTitle}>Configuração de Degradê</Text>
              <Text style={styles.switchSubtitle}>Efeito do claro para o escuro nos botões</Text>
            </View>
            <Switch
              value={gradEnabled}
              onValueChange={setGradEnabled}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={gradEnabled ? '#FFFFFF' : '#757575'}
            />
          </View>
        </View>

        {/* 👁️ Preview em Tempo Real */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview em Tempo Real</Text>
          <Text style={styles.sectionSubtitle}>Veja como ficará sua loja</Text>
          
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Botões do Dashboard</Text>
            
            {gradEnabled ? (
              <>
                {renderPreviewButton(temasPredefinidos[temaSelecionado].cores[1], 'Catálogo')}
                {renderPreviewButton(temasPredefinidos[temaSelecionado].cores[2], 'Promoções')}
                {renderPreviewButton(temasPredefinidos[temaSelecionado].cores[3], 'Vendas')}
                {renderPreviewButton(temasPredefinidos[temaSelecionado].cores[4], 'Config')}
              </>
            ) : (
              <>
                {renderPreviewButton(temasPredefinidos[temaSelecionado].cores[2], 'Catálogo')}
                {renderPreviewButton(temasPredefinidos[temaSelecionado].cores[2], 'Promoções')}
                {renderPreviewButton(temasPredefinidos[temaSelecionado].cores[2], 'Vendas')}
                {renderPreviewButton(temasPredefinidos[temaSelecionado].cores[2], 'Config')}
              </>
            )}
          </View>
        </View>

        {/* 💾 Botão Salvar */}
        <View style={styles.saveSection}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={salvarTema}
            activeOpacity={0.8}
          >
            <Ionicons name="save-outline" size={20} color="white" />
            <Text style={styles.saveButtonText}>Aplicar Tema</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15
  },
  currentThemePreview: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  currentColorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10
  },
  currentThemeText: {
    fontSize: 14,
    color: '#666'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
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
    marginBottom: 5
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15
  },
  themesGrid: {
    gap: 15
  },
  themeCard: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    position: 'relative'
  },
  themeCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8'
  },
  themeColors: {
    flexDirection: 'row',
    marginBottom: 10
  },
  themeColorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  themeDescription: {
    fontSize: 12,
    color: '#666'
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  switchContent: {
    flex: 1
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  switchSubtitle: {
    fontSize: 14,
    color: '#666'
  },
  previewContainer: {
    gap: 10
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  previewButton: {
    marginBottom: 10
  },
  previewButtonInner: {
    height: 50,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20
  },
  previewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  saveSection: {
    marginTop: 20,
    marginBottom: 40
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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
  }
});
