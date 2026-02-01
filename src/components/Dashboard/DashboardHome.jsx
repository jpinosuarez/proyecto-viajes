import React from 'react';
import { Compass, Calendar, Flag, TrendingUp, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme';
import { styles } from './DashboardHome.styles';
import HomeMap from '../Mapa/HomeMap';

const DashboardHome = ({ paisesVisitados, bitacora, setVistaActiva, abrirVisor }) => {
  const { usuario } = useAuth();
  const nombre = usuario?.displayName ? usuario.displayName.split(' ')[0] : 'Viajero';
  
  // Recientes ordenados por fecha
  const recientes = [...bitacora].sort((a,b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)).slice(0, 3);

  const totalPaises = 195;
  const visitadosCount = paisesVisitados.length;
  const porcentaje = ((visitadosCount / totalPaises) * 100).toFixed(0);

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.welcomeArea}>
        <h1 style={styles.title}>Hola, {nombre}</h1>
        <p style={styles.subtitle}>Tu mundo en datos.</p>
      </div>

      <div style={styles.bentoGrid}>
        
        {/* Mapa Estático */}
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

        {/* Stats */}
        <div style={styles.statsColumn}>
          <div style={styles.statCard(COLORS.charcoalBlue)}>
            <div style={styles.statIcon}><Compass size={24} color="white"/></div>
            <div>
                <span style={styles.statLabel}>Aventuras</span>
                <span style={styles.statValue}>{bitacora.length}</span>
            </div>
          </div>
          <div style={styles.statCard(COLORS.atomicTangerine)}>
            <div style={styles.statIcon}><Flag size={24} color="white"/></div>
            <div>
                <span style={styles.statLabel}>Países</span>
                <span style={styles.statValue}>{visitadosCount}</span>
            </div>
          </div>
          <div style={styles.statCard(COLORS.mutedTeal)}>
            <div style={styles.statIcon}><Flag size={24} color="white"/></div>
            <div>
                <span style={styles.statLabel}>Países</span>
                <span style={styles.statValue}>{visitadosCount}</span>
            </div>
          </div>
        </div>

        {/* Recientes (Modo Tarjeta con Foto) */}
        <div style={styles.recentCard}>
          <div style={styles.recentHeader}>
             <span style={styles.cardTitle}><TrendingUp size={16}/> Recientes</span>
             <button onClick={() => setVistaActiva('bitacora')} style={styles.linkBtn}>Ver todo</button>
          </div>
          
          <div style={styles.list}>
            {recientes.length > 0 ? recientes.map(viaje => (
                <div key={viaje.id} style={styles.recentItem} onClick={() => abrirVisor(viaje.id)}>
                    {/* Foto de Fondo o Color */}
                    <div style={{
                        position: 'absolute', inset: 0, 
                        backgroundImage: viaje.foto ? `url(${viaje.foto})` : 'none',
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        backgroundColor: viaje.foto ? 'transparent' : COLORS.mutedTeal,
                        zIndex: 0
                    }} />
                    {/* Overlay Gradiente */}
                    <div style={{position:'absolute', inset:0, background:'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2))', zIndex:1}}/>
                    
                    {/* Contenido */}
                    <div style={{position:'relative', zIndex:2, display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%'}}>
                        <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                            {/* Bandera SVG */}
                            <img 
                                src={viaje.banderas ? viaje.banderas[0] : ''} 
                                alt="flag" 
                                style={{width:'40px', height:'30px', borderRadius:'4px', objectFit:'cover', boxShadow:'0 2px 5px rgba(0,0,0,0.3)'}} 
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            <div>
                                <span style={{display:'block', fontWeight:'800', color:'white', fontSize:'1rem'}}>
                                    {viaje.titulo || viaje.nombreEspanol}
                                </span>
                                <span style={{color:'rgba(255,255,255,0.8)', fontSize:'0.8rem'}}>
                                    {viaje.fechaInicio}
                                </span>
                            </div>
                        </div>
                        <ChevronRight color="white" size={20} />
                    </div>
                </div>
            )) : (
                <p style={styles.emptyText}>Aún no hay viajes.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;