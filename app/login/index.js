import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const { lojas } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMobile(Platform.OS !== 'web');
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    setIsLoading(true);
    
    // Simulação de login
    setTimeout(() => {
      // Login bem sucedido (simulação)
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      router.replace('/lobby');
      setIsLoading(false);
    }, 2000);
  };

  const handleSkipLogin = () => {
    Alert.alert(
      'Pular Login',
      'Deseja acessar sem fazer login?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Acessar',
          onPress: () => {
            router.replace('/lobby');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* ✅ FAIXA PROTETORA: Protege ícones da câmera com cor da marca */}
      <View style={[
        styles.statusBarSpacer,
        { backgroundColor: '#4CAF50' }
      ]} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="storefront-outline" size={60} color="#4CAF50" />
            <Text style={styles.appTitle}>Vendas App</Text>
            <Text style={styles.appSubtitle}>Sistema de Vendas</Text>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Bem-vindo!</Text>
          <Text style={styles.formSubtitle}>Faça login para continuar</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                placeholder="••••••••"
                secureTextEntry
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.loginButtonText}>Entrando...</Text>
            ) : (
              <>
                <Ionicons name="log-in-outline" size={20} color="white" />
                <Text style={styles.loginButtonText}>Entrar</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Skip Login */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkipLogin}>
            <Text style={styles.skipButtonText}>Acessar sem login</Text>
          </TouchableOpacity>

          {/* Footer Info */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Lojas disponíveis: {lojas?.length || 0}
            </Text>
            <Text style={styles.footerSubtext}>
              Sistema de gerenciamento de vendas
            </Text>
          </View>
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
  // ✅ FAIXA PROTETORA: Altura da StatusBar para proteger ícones
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 20,
    width: '100%'
  },
  scrollView: {
    flex: 1
  },
  header: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  logoContainer: {
    alignItems: 'center',
    gap: 10
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333'
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666'
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    marginTop: -20
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30
  },
  inputContainer: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FA'
  },
  inputIcon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333'
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20
  },
  loginButtonDisabled: {
    backgroundColor: '#CCC'
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10
  },
  skipButtonText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline'
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 40,
    gap: 5
  },
  footerText: {
    fontSize: 12,
    color: '#999'
  },
  footerSubtext: {
    fontSize: 10,
    color: '#CCC'
  }
});
