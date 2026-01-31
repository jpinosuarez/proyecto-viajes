import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Camera, Calendar, MapPin, Trash2, Plus } from 'lucide-react';
import { COLORS } from '../../theme';
import { styles } from './EdicionModal.styles';
import { db } from '../../firebase'; // Importamos db para leer paradas
import { collection, getDocs } from 'firebase/firestore'; 
import { useAuth } from '../../context/AuthContext';
import { useViajes } from '../../hooks/useViajes';

// Token para búsqueda interna de ciudades
const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const EdicionModal = ({ viaje, bitacoraData, onClose, onSave }) => {
  const { usuario } = useAuth();
  const { agregarParada, eliminarParada } = useViajes();
  
  const [formData, setFormData] = useState({});
  const [paradas, setParadas] = useState([]);
  const [newCityInput, setNewCityInput] = useState('');
  const [searchingCity, setSearchingCity] = useState(false);

  useEffect(() => {
    if (viaje) {
      // Cargar datos del viaje
      const data = bitacoraData[viaje.id] || {};
      setFormData({
        ...viaje,
        ...data,
        titulo: data.titulo || viaje.nombreEspanol // Asegurar título
      });

      // Cargar paradas asociadas
      const fetchParadas = async () => {
        if(usuario) {
            const ref = collection(db, `usuarios/${usuario.uid}/viajes/${viaje.id}/paradas`);
            const snap = await getDocs(ref);
            setParadas(snap.docs.map(d => ({id: d.id, ...d.data()})));
        }
      };
      fetchParadas();
    }
  }, [viaje, bitacoraData, usuario]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para agregar ciudad usando Mapbox dentro del modal
  const handleAddCity = async () => {
    if(!newCityInput.trim()) return;
    setSearchingCity(true);
    try {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(newCityInput)}.json?types=place&language=es&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(endpoint);
        const data = await res.json();
        
        if (data.features && data.features.length > 0) {
            const place = data.features[0];
            const lugarInfo = {
                nombre: place.text,
                tipo: 'place',
                coordenadas: place.center,
                // Datos del país actual para validar (opcional) o para reusar lógica
                paisCodigo: viaje.code 
            };
            
            // Usamos agregarParada forzando el ID de este viaje
            await agregarParada(lugarInfo, viaje.id);
            
            // Actualizamos lista local visualmente
            const nuevaParadaLocal = { 
                id: 'temp-' + Date.now(), 
                nombre: place.text, 
                fecha: new Date().toISOString().split('T')[0] 
            };
            setParadas([...paradas, nuevaParadaLocal]);
            setNewCityInput('');
        } else {
            alert("No encontramos esa ciudad.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        setSearchingCity(false);
    }
  };

  const handleDeleteParada = async (paradaId) => {
      await eliminarParada(viaje.id, paradaId);
      setParadas(paradas.filter(p => p.id !== paradaId));
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
          {/* Header con Imagen */}
          <div style={styles.header(formData.foto)}>
            <div style={styles.headerOverlay} />
            <div style={styles.headerContent}>
                <span style={styles.flag}>{viaje.flag}</span>
                <input 
                    name="titulo" 
                    value={formData.titulo} 
                    onChange={handleChange} 
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
            
            {/* Fechas */}
            <div style={styles.section}>
                <label style={styles.label}><Calendar size={14}/> Fechas</label>
                <div style={styles.row}>
                    <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} style={styles.dateInput} />
                    <span style={{color:'#94a3b8'}}>hasta</span>
                    <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} style={styles.dateInput} />
                </div>
            </div>

            {/* Gestión de Ciudades */}
            <div style={styles.section}>
                <label style={styles.label}><MapPin size={14}/> Ciudades y Paradas</label>
                
                <div style={styles.cityList}>
                    {paradas.map(p => (
                        <div key={p.id} style={styles.cityTag}>
                            <span>{p.nombre}</span>
                            <button onClick={() => handleDeleteParada(p.id)} style={styles.deleteCityBtn}><X size={12}/></button>
                        </div>
                    ))}
                </div>

                <div style={styles.addCityRow}>
                    <input 
                        value={newCityInput}
                        onChange={e => setNewCityInput(e.target.value)}
                        placeholder="Agregar ciudad..."
                        style={styles.cityInput}
                        onKeyDown={e => e.key === 'Enter' && handleAddCity()}
                    />
                    <button onClick={handleAddCity} disabled={searchingCity} style={styles.addBtn}>
                        {searchingCity ? '...' : <Plus size={18}/>}
                    </button>
                </div>
            </div>

            {/* Detalles */}
            <div style={styles.section}>
                <label style={styles.label}>Reseña rápida</label>
                <textarea 
                    name="texto" 
                    value={formData.texto} 
                    onChange={handleChange} 
                    style={styles.textarea} 
                    placeholder="Escribe un breve resumen..."
                />
            </div>

            <div style={styles.footer}>
                <button onClick={onClose} style={styles.cancelBtn}>Cancelar</button>
                <button onClick={() => { onSave(viaje.id, formData); onClose(); }} style={styles.saveBtn}>
                    <Save size={18} /> Guardar Cambios
                </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EdicionModal;