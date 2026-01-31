import React from 'react';
import { Compass, Map } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatsMapa from './StatsMapa';
import { COLORS } from '../../theme';
import { styles } from './DashboardHome.styles';

const DashboardHome = ({ paisesVisitados, bitacora, setVistaActiva, abrirVisor }) => {
  const { usuario } = useAuth();
  const nombreUsuario = usuario?.displayName ? usuario.displayName.split(' ')[0] : 'Viajero';

  // Recientes
  const recientes = [...bitacora]
    .sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
    .slice(0, 3); // Solo mostrar 3 para balance visual

  return (
    <div style={styles.dashboardContainer}>
      
      {/* 1. Header de Bienvenida */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Hola, {nombreUsuario} 👋</h1>
          <p style={styles.subtitle}>Tu mundo se expande con cada viaje.</p>
        </div>
      </header>

      {/* 2. Grid Principal */}
      <div style={styles.mainGrid}>
        
        {/* Columna Izquierda: Estadísticas y Mapa */}
        <div style={styles.leftColumn}>
          <StatsMapa bitacora={bitacora} paisesVisitados={paisesVisitados} />
          
          <div style={styles.mapTeaser} onClick={() => setVistaActiva('mapa')}>
            <div style={styles.mapOverlay} />
            <div style={styles.mapContent}>
              <Map size={32} color={COLORS.atomicTangerine} />
              <h3>Mapa Interactivo</h3>
              <p>Visualiza tus {paisesVisitados.length} países conquistados</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Actividad Reciente */}
        <div style={styles.rightColumn}>
          <div style={styles.sectionHeader}>
            <h3>Aventuras Recientes</h3>
            <button onClick={() => setVistaActiva('bitacora')}>Ver todo</button>
          </div>

          <div style={styles.cardsContainer}>
            {recientes.length > 0 ? recientes.map(viaje => (
              <div key={viaje.id} style={styles.card} onClick={() => abrirVisor(viaje.id)}>
                <div style={styles.cardImage(viaje.foto)}>
                  {!viaje.foto && <span style={{fontSize:'2rem'}}>{viaje.flag}</span>}
                </div>
                <div style={styles.cardContent}>
                  <h4>{viaje.titulo || viaje.nombreEspanol}</h4>
                  <span>{viaje.fechaInicio}</span>
                  {viaje.ciudades && <div style={styles.tag}>{viaje.ciudades.split(',').length} paradas</div>}
                </div>
              </div>
            )) : (
              <div style={styles.emptyState}>No hay viajes recientes.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;