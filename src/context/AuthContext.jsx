import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext();

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const isAdmin = useMemo(() => {
    if (!usuario?.email) return false;
    return ADMIN_EMAILS.includes(usuario.email.toLowerCase());
  }, [usuario]);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error al autenticar:", error);
    }
  };

  const logout = () => signOut(auth);

  // NUEVO: Función para actualizar perfil
  const actualizarPerfilUsuario = async (nombre, fotoURL) => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, {
        displayName: nombre,
        photoURL: fotoURL
      });
      // Forzamos actualización del estado local
      setUsuario({ ...auth.currentUser });
      return true;
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      return false;
    }
  };

  useEffect(() => {
    let timeoutId;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUsuario(currentUser);
      setCargando(false);
      if (timeoutId) clearTimeout(timeoutId);
    });
    // Timeout de seguridad: si Firebase no responde en 5s, forzar cargando a false
    timeoutId = setTimeout(() => {
      setCargando(false);
      unsubscribe();
      console.warn('⏰ Timeout de autenticación: Firebase no respondió en 5s. Se fuerza cargando = false.');
    }, 5000);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const value = { usuario, login, logout, actualizarPerfilUsuario, cargando, isAdmin };

  return (
    <AuthContext.Provider value={value}>
      {cargando ? (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          color: '#334155',
          fontSize: 22,
          fontWeight: 500
        }}>
          <LoaderCircle size={48} className="spin" style={{ marginBottom: 16, color: '#f59e42' }} />
          Iniciando...
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};