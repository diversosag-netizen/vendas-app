import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(Platform.OS !== 'web');

  const screenWidth = Dimensions.get('window').width;

  // 🎯 VENDAS 3.2: Fluxo de Identificação Principal
  const handleIdentifyAs = (userType) => {
    switch (userType) {
      case 'visitor':
        // Visitante: Acesso livre ao catálogo
        router.replace('/lobby');
        break;
      case 'customer':
        // Cliente: Login específico
        router.replace('/login');
        break;
      case 'admin':
        // Administrador: Login admin
        router.replace('/login-admin');
        break;
    }
  };

  const cardWidth = isMobile ? screenWidth - 40 : Math.min(screenWidth * 0.3, 280);

  return (
    <ScrollView style={styles.container}>
      {/* Header Principal */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="storefront-outline" size={isMobile ? 48 : 64} color="#4CAF50" />
          <Text style={[styles.headerTitle, isMobile && styles.headerTitleMobile]}>
            Vendas App
          </Text>
          <Text style={[styles.headerSubtitle, isMobile && styles.headerSubtitleMobile]}>
            Sistema Completo de Vendas
          </Text>
        </View>
      </View>

      {/* Pergunta Principal */}
      <View style={styles.questionContainer}>
        <Text style={[styles.questionText, isMobile && styles.questionTextMobile]}>
          Como você quer acessar o sistema?
        </Text>
        <Text style={[styles.questionSubtext, isMobile && styles.questionSubtextMobile]}>
          Escolha a opção que melhor descreve você
        </Text>
      </View>

      {/* Cards de Identificação */}
      <View style={[
        styles.cardsContainer,
        isMobile && styles.cardsContainerMobile
      ]}>
        {/* Visitante */}
        <TouchableOpacity
          style={[
            styles.identityCard,
            { width: cardWidth },
            isMobile && styles.identityCardMobile
          ]}
          onPress={() => handleIdentifyAs('visitor')}
          activeOpacity={0.8}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#E8F5E8' }]}>
            <Ionicons name="eye-outline" size={isMobile ? 32 : 40} color="#4CAF50" />
          </View>
          <Text style={[styles.cardTitle, isMobile && styles.cardTitleMobile]}>
            Visitante
          </Text>
          <Text style={[styles.cardDescription, isMobile && styles.cardDescriptionMobile]}>
            Quero apenas explorar as lojas e ver os produtos
          </Text>
        </TouchableOpacity>

        {/* Cliente */}
        <TouchableOpacity
          style={[
            styles.identityCard,
            { width: cardWidth },
            isMobile && styles.identityCardMobile
          ]}
          onPress={() => handleIdentifyAs('customer')}
          activeOpacity={0.8}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="person-outline" size={isMobile ? 32 : 40} color="#2196F3" />
          </View>
          <Text style={[styles.cardTitle, isMobile && styles.cardTitleMobile]}>
            Cliente
          </Text>
          <Text style={[styles.cardDescription, isMobile && styles.cardDescriptionMobile]}>
            Tenho cadastro e quero fazer compras
          </Text>
        </TouchableOpacity>

        {/* Administrador */}
        <TouchableOpacity
          style={[
            styles.identityCard,
            { width: cardWidth },
            isMobile && styles.identityCardMobile
          ]}
          onPress={() => handleIdentifyAs('admin')}
          activeOpacity={0.8}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="shield-checkmark-outline" size={isMobile ? 32 : 40} color="#FF9800" />
          </View>
          <Text style={[styles.cardTitle, isMobile && styles.cardTitleMobile]}>
            Administrador
          </Text>
          <Text style={[styles.cardDescription, isMobile && styles.cardDescriptionMobile]}>
            Sou lojista e quero gerenciar minha loja
          </Text>
        </TouchableOpacity>
      </View>

      {/* Informações Adicionais */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={isMobile ? 20 : 24} color="#666" />
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, isMobile && styles.infoTitleMobile]}>
              Segurança Primeiro
            </Text>
            <Text style={[styles.infoDescription, isMobile && styles.infoDescriptionMobile]}>
              Cada tipo de acesso tem permissões específicas para proteger seus dados e os dados da loja.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  // Header
  header: {
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  headerContent: {
    alignItems: 'center',
    gap: 15
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center'
  },
  headerTitleMobile: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center'
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center'
  },
  headerSubtitleMobile: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  // Question Container
  questionContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 1
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10
  },
  questionTextMobile: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8
  },
  questionSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  questionSubtextMobile: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  // Cards Container
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    gap: 20
  },
  cardsContainerMobile: {
    flexDirection: 'column',
    padding: 20,
    gap: 15
  },
  // Identity Card
  identityCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  identityCardMobile: {
    padding: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3
  },
  cardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center'
  },
  cardTitleMobile: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center'
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20
  },
  cardDescriptionMobile: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18
  },
  // Info Container
  infoContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 1
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#666'
  },
  infoText: {
    flex: 1
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  infoTitleMobile: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  infoDescriptionMobile: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18
  }
});
