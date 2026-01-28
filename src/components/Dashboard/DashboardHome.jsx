import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Map as MapIcon, BookOpen, ArrowRight, PlaneTakeoff } from 'lucide-react';
import { COLORS } from '../../theme';
import { styles } from './DashboardHome.styles';

const DashboardHome = ({ paisesVisitados = [], bitacora = [], setVistaActiva }) => {
  const ultimosViajes = bitacora.slice(0, 3);

  return (
    <div style={styles.dashboardContainer}>
      <section style={styles.heroSection}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 style={styles.welcomeTitle}>¡Hola, Julian!</h1>
          <p style={{ ...styles.welcomeSubtitle, display: 'flex', gap: '6px', alignItems: 'center' }}>
            Has capturado momentos en 
            <span style={{ fontWeight: '800', color: COLORS.atomicTangerine }}>{paisesVisitados.length} países</span> 
            y 
            <span style={{ fontWeight: '800', color: COLORS.atomicTangerine }}>{bitacora.length} aventuras</span>.
          </p>
        </motion.div>
        
        <div style={styles.quickActionsGrid}>
          <div style={styles.statBox} onClick={() => setVistaActiva('mapa')}>
            <div style={styles.iconCircle(`${COLORS.mutedTeal}20`)}><MapIcon color={COLORS.mutedTeal} /></div>
            <div><span style={styles.statLabel}>Explorar</span><div style={styles.statValue}>Mapa</div></div>
          </div>
          <div style={styles.statBox} onClick={() => setVistaActiva('bitacora')}>
            <div style={styles.iconCircle(`${COLORS.atomicTangerine}20`)}><BookOpen color={COLORS.atomicTangerine} /></div>
            <div><span style={styles.statLabel}>Memorias</span><div style={styles.statValue}>Bitácora</div></div>
          </div>
        </div>
      </section>

      <motion.div whileHover={{ scale: 1.005 }} style={styles.mapBanner} onClick={() => setVistaActiva('mapa')}>
        <div style={styles.mapBannerContent}>
          <Compass size={44} color={COLORS.linen} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '15px 0 5px' }}>Tu Mapa Global</h2>
          <p>Visualiza tus rutas y conquista nuevos horizontes.</p>
        </div>
        <div style={styles.mapBannerOverlay} />
      </motion.div>

      <section style={{ marginTop: '10px' }}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Aventuras Recientes</h3>
          <button style={styles.viewAllBtn} onClick={() => setVistaActiva('bitacora')}>
            Ver historial <ArrowRight size={16} />
          </button>
        </div>
        <div style={styles.recentGrid}>
          {ultimosViajes.map((viaje, index) => (
            <motion.div key={viaje.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={styles.miniCard}>
              <span className="emoji-span" style={{ fontSize: '2rem' }}>{viaje.flag}</span>
              <div style={styles.miniCardInfo}>
                <strong style={{ color: COLORS.charcoalBlue }}>{viaje.nombreEspanol}</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{viaje.fecha}</span>
                <div style={styles.badge}>RECIÉN AÑADIDO</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;