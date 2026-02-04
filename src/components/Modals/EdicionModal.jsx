import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Camera, Calendar, MapPin, Trash2, Plus } from 'lucide-react';
import { styles } from './EdicionModal.styles';
import { useAuth } from '../../context/AuthContext';
import CityManager from '../Shared/CityManager';

const EdicionModal = ({ viaje, onClose, onSave, esBorrador, ciudadInicial }) => {
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
        flag: viaje.flag, // URL del SVG
        code: viaje.code, // Código ISO
        nombreEspanol: viaje.nombreEspanol
      });
      
      // Si hay ciudad inicial del buscador y es un borrador nuevo, la mostramos
      if (esBorrador && ciudadInicial) {
        // La ciudad inicial se gestionará en el CityManager si se desea
        // Ojo: CityManager maneja "paradas", aquí inicializamos con esa ciudad si no hay otras
        setParadas([{ 
            id: 'init', 
            nombre: ciudadInicial.nombre, 
            coordenadas: ciudadInicial.coordenadas,
            fecha: viaje.fechaInicio || new Date().toISOString().split('T')[0],
            paisCodigo: ciudadInicial.paisCodigo,
            flag: viaje.flag // O la flag específica si es diferente
        }]);
      } else {
          setParadas([]); // Limpiar o cargar reales si fuera edición (manejado por padre en app real)
      }
    }
  }, [viaje, esBorrador, ciudadInicial]);

  const handleSave = () => {
    // Validar datos mínimos antes de enviar
    if (!formData.nombreEspanol) return;
    
    onSave(viaje.id, { 
        ...formData, 
        paradasNuevas: paradas 
    });
    onClose();
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
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        style={styles.overlay} onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} 
          style={styles.modal} onClick={e => e.stopPropagation()}
        >
          <div style={styles.header(formData.foto)}>
            <div style={styles.headerOverlay} />
            <div style={styles.headerContent}>
                {/* CORRECCIÓN: Renderizar la bandera como IMAGEN */}
                {formData.flag ? (
                    <img 
                        src={formData.flag} 
                        alt="Bandera" 
                        style={styles.flagImg} 
                        onError={(e) => e.target.style.display = 'none'}
                    />
                ) : (
                    <span style={{fontSize:'3rem'}}>🌍</span>
                )}
                
                <input 
                    name="titulo"
                    value={formData.titulo || ''} 
                    onChange={e => setFormData({...formData, titulo: e.target.value})} 
                    style={styles.titleInput} 
                    placeholder="Título del viaje" 
                />
            </div>
            <label style={styles.cameraBtn}>
              <Camera size={18} />
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </label>
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
                <textarea 
                    value={formData.texto || ''} 
                    onChange={e => setFormData({...formData, texto: e.target.value})} 
                    style={styles.textarea} 
                    placeholder="Escribe tus recuerdos aquí..." 
                />
            </div>

            <div style={styles.footer}>
                <button onClick={onClose} style={styles.cancelBtn}>Cancelar</button>
                <button onClick={handleSave} style={styles.saveBtn}>
                    <Save size={18} /> {esBorrador ? 'Crear Viaje' : 'Guardar Cambios'}
                </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EdicionModal;