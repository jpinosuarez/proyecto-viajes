import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar, MapPin, Landmark, CloudSun, UtensilsCrossed, Star, Camera, Users } from 'lucide-react';
import { COLORS } from '../../theme';
import { styles } from './EdicionModal.styles';

const EdicionModal = ({ viaje, bitacoraData, onClose, onSave }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (viaje) {
      const data = bitacoraData[viaje.id] || {};
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
    }
  }, [viaje, bitacoraData]);

  const guardar = () => {
    onSave(viaje.id, form);
    onClose();
  };

  if (!viaje) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        style={styles.modalOverlay} onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20, opacity: 0 }} 
          animate={{ scale: 1, y: 0, opacity: 1 }} 
          exit={{ scale: 0.95, y: 20, opacity: 0 }} 
          style={styles.modalContent} onClick={e => e.stopPropagation()}
        >
          <div style={styles.modalHeader}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <span style={{ fontSize: '3.5rem' }}>{viaje.flag}</span>
              <div>
                <h2 style={{ margin: 0, fontWeight: '900', color: COLORS.charcoalBlue }}>{viaje.nombreEspanol}</h2>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: COLORS.mutedTeal, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Editando Registro
                </p>
              </div>
            </div>
            <button onClick={onClose} style={styles.closeBtn}><X size={24} /></button>
          </div>

          <div style={styles.scrollArea} className="custom-scroll">
            {/* FECHAS */}
            <div style={styles.formSection}>
              <div style={styles.formRow}>
                <div style={styles.inputGroup}><label style={styles.label}><Calendar size={14}/> Inicio</label><input type="date" style={styles.input} value={form.fechaInicio} onChange={e => setForm({...form, fechaInicio: e.target.value})} /></div>
                <div style={styles.inputGroup}><label style={styles.label}><Calendar size={14}/> Fin</label><input type="date" style={styles.input} min={form.fechaInicio} value={form.fechaFin} onChange={e => setForm({...form, fechaFin: e.target.value})} /></div>
              </div>
            </div>

            {/* DETALLES */}
            <div style={styles.formSection}>
              <div style={styles.formRow}>
                <div style={styles.inputGroup}><label style={styles.label}><MapPin size={14}/> Ciudades</label><input type="text" placeholder="Ej: Berlín, Múnich" style={styles.input} value={form.ciudades} onChange={e => setForm({...form, ciudades: e.target.value})} /></div>
                <div style={styles.inputGroup}><label style={styles.label}><CloudSun size={14}/> Vibra / Clima</label><input type="text" placeholder="Ej: Aventura, Relax, Frío" style={styles.input} value={form.clima} onChange={e => setForm({...form, clima: e.target.value})} /></div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.inputGroup}><label style={styles.label}><Landmark size={14}/> Monumentos</label><input type="text" placeholder="Ej: Puerta de Brandeburgo" style={styles.input} value={form.monumentos} onChange={e => setForm({...form, monumentos: e.target.value})} /></div>
                <div style={styles.inputGroup}><label style={styles.label}><UtensilsCrossed size={14}/> Gastronomía</label><input type="text" placeholder="Plato inolvidable" style={styles.input} value={form.gastronomia} onChange={e => setForm({...form, gastronomia: e.target.value})} /></div>
              </div>
              <div style={styles.formRow}>
                 <div style={styles.inputGroup}><label style={styles.label}><Users size={14}/> Compañía</label><input type="text" placeholder="¿Con quién fuiste?" style={styles.input} value={form.companero} onChange={e => setForm({...form, companero: e.target.value})} /></div>
                 <div style={styles.inputGroup}>
                    <label style={styles.label}><Star size={14}/> Veredicto</label>
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} size={20} onClick={() => setForm({...form, rating: n})} style={{ cursor: 'pointer', fill: n <= form.rating ? COLORS.atomicTangerine : 'none', color: n <= form.rating ? COLORS.atomicTangerine : '#cbd5e1' }} />
                      ))}
                    </div>
                 </div>
              </div>
            </div>

            {/* MULTIMEDIA Y TEXTO */}
            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}><Camera size={14}/> Portada</label>
              <input type="file" id="upload-edit-modal" hidden onChange={e => { const r = new FileReader(); r.onload = () => setForm({...form, foto: r.result}); r.readAsDataURL(e.target.files[0]); }} />
              <label htmlFor="upload-edit-modal" style={styles.uploadLabel(form.foto)}>
                {!form.foto && <span style={{ color: COLORS.mutedTeal, fontWeight: '800' }}>Click para subir foto</span>}
                {form.foto && <div style={{ background: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px 10px', borderRadius: '12px' }}>Cambiar foto</div>}
              </label>
            </div>

            <textarea style={styles.textarea} placeholder="Escribe aquí tu historia..." value={form.texto} onChange={e => setForm({...form, texto: e.target.value})} />
          </div>

          <div style={styles.footer}>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: COLORS.charcoalBlue, fontWeight: '800', cursor: 'pointer' }}>Cancelar</button>
            <button onClick={guardar} style={styles.saveBtn}><Check /> Guardar Aventura</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default EdicionModal;