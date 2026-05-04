import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';

export default function Header({ 
  title, 
  subtitle, 
  showBackButton = false, 
  onBackPress,
  backgroundColor,
  customStyles = {} 
}) {
  const router = useRouter();
  const { lojaAtual } = useApp();
  
  // ✅ USO DO CONTEXTO: Busca cor do tema diretamente do AppContext
  const headerColor = backgroundColor || lojaAtual?.cor || '#4CAF50';
  
  // Função padrão para voltar
  const handleDefaultBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: headerColor }]}>
      {/* ✅ SAFEAREAVIEW OBRIGATÓRIO: Protege ícones da câmera */}
      <View style={styles.content}>
        {/* Botão Voltar */}
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleDefaultBack}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        
        {/* Conteúdo do Header */}
        <View style={[styles.headerContent, showBackButton && styles.headerContentWithBack]}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        
        {/* Espaço para balanceamento */}
        <View style={styles.spacer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // ✅ SAFEAREAVIEW OBRIGATÓRIO: Garante proteção da StatusBar
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    minHeight: 60
  },
  backButton: {
    marginRight: 15
  },
  headerContent: {
    flex: 1,
    alignItems: 'center'
  },
  headerContentWithBack: {
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginTop: 2
  },
  spacer: {
    width: 39 // Mesma largura do ícone de voltar para balanceamento
  }
});
