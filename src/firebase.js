import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Configuración alineada con tu proyecto local (ver .firebaserc)
const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "keeptrip-app-b06b3.firebaseapp.com",
  projectId: "keeptrip-app-b06b3", // ID REAL DE TU PROYECTO
  storageBucket: "keeptrip-app-b06b3.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcde"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Detectar localhost y conectar a Emuladores
if (window.location.hostname === "localhost") {
  console.log("🔧 Conectando a Firebase Emulators...");
  // Nota: disableWarnings ayuda a limpiar la consola en desarrollo
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}

export { auth, db, storage };