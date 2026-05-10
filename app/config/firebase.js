// Firebase Configuration - Vendas App 3.3
// Este arquivo será preenchido após configuração no console

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 🔥 CONFIGURAÇÃO DO FIREBASE (PROJETO VENDASAPP-95EDC)
const firebaseConfig = {
  apiKey: "AIzaSyDZXb1_kJYfktH3LJ1YjyUdjg9cf8sbAiE",
  authDomain: "vendasapp-95edc.firebaseapp.com",
  projectId: "vendasapp-95edc",
  storageBucket: "vendasapp-95edc.firebasestorage.app",
  messagingSenderId: "1011354895946",
  appId: "1:1011354895946:web:3e6a2d1646050fe87748b3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore
export const db = getFirestore(app);

// Exportar Storage para upload de imagens
export const storage = getStorage(app);

// Exportar configuração para debug
export { firebaseConfig };

console.log('🔥 Firebase inicializado com sucesso!');

// Export default para compatibilidade com Expo Router
export default function FirebaseConfig() {
  return null; // Componente vazio para compatibilidade
}
