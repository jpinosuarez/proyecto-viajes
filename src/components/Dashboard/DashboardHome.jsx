import React from 'react';
import { Compass, Calendar, Map as MapIcon, Flag, Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme';
import { styles } from './DashboardHome.styles';
import HomeMap from '../Mapa/HomeMap'; // El mapa estático limpio

const DashboardHome = ({ paisesVisitados, bitacora, setVistaActiva, abrirVisor }) => {
  const { usuario } = useAuth();
  const nombre = usuario?.displayName ? usuario.displayName.split(' ')[0] : 'Viajero';
  
  // Recientes ordenados
  const recientes = [...bitacora]
    .sort((a,b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
    .slice(0, 3);

  // Cálculo de Stats
  const totalPaises = 195;
  const visitadosCount = paisesVisitados.length;
  const porcentaje = ((visitadosCount / totalPaises) * 100).toFixed(0);
  
  // Calcular días totales de viaje (aprox)
  const diasViaje = bitacora.reduce((total, v) => {
      const ini = new Date(v.fechaInicio);
      const fin = new Date(v.fechaFin || v.fechaInicio);
      const diff = Math.ceil((fin - ini) / (1000 * 60 * 60 * 24)) + 1;
      return total + diff;
  }, 0);

  return (
    <div style={styles.dashboardContainer}>
      
      {/* Header */}
      <div style={styles.welcomeArea}>
        <h1 style={styles.title}>Hola, {nombre}</h1>
        <p style={styles.subtitle}>Tu mundo en datos.</p>
      </div>

      {/* Grid Asimétrico */}
      <div style={styles.bentoGrid}>
        
        {/* 1. MAPA HERO (Estático, sin labels, ocupa 2 filas) */}
        <div style={styles.mapCard}>
          <div style={styles.mapOverlayInfo}>
            <span style={styles.mapTitle}>Mundo Descubierto</span>
            <div style={styles.mapProgress}>
                <span style={styles.mapPercent}>{porcentaje}%</span>
                <span style={styles.mapTotal}>{visitadosCount} / {totalPaises}</span>
            </div>
          </div>
          <div style={{flex: 1, width: '100%', height: '100%'}}>
             <HomeMap paisesVisitados={paisesVisitados} />
          </div>
        </div>

        {/* 2. STATS CARDS (Columna derecha) */}
        <div style={styles.statsColumn}>
          
          {/* Stat 1: Viajes */}
          <div style={styles.statCard(COLORS.charcoalBlue)}>
            <div style={styles.statIcon}><Compass size={24} color="white"/></div>
            <div>
                <span style={styles.statLabel}>Aventuras</span>
                <span style={styles.statValue}>{bitacora.length}</span>
            </div>
          </div>

          {/* Stat 2: Días */}
          <div style={styles.statCard(COLORS.mutedTeal)}>
            <div style={styles.statIcon}><Calendar size={24} color="white"/></div>
            <div>
                <span style={styles.statLabel}>Días viajando</span>
                <span style={styles.statValue}>{diasViaje}</span>
            </div>
          </div>

          {/* Stat 3: Nivel (Gamification simple) */}
          <div style={styles.statCard(COLORS.atomicTangerine)}>
            <div style={styles.statIcon}><Trophy size={24} color="white"/></div>
            <div>
                <span style={styles.statLabel}>Nivel</span>
                <span style={styles.statValue}>{visitadosCount > 10 ? 'Explorador' : 'Turista'}</span>
            </div>
          </div>
        </div>

        {/* 3. RECIENTES (Abajo, ancho completo o columna según grid) */}
        <div style={styles.recentCard}>
          <div style={styles.recentHeader}>
             <span style={styles.cardTitle}><TrendingUp size={16}/> Recientes</span>
             <button onClick={() => setVistaActiva('bitacora')} style={styles.linkBtn}>Ver todo</button>
          </div>
          <div style={styles.list}>
            {recientes.length > 0 ? recientes.map(viaje => (
                <div key={viaje.id} style={styles.listItem} onClick={() => abrirVisor(viaje.id)}>
                    <div style={styles.listIcon}>
                        {viaje.banderas && viaje.banderas.length > 0 ? viaje.banderas[0] : (viaje.flag || '✈️')}
                    </div>
                    <div style={{flex:1, minWidth:0}}>
                        <span style={styles.listTitle}>{viaje.titulo || viaje.nombreEspanol}</span>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <span style={styles.listDate}>{viaje.fechaInicio}</span>
                            {viaje.ciudades && <span style={styles.listSub}>{viaje.ciudades.split(',')[0]}...</span>}
                        </div>
                    </div>
                </div>
            )) : (
                <p style={styles.emptyText}>Aún no hay viajes registrados.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;