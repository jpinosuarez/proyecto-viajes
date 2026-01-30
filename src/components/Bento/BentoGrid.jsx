import React, { useMemo } from 'react';
import BentoCard from './BentoCard';
import StatsBitacora from '../Dashboard/StatsBitacora'; 
import { Trash2, Edit3, Calendar } from 'lucide-react';
import { COLORES_CONTINENTE } from '../../assets/sellos';
import { COLORS } from '../../theme';
import { styles } from './BentoGrid.styles';

const BentoGrid = ({ viajes = [], bitacoraData = {}, manejarEliminar, abrirEditor, abrirVisor }) => {
  
  const viajesOrdenados = useMemo(() => {
    return [...viajes].sort((a, b) => {
      const fA = new Date(bitacoraData[a.id]?.fechaInicio || a.fecha).getTime();
      const fB = new Date(bitacoraData[b.id]?.fechaInicio || b.fecha).getTime();
      return fB - fA;
    });
  }, [viajes, bitacoraData]);

  return (
    <div style={{ width: '100%' }}>
      <StatsBitacora bitacora={viajes} bitacoraData={bitacoraData} />
      
      <div style={styles.gridContainer}>
        {viajesOrdenados.map((viaje, index) => {
          const data = bitacoraData[viaje.id] || {};
          const colorRegion = COLORES_CONTINENTE[viaje.continente] || COLORS.mutedTeal;
          const esHito = index === 0 || !!data.foto;

          return (
            <BentoCard 
              key={viaje.id} 
              tipo={esHito ? 'grande' : 'normal'} 
              onClick={() => abrirVisor(viaje.id)} // Dispara el visor global
              style={{ ...(data.foto ? { backgroundImage: `url(${data.foto})`, backgroundSize: 'cover' } 
                                     : { borderTop: `6px solid ${colorRegion}`, backgroundColor: 'white' }) }}>
              
              {data.foto && <div style={styles.fotoOverlay} />}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', zIndex: 10 }}>
                <span className="emoji-span" style={{ fontSize: '2.5rem' }}>{viaje.flag}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={(e) => { e.stopPropagation(); abrirEditor(viaje.id); }} style={data.foto ? styles.btnNavFoto : styles.actionBtn}><Edit3 size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); manejarEliminar(viaje.id); }} style={data.foto ? styles.btnNavFoto : styles.actionBtn}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ marginTop: 'auto', zIndex: 5, ...(data.foto ? styles.fullWidthGlass : { padding: '20px' }) }}>
                 <p style={{ margin: 0, color: data.foto ? '#fff' : colorRegion, fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                   {viaje.continente}
                 </p>
                 <h3 style={{ margin: '6px 0', color: data.foto ? 'white' : COLORS.charcoalBlue, fontSize: esHito ? '1.8rem' : '1.2rem', fontWeight: '800' }}>
                   {viaje.nombreEspanol}
                 </h3>
                 <div style={{ display: 'flex', gap: '8px', alignItems: 'center', opacity: 0.9 }}>
                   <Calendar size={14} color={data.foto ? 'white' : COLORS.charcoalBlue} />
                   <span className="mono-data" style={{ color: data.foto ? 'white' : COLORS.charcoalBlue }}>
                     {data.fechaInicio || viaje.fecha} — {data.fechaFin || 'Activo'}
                   </span>
                 </div>
              </div>
            </BentoCard>
          );
        })}
      </div>
    </div>
  );
};

export default BentoGrid;