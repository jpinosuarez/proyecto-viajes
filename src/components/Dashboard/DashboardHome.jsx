import React from 'react';
import { Globe, Calendar, Map as MapIcon, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme';
import { styles } from './DashboardHome.styles';
import StatsMapa from './StatsMapa'; // Componente pequeño de stats
import MapaViajes from '../Mapa/MapaView'; // Reusamos el mapa

const DashboardHome = ({ paisesVisitados, bitacora, setVistaActiva, abrirVisor }) => {
  const { usuario } = useAuth();
  const nombre = usuario?.displayName ? usuario.displayName.split(' ')[0] : 'Viajero';
  
  // Recientes ordenados
  const recientes = [...bitacora].sort((a,b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));

  return (
    <div style={styles.dashboardContainer}>
      
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Hola, {nombre} 👋</h1>
          <p style={styles.subtitle}>Tu mundo, tus historias.</p>
        </div>
      </header>

      {/* Grid 3 Columnas */}
      <div style={styles.mainGrid}>
        
        {/* COL 1: Resumen & Stats */}
        <div style={styles.colLeft}>
          <div style={styles.statsCard}>
            <div style={styles.statRow}>
              <span>Países</span>
              <span style={styles.statValue}>{paisesVisitados.length} / 195</span>
            </div>
            <div style={styles.statRow}>
              <span>Viajes</span>
              <span style={styles.statValue}>{bitacora.length}</span>
            </div>
            {/* Barra Progreso */}
            <div style={{height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow:'hidden', marginTop:'10px'}}>
               <div style={{width: `${(paisesVisitados.length/195)*100}%`, background: COLORS.atomicTangerine, height:'100%'}} />
            </div>
          </div>
          
          <StatsMapa bitacora={bitacora} paisesVisitados={paisesVisitados} />
        </div>

        {/* COL 2: Mapa Central */}
        <div style={styles.colCenter} onClick={() => setVistaActiva('mapa')}>
           <div style={styles.mapContainer}>
             {/* Mapa en modo solo lectura/visualización */}
             <MapaViajes paises={paisesVisitados} /> 
             {/* Overlay para click */}
             <div style={{position:'absolute', inset:0, background:'transparent', cursor:'pointer'}} />
           </div>
           <div style={{padding:'15px', borderTop:`1px solid ${COLORS.border}`, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
             <span style={{fontWeight:'700', color: COLORS.charcoalBlue, fontSize:'0.9rem'}}>Tu Mapa Global</span>
             <button style={styles.actionBtn}>Expandir <ChevronRight size={14}/></button>
           </div>
        </div>

        {/* COL 3: Bitácora Reciente */}
        <div style={styles.colRight}>
          <div style={styles.recentsHeader}>
            <span>Recientes</span>
            <button style={styles.actionBtn} onClick={() => setVistaActiva('bitacora')}>Ver todo</button>
          </div>
          
          <div style={styles.recentsList} className="custom-scroll">
            {recientes.length > 0 ? recientes.map(viaje => (
              <div key={viaje.id} style={styles.miniCard} onClick={() => abrirVisor(viaje.id)}>
                <div style={styles.miniImg(viaje.foto)}>
                  {!viaje.foto && <span>{viaje.banderas ? viaje.banderas[0] : viaje.flag}</span>}
                </div>
                <div style={styles.miniInfo}>
                  <span style={styles.miniTitle}>{viaje.titulo || viaje.nombreEspanol}</span>
                  <span style={styles.miniDate}>{viaje.fechaInicio}</span>
                  {/* Banderas Extra */}
                  {viaje.banderas && viaje.banderas.length > 1 && (
                    <div style={{display:'flex', gap:'2px', marginTop:'4px', fontSize:'0.8rem'}}>
                      {viaje.banderas.slice(0,4).map((b,i) => <span key={i}>{b}</span>)}
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <p style={{color:'#94a3b8', textAlign:'center', marginTop:'20px'}}>Aún no hay viajes.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;