import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Edit3, Calendar, MapPin, Check, X, Camera, Thermometer, Cloud 
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore'; 
import { useAuth } from '../../context/AuthContext';
import { IMAGENES_SELLOS } from '../../assets/sellos';
import { COLORS } from '../../theme';
import { styles } from './VisorViaje.styles';

const VisorViaje = ({ viajeId, bitacoraData, bitacoraLista, onClose, onEdit, onSave }) => {
  const { usuario } = useAuth();
  const viajeBase = bitacoraLista.find(v => v.id === viajeId);
  const data = bitacoraData[viajeId] || {};
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formTemp, setFormTemp] = useState({});
  const [paradas, setParadas] = useState([]); // Paradas reales

  // Cargar paradas al abrir
  useEffect(() => {
    if (viajeId && usuario) {
      const fetchParadas = async () => {
        const ref = collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`);
        const snap = await getDocs(ref);
        setParadas(snap.docs.map(d => ({id: d.id, ...d.data()})));
      };
      fetchParadas();
    }
  }, [viajeId, usuario]);

  if (!viajeId || !viajeBase) return null;

  const iniciarEdicion = () => {
    setFormTemp(data);
    setModoEdicion(true);
  };

  const guardarCambios = () => {
    onSave(viajeId, formTemp);
    setModoEdicion(false);
  };

  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} 
        transition={{ type: 'spring', damping: 20 }} 
        style={styles.expandedOverlay}
      >
        {/* HEADER INMERSIVO */}
        <div style={styles.expandedHeader(modoEdicion ? formTemp.foto : data.foto)}>
          <div style={styles.fotoOverlay} />
          
          <div style={styles.navBar}>
            <button onClick={onClose} style={styles.backBtn}><ArrowLeft size={24} /></button>
            {!modoEdicion ? (
              <button onClick={iniciarEdicion} style={styles.editBtnInmersive}><Edit3 size={18} /> Editar</button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setModoEdicion(false)} style={styles.cancelBtn}><X size={18} /></button>
                <button onClick={guardarCambios} style={styles.saveBtn}><Check size={18} /> Guardar</button>
              </div>
            )}
          </div>

          <div style={styles.headerContent}>
             <span style={styles.flagIcon}>{viajeBase.flag}</span>
             {modoEdicion ? (
               <input 
                 style={styles.titleInput} 
                 value={formTemp.titulo} 
                 onChange={e => setFormTemp({...formTemp, titulo: e.target.value})} 
               />
             ) : (
               <h1 style={styles.titleDisplay}>{data.titulo || viajeBase.nombreEspanol}</h1>
             )}
             <div style={styles.metaBadge}>
               <Calendar size={14} /> {data.fechaInicio}
             </div>
          </div>
          
          {/* Crédito Foto Discreto */}
          {!modoEdicion && data.fotoCredito && (
             <div style={styles.creditBox}>
               <Camera size={12} /> Foto: {data.fotoCredito.nombre}
             </div>
          )}
        </div>

        {/* CONTENIDO */}
        <div style={styles.bodyContent}>
          
          {/* SECCIÓN 1: RELATO */}
          <div style={styles.mainColumn}>
            <h3 style={styles.sectionTitle}>Bitácora de Viaje</h3>
            {modoEdicion ? (
              <textarea 
                style={styles.textArea} 
                value={formTemp.texto} 
                onChange={e => setFormTemp({...formTemp, texto: e.target.value})} 
                placeholder="Escribe aquí tu relato..."
              />
            ) : (
              <p style={styles.readText}>{data.texto || "Aún no has escrito el relato de esta aventura."}</p>
            )}
          </div>

          {/* SECCIÓN 2: RUTA Y PARADAS (SIDEBAR) */}
          <div style={styles.sideColumn}>
            <h3 style={styles.sectionTitle}>Hoja de Ruta</h3>
            
            {paradas.length === 0 ? (
               <div style={styles.emptyState}>No hay paradas registradas.</div>
            ) : (
               <div style={styles.timeline}>
                 {paradas.map((parada, idx) => (
                   <div key={idx} style={styles.timelineItem}>
                     <div style={styles.timelineDot} />
                     <div style={styles.stopCard}>
                       <strong style={{ fontSize: '1rem', color: COLORS.charcoalBlue }}>{parada.nombre}</strong>
                       
                       {/* Clima Histórico */}
                       {parada.clima && (
                         <div style={styles.weatherTag}>
                           {parada.clima.desc.includes('Sol') ? <Thermometer size={12}/> : <Cloud size={12}/>}
                           {parada.clima.desc} • {parada.clima.max}°C
                         </div>
                       )}
                       
                       {parada.relato && <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0' }}>"{parada.relato.substring(0,50)}..."</p>}
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>, 
    document.body
  );
};

export default VisorViaje;