import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';

export default function LoginAdminScreen() {
  const router = useRouter();
  const { login } = useApp();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    setIsLoading(true);
    
    // 🔐 VENDAS 3.0: Login específico para administradores
    try {
      const sucesso = login(email, senha);
      
      if (sucesso) {
        Alert.alert('Sucesso', 'Acesso administrativo liberado!');
        
        // Pequeno delay para garantir atualização do estado
        setTimeout(() => {
          router.replace('/(tabs)/config');
        }, 100);
      } else {
        Alert.alert('Erro', 'Credenciais administrativas incorretas!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha no login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* ✅ FAIXA PROTETORA: Protege ícones da câmera com cor da marca */}
      <View style={[
        styles.statusBarSpacer,
        { backgroundColor: '#607D8B' }
      ]} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark-outline" size={60} color="#607D8B" />
            <Text style={styles.appTitle}>Acesso Administrativo</Text>
            <Text style={styles.appSubtitle}>Vendas App - Área Restrita</Text>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login Administrador</Text>
          <Text style={styles.formSubtitle}>Acesso apenas para lojistas</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-mail Administrativo</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="admin@sualoja.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha Administrativa</Text>
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
              <Text style={styles.loginButtonText}>Autenticando...</Text>
            ) : (
              <>
                <Ionicons name="shield-checkmark-outline" size={20} color="white" />
                <Text style={styles.loginButtonText}>Acessar Painel</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back-outline" size={20} color="#607D8B" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>

          {/* Footer Info - Dados de Teste */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              📱 Dados de Teste Admin:
            </Text>
            <Text style={styles.footerSubtext}>
              admin@vendas.com / admin123
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
    backgroundColor: '#607D8B',
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8
  },
  backButtonText: {
    color: '#607D8B',
    fontSize: 14,
    fontWeight: '600'
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
