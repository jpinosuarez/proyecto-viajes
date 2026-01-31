import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Edit3, Calendar, Check, X, Camera, Plus } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore'; 
import { useAuth } from '../../context/AuthContext';
import { styles } from './VisorViaje.styles';
import CityManager from '../Shared/CityManager'; // IMPORTADO
import MiniMapaRuta from '../Shared/MiniMapaRuta'; // IMPORTADO

const VisorViaje = ({ viajeId, bitacoraData, bitacoraLista, onClose, onEdit, onSave }) => {
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
        // Ordenar por fecha si es posible, sino por creación
        const loaded = snap.docs.map(d => ({id: d.id, ...d.data()}));
        setParadas(loaded.sort((a,b) => new Date(a.fecha) - new Date(b.fecha)));
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
    // Al guardar, también deberíamos actualizar las paradas en DB 
    // (Por simplicidad en este MVP, CityManager maneja estado local y aquí deberíamos iterar para guardar en DB real)
    // NOTA: Para producción, mover lógica de guardado de paradas a useViajes y llamarla aquí.
    onSave(viajeId, formTemp);
    setModoEdicion(false);
  };

  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} 
        transition={{ type: 'spring', damping: 25 }} 
        style={styles.expandedOverlay}
      >
        <div style={styles.expandedHeader(modoEdicion ? formTemp.foto : data.foto)}>
          <div style={styles.fotoOverlay} />
          
          <div style={styles.navBar}>
            <button onClick={onClose} style={styles.iconBtn}><ArrowLeft size={24} /></button>
            <div style={{ display: 'flex', gap: '10px' }}>
              {!modoEdicion ? (
                <button onClick={iniciarEdicion} style={styles.primaryBtn(false)}>
                  <Edit3 size={16} /> Editar
                </button>
              ) : (
                <>
                  <button onClick={() => setModoEdicion(false)} style={styles.secondaryBtn}><X size={16} /></button>
                  <button onClick={guardarCambios} style={styles.primaryBtn(true)}><Check size={16} /> Guardar</button>
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
        </div>

        <div style={styles.bodyContent}>
          {/* Columna Principal: Relato y Mapa */}
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
              <p style={styles.readText}>{data.texto || "Sin relato aún..."}</p>
            )}

            {/* Nuevo: Mapa de Ruta en el Visor */}
            <div style={{ marginTop: '40px' }}>
                <h3 style={styles.sectionTitle}>Mapa de Ruta</h3>
                <MiniMapaRuta paradas={paradas} />
            </div>
          </div>

          {/* Columna Lateral: Ciudades (Lectura/Edición) */}
          <div style={styles.sideColumn}>
            <h3 style={styles.sectionTitle}>Hoja de Ruta</h3>
            
            {modoEdicion ? (
                // En modo edición usamos el CityManager completo
                <CityManager paradas={paradas} setParadas={setParadas} />
            ) : (
                // En modo lectura mostramos una lista bonita
                <div style={styles.timeline}>
                    {paradas.map((p, i) => (
                        <div key={i} style={styles.timelineItem}>
                            <div style={styles.timelineDot} />
                            <div style={styles.stopCard}>
                                <strong>{p.nombre}</strong>
                                <span style={{fontSize:'0.75rem', display:'block', color:'#64748b'}}>{p.fecha}</span>
                            </div>
                        </div>
                    ))}
                    {paradas.length === 0 && <p style={styles.emptyState}>No hay paradas registradas.</p>}
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