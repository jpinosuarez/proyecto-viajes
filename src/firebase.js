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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

const useEmulators = import.meta.env.VITE_USE_EMULATORS === "true";

// Detectar localhost y conectar a Emuladores
if (window.location.hostname === "localhost" && useEmulators) {
  console.log("🔧 Conectando a Firebase Emulators...");
  // Nota: disableWarnings ayuda a limpiar la consola en desarrollo
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}

export { auth, db, storage };