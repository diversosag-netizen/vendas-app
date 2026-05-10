import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useApp } from '../../context/AppContext';
import Header from '../components/Header';

export default function PerfilScreen() {
  const router = useRouter();
  const { lojaAtual, perfil } = useApp();
  
  const nomeLoja = lojaAtual?.nome || 'Minha Loja';
  const corLoja = lojaAtual?.cor || '#4CAF50';
  const usuarioNome = perfil?.nome || 'Usuário';

  return (
    <>
      <ScrollView style={styles.container}>
        <Header 
          title="Perfil"
          subtitle={nomeLoja}
          backgroundColor={corLoja}
        />
        
        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={[styles.avatar, { backgroundColor: corLoja }]}>
              <Ionicons name="person-outline" size={40} color="white" />
            </View>
            <Text style={styles.userName}>{usuarioNome}</Text>
            <Text style={styles.userEmail}>usuario@exemplo.com</Text>
          </View>
          
          <View style={styles.emptyState}>
            <Ionicons name="construct-outline" size={60} color="#CCC" />
            <Text style={styles.emptyTitle}>Perfil em Construção</Text>
            <Text style={styles.emptySubtitle}>
              Estamos desenvolvendo ferramentas para você gerenciar seus dados pessoais
            </Text>
            <Text style={styles.emptyInfo}>
              Em breve você poderá:
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Editar informações pessoais</Text>
              <Text style={styles.featureItem}>• Alterar senha de acesso</Text>
              <Text style={styles.featureItem}>• Configurar notificações</Text>
              <Text style={styles.featureItem}>• Gerenciar preferências</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* ✅ BOTÃO VOLTAR - Parte inferior direita */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
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
  content: {
    flex: 1,
    padding: 20
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  userEmail: {
    fontSize: 14,
    color: '#666'
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24
  },
  emptyInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  featuresList: {
    alignItems: 'flex-start',
    width: '100%'
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20
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
