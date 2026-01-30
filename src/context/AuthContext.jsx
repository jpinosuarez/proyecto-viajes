import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUsuario(currentUser);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
};