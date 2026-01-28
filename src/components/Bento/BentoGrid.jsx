import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BentoCard from './BentoCard';
import StatsBitacora from '../Dashboard/StatsBitacora'; 
import { 
  Trash2, Edit3, Calendar, Users, MapPin, Landmark, CloudSun, UtensilsCrossed, ArrowLeft, BookOpen, Map, Clock, Zap
} from 'lucide-react';
import { IMAGENES_SELLOS, COLORES_CONTINENTE } from '../../assets/sellos';
import { COLORS } from '../../theme';
import { styles } from './BentoGrid.styles';

const BentoGrid = ({ viajes = [], bitacoraData = {}, manejarEliminar, abrirEditor }) => {
  const [viajeExpandido, setViajeExpandido] = useState(null);

  const viajesOrdenados = useMemo(() => {
    return [...viajes].sort((a, b) => {
      // Ordenamiento cronológico robusto
      const fA = new Date(bitacoraData[a.id]?.fechaInicio || a.fecha).getTime();
      const fB = new Date(bitacoraData[b.id]?.fechaInicio || b.fecha).getTime();
      return fB - fA;
    });
  }, [viajes, bitacoraData]);

  const obtenerStatsCapitulo = (id) => {
    const data = bitacoraData[id] || {};
    const ciudadesCount = data.ciudades ? data.ciudades.split(',').filter(c => c.trim() !== "").length : 0;
    
    let dias = 1;
    if (data.fechaInicio && data.fechaFin) {
      const inicio = new Date(data.fechaInicio);
      const fin = new Date(data.fechaFin);
      dias = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1);
    }
    return { dias, ciudadesCount };
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };

  return (
    <div style={{ width: '100%' }}>
      <StatsBitacora bitacora={viajes} bitacoraData={bitacoraData} />

      <div style={styles.gridContainer}>
        {viajesOrdenados.map((viaje, index) => {
          const data = bitacoraData[viaje.id] || {};
          const colorRegion = COLORES_CONTINENTE[viaje.continente] || COLORS.mutedTeal;
          const esHito = index === 0 || !!data.foto;
          const { dias } = obtenerStatsCapitulo(viaje.id);

          return (
            <BentoCard key={viaje.id} tipo={esHito ? 'grande' : 'normal'} onClick={() => setViajeExpandido(viaje)}
              style={{ ...(data.foto ? { backgroundImage: `url(${data.foto})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
                                     : { borderTop: `6px solid ${colorRegion}`, backgroundColor: 'white' }) }}>
              {data.foto && <div style={styles.fotoOverlay} />}
              <div style={styles.cardHeader}>
                <span style={{ fontSize: '2.5rem', zIndex: 10, padding: '10px' }}>{viaje.flag}</span>
                <div style={{...styles.actions, padding: '10px'}}>
                  <button onClick={(e) => { e.stopPropagation(); abrirEditor(viaje.id); }} style={data.foto ? styles.btnNavFoto : styles.actionBtn}><Edit3 size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); manejarEliminar(viaje.id); }} style={data.foto ? styles.btnNavFoto : styles.actionBtn}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ marginTop: 'auto', zIndex: 5, ...(data.foto ? styles.fullWidthGlass : { padding: '20px' }) }}>
                 <div style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'center' }}>
                   <p style={{ margin: 0, color: data.foto ? '#fff' : colorRegion, fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase' }}>
                     {viaje.continente.toUpperCase() || 'DESTINO'}
                   </p>
                   <span style={{ ...styles.badge, backgroundColor: data.foto ? 'rgba(255,255,255,0.2)' : `${colorRegion}20`, color: data.foto ? 'white' : colorRegion }}>
                     {dias} {dias === 1 ? 'DÍA' : 'DÍAS'}
                   </span>
                 </div>
                 <h3 style={{ margin: '5px 0', color: data.foto ? 'white' : COLORS.charcoalBlue, fontSize: esHito ? '1.8rem' : '1.2rem', fontWeight: '900' }}>
                   {viaje.nombreEspanol}
                 </h3>
                 <div style={{ display: 'flex', gap: '10px', opacity: 0.8 }}>
                   <Calendar size={12} color={data.foto ? 'white' : COLORS.charcoalBlue} />
                   <span style={{ fontSize: '0.75rem', color: data.foto ? 'white' : COLORS.charcoalBlue, fontWeight: '700' }}>{data.fechaInicio || viaje.fecha}</span>
                 </div>
              </div>
            </BentoCard>
          );
        })}
      </div>

      {/* --- VISTA INMERSIVA --- */}
      {createPortal(
        <AnimatePresence>
          {viajeExpandido && (() => {
            const { dias, ciudadesCount } = obtenerStatsCapitulo(viajeExpandido.id);
            const imgSello = IMAGENES_SELLOS[viajeExpandido.code]; // Sello visual si existe

            return (
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30 }} style={styles.expandedOverlay}>
                <div style={styles.expandedHeader(bitacoraData[viajeExpandido.id]?.foto)}>
                  <div style={styles.fotoOverlay} />
                  
                  {/* Botón Atrás arreglado */}
                  <button onClick={() => setViajeExpandido(null)} style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 50, background: 'rgba(255,255,255,0.2)', border: 'none', padding: '12px', borderRadius: '50%', color: 'white', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                    <ArrowLeft size={24} />
                  </button>

                  {/* Botón Editar en inmersiva */}
                  <button onClick={() => abrirEditor(viajeExpandido.id)} style={{ position: 'absolute', top: '30px', right: '30px', zIndex: 50, background: 'rgba(255,255,255,0.2)', border: 'none', padding: '12px', borderRadius: '50%', color: 'white', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                    <Edit3 size={24} />
                  </button>

                  <div style={{ position: 'relative', zIndex: 10, color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <span style={{ fontSize: '5rem', display: 'block', marginBottom: '10px' }}>{viajeExpandido.flag}</span>
                        <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: '0 0 10px' }}>{viajeExpandido.nombreEspanol}</h1>
                        <p style={{ fontSize: '1.4rem', margin: 0, opacity: 0.9, fontWeight: '600' }}>{viajeExpandido.continente}</p>
                      </div>
                      
                      {/* Sello Tipo Pasaporte Visual */}
                      {imgSello && (
                        <img src={imgSello} alt="Sello" style={{ width: '120px', opacity: 0.8, filter: 'invert(1)', transform: 'rotate(-10deg)' }} />
                      )}
                    </div>
                  </div>
                </div>

                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} style={styles.infoBar}>
                  <div style={styles.infoItem}><Clock size={20} color={COLORS.mutedTeal} /><span style={{ fontSize: '1rem', fontWeight: '900', color: COLORS.charcoalBlue }}>{dias} Días</span><span style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: '900' }}>DURACIÓN</span></div>
                  <div style={styles.infoItem}><MapPin size={20} color={COLORS.mutedTeal} /><span style={{ fontSize: '1rem', fontWeight: '900', color: COLORS.charcoalBlue }}>{ciudadesCount}</span><span style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: '900' }}>CIUDADES</span></div>
                  <div style={styles.infoItem}><Zap size={20} color={COLORS.atomicTangerine} /><span style={{ fontSize: '1rem', fontWeight: '900', color: COLORS.charcoalBlue }}>{bitacoraData[viajeExpandido.id]?.rating}/5</span><span style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: '900' }}>VERDICTO</span></div>
                  <div style={styles.infoItem}><CloudSun size={20} color={COLORS.mutedTeal} /><span style={{ fontSize: '1rem', fontWeight: '900', color: COLORS.charcoalBlue }}>{bitacoraData[viajeExpandido.id]?.clima || '--'}</span><span style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: '900' }}>VIBRA</span></div>
                </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" style={styles.hybridBody}>
                  <motion.div variants={itemVariants}><h4 style={styles.sectionTitle}><BookOpen size={18}/> Capítulo de vida</h4><div style={{ fontSize: '1.35rem', lineHeight: '1.9', color: COLORS.charcoalBlue, whiteSpace: 'pre-wrap', fontFamily: '"Georgia", serif' }}>{bitacoraData[viajeExpandido.id]?.texto || "El relato está esperando..."}</div></motion.div>
                  <motion.div variants={itemVariants}><h4 style={styles.sectionTitle}><Map size={18}/> Hallazgos</h4>
                    <div style={styles.highlightCard}><p style={styles.label}>Hitos Principales</p><p style={{ fontWeight: '800', margin: 0 }}>{bitacoraData[viajeExpandido.id]?.monumentos || 'Sin registro'}</p></div>
                    <div style={styles.highlightCard}><p style={styles.label}>Tripulación</p><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /><p style={{ fontWeight: '800', margin: 0 }}>{bitacoraData[viajeExpandido.id]?.companero || 'Solo'}</p></div></div>
                    <div style={styles.highlightCard}><p style={styles.label}>Sabor Memorable</p><p style={{ fontWeight: '800', margin: 0 }}>{bitacoraData[viajeExpandido.id]?.gastronomia || 'Sin registro'}</p></div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          })()}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default BentoGrid;