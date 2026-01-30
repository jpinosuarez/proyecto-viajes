import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Edit3, Calendar, Check, X, Camera, Thermometer, Cloud, Plus, MapPin 
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore'; 
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme';
import { styles } from './VisorViaje.styles';

const VisorViaje = ({ viajeId, bitacoraData, bitacoraLista, onClose, onEdit, onSave, onAddParada }) => {
  const { usuario } = useAuth();
  const viajeBase = bitacoraLista.find(v => v.id === viajeId);
  const data = bitacoraData[viajeId] || {};
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formTemp, setFormTemp] = useState({});
  const [paradas, setParadas] = useState([]);

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
        transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
        style={styles.expandedOverlay}
      >
        <div style={styles.expandedHeader(modoEdicion ? formTemp.foto : data.foto)}>
          <div style={styles.fotoOverlay} />
          
          <div style={styles.navBar}>
            <button onClick={onClose} style={styles.iconBtn}><ArrowLeft size={24} /></button>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {!modoEdicion ? (
                <button onClick={iniciarEdicion} style={styles.primaryBtn(false)}>
                  <Edit3 size={16} /> Editar Viaje
                </button>
              ) : (
                <>
                  <button onClick={() => setModoEdicion(false)} style={styles.secondaryBtn}>
                    <X size={16} /> Cancelar
                  </button>
                  <button onClick={guardarCambios} style={styles.primaryBtn(true)}>
                    <Check size={16} /> Guardar
                  </button>
                </>
              )}
            </div>
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
          
          {!modoEdicion && data.fotoCredito && (
             <div style={styles.creditBox}><Camera size={12} /> {data.fotoCredito.nombre}</div>
          )}
        </div>

        <div style={styles.bodyContent}>
          <div style={styles.mainColumn}>
            <h3 style={styles.sectionTitle}>Bitácora</h3>
            {modoEdicion ? (
              <textarea 
                style={styles.textArea} 
                value={formTemp.texto} 
                onChange={e => setFormTemp({...formTemp, texto: e.target.value})} 
                placeholder="¿Qué hizo especial a este viaje?"
              />
            ) : (
              <p style={styles.readText}>{data.texto || "Sin relato aún..."}</p>
            )}
          </div>

          <div style={styles.sideColumn}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h3 style={{...styles.sectionTitle, marginBottom:0}}>Hoja de Ruta</h3>
              {/* Botón para abrir el buscador y agregar ciudad a este viaje */}
              <button onClick={() => onAddParada(viajeId)} style={styles.addStopBtn} title="Agregar parada">
                <Plus size={16} />
              </button>
            </div>
            
            <div style={styles.timeline}>
               {paradas.map((parada, idx) => (
                 <div key={idx} style={styles.timelineItem}>
                   <div style={styles.timelineDot} />
                   <div style={styles.stopCard}>
                     <div style={{display:'flex', justifyContent:'space-between'}}>
                       <strong style={{color: COLORS.charcoalBlue}}>{parada.nombre}</strong>
                       <span style={{fontSize:'0.7rem', opacity:0.6}}>{parada.fecha}</span>
                     </div>
                     {parada.clima && (
                       <div style={styles.weatherTag}>
                         {parada.clima.desc.includes('Sol') ? <Thermometer size={12}/> : <Cloud size={12}/>}
                         {parada.clima.desc} • {parada.clima.max}°C
                       </div>
                     )}
                   </div>
                 </div>
               ))}
               {paradas.length === 0 && <div style={styles.emptyState}>Agrega ciudades o lugares con el botón +</div>}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>, 
    document.body
  );
};

export default VisorViaje;