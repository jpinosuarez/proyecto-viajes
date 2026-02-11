import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Edit3, Calendar, Check, X, Camera, Trash2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore'; 
import { useAuth } from '../../context/AuthContext';
import { styles } from './VisorViaje.styles';
import { COLORS } from '../../theme';
import CityManager from '../Shared/CityManager'; 
import MiniMapaRuta from '../Shared/MiniMapaRuta'; 

const VisorViaje = ({ viajeId, bitacoraData, bitacoraLista, onClose, onEdit, onSave, onDelete }) => {
  const { usuario } = useAuth();
  const viajeBase = bitacoraLista.find(v => v.id === viajeId);
  const data = bitacoraData[viajeId] || viajeBase || {}; 
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formTemp, setFormTemp] = useState({});
  const [paradas, setParadas] = useState([]);

  useEffect(() => {
    if (viajeId && usuario) {
      const fetchParadas = async () => {
        const ref = collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`);
        const snap = await getDocs(ref);
        const loaded = snap.docs.map(d => ({id: d.id, ...d.data()}));
        setParadas(loaded.sort((a,b) => new Date(a.fecha) - new Date(b.fecha)));
      };
      fetchParadas();
    }
  }, [viajeId, usuario]);

  if (!viajeId || !data) return null;

  const iniciarEdicion = () => {
    setFormTemp({
      ...data,
      titulo: data.titulo || viajeBase.nombreEspanol,
      texto: data.texto || ''
    });
    setModoEdicion(true);
  };

  const guardarCambios = () => {
    onSave(viajeId, { ...formTemp, paradasNuevas: paradas });
    setModoEdicion(false);
  };

  const eliminarEsteViaje = () => {
      if(window.confirm('¿Estás seguro de eliminar este viaje y todos sus recuerdos?')) {
          onDelete(viajeId);
      }
  };

  const getClimaTexto = (clima, temperatura) => {
    if (!clima) return null;
    const desc = clima.toLowerCase();
    const temp = Math.round(temperatura);
    if (desc.includes('despejado') || desc.includes('sol')) return `Día soleado, ${temp}°C ☀️`;
    if (desc.includes('nublado') || desc.includes('nubes')) return `Cielo nublado, ${temp}°C ☁️`;
    if (desc.includes('lluvia')) return `Llovió, ${temp}°C 🌧️`;
    return `${clima}, ${temp}°C`;
  };

  const fotoMostrada = modoEdicion ? formTemp.foto : (data.foto || viajeBase?.foto);

  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} 
        transition={{ type: 'spring', damping: 25 }} 
        style={styles.expandedOverlay}
      >
        <div style={styles.expandedHeader(fotoMostrada)}>
          <div style={styles.fotoOverlay} />
          
          <div style={styles.navBar}>
            <button onClick={onClose} style={styles.iconBtn}><ArrowLeft size={24} /></button>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {!modoEdicion ? (
                <>
                    <button onClick={eliminarEsteViaje} style={styles.secondaryBtn}>
                        <Trash2 size={16} color="#ff6b6b" />
                    </button>
                    <button onClick={iniciarEdicion} style={styles.primaryBtn(false)}>
                        <Edit3 size={16} /> Editar
                    </button>
                </>
              ) : (
                <>
                  <button onClick={() => setModoEdicion(false)} style={styles.secondaryBtn}><X size={16} /></button>
                  <button onClick={guardarCambios} style={styles.primaryBtn(true)}><Check size={16} /> Guardar</button>
                </>
              )}
            </div>
          </div>

          <div style={styles.headerContent}>
            {/* Banderas SVG */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              {data.banderas && data.banderas.length > 0 ? (
                data.banderas.map((b, i) => (
                  <img
                    key={i}
                    src={b}
                    alt="flag"
                    style={{
                      width: "40px",
                      borderRadius: "4px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    }}
                  />
                ))
              ) : (
                <span style={styles.flagIcon}>✈️</span> // Fallback
              )}
            </div>

            {modoEdicion ? (
              <input
                style={styles.titleInput}
                value={formTemp.titulo || ''}
                onChange={(e) =>
                  setFormTemp({ ...formTemp, titulo: e.target.value })
                }
                placeholder="Título del viaje"
              />
            ) : (
              <h1 style={styles.titleDisplay}>
                {data.titulo || viajeBase.nombreEspanol}
              </h1>
            )}

            <div style={styles.metaBadge}>
              <Calendar size={14} /> {data.fechaInicio}{" "}
              {data.fechaFin && data.fechaFin !== data.fechaInicio
                ? ` - ${data.fechaFin}`
                : ""}
            </div>

            {/* Crédito Foto (Solo lectura) */}
            {!modoEdicion && data.fotoCredito && (
              <a
                href={`${data.fotoCredito.link}?utm_source=keeptrip&utm_medium=referral`}
                target="_blank"
                rel="noreferrer"
                style={styles.creditLink}
              >
                <Camera size={12} /> Foto por {data.fotoCredito.nombre} /
                Unsplash
              </a>
            )}
          </div>
        </div>

        <div style={styles.bodyContent}>
          <div style={styles.mainColumn}>
            <h3 style={styles.sectionTitle}>Bitácora</h3>
            {modoEdicion ? (
              <textarea
                style={styles.textArea}
                value={formTemp.texto || ''}
                onChange={(e) =>
                  setFormTemp({ ...formTemp, texto: e.target.value })
                }
                placeholder="Escribe aquí tu relato..."
              />
            ) : (
              <p style={styles.readText}>{data.texto || "Sin relato aún..."}</p>
            )}

            <div style={{ marginTop: '40px' }}>
                <h3 style={styles.sectionTitle}>Ruta</h3>
                <MiniMapaRuta paradas={paradas} />
            </div>
          </div>

          <div style={styles.sideColumn}>
            <h3 style={styles.sectionTitle}>Itinerario</h3>
            {modoEdicion ? (
                <CityManager paradas={paradas} setParadas={setParadas} />
            ) : (
                <div style={styles.timeline}>
                    {paradas.map((p, i) => (
                        <div key={i} style={styles.timelineItem}>
                            <div style={styles.timelineDot} />
                            <div style={styles.stopCard}>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                                    <strong style={{fontSize:'1rem', color: COLORS.charcoalBlue}}>{p.nombre}</strong>
                                    <span style={{fontSize:'0.75rem', color: '#64748b'}}>{p.fecha}</span>
                                </div>
                                {p.clima && (
                                    <div style={styles.weatherNote}>
                                        {getClimaTexto(p.clima.desc, p.clima.max)}
                                        <span style={styles.verifiedBadge}>✓ Histórico</span>
                                    </div>
                                )}
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
