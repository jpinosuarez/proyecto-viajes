import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Camera, Calendar, LoaderCircle } from 'lucide-react';
import { styles } from './EdicionModal.styles';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import CityManager from '../Shared/CityManager';

const EdicionModal = ({ viaje, onClose, onSave, esBorrador, ciudadInicial, isSaving = false }) => {
  const { usuario } = useAuth();
  const [formData, setFormData] = useState({});
  const [paradas, setParadas] = useState([]);

  useEffect(() => {
    if (viaje) {
      setFormData({
        ...viaje,
        titulo: viaje.titulo || `Viaje a ${viaje.nombreEspanol}`,
        fechaInicio: viaje.fechaInicio || new Date().toISOString().split('T')[0],
        fechaFin: viaje.fechaFin || new Date().toISOString().split('T')[0],
        foto: viaje.foto,
        texto: viaje.texto || "",
        flag: viaje.flag,
        code: viaje.code,
        nombreEspanol: viaje.nombreEspanol
      });
      
      if (esBorrador && ciudadInicial) {
        // Nuevo viaje: agregar ciudad inicial
        setParadas([{ 
            id: 'init', 
            nombre: ciudadInicial.nombre, 
            coordenadas: ciudadInicial.coordenadas,
            fecha: viaje.fechaInicio || new Date().toISOString().split('T')[0],
            paisCodigo: ciudadInicial.paisCodigo,
            flag: viaje.flag 
        }]);
      } else if (!esBorrador && usuario && viaje.id) {
        // Viaje existente: cargar paradas desde Firestore
        const cargarParadas = async () => {
          try {
            const paradasRef = collection(db, `usuarios/${usuario.uid}/viajes/${viaje.id}/paradas`);
            const snap = await getDocs(paradasRef);
            const loaded = snap.docs.map(d => ({id: d.id, ...d.data()}));
            setParadas(loaded.sort((a,b) => new Date(a.fecha) - new Date(b.fecha)));
          } catch (e) {
            console.error("Error cargando paradas:", e);
            setParadas([]);
          }
        };
        cargarParadas();
      } else {
        setParadas([]); 
      }
    }
  }, [viaje, esBorrador, ciudadInicial, usuario]);

  const handleSave = async () => {
    if (!formData.nombreEspanol) return;
    const ok = await onSave(viaje.id, { ...formData, paradasNuevas: paradas });
    if (ok) onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, foto: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  if (!viaje) return null;

  return (
    <AnimatePresence>
      <motion.div style={styles.overlay} onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <motion.div style={styles.modal} onClick={e => e.stopPropagation()} initial={{y:50}} animate={{y:0}} exit={{y:50}}>
          <div style={styles.header(formData.foto)}>
            <div style={styles.headerOverlay} />
            <div style={styles.headerContent}>
                {formData.flag ? (
                    <img src={formData.flag} alt="Bandera" style={styles.flagImg} onError={(e) => e.target.style.display = 'none'}/>
                ) : <span style={{fontSize:'3rem'}}>🌍</span>}
                <input name="titulo" value={formData.titulo || ''} onChange={e => setFormData({...formData, titulo: e.target.value})} style={styles.titleInput} placeholder="Título del viaje" />
            </div>
            <label style={styles.cameraBtn}><Camera size={18} /><input type="file" hidden onChange={handleFileChange} accept="image/*" /></label>
          </div>

          <div style={styles.body} className="custom-scroll">
            <div style={styles.section}>
                <label style={styles.label}><Calendar size={14}/> Fechas</label>
                <div style={styles.row}>
                    <input type="date" value={formData.fechaInicio || ''} onChange={e => setFormData({...formData, fechaInicio: e.target.value})} style={styles.dateInput} />
                    <span style={{color:'#94a3b8'}}>hasta</span>
                    <input type="date" value={formData.fechaFin || ''} onChange={e => setFormData({...formData, fechaFin: e.target.value})} style={styles.dateInput} />
                </div>
            </div>
            <div style={styles.section}>
                <label style={styles.label}>Ciudades y Paradas</label>
                <CityManager paradas={paradas} setParadas={setParadas} />
            </div>
            <div style={styles.section}>
                <label style={styles.label}>Notas</label>
                <textarea value={formData.texto || ''} onChange={e => setFormData({...formData, texto: e.target.value})} style={styles.textarea} placeholder="Escribe tus recuerdos aquí..." />
            </div>
            <div style={styles.footer}>
                <button onClick={onClose} style={styles.cancelBtn(isSaving)} disabled={isSaving}>Cancelar</button>
                <button onClick={handleSave} style={styles.saveBtn(isSaving)} disabled={isSaving}>
                  {isSaving ? <LoaderCircle size={18} className="spin" /> : <Save size={18} />}
                  {isSaving ? 'Guardando...' : (esBorrador ? 'Crear Viaje' : 'Guardar')}
                </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EdicionModal;
