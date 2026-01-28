import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BentoCard from './BentoCard';
import StatsBitacora from '../Dashboard/StatsBitacora'; 
import { 
  Trash2, Edit3, Calendar, MapPin, ArrowLeft, BookOpen, Map, Star, Sparkles, Check, X, Camera
} from 'lucide-react';
import { COLORES_CONTINENTE, IMAGENES_SELLOS } from '../../assets/sellos';
import { COLORS } from '../../theme';
import { styles } from './BentoGrid.styles';

const BentoGrid = ({ viajes = [], bitacoraData = {}, manejarEliminar, abrirEditor, actualizarDetallesViaje }) => {
  const [viajeExpandido, setViajeExpandido] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formTemp, setFormTemp] = useState({});

  // Sincronizar el formulario temporal cuando cambia el viaje expandido o la data global
  useEffect(() => {
    if (viajeExpandido) {
      setFormTemp(bitacoraData[viajeExpandido.id] || {});
    }
  }, [viajeExpandido, bitacoraData]);

  const guardarCambiosInmersivos = () => {
    actualizarDetallesViaje(viajeExpandido.id, formTemp);
    setModoEdicion(false);
  };

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
            <BentoCard key={viaje.id} tipo={esHito ? 'grande' : 'normal'} onClick={() => setViajeExpandido(viaje)}
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
                     {/* Se muestra el rango de fechas en la tarjeta */}
                     {data.fechaInicio || viaje.fecha} — {data.fechaFin || 'Activo'}
                   </span>
                 </div>
              </div>
            </BentoCard>
          );
        })}
      </div>

      {createPortal(
        <AnimatePresence>
          {viajeExpandido && (() => {
            const data = bitacoraData[viajeExpandido.id] || {};
            const imgSello = IMAGENES_SELLOS[viajeExpandido.code];
            
            return (
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} style={styles.expandedOverlay}>
                <div style={styles.expandedHeader(formTemp.foto)}>
                  <div style={styles.fotoOverlay} />
                  
                  {/* Navegación superior con botones de edición integrados */}
                  <div style={{ position: 'absolute', top: '30px', left: '30px', right: '30px', display: 'flex', justifyContent: 'space-between', zIndex: 100 }}>
                    <button onClick={() => { setViajeExpandido(null); setModoEdicion(false); }} style={styles.backBtn}><ArrowLeft size={24} /></button>
                    
                    {!modoEdicion ? (
                      <button onClick={() => setModoEdicion(true)} style={styles.editBtnInmersive}><Edit3 size={20} /> Editar Memorias</button>
                    ) : (
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={() => setModoEdicion(false)} style={styles.cancelBtnInmersive}><X size={20} /> Cancelar</button>
                        <button onClick={guardarCambiosInmersivos} style={styles.saveBtnInmersive}><Check size={20} /> Guardar</button>
                      </div>
                    )}
                  </div>

                  <div style={{ position: 'relative', zIndex: 10, color: 'white', width: '100%', padding: '0 60px 40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <span className="emoji-span" style={{ fontSize: '5rem', display: 'block', marginBottom: '15px' }}>{viajeExpandido.flag}</span>
                        <h1 style={{ fontSize: '4rem', fontWeight: '800', margin: '0 0 10px' }}>{viajeExpandido.nombreEspanol}</h1>
                        <p style={{ fontSize: '1.2rem', fontWeight: '600', opacity: 0.9, letterSpacing: '0.05em' }}>{viajeExpandido.continente.toUpperCase()}</p>
                      </div>
                      {imgSello && !modoEdicion && <img src={imgSello} alt="Sello" style={{ width: '130px', filter: 'invert(1) brightness(2)', opacity: 0.7, transform: 'rotate(-10deg)' }} />}
                      
                      {modoEdicion && (
                        <div style={{ textAlign: 'center' }}>
                          <input type="file" id="up-inmersive" hidden onChange={e => { const r = new FileReader(); r.onload = () => setFormTemp({...formTemp, foto: r.result}); r.readAsDataURL(e.target.files[0]); }} />
                          <label htmlFor="up-inmersive" style={styles.cameraLabel}><Camera size={30} /><br/>Nueva Portada</label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={styles.infoBar}>
                  <div style={styles.infoItem}>
                    <Calendar size={20} color={COLORS.mutedTeal} />
                    {modoEdicion ? (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <input type="date" style={styles.miniInput} value={formTemp.fechaInicio} onChange={e => setFormTemp({...formTemp, fechaInicio: e.target.value})} />
                        <input type="date" style={styles.miniInput} value={formTemp.fechaFin} onChange={e => setFormTemp({...formTemp, fechaFin: e.target.value})} />
                      </div>
                    ) : (
                      <span className="mono-data" style={{ fontWeight: '700' }}>{data.fechaInicio} — {data.fechaFin || 'Hoy'}</span>
                    )}
                    <span style={styles.infoLabel}>PERÍODO</span>
                  </div>

                  <div style={styles.infoItem}>
                    <MapPin size={20} color={COLORS.mutedTeal} />
                    {modoEdicion ? (
                      <input type="text" placeholder="¿Qué ciudades?" style={styles.miniInput} value={formTemp.ciudades} onChange={e => setFormTemp({...formTemp, ciudades: e.target.value})} />
                    ) : (
                      <span style={{ fontWeight: '700' }}>{data.ciudades || '---'}</span>
                    )}
                    <span style={styles.infoLabel}>LOCALIZACIÓN</span>
                  </div>

                  <div style={styles.infoItem}>
                    <Sparkles size={20} color={COLORS.atomicTangerine} />
                    {modoEdicion ? (
                      <input type="text" placeholder="Vibra..." style={styles.miniInput} value={formTemp.clima} onChange={e => setFormTemp({...formTemp, clima: e.target.value})} />
                    ) : (
                      <span style={{ fontWeight: '700' }}>{data.clima || 'Aventura'}</span>
                    )}
                    <span style={styles.infoLabel}>VIBRA</span>
                  </div>

                  <div style={styles.infoItem}>
                    <Star size={20} color={COLORS.atomicTangerine} />
                    {modoEdicion ? (
                      <select style={styles.miniInput} value={formTemp.rating} onChange={e => setFormTemp({...formTemp, rating: Number(e.target.value)})}>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} estrellas</option>)}
                      </select>
                    ) : (
                      <span style={{ fontWeight: '700' }}>{data.rating}/5</span>
                    )}
                    <span style={styles.infoLabel}>VERDICTO</span>
                  </div>
                </div>

                <div style={styles.hybridBody}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={styles.sectionTitle}><BookOpen size={18}/> Mi Relato</h4>
                    {modoEdicion ? (
                      <textarea style={styles.inmersiveTextarea} value={formTemp.texto} onChange={e => setFormTemp({...formTemp, texto: e.target.value})} placeholder="Escribe tu historia aquí..." />
                    ) : (
                      <p style={styles.readText}>{data.texto || "No hay nada escrito aún sobre esta aventura..."}</p>
                    )}
                  </div>

                  <div>
                    <h4 style={styles.sectionTitle}><Map size={18}/> Hallazgos</h4>
                    <div style={styles.highlightCard}>
                      <span style={styles.infoLabel}>Sabores</span>
                      {modoEdicion ? <input type="text" style={styles.miniInput} value={formTemp.gastronomia} onChange={e => setFormTemp({...formTemp, gastronomia: e.target.value})} /> : <p style={{ fontWeight: '600', margin: '5px 0' }}>{data.gastronomia || '---'}</p>}
                    </div>
                    <div style={styles.highlightCard}>
                      <span style={styles.infoLabel}>Compañeros</span>
                      {modoEdicion ? <input type="text" style={styles.miniInput} value={formTemp.companero} onChange={e => setFormTemp({...formTemp, companero: e.target.value})} /> : <p style={{ fontWeight: '600', margin: '5px 0' }}>{data.companero || 'Solo'}</p>}
                    </div>
                    <div style={styles.highlightCard}>
                      <span style={styles.infoLabel}>Hitos</span>
                      {modoEdicion ? <input type="text" style={styles.miniInput} value={formTemp.monumentos} onChange={e => setFormTemp({...formTemp, monumentos: e.target.value})} /> : <p style={{ fontWeight: '600', margin: '5px 0' }}>{data.monumentos || '---'}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>, 
        document.body
      )}
    </div>
  );
};

export default BentoGrid;