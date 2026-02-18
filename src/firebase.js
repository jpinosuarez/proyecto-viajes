import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Configuracion por entorno (con fallback a valores actuales).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "keeptrip-app-b06b3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "keeptrip-app-b06b3",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "keeptrip-app-b06b3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcde"
};

const useEmulators = import.meta.env.VITE_USE_EMULATORS === "true";

// Advertencia si las credenciales son de ejemplo o vacías
const missingFirebaseConfig = (
  !firebaseConfig.apiKey ||
  firebaseConfig.apiKey === 'demo-key' ||
  firebaseConfig.authDomain === '' ||
  firebaseConfig.projectId === ''
);

if (missingFirebaseConfig) {
  const message = '[Firebase] ⚠️ Las credenciales parecen ser de ejemplo o están vacías. Verifica tu archivo .env y configuración.';
  if (useEmulators) {
    console.info(`${message} (Usas emulators, pero el SDK igual requiere config.)`);
  } else {
    console.warn(message);
  }
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Detectar localhost/127.0.0.1 y conectar a Emuladores
if (typeof window !== 'undefined' && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && useEmulators) {
  const EMULATOR_HOST = 'localhost';
  console.log(`🔧 Conectando a Firebase Emulators (${EMULATOR_HOST})...`);
  // Nota: disableWarnings ayuda a limpiar la consola en desarrollo
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
  connectStorageEmulator(storage, EMULATOR_HOST, 9199);
}

export { auth, db, storage };