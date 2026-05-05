import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';

export default function LobbyScreen() {
  const router = useRouter();
  const { lojas, trocarLoja, setLojaAtiva } = useApp();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(Platform.OS !== 'web');
  }, []);

  const screenWidth = Dimensions.get('window').width;

  // ✅ FUNÇÃO DE SELEÇÃO - Solução Segura para Identidade Visual
  const selecionarLoja = (loja) => {
    console.log(`Clicou na loja: ${loja.nome} (ID: ${loja.id})`);
    
    // Definir a loja ativa corretamente
    setLojaAtiva(loja.id);
    
    // Log para debug
    console.log(`Loja ativa definida para: ${loja.id}`);
    
    // Navegação: router.replace para Web (sem reload) e Android
    router.replace('/(tabs)');
  };

  const handleSelectStore = (loja) => {
    // Fluxo unificado: chamar selecionarLoja que cuida da senha
    selecionarLoja(loja);
  };

  const renderStoreCard = (loja) => {
    const cardWidth = isMobile ? screenWidth - 40 : Math.min(screenWidth * 0.4, 300);
    const cardHeight = isMobile ? 120 : 150;

    return (
      <TouchableOpacity
        key={loja.id}
        style={[
          styles.storeCard,
          {
            width: cardWidth,
            height: cardHeight,
            backgroundColor: loja.cor,
            borderColor: loja.cor
          },
          isMobile && styles.storeCardMobile,
          Platform.OS === 'web' && {
            zIndex: 10,
            cursor: 'pointer'
          }
        ]}
        onPress={() => handleSelectStore(loja)}
        activeOpacity={0.8}
      >
        {/* Banner da Loja */}
        {loja.bannerImage ? (
          <Image
            source={{ uri: loja.bannerImage }}
            style={[
              styles.storeBanner,
              {
                width: cardWidth,
                height: cardHeight * 0.6
              },
              isMobile && styles.storeBannerMobile
            ]}
            resizeMode="cover"
          />
        ) : (
          <View style={[
            styles.storeBannerPlaceholder,
            {
              backgroundColor: loja.cor,
              height: cardHeight * 0.6
            }
          ]}>
            <Ionicons name={loja.logo} size={isMobile ? 32 : 40} color="white" />
          </View>
        )}

        {/* Informações da Loja */}
        <View style={styles.storeInfo}>
          <View style={styles.storeHeader}>
            <Ionicons 
              name={loja.logo} 
              size={isMobile ? 16 : 20} 
              color={loja.bannerImage ? "#333" : "white"} 
            />
            <Text style={[
              styles.storeName,
              isMobile && styles.storeNameMobile,
              loja.bannerImage && styles.storeNameWithBanner
            ]}>
              {loja.nome.split(' ')[0]}
            </Text>
          </View>
          <Text style={[
            styles.storeBannerText,
            isMobile && styles.storeBannerTextMobile,
            loja.bannerImage && styles.storeBannerTextWithBanner
          ]}>
            {loja.banner}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header do Lobby */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="storefront-outline" size={isMobile ? 32 : 40} color="#1A1A1A" />
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, isMobile && styles.headerTitleMobile]}>
              Shopping Vendas App
            </Text>
            <Text style={[styles.headerSubtitle, isMobile && styles.headerSubtitleMobile]}>
              Escolha sua loja preferida
            </Text>
          </View>
        </View>
      </View>

      {/* Lista de Lojas */}
      <View style={styles.storesContainer}>
        <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
          Lojas Disponíveis
        </Text>
        
        <View style={[
          styles.storesGrid,
          isMobile && styles.storesGridMobile
        ]}>
          {lojas.map(renderStoreCard)}
        </View>
      </View>

      {/* Informações Adicionais */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={isMobile ? 24 : 28} color="#2196F3" />
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, isMobile && styles.infoTitleMobile]}>
              Como Funciona
            </Text>
            <Text style={[styles.infoDescription, isMobile && styles.infoDescriptionMobile]}>
              • Escolha uma loja para começar a comprar
              {'\n'}• Cada loja tem seu próprio carrinho
              {'\n'}• Troque de loja quando quiser explorar outras opções
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  headerContent: {
    alignItems: 'center',
    gap: 15
  },
  headerText: {
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center'
  },
  headerTitleMobile: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center'
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5
  },
  headerSubtitleMobile: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 3
  },
  // Stores Container
  storesContainer: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20
  },
  sectionTitleMobile: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  storesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15
  },
  storesGridMobile: {
    flexDirection: 'column',
    gap: 15
  },
  // Store Card
  storeCard: {
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
    borderWidth: 2,
    overflow: 'hidden'
  },
  storeCardMobile: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  storeBanner: {
    width: '100%',
    height: '60%'
  },
  storeBannerMobile: {
    width: '100%',
    height: '60%'
  },
  storeBannerPlaceholder: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  storeInfo: {
    padding: 12,
    backgroundColor: 'white',
    height: '40%',
    justifyContent: 'center'
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 8
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  storeNameMobile: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  storeNameWithBanner: {
    color: '#333'
  },
  storeBannerText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 14
  },
  storeBannerTextMobile: {
    fontSize: 11,
    color: '#666',
    lineHeight: 13
  },
  storeBannerTextWithBanner: {
    color: '#666'
  },
  // Info Container
  infoContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
    padding: 15,
    backgroundColor: '#F0F7FF',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3'
  },
  infoText: {
    flex: 1
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8
  },
  infoTitleMobile: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 6
  },
  infoDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20
  },
  infoDescriptionMobile: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18
  }
});
