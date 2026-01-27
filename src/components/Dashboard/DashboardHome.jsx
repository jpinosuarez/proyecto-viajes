import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Map as MapIcon, BookOpen, ArrowRight, PlaneTakeoff } from 'lucide-react';
import { COLORS } from '../../theme';
import { styles } from './DashboardHome.styles';

const DashboardHome = ({ paisesVisitados = [], bitacora = [], setVistaActiva }) => {
  
  // Obtenemos los últimos 3 registros de la bitácora real
  const ultimosViajes = bitacora.slice(0, 3);

  return (
    <div style={styles.dashboardContainer}>
      
      {/* 1. SECCIÓN DE BIENVENIDA */}
      <section style={styles.heroSection}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ flex: 1 }}
        >
          <h1 style={styles.welcomeTitle}>¡Hola, Explorador!</h1>
          <p style={styles.welcomeSubtitle}>
            Has capturado momentos en <strong>{paisesVisitados.length} países</strong> y {bitacora.length} aventuras registradas.
          </p>
        </motion.div>
        
        <div style={styles.quickActionsGrid}>
          <motion.div 
            whileHover={{ y: -5 }}
            style={styles.statBox} 
            onClick={() => setVistaActiva('mapa')}
          >
            <div style={styles.iconCircle(`${COLORS.mutedTeal}20`)}>
              <MapIcon color={COLORS.mutedTeal} size={24} />
            </div>
            <div>
              <span style={styles.statLabel}>Vuelo</span>
              <div style={styles.statValue}>Mapa</div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            style={styles.statBox} 
            onClick={() => setVistaActiva('bitacora')}
          >
            <div style={styles.iconCircle(`${COLORS.atomicTangerine}20`)}>
              <BookOpen color={COLORS.atomicTangerine} size={24} />
            </div>
            <div>
              <span style={styles.statLabel}>Relatos</span>
              <div style={styles.statValue}>Bitácora</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. BANNER INTERACTIVO */}
      <motion.div 
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        style={styles.mapBanner}
        onClick={() => setVistaActiva('mapa')}
      >
        <div style={styles.mapBannerContent}>
          <Compass size={44} color={COLORS.linen} style={{ marginBottom: '16px' }} />
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>Tu Mapa Global</h2>
          <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Visualiza tus rutas y conquista nuevos horizontes.</p>
        </div>
        <div style={styles.mapBannerOverlay} />
      </motion.div>

      {/* 3. RECUERDOS RECIENTES */}
      <section style={{ marginTop: '10px' }}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Aventuras Recientes</h3>
          <button style={styles.viewAllBtn} onClick={() => setVistaActiva('bitacora')}>
            Ver historial <ArrowRight size={16} />
          </button>
        </div>

        <div style={styles.recentGrid}>
          {ultimosViajes.length > 0 ? (
            ultimosViajes.map((viaje, index) => (
              <motion.div 
                key={viaje.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={styles.miniCard}
              >
                <span style={{ fontSize: '2.2rem' }}>{viaje.flag}</span>
                <div style={styles.miniCardInfo}>
                  <strong style={{ color: COLORS.charcoalBlue, fontSize: '1.1rem' }}>
                    {viaje.nombreEspanol}
                  </strong>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: '600' }}>
                    {viaje.fecha}
                  </span>
                  <div style={styles.badge}>NUEVO SELLO</div>
                </div>
              </motion.div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <PlaneTakeoff size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: '600' }}>Aún no has registrado viajes.</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>¡Busca un destino para empezar tu bitácora!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;