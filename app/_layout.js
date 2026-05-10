import { Stack } from 'expo-router';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider } from './context/AppContext';

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* 🛒 E-COMMERCE: Acesso livre para clientes */}
          <Stack.Screen name="lobby/index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* 🔐 Login apenas para área administrativa */}
          <Stack.Screen name="login-admin/index" options={{ headerShown: false }} />
        </Stack>
      </AppProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  }
});
