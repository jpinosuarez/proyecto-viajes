import React from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import { Compass, Calendar, Flag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme';
import { styles } from './DashboardHome.styles';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const DashboardHome = ({ paisesVisitados, bitacora, setVistaActiva, abrirVisor }) => {
  const { usuario } = useAuth();
  const nombre = usuario?.displayName ? usuario.displayName.split(' ')[0] : 'Viajero';
  
  // Ordenar recientes
  const recientes = [...bitacora].sort((a,b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)).slice(0, 3);

  // Estadísticas
  const totalPaises = 195;
  const visitadosCount = paisesVisitados.length;
  const porcentaje = ((visitadosCount / totalPaises) * 100).toFixed(0);

  return (
    <div style={styles.container}>
      {/* HEADER INTEGRADO */}
      <div style={styles.welcomeArea}>
        <h1 style={styles.title}>Hola, {nombre}</h1>
        <p style={styles.subtitle}>Tu mundo en datos.</p>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div style={styles.bentoGrid}>
        
        {/* 1. MAPA ESTÁTICO MERCATOR (Bloque Grande) */}
        <div style={styles.mapCard}>
          <div style={styles.mapHeader}>
            <span style={styles.cardTitle}>Mundo Descubierto</span>
            <span style={styles.cardValue}>{porcentaje}%</span>
          </div>
          <div style={{flex: 1, position: 'relative', width: '100%', height: '100%'}}>
             <Map
                initialViewState={{ longitude: 10, latitude: 20, zoom: 1.2 }}
                mapStyle="mapbox://styles/mapbox/light-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                projection="mercator" // SOLICITADO: Mercator Fijo
                interactive={false}   // SOLICITADO: Sin navegación
                attributionControl={false}
             >
                {/* Capa de Países Visitados */}
                <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
                  <Layer
                    id="country-fills"
                    type="fill"
                    source-layer="country_boundaries"
                    paint={{
                      'fill-color': COLORS.atomicTangerine,
                      'fill-opacity': ['match', ['get', 'iso_3166_1_alpha_3'], paisesVisitados.length > 0 ? paisesVisitados : [''], 0.8, 0] // Solo pinta visitados
                    }}
                  />
                  <Layer
                    id="country-borders"
                    type="line"
                    source-layer="country_boundaries"
                    paint={{ 'line-color': '#e2e8f0', 'line-width': 0.5 }}
                  />
                </Source>
             </Map>
          </div>
        </div>

        {/* 2. STATS (Vertical) */}
        <div style={styles.statsColumn}>
          <div style={styles.statCard}>
            <div style={styles.iconBox(COLORS.mutedTeal)}><Flag size={20}/></div>
            <div>
                <span style={styles.statLabel}>Países</span>
                <span style={styles.statNumber}>{visitadosCount}</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.iconBox(COLORS.charcoalBlue)}><Compass size={20}/></div>
            <div>
                <span style={styles.statLabel}>Viajes</span>
                <span style={styles.statNumber}>{bitacora.length}</span>
            </div>
          </div>
        </div>

        {/* 3. RECIENTES (Lista Compacta) */}
        <div style={styles.recentCard}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
             <span style={styles.cardTitle}>Aventuras Recientes</span>
             <button onClick={() => setVistaActiva('bitacora')} style={styles.linkBtn}>Ver todo</button>
          </div>
          <div style={styles.list}>
            {recientes.map(viaje => (
                <div key={viaje.id} style={styles.listItem} onClick={() => abrirVisor(viaje.id)}>
                    <div style={styles.listIcon}>
                        {viaje.banderas ? viaje.banderas[0] : '✈️'}
                    </div>
                    <div style={{flex:1}}>
                        <span style={styles.listTitle}>{viaje.titulo}</span>
                        <span style={styles.listDate}>{viaje.fechaInicio}</span>
                    </div>
                </div>
            ))}
            {recientes.length === 0 && <p style={{color: '#94a3b8', fontSize:'0.9rem'}}>Tu bitácora está vacía.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;