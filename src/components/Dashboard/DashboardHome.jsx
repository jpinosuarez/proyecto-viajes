import React from 'react';
import { Compass, Calendar, Flag, TrendingUp, MapPin, ArrowRight, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme';
import { styles } from './DashboardHome.styles';
import HomeMap from '../Mapa/HomeMap';

const DashboardHome = ({ paisesVisitados, bitacora, setVistaActiva, abrirVisor }) => {
  const { usuario } = useAuth();
  const nombre = usuario?.displayName ? usuario.displayName.split(' ')[0] : 'Viajero';
  
  // Ordenar por fecha más reciente
  const recientes = [...bitacora].sort((a,b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));

  // Stats
  const totalPaises = 195;
  const visitadosCount = paisesVisitados.length;
  const porcentaje = ((visitadosCount / totalPaises) * 100).toFixed(0);

  return (
    <div style={styles.dashboardContainer}>
      
      {/* HEADER: Bienvenida + Stats Integrados */}
      <div style={styles.welcomeArea}>
        <div>
          <h1 style={styles.title}>Hola, {nombre}</h1>
          <p style={styles.subtitle}>Tu bitácora de viaje digital.</p>
        </div>
        
        {/* Stats en el Header */}
        <div style={styles.headerStatsRow}>
            <div style={styles.statPill}>
                <div style={styles.pillIcon(COLORS.atomicTangerine)}><Flag size={14} color="white"/></div>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <span style={styles.pillValue}>{visitadosCount} <span style={{fontSize:'0.7rem', opacity:0.6, fontWeight:'400'}}>/ 195</span></span>
                    <span style={styles.pillLabel}>Países</span>
                </div>
            </div>
            
            <div style={styles.statPill}>
                <div style={styles.pillIcon(COLORS.charcoalBlue)}><Compass size={14} color="white"/></div>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <span style={styles.pillValue}>{bitacora.length}</span>
                    <span style={styles.pillLabel}>Viajes</span>
                </div>
            </div>

            <div style={styles.statPill}>
                <div style={styles.pillIcon(COLORS.mutedTeal)}><Trophy size={14} color="white"/></div>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <span style={styles.pillValue}>{porcentaje}%</span>
                    <span style={styles.pillLabel}>Mundo</span>
                </div>
            </div>
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div style={styles.mainGrid}>
        
        {/* MAPA ESTÁTICO (Sin overlays intrusivos) */}
        <div style={styles.mapCard}>
          <HomeMap paisesVisitados={paisesVisitados} />
        </div>

        {/* RECIENTES */}
        <div style={styles.recentsContainer}>
          <div style={styles.sectionHeader}>
             <span style={styles.sectionTitle}><TrendingUp size={16}/> Aventuras Recientes</span>
             <button onClick={() => setVistaActiva('bitacora')} style={styles.viewAllBtn}>
                Ver todas <ArrowRight size={14}/>
             </button>
          </div>
          
          <div style={styles.cardsList} className="custom-scroll">
            {recientes.length > 0 ? recientes.map(viaje => (
                <div 
                    key={viaje.id} 
                    style={styles.travelCard} 
                    onClick={() => abrirVisor(viaje.id)}
                >
                    {/* Fondo */}
                    <div style={{
                        ...styles.cardBackground,
                        backgroundImage: viaje.foto ? `url(${viaje.foto})` : 'none',
                        backgroundColor: viaje.foto ? 'transparent' : COLORS.mutedTeal
                    }} />
                    <div style={styles.cardGradient} />

                    {/* Contenido */}
                    <div style={styles.cardContent}>
                        <div style={styles.cardTop}>
                            {viaje.banderas && viaje.banderas.length > 0 ? (
                                <img src={viaje.banderas[0]} alt="flag" style={styles.flagImg} />
                            ) : (
                                <span style={{fontSize:'1.2rem'}}>✈️</span>
                            )}
                        </div>
                        
                        <div style={styles.cardBottom}>
                            <h4 style={styles.cardTitle}>{viaje.titulo || viaje.nombreEspanol}</h4>
                            <div style={styles.cardMeta}>
                                <span style={styles.metaItem}>
                                    <Calendar size={12}/> {viaje.fechaInicio}
                                </span>
                                {viaje.ciudades && (
                                    <span style={styles.metaItem}>
                                        <MapPin size={12}/> {viaje.ciudades.split(',')[0]}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div style={styles.emptyState}>
                    <Compass size={40} color="#cbd5e1" />
                    <p>Aún no has registrado viajes.</p>
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;