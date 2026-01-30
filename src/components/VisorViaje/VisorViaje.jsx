import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Edit3, Calendar, MapPin, Sparkles, Star, BookOpen, Map, Check, X, Camera 
} from 'lucide-react';
import { IMAGENES_SELLOS } from '../../assets/sellos';
import { COLORS } from '../../theme';
import { styles } from './VisorViaje.styles';

const VisorViaje = ({ viajeId, bitacoraData, bitacoraLista, onClose, onEdit, onSave }) => {
  // Buscamos el objeto viaje base y sus datos extendidos
  const viajeBase = bitacoraLista.find(v => v.id === viajeId);
  const data = bitacoraData[viajeId] || {};
  
  // Estado local para el modo edición dentro del visor (opcional, si queremos mantener la edición inmersiva)
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formTemp, setFormTemp] = useState({});

  if (!viajeId || !viajeBase) return null;

  const iniciarEdicion = () => {
    setFormTemp(data);
    setModoEdicion(true);
  };

  const guardarCambios = () => {
    onSave(viajeId, formTemp);
    setModoEdicion(false);
  };

  const imgSello = IMAGENES_SELLOS[viajeBase.code];

  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} 
        transition={{ type: 'spring', damping: 25 }} 
        style={styles.expandedOverlay}
      >
        <div style={styles.expandedHeader(modoEdicion ? formTemp.foto : data.foto)}>
          <div style={styles.fotoOverlay} />
          
          {/* BARRA SUPERIOR */}
          <div style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', zIndex: 100, position: 'relative' }}>
            <button onClick={() => { onClose(); setModoEdicion(false); }} style={styles.backBtn}><ArrowLeft size={24} /></button>
            
            {!modoEdicion ? (
              <button onClick={iniciarEdicion} style={styles.editBtnInmersive}><Edit3 size={20} /> Editar Memorias</button>
            ) : (
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => setModoEdicion(false)} style={{...styles.editBtnInmersive, background: 'rgba(255,255,255,0.2)'}}><X size={20} /> Cancelar</button>
                <button onClick={guardarCambios} style={styles.editBtnInmersive}><Check size={20} /> Guardar</button>
              </div>
            )}
          </div>

          {/* CONTENIDO INFERIOR */}
          <div style={styles.fullWidthGlass}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
              <div style={{ flex: 1, color: 'white' }}>
                <span className="emoji-span" style={styles.emojiSpan}>{viajeBase.flag}</span>
                <h1 style={{ fontSize: '4rem', fontWeight: '800', margin: '0 0 10px', lineHeight: 1 }}>{viajeBase.nombreEspanol}</h1>
                <p style={{ fontSize: '1.2rem', fontWeight: '600', opacity: 0.9, letterSpacing: '0.05em' }}>{viajeBase.continente.toUpperCase()}</p>
              </div>
              {imgSello && !modoEdicion && <img src={imgSello} alt="Sello" style={styles.stamp} />}
              
              {modoEdicion && (
                <div style={{ textAlign: 'center' }}>
                  <input type="file" id="up-inmersive" hidden onChange={e => { const r = new FileReader(); r.onload = () => setFormTemp({...formTemp, foto: r.result}); r.readAsDataURL(e.target.files[0]); }} />
                  <label htmlFor="up-inmersive" style={{...styles.editBtnInmersive, background: 'rgba(0,0,0,0.5)'}}><Camera size={24} /> Cambiar Portada</label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BARRAS DE DATOS */}
        <div style={styles.infoBar}>
          <div style={styles.infoItem}>
            <Calendar size={20} color={COLORS.mutedTeal} />
            {modoEdicion ? (
               <div style={{display:'flex', gap:'5px'}}><input type="date" value={formTemp.fechaInicio} onChange={e=>setFormTemp({...formTemp, fechaInicio:e.target.value})}/><input type="date" value={formTemp.fechaFin} onChange={e=>setFormTemp({...formTemp, fechaFin:e.target.value})}/></div>
            ) : (
              <span style={styles.monoData}>{data.fechaInicio} — {data.fechaFin || 'Hoy'}</span>
            )}
            <span style={styles.infoLabel}>PERÍODO</span>
          </div>
          {/* ... resto de items igual que antes, usando data o formTemp ... */}
          <div style={styles.infoItem}>
             <Star size={20} color={COLORS.atomicTangerine} />
             {modoEdicion ? <input type="number" max="5" min="1" value={formTemp.rating} onChange={e=>setFormTemp({...formTemp, rating: Number(e.target.value)})} style={{width:'50px'}}/> : <span style={styles.monoData}>{data.rating}/5</span>}
             <span style={styles.infoLabel}>VERDICTO</span>
          </div>
        </div>

        <div style={styles.hybridBody}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={styles.sectionTitle}><BookOpen size={18}/> Mi Relato</h4>
            {modoEdicion ? (
              <textarea style={{width:'100%', minHeight:'300px', padding:'20px', borderRadius:'20px', border:'1px solid #ddd'}} value={formTemp.texto} onChange={e => setFormTemp({...formTemp, texto: e.target.value})} />
            ) : (
              <p style={styles.readText}>{data.texto || "No hay nada escrito aún sobre esta aventura..."}</p>
            )}
          </div>
          <div>
            <h4 style={styles.sectionTitle}><Map size={18}/> Hallazgos</h4>
            <div style={styles.highlightCard}>
              <span style={styles.infoLabel}>Sabores</span>
              {modoEdicion ? <input type="text" value={formTemp.gastronomia} onChange={e=>setFormTemp({...formTemp, gastronomia:e.target.value})}/> : <p style={{ fontWeight: '600', margin: '5px 0' }}>{data.gastronomia || '---'}</p>}
            </div>
            {/* ... resto de cards ... */}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>, 
    document.body
  );
};

export default VisorViaje;