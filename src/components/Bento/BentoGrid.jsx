import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import StatsBitacora from '../Dashboard/StatsBitacora';
import { Trash2, Edit3, Calendar, MapPin, Search, LoaderCircle, Map } from 'lucide-react';
import { COLORS } from '../../theme';
import { styles } from './BentoGrid.styles';

const BentoGrid = ({
  viajes = [],
  bitacoraData = {},
  manejarEliminar,
  isDeletingViaje = () => false,
  abrirEditor,
  abrirVisor,
  searchTerm = '',
  onClearSearch,
  onStartFirstTrip
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

  const hasNoTrips = viajes.length === 0;
  const hasNoSearchResults = !hasNoTrips && termino && viajesOrdenados.length === 0;

  return (
    <div style={{ width: '100%', paddingBottom: '50px' }}>
      <StatsBitacora bitacora={viajesFiltrados} bitacoraData={bitacoraData} />
      {termino && !hasNoTrips && (
        <div style={styles.searchMeta}>
          <span>
            Mostrando {viajesOrdenados.length} de {viajes.length} viajes
          </span>
          <button type="button" onClick={() => onClearSearch?.()} style={styles.clearSearchButton}>
            Limpiar busqueda
          </button>
        </div>
      )}

      <div style={styles.masonryContainer}>
        {viajesOrdenados.map((viaje) => {
          const data = bitacoraData[viaje.id] || viaje || {};

          if (!data.nombreEspanol && !data.titulo) return null;

          const tieneFoto = !!(data.foto && typeof data.foto === 'string' && data.foto.startsWith('http'));
          const banderas = data.banderas && data.banderas.length > 0 ? data.banderas : (viaje.flag ? [viaje.flag] : []);

          return (
            <div
              key={viaje.id}
              style={{
                ...styles.masonryItem,
                ...(tieneFoto ? {
                  backgroundImage: `url('${data.foto}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {})
              }}
              onClick={() => abrirVisor(viaje.id)}
            >
              <div style={styles.topGradient}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {banderas.slice(0, 3).map((b, i) => (
                    <img key={i} src={b} alt="flag" style={{ width: '28px', height: '20px', borderRadius: '3px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.3)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} onError={(e) => e.target.style.display = 'none'} />
                  ))}
                  {banderas.length > 3 && <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>+{banderas.length - 3}</span>}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={(e) => { e.stopPropagation(); abrirEditor(viaje.id); }} style={styles.miniBtn}><Edit3 size={14} /></button>
                  <button
                    onClick={(e) => { e.stopPropagation(); manejarEliminar(viaje.id); }}
                    style={styles.miniBtn}
                    disabled={isDeletingViaje(viaje.id)}
                    title={isDeletingViaje(viaje.id) ? 'Eliminando...' : 'Eliminar viaje'}
                  >
                    {isDeletingViaje(viaje.id) ? <LoaderCircle size={14} className="spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>

              <div style={tieneFoto ? styles.bottomContentGlass : styles.bottomContentSolid(COLORS.mutedTeal)}>
                <h3 style={{ margin: '4px 0 8px', color: tieneFoto ? 'white' : COLORS.charcoalBlue, fontSize: '1.1rem', fontWeight: '800', lineHeight: 1.2 }}>
                  {data.titulo || viaje.nombreEspanol}
                </h3>
                <div style={styles.metaRow(tieneFoto)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> <span>{data.fechaInicio?.split('-')[0]}</span>
                  </div>
                  {data.ciudades && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> <span>{data.ciudades.split(',').length} paradas</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {hasNoTrips && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={styles.emptyStatePrimary}
          >
            <div style={styles.emptyIconPrimary}>
              <Map size={36} />
            </div>
            <h3 style={styles.emptyTitlePrimary}>Tu bitacora aun no tiene paradas</h3>
            <p style={styles.emptyTextPrimary}>
              Guarda tu primera parada para empezar a construir recuerdos, ver estadisticas y seguir tu ruta.
            </p>
            <button type="button" onClick={() => onStartFirstTrip?.()} style={styles.emptyActionPrimary}>
              Registrar primera parada
            </button>
          </motion.div>
        )}

        {hasNoSearchResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={styles.emptyState}
          >
            <div style={styles.emptyIcon}>
              <Search size={28} />
            </div>
            <h3 style={styles.emptyTitle}>No encontramos resultados</h3>
            <p style={styles.emptyText}>
              Prueba con otro nombre de viaje, pais o ciudad.
            </p>
            <button type="button" onClick={() => onClearSearch?.()} style={styles.emptyAction}>
              Borrar filtro
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BentoGrid;
