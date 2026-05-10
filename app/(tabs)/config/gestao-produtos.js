import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { db, storage } from '../../config/firebase';
import { useApp } from '../../context/AppContext';

export default function GestaoProdutosScreen() {
  const router = useRouter();
  const { lojaAtual } = useApp();
  
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    descricao: '',
    categoria: ''
  });

  const categoriasEnergia = [
    'Painéis Solares',
    'Inversores',
    'Estruturas de Fixação',
    'Elétrica e Cabos',
    'Baterias',
    'Controladores de Carga',
    'Kit Completo'
  ];
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePick = async () => {
    try {
      // Simulação de upload de arquivo PNG/JPEG
      Alert.alert(
        'Selecionar Imagem',
        'Escolha uma imagem PNG ou JPEG para o produto',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Escolher Arquivo',
            onPress: () => {
              Alert.alert('Arquivo Selecionado', 'Imagem PNG/JPEG simulada para demonstração');
              setImagePreview('https://via.placeholder.com/800x800/4CAF50/FFFFFF?text=Produto');
              setSelectedImage(true);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
      console.error('Erro ao selecionar imagem:', error);
    }
  };

  const formatPreco = (text) => {
    const cleaned = text.replace(/[^0-9,.-]/g, '');
    const normalized = cleaned.replace(',', '.');
    return normalized;
  };

  const handlePrecoChange = (text) => {
    const formatted = formatPreco(text);
    setFormData(prev => ({ ...prev, preco: formatted }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nome.trim()) {
      errors.nome = 'Nome do produto é obrigatório';
    }
    
    if (!formData.categoria) {
      errors.categoria = 'Categoria é obrigatória';
    }
    
    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      errors.preco = 'Preço deve ser maior que zero';
    }
    
    if (!formData.descricao.trim()) {
      errors.descricao = 'Descrição é obrigatória';
    }
    
    if (!selectedImage) {
      errors.imagem = 'Imagem é obrigatória';
    }
    
    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleSalvar = async () => {
    const errors = validateForm();
    if (errors) {
      Alert.alert('Erro de Validação', Object.values(errors)[0]);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload da imagem para Firebase Storage
      const imageRef = ref(storage, `produtos/${Date.now()}_${formData.nome}.jpg`);
      
      // Em produção, aqui faria o upload real da imagem
      // Por ora, usamos URL simulada
      const imageUrl = imagePreview || 'https://via.placeholder.com/800x800/4CAF50/FFFFFF?text=Produto';
      
      // 2. Salvar dados no Firestore
      const produtoData = {
        nome: formData.nome,
        categoria: formData.categoria,
        preco: parseFloat(formData.preco),
        descricao: formData.descricao,
        imagem: imageUrl,
        idLoja: lojaAtual?.id || '1',
        dataCriacao: serverTimestamp(),
        dataAtualizacao: serverTimestamp(),
        ativo: true
      };

      const produtosRef = collection(db, 'produtos');
      await addDoc(produtosRef, produtoData);

      Alert.alert(
        'Sucesso!',
        'Produto cadastrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpar formulário
              setFormData({ nome: '', preco: '', descricao: '', categoria: '' });
              setSelectedImage(null);
              setImagePreview(null);
            }
          }
        ]
      );

    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Alert.alert('Erro', 'Não foi possível salvar o produto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderImagePreview = () => {
    if (!imagePreview) {
      return (
        <TouchableOpacity style={styles.imagePlaceholder} onPress={handleImagePick}>
          <Ionicons name="image-outline" size={40} color="#CCC" />
          <Text style={styles.imagePlaceholderText}>Adicionar Imagem PNG/JPEG</Text>
          <Text style={styles.imageHint}>Tamanho recomendado: 800x800px</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
        <TouchableOpacity style={styles.changeImageButton} onPress={handleImagePick}>
          <Ionicons name="camera-outline" size={20} color="#4CAF50" />
          <Text style={styles.changeImageText}>Alterar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gestão de Produtos</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.form}>
            {/* Imagem */}
            <View style={styles.imageSection}>
              <Text style={styles.sectionTitle}>Imagem do Produto</Text>
              {renderImagePreview()}
              <Text style={styles.imageRequirements}>
                • Formato: PNG ou JPEG • Tamanho: 800x800px • Máximo: 2MB
              </Text>
            </View>

            {/* Categoria */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria *</Text>
              <TouchableOpacity 
                style={styles.categorySelector}
                onPress={() => {
                  Alert.alert(
                    'Selecionar Categoria',
                    'Escolha a categoria do equipamento',
                    categoriasEnergia.map((cat, index) => ({
                      text: cat,
                      onPress: () => setFormData(prev => ({ ...prev, categoria: cat }))
                    }))
                  )
                }}
              >
                <Text style={formData.categoria ? styles.categoryTextSelected : styles.categoryTextPlaceholder}>
                  {formData.categoria || 'Selecione uma categoria...'}
                </Text>
                <Ionicons name="chevron-down-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Nome do Produto */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Produto *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Painel Solar 550W Monocristalino"
                value={formData.nome}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nome: text }))}
                maxLength={100}
              />
            </View>

            {/* Preço */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preço *</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.pricePrefix}>R$</Text>
                <TextInput
                  style={[styles.input, styles.priceInput]}
                  placeholder="0,00"
                  value={formData.preco}
                  onChangeText={handlePrecoChange}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição Detalhada *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva as características, benefícios e informações importantes do produto..."
                value={formData.descricao}
                onChangeText={(text) => setFormData(prev => ({ ...prev, descricao: text }))}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={handleSalvar}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.saveButtonText}>Salvando...</Text>
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="white" />
                  <Text style={styles.saveButtonText}>Cadastrar Produto</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center'
  },
  placeholder: {
    width: 40
  },
  content: {
    padding: 20
  },
  form: {
    gap: 24
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  },
  imageHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4
  },
  imageRequirements: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic'
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F0F0F0'
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 8
  },
  changeImageText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500'
  },
  inputGroup: {
    marginBottom: 8
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top'
  },
  categorySelector: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  categoryTextPlaceholder: {
    fontSize: 16,
    color: '#999'
  },
  categoryTextSelected: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  pricePrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 0
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  saveButtonDisabled: {
    backgroundColor: '#CCC'
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
