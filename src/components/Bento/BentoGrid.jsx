import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BentoCard from './BentoCard';
import StatsBitacora from '../Dashboard/StatsBitacora'; 
import { 
  Trash2, Edit3, X, Check, Calendar, Star, Users, Camera, 
  MapPin, Landmark, CloudSun, UtensilsCrossed, ArrowLeft, BookOpen, Map, Clock, Zap
} from 'lucide-react';
import { IMAGENES_SELLOS, COLORES_CONTINENTE } from '../../assets/sellos';
import { COLORS } from '../../theme';
import { styles } from './BentoGrid.styles';

const BentoGrid = ({ viajes = [], bitacoraData = {}, actualizarDetallesViaje, manejarEliminar }) => {
  const [viajeEnEdicion, setViajeEnEdicion] = useState(null);
  const [viajeExpandido, setViajeExpandido] = useState(null);
  const [form, setForm] = useState({});

  const abrirEditor = (e, viaje) => {
    e.stopPropagation();
    const data = bitacoraData[viaje.id] || {};
    setViajeEnEdicion(viaje);
    setForm({
      texto: data.texto || "",
      fechaInicio: data.fechaInicio || viaje.fecha,
      fechaFin: data.fechaFin || "",
      companero: data.companero || "",
      rating: data.rating || 5,
      foto: data.foto || null,
      ciudades: data.ciudades || "",
      monumentos: data.monumentos || "",
      clima: data.clima || "",
      gastronomia: data.gastronomia || ""
    });
  };

  const guardarCambios = () => {
    actualizarDetallesViaje(viajeEnEdicion.id, form);
    setViajeEnEdicion(null);
  };

  const viajesOrdenados = useMemo(() => {
    return [...viajes].sort((a, b) => {
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
    return { dias, ciudadesCount, intensidad: ciudadesCount > 3 || dias > 10 ? 'Expedición' : 'Escapada' };
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };

  return (
    <div style={{ width: '100%' }}>
      {/* 1. Barra de estadísticas resumidas: Solo Acumulación */}
      <StatsBitacora bitacora={viajes} bitacoraData={bitacoraData} />

      {/* 2. Grid de tarjetas */}
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
                <span style={{ fontSize: '2.5rem', zIndex: 10 }}>{viaje.flag}</span>
                <div style={styles.actions}>
                  <button onClick={(e) => abrirEditor(e, viaje)} style={data.foto ? styles.btnNavFoto : styles.actionBtn}><Edit3 size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); manejarEliminar(viaje.id, viaje.code); }} style={data.foto ? styles.btnNavFoto : styles.actionBtn}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ marginTop: 'auto', zIndex: 5, ...(data.foto ? styles.fullWidthGlass : { padding: '20px' }) }}>
                 <div style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'center' }}>
                   <p style={{ margin: 0, color: data.foto ? '#fff' : colorRegion, fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase' }}>
                     {data.ciudades || 'Nuevas coordenadas'}
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

      {/* --- HYBRID CANVAS --- */}
      {createPortal(
        <AnimatePresence>
          {viajeExpandido && (() => {
            const { dias, ciudadesCount, intensidad } = obtenerStatsCapitulo(viajeExpandido.id);
            return (
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30 }} style={styles.expandedOverlay}>
                <div style={styles.expandedHeader(bitacoraData[viajeExpandido.id]?.foto)}>
                  <div style={styles.fotoOverlay} />
                  <button onClick={() => setViajeExpandido(null)} style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 20, background: 'rgba(255,255,255,0.2)', border: 'none', padding: '15px', borderRadius: '50%', color: 'white', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                    <ArrowLeft size={24} />
                  </button>
                  <div style={{ position: 'relative', zIndex: 10, color: 'white' }}>
                    <span style={{ fontSize: '5rem' }}>{viajeExpandido.flag}</span>
                    <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: '10px 0 5px' }}>{viajeExpandido.nombreEspanol}</h1>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                       <p style={{ fontSize: '1.4rem', margin: 0, opacity: 0.9, fontWeight: '600' }}>{viajeExpandido.continente}</p>
                       <span style={{ backgroundColor: COLORS.atomicTangerine, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '900' }}>{intensidad}</span>
                    </div>
                  </div>
                </div>

                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} style={styles.infoBar}>
                  <div style={styles.infoItem}><Clock size={20} color={COLORS.mutedTeal} /><span style={{ fontSize: '1rem', fontWeight: '900', color: COLORS.charcoalBlue }}>{dias} Días</span><span style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: '900' }}>DURACIÓN</span></div>
                  <div style={styles.infoItem}><MapPin size={20} color={COLORS.mutedTeal} /><span style={{ fontSize: '1rem', fontWeight: '900', color: COLORS.charcoalBlue }}>{ciudadesCount}</span><span style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: '900' }}>CIUDADES</span></div>
                  <div style={styles.infoItem}><Zap size={20} color={COLORS.atomicTangerine} /><span style={{ fontSize: '1rem', fontWeight: '900', color: COLORS.charcoalBlue }}>{bitacoraData[viajeExpandido.id]?.rating}/5</span><span style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: '900' }}>VERDICTO</span></div>
                  <div style={styles.infoItem}><CloudSun size={20} color={COLORS.mutedTeal} /><span style={{ fontSize: '1rem', fontWeight: '900', color: COLORS.charcoalBlue }}>{bitacoraData[viajeExpandido.id]?.clima || '--'}</span><span style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: '900' }}>ATMÓSFERA</span></div>
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

      {/* --- MODAL DE EDICIÓN --- */}
      {createPortal(
        <AnimatePresence>
          {viajeEnEdicion && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay} onClick={() => setViajeEnEdicion(null)}>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}><div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}><span style={{ fontSize: '3.5rem' }}>{viajeEnEdicion.flag}</span><h2 style={{ margin: 0, fontWeight: '900', color: COLORS.charcoalBlue }}>{viajeEnEdicion.nombreEspanol}</h2></div><button onClick={() => setViajeEnEdicion(null)} style={styles.closeBtn}><X size={24} /></button></div>
                <div style={styles.formSection}><div style={styles.formRow}><div style={styles.inputGroup}><label style={styles.label}>Inicio</label><input type="date" style={styles.input} value={form.fechaInicio} onChange={e => setForm({...form, fechaInicio: e.target.value})} /></div><div style={styles.inputGroup}><label style={styles.label}>Fin</label><input type="date" style={styles.input} min={form.fechaInicio} value={form.fechaFin} onChange={e => setForm({...form, fechaFin: e.target.value})} /></div></div></div>
                <div style={styles.formSection}>
                  <div style={styles.formRow}>
                    <div style={styles.inputGroup}><label style={styles.label}>Ciudades</label><input type="text" placeholder="Berlín, París..." style={styles.input} value={form.ciudades} onChange={e => setForm({...form, ciudades: e.target.value})} /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>Clima</label><input type="text" placeholder="Soleado, 20°C" style={styles.input} value={form.clima} onChange={e => setForm({...form, clima: e.target.value})} /></div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.inputGroup}><label style={styles.label}>Monumentos</label><input type="text" style={styles.input} value={form.monumentos} onChange={e => setForm({...form, monumentos: e.target.value})} /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>Gastronomía</label><input type="text" style={styles.input} value={form.gastronomia} onChange={e => setForm({...form, gastronomia: e.target.value})} /></div>
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}><label style={styles.label}>Portada</label><input type="file" id="up-edit" hidden onChange={e => { const r = new FileReader(); r.onload = () => setForm({...form, foto: r.result}); r.readAsDataURL(e.target.files[0]); }} /><label htmlFor="up-edit" style={styles.uploadLabel(form.foto)}>{!form.foto && <span style={{fontWeight: '800', color: COLORS.atomicTangerine}}>Subir Foto</span>}</label></div>
                <textarea style={styles.textarea} value={form.texto} onChange={e => setForm({...form, texto: e.target.value})} />
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}><button onClick={guardarCambios} style={styles.saveBtn}><Check /> Guardar Aventura</button></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default BentoGrid;