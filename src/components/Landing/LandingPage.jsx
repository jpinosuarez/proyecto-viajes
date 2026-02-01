import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { styles } from './LandingPage.styles';
import { Compass, Map, BookOpen, Shield } from 'lucide-react';

const LandingPage = () => {
  const { login } = useAuth();

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.logo}>Keeptrip</div>
        <button onClick={login} style={styles.loginBtn}>Iniciar Sesión</button>
      </nav>

      <main style={styles.hero}>
        <div style={styles.content}>
          <h1 style={styles.title}>
            Tus viajes merecen <br />
            <span style={styles.gradientText}>ser recordados.</span>
          </h1>
          <p style={styles.subtitle}>
            Deja de perder tus recuerdos en galerías infinitas. Keeptrip transforma tus rutas, 
            fotos y fechas en un pasaporte digital vivo que cuenta tu historia.
          </p>
          <button onClick={login} style={styles.ctaBtn}>
            Comenzar mi Bitácora
          </button>
        </div>

        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <Map size={32} color="#FF6B35" />
            <h3>Mapa Interactivo</h3>
            <p>Visualiza tu conquista del mundo coloreando cada país visitado.</p>
          </div>
          <div style={styles.featureCard}>
            <BookOpen size={32} color="#45B0A8" />
            <h3>Bitácora de Detalles</h3>
            <p>Registra ciudades, clima y sensaciones de cada parada.</p>
          </div>
          <div style={styles.featureCard}>
            <Shield size={32} color="#2C3E50" />
            <h3>Privado y Seguro</h3>
            <p>Tus recuerdos son tuyos. Almacenamiento seguro en la nube.</p>
          </div>
        </div>
      </main>
      
      <div style={styles.backgroundMap} />
    </div>
  );
};

export default LandingPage;