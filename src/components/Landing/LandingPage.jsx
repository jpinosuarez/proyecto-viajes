import React from 'react';
import { motion } from 'framer-motion';
import { Navigation2, Globe, BookOpen, PenTool, ArrowRight, ShieldCheck } from 'lucide-react';
import { styles } from './LandingPage.styles';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme';

// Mock de datos para la demo visual
const DEMO_CARDS = [
  { id: 1, flag: '🇯🇵', title: 'Japón', desc: 'Cerezos y Neón', color: '#BC002D' },
  { id: 2, flag: '🇮🇸', title: 'Islandia', desc: 'Tierra de Hielo', color: '#02529C' },
  { id: 3, flag: '🇲🇦', title: 'Marruecos', desc: 'Desierto Dorado', color: '#C1272D' },
];

const LandingPage = () => {
  const { login } = useAuth();

  return (
    <div style={styles.landingContainer}>
      {/* NAVEGACIÓN */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <Navigation2 size={28} color={COLORS.atomicTangerine} style={{ transform: 'rotate(45deg)' }} />
          <span>Keeptrip</span>
        </div>
        <button onClick={login} style={styles.loginBtn}>Entrar</button>
      </nav>

      {/* HERO SECTION */}
      <header style={styles.heroSection}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={styles.heroTitle}>Convierte tus rutas <br/> en <span style={{ color: COLORS.atomicTangerine }}>relatos eternos.</span></h1>
        </motion.div>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={styles.heroSubtitle}>
          Más que un mapa, es tu <strong>pasaporte digital</strong>. Centraliza tus memorias, visualiza tu progreso y construye el legado de tus aventuras.
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <button onClick={login} style={styles.ctaButton}>
            Empieza tu colección (Gratis) <ArrowRight size={20} />
          </button>
          <div style={styles.googleHint}>
            <ShieldCheck size={14} /> Entra con un clic usando Google
          </div>
        </motion.div>
      </header>

      {/* DEMO SECTION (Visual Proof) */}
      <section style={styles.demoSection}>
        
        {/* EL MAPA DE TU VIDA */}
        <div style={styles.featureBlock}>
          <div style={styles.featureText}>
            <span style={styles.featureTag}>Visualización</span>
            <h2 style={styles.featureTitle}>El Mapa de tu Vida</h2>
            <p style={styles.featureDesc}>
              Olvídate de las listas aburridas. Mira cómo se ilumina el mundo a medida que lo exploras. Cada país visitado es un trofeo desbloqueado en tu tablero personal.
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            style={{ ...styles.visualCard, height: '300px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Globe size={120} color={COLORS.mutedTeal} opacity={0.5} />
            <div style={{ position: 'absolute', fontWeight: '900', color: COLORS.charcoalBlue, opacity: 0.3, fontSize: '4rem' }}>EXPLORA</div>
          </motion.div>
        </div>

        {/* MÁS QUE UN DIARIO */}
        <div style={{ ...styles.featureBlock, direction: 'rtl' }}> {/* Invertir orden visual */}
          <div style={{ ...styles.featureText, direction: 'ltr' }}>
            <span style={styles.featureTag}>Bitácora</span>
            <h2 style={styles.featureTitle}>Más que un Diario</h2>
            <p style={styles.featureDesc}>
              Guarda la "vibra", los sabores y los compañeros de viaje. Tus recuerdos merecen un formato que les haga justicia, no una nota perdida en el celular.
            </p>
          </div>
          <div style={{ ...styles.visualCard, direction: 'ltr', background: 'white', border: '1px solid #f1f5f9', display: 'grid', gap: '15px' }}>
            {DEMO_CARDS.map(card => (
              <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '2rem' }}>{card.flag}</span>
                <div>
                  <strong style={{ display: 'block', color: COLORS.charcoalBlue }}>{card.title}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{card.desc}</span>
                </div>
                <div style={{ marginLeft: 'auto', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: card.color }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: COLORS.charcoalBlue }}>Tu progreso en números</h3>
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>195</div>
              <div style={styles.statLabel}>Países por descubrir</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>∞</div>
              <div style={styles.statLabel}>Memorias guardadas</div>
            </div>
          </div>
        </div>

      </section>

      <footer style={styles.footer}>
        <p>Desde <strong>Berlín</strong> para el mundo 🌍 | Tus recuerdos son privados y tuyos.</p>
      </footer>
    </div>
  );
};

export default LandingPage;