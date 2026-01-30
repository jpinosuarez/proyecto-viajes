import React, { useMemo } from 'react';
import StatsBitacora from '../Dashboard/StatsBitacora'; 
import { Trash2, Edit3, Calendar, MapPin } from 'lucide-react';
import { COLORES_CONTINENTE } from '../../assets/sellos';
import { COLORS } from '../../theme';
import { styles } from './BentoGrid.styles';

const BentoGrid = ({ viajes = [], bitacoraData = {}, manejarEliminar, abrirEditor, abrirVisor }) => {
  
  // Ordenar viajes por fecha
  const viajesOrdenados = useMemo(() => {
    return [...viajes].sort((a, b) => {
      const fA = new Date(bitacoraData[a.id]?.fechaInicio || a.fecha).getTime();
      const fB = new Date(bitacoraData[b.id]?.fechaInicio || b.fecha).getTime();
      return fB - fA;
    });
  }, [viajes, bitacoraData]);

  return (
    <div style={{ width: '100%', paddingBottom: '50px' }}>
      <StatsBitacora bitacora={viajes} bitacoraData={bitacoraData} />
      
      {/* MASONRY LAYOUT: Columnas fluidas */}
      <div style={styles.masonryContainer}>
        {viajesOrdenados.map((viaje) => {
          const data = bitacoraData[viaje.id] || {};
          const colorRegion = COLORES_CONTINENTE[viaje.continente] || COLORS.mutedTeal;
          const tieneFoto = !!data.foto;

          return (
            <div 
              key={viaje.id} 
              style={{ ...styles.masonryItem, ...(tieneFoto ? styles.cardConFoto(data.foto) : {}) }}
              onClick={() => abrirVisor(viaje.id)}
            >
              {/* GRADIENTE SUPERIOR PARA BOTONES */}
              <div style={styles.topGradient}>
                <span className="emoji-span" style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{viaje.flag}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={(e) => { e.stopPropagation(); abrirEditor(viaje.id); }} style={styles.miniBtn}><Edit3 size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); manejarEliminar(viaje.id); }} style={styles.miniBtn}><Trash2 size={14} /></button>
                </div>
              </div>

              {/* CONTENIDO INFERIOR */}
              <div style={tieneFoto ? styles.bottomContentGlass : styles.bottomContentSolid(colorRegion)}>
                 <p style={styles.regionTag(tieneFoto ? 'white' : colorRegion)}>
                   {viaje.continente}
                 </p>
                 {/* Título Personalizado */}
                 <h3 style={{ margin: '4px 0 8px', color: tieneFoto ? 'white' : COLORS.charcoalBlue, fontSize: '1.1rem', fontWeight: '800', lineHeight: 1.2 }}>
                   {data.titulo || viaje.nombreEspanol}
                 </h3>
                 
                 <div style={styles.metaRow(tieneFoto)}>
                   <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                      <Calendar size={12} /> <span>{data.fechaInicio.split('-')[0]}</span>
                   </div>
                   {/* Si hay ciudades, mostramos contador */}
                   {data.ciudades && (
                      <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                        <MapPin size={12} /> <span>{data.ciudades.split(',').length} paradas</span>
                      </div>
                   )}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BentoGrid;