import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Camera, Calendar, MapPin, Trash2, Plus } from 'lucide-react';
import { styles } from './EdicionModal.styles';
import { db } from '../../firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import { useAuth } from '../../context/AuthContext';
import { useViajes } from '../../hooks/useViajes';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const EdicionModal = ({ viaje, bitacoraData, onClose, onSave, esBorrador, ciudadInicial }) => {
  const { usuario } = useAuth();
  const { agregarParada, eliminarParada } = useViajes();
  
  const [formData, setFormData] = useState({});
  const [paradas, setParadas] = useState([]);
  const [newCityInput, setNewCityInput] = useState('');
  const [searchingCity, setSearchingCity] = useState(false);

  // Inicializar Formulario
  useEffect(() => {
    if (viaje) {
      if (esBorrador) {
        // Modo Creación: Usar datos del borrador directos
        setFormData({
            ...viaje,
            titulo: viaje.titulo || `Viaje a ${viaje.nombreEspanol}`,
            fechaInicio: viaje.fechaInicio,
            fechaFin: viaje.fechaFin,
            texto: "",
            foto: null
        });
        // Si hay ciudad inicial en borrador, mostrarla visualmente
        setParadas(ciudadInicial ? [{ id: 'temp', nombre: ciudadInicial.nombre, fecha: ciudadInicial.fecha }] : []);
      } else {
        // Modo Edición: Cargar de DB
        const data = bitacoraData[viaje.id] || {};
        setFormData({
          ...viaje,
          ...data,
          titulo: data.titulo || viaje.nombreEspanol,
          // Asegurar fechas
          fechaInicio: data.fechaInicio || viaje.fecha,
          fechaFin: data.fechaFin || viaje.fecha
        });

        // Cargar paradas reales
        const fetchParadas = async () => {
          if(usuario) {
              const ref = collection(db, `usuarios/${usuario.uid}/viajes/${viaje.id}/paradas`);
              const snap = await getDocs(ref);
              setParadas(snap.docs.map(d => ({id: d.id, ...d.data()})));
          }
        };
        fetchParadas();
      }
    }
  }, [viaje, bitacoraData, usuario, esBorrador, ciudadInicial]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, foto: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAddCity = async () => {
    if(!newCityInput.trim()) return;
    setSearchingCity(true);
    try {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(newCityInput)}.json?types=place&language=es&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(endpoint);
        const data = await res.json();
        
        if (data.features?.length > 0) {
            const place = data.features[0];
            
            // Si es borrador, solo agregamos a la lista visual (se guardará al final o requerirá lógica extra)
            // Nota: En borrador complejo, paradas multiples requeririan guardar el viaje primero.
            // Para simplificar UX Borrador: Permitimos ver solo la ciudad inicial. 
            if (esBorrador) {
                alert("Guarda el viaje primero para agregar más paradas.");
            } else {
                const lugarInfo = {
                    nombre: place.text,
                    coordenadas: place.center,
                    paisCodigo: viaje.code,
                    fecha: formData.fechaInicio // Usamos fecha inicio por defecto
                };
                await agregarParada(lugarInfo, viaje.id);
                setParadas([...paradas, { id: 'temp-'+Date.now(), nombre: place.text, fecha: formData.fechaInicio }]);
            }
            setNewCityInput('');
        }
    } catch (e) { console.error(e); } 
    finally { setSearchingCity(false); }
  };

  const handleDeleteParada = async (paradaId) => {
      if (!esBorrador) await eliminarParada(viaje.id, paradaId);
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
          <div style={styles.header(formData.foto)}>
            <div style={styles.headerOverlay} />
            <div style={styles.headerContent}>
                <span style={styles.flag}>{viaje.flag}</span>
                <input name="titulo" value={formData.titulo || ''} onChange={handleChange} style={styles.titleInput} placeholder="Título del viaje" />
            </div>
            <label style={styles.cameraBtn}>
              <Camera size={18} />
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          <div style={styles.body} className="custom-scroll">
            <div style={styles.section}>
                <label style={styles.label}><Calendar size={14}/> Fechas del Viaje</label>
                <div style={styles.row}>
                    <input type="date" name="fechaInicio" value={formData.fechaInicio || ''} onChange={handleChange} style={styles.dateInput} />
                    <span style={{color:'#94a3b8'}}>hasta</span>
                    <input type="date" name="fechaFin" value={formData.fechaFin || ''} onChange={handleChange} style={styles.dateInput} />
                </div>
            </div>

            <div style={styles.section}>
                <label style={styles.label}><MapPin size={14}/> Ciudades</label>
                <div style={styles.cityList}>
                    {paradas.map(p => (
                        <div key={p.id} style={styles.cityTag}>
                            <span>{p.nombre}</span>
                            <button onClick={() => handleDeleteParada(p.id)} style={styles.deleteCityBtn}><X size={12}/></button>
                        </div>
                    ))}
                </div>
                {!esBorrador && (
                    <div style={styles.addCityRow}>
                        <input value={newCityInput} onChange={e => setNewCityInput(e.target.value)} placeholder="Agregar otra ciudad..." style={styles.cityInput} onKeyDown={e => e.key === 'Enter' && handleAddCity()} />
                        <button onClick={handleAddCity} disabled={searchingCity} style={styles.addBtn}>{searchingCity ? '...' : <Plus size={18}/>}</button>
                    </div>
                )}
            </div>

            <div style={styles.section}>
                <label style={styles.label}>Reseña</label>
                <textarea name="texto" value={formData.texto || ''} onChange={handleChange} style={styles.textarea} placeholder="Escribe un breve resumen..." />
            </div>

            <div style={styles.footer}>
                <button onClick={onClose} style={styles.cancelBtn}>Cancelar</button>
                <button onClick={() => { onSave(viaje.id, formData); onClose(); }} style={styles.saveBtn}>
                    <Save size={18} /> {esBorrador ? 'Confirmar Viaje' : 'Guardar Cambios'}
                </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EdicionModal;