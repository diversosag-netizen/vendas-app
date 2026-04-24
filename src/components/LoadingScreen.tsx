import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoadingScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <ThemedText style={{ marginTop: 20 }}>Carregando...</ThemedText>
    </ThemedView>
  );
}
