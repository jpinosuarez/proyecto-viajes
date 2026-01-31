import React from 'react';
import { Compass, Map, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatsMapa from './StatsMapa';
import { COLORS } from '../../theme';
import { styles } from './DashboardHome.styles';

const DashboardHome = ({ paisesVisitados, bitacora, setVistaActiva, abrirVisor }) => {
  const { usuario } = useAuth();
  
  // Obtener primer nombre
  const nombreUsuario = usuario?.displayName ? usuario.displayName.split(' ')[0] : 'Viajero';

  // Obtener aventuras recientes
  const recientes = [...bitacora]
    .sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
    .slice(0, 4);

  return (
    <div style={styles.dashboardContainer}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div>
          <h1 style={styles.welcomeTitle}>¡Hola, {nombreUsuario}! 👋</h1>
          <p style={styles.welcomeSubtitle}>
            Tu pasaporte digital tiene <strong style={{color: COLORS.atomicTangerine}}>{paisesVisitados.length} sellos</strong>. 
            ¿Cuál es la próxima historia?
          </p>
        </div>
        
        <div style={styles.quickActionsGrid}>
          <button style={styles.statBox} onClick={() => setVistaActiva('mapa')}>
            <div style={styles.iconCircle(COLORS.atomicTangerine)}>
              <Map size={20} />
            </div>
            <div>
              <span style={styles.statLabel}>Mapa Global</span>
              <span style={styles.statValue}>Explorar</span>
            </div>
          </button>
          
          <button style={styles.statBox} onClick={() => setVistaActiva('bitacora')}>
            <div style={styles.iconCircle(COLORS.charcoalBlue)}>
              <Compass size={20} />
            </div>
            <div>
              <span style={styles.statLabel}>Bitácora</span>
              <span style={styles.statValue}>Ver Todo</span>
            </div>
          </button>
        </div>
      </div>

      {/* Grid Principal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Columna Izquierda: Banner Mapa + Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={styles.mapBanner} onClick={() => setVistaActiva('mapa')}>
              <div style={styles.mapBannerOverlay} />
              <div style={styles.mapBannerContent}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Mapa Interactivo</h3>
                <p style={{ opacity: 0.9, marginTop: '8px' }}>Visualiza tus rutas y completa el mundo.</p>
              </div>
           </div>
           
           <StatsMapa bitacora={bitacora} paisesVisitados={paisesVisitados} />
        </div>

        {/* Columna Derecha: Recientes */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Aventuras Recientes</h3>
            <button style={styles.viewAllBtn} onClick={() => setVistaActiva('bitacora')}>
              Ver Bitácora
            </button>
          </div>

          <div style={styles.recentGrid}>
            {recientes.length > 0 ? recientes.map(viaje => (
              <div key={viaje.id} style={styles.miniCard} onClick={() => abrirVisor(viaje.id)}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '12px',
                  backgroundColor: COLORS.charcoalBlue,
                  backgroundImage: viaje.foto ? `url(${viaje.foto})` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', color: 'white', flexShrink: 0
                }}>
                  {!viaje.foto && viaje.flag}
                </div>
                <div style={styles.miniCardInfo}>
                  <span style={{fontWeight: '800', color: COLORS.charcoalBlue, fontSize: '1rem'}}>
                    {viaje.titulo || viaje.nombreEspanol}
                  </span>
                  <span style={{fontSize: '0.8rem', color: '#64748b'}}>
                    {viaje.fechaInicio}
                  </span>
                  {viaje.ciudades && <span style={styles.badge}>{viaje.ciudades.split(',')[0]}</span>}
                </div>
              </div>
            )) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: '20px' }}>
                <p>Aún no hay viajes registrados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;