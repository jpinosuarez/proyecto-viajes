import React, { useMemo } from 'react';
import StatsBitacora from '../Dashboard/StatsBitacora'; 
import { Trash2, Edit3, Calendar, MapPin, Search } from 'lucide-react';
import { COLORS } from '../../theme';
import { styles } from './BentoGrid.styles';

const BentoGrid = ({
  viajes = [],
  bitacoraData = {},
  manejarEliminar,
  abrirEditor,
  abrirVisor,
  searchTerm = '',
  onClearSearch
}) => {
  const termino = searchTerm.trim().toLowerCase();
  const viajesFiltrados = useMemo(() => {
    if (!termino) return viajes;
    return viajes.filter((viaje) => {
      const data = bitacoraData[viaje.id] || {};
      const campos = [
        data.titulo,
        viaje.nombreEspanol,
        data.ciudades
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return campos.includes(termino);
    });
  }, [viajes, bitacoraData, termino]);

  const viajesOrdenados = useMemo(() => {
    return [...viajesFiltrados].sort((a, b) => {
      const fA = new Date(bitacoraData[a.id]?.fechaInicio || a.fecha).getTime();
      const fB = new Date(bitacoraData[b.id]?.fechaInicio || b.fecha).getTime();
      return fB - fA;
    });
  }, [viajesFiltrados, bitacoraData]);

  return (
    <div style={{ width: '100%', paddingBottom: '50px' }}>
      <StatsBitacora bitacora={viajesFiltrados} bitacoraData={bitacoraData} />
      {termino && (
        <div style={styles.searchMeta}>
          <span>
            Mostrando {viajesOrdenados.length} de {viajes.length} viajes
          </span>
          <button type="button" onClick={() => onClearSearch?.()} style={styles.clearSearchButton}>
            Limpiar búsqueda
          </button>
        </div>
      )}
      
      <div style={styles.masonryContainer}>
        {viajesOrdenados.map((viaje) => {
          const data = bitacoraData[viaje.id] || {};
          const tieneFoto = !!data.foto;
          // Banderas: Usar array nuevo o fallback a single flag
          const banderas = data.banderas || [viaje.flag];

          return (
            <div 
              key={viaje.id} 
              style={{ ...styles.masonryItem, ...(tieneFoto ? styles.cardConFoto(data.foto) : {}) }}
              onClick={() => abrirVisor(viaje.id)}
            >
              <div style={styles.topGradient}>
                <div style={{display:'flex', gap:'4px'}}>
                    {banderas.slice(0, 3).map((b, i) => (
                        <span key={i} className="emoji-span" style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                            {b}
                        </span>
                    ))}
                    {banderas.length > 3 && <span style={{color:'white', fontWeight:'bold', fontSize:'0.8rem'}}>+{banderas.length - 3}</span>}
                </div>
                
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={(e) => { e.stopPropagation(); abrirEditor(viaje.id); }} style={styles.miniBtn}><Edit3 size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); manejarEliminar(viaje.id); }} style={styles.miniBtn}><Trash2 size={14} /></button>
                </div>
              </div>

              <div style={tieneFoto ? styles.bottomContentGlass : styles.bottomContentSolid(COLORS.mutedTeal)}>
                 <h3 style={{ margin: '4px 0 8px', color: tieneFoto ? 'white' : COLORS.charcoalBlue, fontSize: '1.1rem', fontWeight: '800', lineHeight: 1.2 }}>
                   {data.titulo || viaje.nombreEspanol}
                 </h3>
                 <div style={styles.metaRow(tieneFoto)}>
                   <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                      <Calendar size={12} /> <span>{data.fechaInicio?.split('-')[0]}</span>
                   </div>
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
        {viajesOrdenados.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Search size={28} />
            </div>
            <h3 style={styles.emptyTitle}>No encontramos resultados</h3>
            <p style={styles.emptyText}>
              Prueba con otro nombre de viaje, país o ciudad.
            </p>
            {termino && (
              <button type="button" onClick={() => onClearSearch?.()} style={styles.emptyAction}>
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BentoGrid;
