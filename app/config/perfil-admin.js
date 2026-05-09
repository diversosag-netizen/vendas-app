import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function PerfilAdminScreen() {
  const router = useRouter();
  const { lojaAtual, atualizarBannerLoja } = useApp();
  
  const [formData, setFormData] = useState({
    nomeLoja: lojaAtual?.nome || '',
    cnpj: lojaAtual?.cnpj || '',
    telefone: lojaAtual?.telefone || '',
    endereco: lojaAtual?.endereco || '',
    email: lojaAtual?.email || '',
    senha: lojaAtual?.senha || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nomeLoja.trim()) {
      newErrors.nomeLoja = 'Nome da loja é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }
    
    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular salvamento no Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Dados Salvos!',
        'As informações da loja foram atualizadas com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (placeholder, field, icon, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, errors[field] && styles.inputError]}
          placeholder={placeholder}
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          keyboardType={keyboardType}
        />
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dados da Loja</Text>
        <Text style={styles.subtitle}>Informações administrativas</Text>
      </View>

      <View style={styles.form}>
        {renderInput('Nome da Loja', 'nomeLoja', 'storefront-outline')}
        {renderInput('CNPJ', 'cnpj', 'business-outline')}
        {renderInput('Telefone', 'telefone', 'call-outline', 'phone-pad')}
        {renderInput('Endereço', 'endereco', 'location-outline')}
        {renderInput('E-mail', 'email', 'mail-outline', 'email-address')}
        {renderInput('Senha', 'senha', 'lock-outline', true)}

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.submitButtonText}>Salvando...</Text>
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.submitButtonText}>Salvar Dados</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#007AFF" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 5,
  },
});
