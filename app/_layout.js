import { Stack } from 'expo-router';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider } from './context/AppContext';

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="lobby/index" />
          <Stack.Screen name="(tabs)" />
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
