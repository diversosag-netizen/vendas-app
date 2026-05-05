import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function LoginClienteScreen() {
  const router = useRouter();
  const { login, setIsAuthenticated, setUserRole, setCurrentUser } = useApp();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCadastro, setIsCadastro] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    setIsLoading(true);
    
    // 🛒 VENDAS 3.1: Login específico para clientes
    try {
      // Validação simples para clientes (em produção, usar API real)
      if (email.includes('@') && senha.length >= 3) {
        const sucesso = login(email, senha);
        
        if (sucesso) {
          // Definir papel de cliente
          setUserRole('cliente');
          setCurrentUser({
            email,
            nome: email.split('@')[0], // Nome baseado no email
            tipo: 'cliente'
          });
          
          Alert.alert('Sucesso', 'Login realizado com sucesso!');
          
          // Pequeno delay para garantir atualização do estado
          setTimeout(() => {
            router.replace('/checkout');
          }, 500);
        } else {
          Alert.alert('Erro', 'Email ou senha incorretos!');
        }
      } else {
        Alert.alert('Erro', 'Email ou senha inválidos!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCadastro = () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    // 🛒 VENDAS 3.1: Cadastro simplificado de cliente
    try {
      // Em produção, enviar para API
      const sucesso = login(email, senha);
      
      if (sucesso) {
        setUserRole('cliente');
        setCurrentUser({
          email,
          nome: email.split('@')[0],
          tipo: 'cliente'
        });
        
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        
        setTimeout(() => {
          router.replace('/checkout');
        }, 500);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao realizar o cadastro!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer cadastro. Tente novamente.');
    }
  };

  const handleGuestCheckout = () => {
    // 🛒 VENDAS 3.1: Permitir checkout como visitante
    Alert.alert(
      'Checkout como Visitante',
      'Você pode finalizar sua compra como visitante, mas algumas funcionalidades estarão limitadas. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: () => {
            // Definir como visitante
            setUserRole('visitante');
            setCurrentUser({
              tipo: 'visitante',
              nome: 'Visitante'
            });
            router.replace('/checkout');
          }
        }
      ]
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-outline" size={60} color="white" />
          </View>
          <Text style={styles.headerTitle}>
            {isCadastro ? 'Criar Conta' : 'Login Cliente'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isCadastro 
              ? 'Cadastre-se para finalizar sua compra' 
              : 'Faça login para finalizar sua compra'
            }
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={isCadastro ? handleCadastro : handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <Text style={styles.buttonText}>Processando...</Text>
              ) : (
                <Text style={styles.buttonText}>
                  {isCadastro ? 'Criar Conta' : 'Entrar'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setIsCadastro(!isCadastro)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>
                {isCadastro 
                  ? 'Já tem conta? Faça login'
                  : 'Não tem conta? Cadastre-se'
                }
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.guestButton]}
            onPress={handleGuestCheckout}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.guestButtonText}>Continuar como Visitante</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>
              Visitantes podem comprar normalmente, mas não terão acesso a histórico de pedidos e funcionalidades exclusivas.
            </Text>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center'
  },
  content: {
    padding: 20
  },
  form: {
    marginBottom: 30
  },
  inputGroup: {
    marginBottom: 20
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 16
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600'
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0'
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#666'
  },
  guestButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20
  },
  guestButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600'
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    alignItems: 'flex-start'
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20
  }
});
