import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useApp } from '../../../context/AppContext';

export default function CadastrosScreen() {
  const router = useRouter();
  const { lojaAtiva, isAuthenticated, userRole } = useApp();
  
  const [activeTab, setActiveTab] = useState('administradores');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(Platform.OS !== 'web');

  // 🔐 VENDAS 3.2: Proteção de acesso
  useEffect(() => {
    if (!isAuthenticated || userRole !== 'admin') {
      Alert.alert(
        'Acesso Restrito',
        'Esta área é restrita a administradores.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, [isAuthenticated, userRole, router]);

  // 📊 Dados mock para demonstração (em produção viriam do Firebase)
  const [administradores, setAdministradores] = useState([
    { id: 1, nome: 'Administrador Principal', email: 'admin@vendas.com', lojaId: '1', status: 'ativo' },
    { id: 2, nome: 'Gerente Loja 1', email: 'gerente1@loja.com', lojaId: '1', status: 'ativo' },
    { id: 3, nome: 'Gerente Loja 2', email: 'gerente2@loja.com', lojaId: '2', status: 'ativo' },
  ]);

  const [clientes, setClientes] = useState([
    { id: 1, nome: 'Cliente Silva', email: 'cliente@email.com', lojaId: '1', totalCompras: 1250.00, status: 'ativo' },
    { id: 2, nome: 'Cliente Oliveira', email: 'oliveira@email.com', lojaId: '1', totalCompras: 890.50, status: 'ativo' },
    { id: 3, nome: 'Cliente Tech', email: 'tech@cliente.com', lojaId: '2', totalCompras: 2100.00, status: 'ativo' },
  ]);

  // 🔐 VENDAS 3.2: Filtrar dados pela loja ativa
  const administradoresDaLoja = administradores.filter(admin => admin.lojaId === lojaAtiva);
  const clientesDaLoja = clientes.filter(cliente => cliente.lojaId === lojaAtiva);

  // 📝 Formulário de novo administrador
  const [novoAdmin, setNovoAdmin] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleCadastrarAdmin = async () => {
    if (!novoAdmin.nome || !novoAdmin.email || !novoAdmin.senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (novoAdmin.senha !== novoAdmin.confirmarSenha) {
      Alert.alert('Erro', 'As senhas não conferem!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulação de cadastro (em produção: salvar no Firebase)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const adminAdicionado = {
        id: Date.now(),
        nome: novoAdmin.nome,
        email: novoAdmin.email,
        lojaId: lojaAtiva,
        status: 'ativo'
      };

      setAdministradores(prev => [...prev, adminAdicionado]);
      setNovoAdmin({ nome: '', email: '', senha: '', confirmarSenha: '' });
      
      Alert.alert('Sucesso', 'Administrador cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao cadastrar administrador!');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAdministradoresTab = () => (
    <View style={styles.tabContent}>
      {/* 📝 Formulário de Cadastro */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Cadastrar Novo Administrador</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={novoAdmin.nome}
            onChangeText={(text) => setNovoAdmin(prev => ({ ...prev, nome: text }))}
            placeholder="Nome do administrador"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={novoAdmin.email}
            onChangeText={(text) => setNovoAdmin(prev => ({ ...prev, email: text }))}
            placeholder="admin@sualoja.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Senha</Text>
          <TextInput
            style={styles.input}
            value={novoAdmin.senha}
            onChangeText={(text) => setNovoAdmin(prev => ({ ...prev, senha: text }))}
            placeholder="•••••••••"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirmar Senha</Text>
          <TextInput
            style={styles.input}
            value={novoAdmin.confirmarSenha}
            onChangeText={(text) => setNovoAdmin(prev => ({ ...prev, confirmarSenha: text }))}
            placeholder="•••••••••"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleCadastrarAdmin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="person-add-outline" size={20} color="white" />
              <Text style={styles.submitButtonText}>Cadastrar Administrador</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* 📋 Lista de Administradores */}
      <View style={styles.listCard}>
        <Text style={styles.listTitle}>
          Administradores da Loja ({administradoresDaLoja.length})
        </Text>
        
        {administradoresDaLoja.map(admin => (
          <View key={admin.id} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <View style={styles.listItemInfo}>
                <Text style={styles.listItemName}>{admin.nome}</Text>
                <Text style={styles.listItemEmail}>{admin.email}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: admin.status === 'ativo' ? '#4CAF50' : '#F44336' }
              ]}>
                <Text style={styles.statusText}>{admin.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderClientesTab = () => (
    <View style={styles.tabContent}>
      {/* 📊 Estatísticas */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Visão Geral de Clientes</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{clientesDaLoja.length}</Text>
            <Text style={styles.statLabel}>Total Clientes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {clientesDaLoja.filter(c => c.status === 'ativo').length}
            </Text>
            <Text style={styles.statLabel}>Clientes Ativos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              R$ {clientesDaLoja.reduce((sum, c) => sum + c.totalCompras, 0).toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Total em Compras</Text>
          </View>
        </View>
      </View>

      {/* 📋 Lista de Clientes */}
      <View style={styles.listCard}>
        <Text style={styles.listTitle}>
          Clientes Cadastrados ({clientesDaLoja.length})
        </Text>
        
        {clientesDaLoja.map(cliente => (
          <View key={cliente.id} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <View style={styles.listItemInfo}>
                <Text style={styles.listItemName}>{cliente.nome}</Text>
                <Text style={styles.listItemEmail}>{cliente.email}</Text>
                <Text style={styles.listItemDetail}>
                  Total em compras: R$ {cliente.totalCompras.toFixed(2)}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: cliente.status === 'ativo' ? '#4CAF50' : '#F44336' }
              ]}>
                <Text style={styles.statusText}>{cliente.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciamento de Cadastros</Text>
        <Text style={styles.headerSubtitle}>
          Loja: {lojaAtiva ? `Loja ${lojaAtiva}` : 'Não selecionada'}
        </Text>
      </View>

      {/* Abas */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'administradores' && styles.activeTab
          ]}
          onPress={() => setActiveTab('administradores')}
        >
          <Ionicons 
            name="people-outline" 
            size={20} 
            color={activeTab === 'administradores' ? '#007AFF' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'administradores' && styles.activeTabText
          ]}>
            Administradores
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'clientes' && styles.activeTab
          ]}
          onPress={() => setActiveTab('clientes')}
        >
          <Ionicons 
            name="person-outline" 
            size={20} 
            color={activeTab === 'clientes' ? '#007AFF' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'clientes' && styles.activeTabText
          ]}>
            Clientes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo da Aba Ativa */}
      {activeTab === 'administradores' ? renderAdministradoresTab() : renderClientesTab()}

      {/* Botão Voltar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/(tabs)/config')}
      >
        <Ionicons name="arrow-back-outline" size={20} color="#007AFF" />
        <Text style={styles.backButtonText}>Voltar para Configurações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF'
  },
  tabText: {
    fontSize: 14,
    color: '#666'
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600'
  },
  tabContent: {
    padding: 20
  },
  formCard: {
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
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20
  },
  inputGroup: {
    marginBottom: 15
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA'
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
    marginTop: 10
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  statsCard: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5
  },
  listCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 15
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listItemInfo: {
    flex: 1
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  listItemEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  listItemDetail: {
    fontSize: 12,
    color: '#999',
    marginTop: 4
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  backButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600'
  }
});
