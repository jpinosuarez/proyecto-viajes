import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, MapPin, Globe } from 'lucide-react';
import { COLORS } from '../../theme';
import { styles } from './BuscadorModal.styles';

// Token de Mapbox (Idealmente mover a .env)
const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const BuscadorModal = ({ isOpen, onClose, filtro, setFiltro, seleccionarLugar, paisesVisitados }) => {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const debounceRef = useRef(null);

  // Efecto de búsqueda con debounce para no saturar la API
  useEffect(() => {
    if (!filtro || filtro.length < 3) {
      setResultados([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setCargando(true);
      try {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(filtro)}.json?types=country,place,locality,poi&language=es&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(endpoint);
        const data = await res.json();
        
        // Procesar resultados de Mapbox para adaptarlos a nuestra UI
        const procesados = data.features.map(feat => {
          // Identificar país padre (contexto)
          const contextoPais = feat.context?.find(c => c.id.startsWith('country')) || (feat.place_type.includes('country') ? feat : null);
          const codigoPais = contextoPais?.properties?.short_code?.toUpperCase(); // Ej: AR, FR
          
          // Mapear Mapbox Alpha-2 a nuestro Alpha-3 (Aprox) o pasar el Alpha-2 para que useViajes lo resuelva
          // Nota: Mapbox usa ISO 3166-1 alpha-2 (FR), nosotros alpha-3 (FRA). 
          // useViajes.js tiene una función 'buscarPaisEnCatalogo' que intentará matchear.
          
          return {
            id: feat.id,
            nombre: feat.text, // Ej: París
            nombreCompleto: feat.place_name, // Ej: París, Francia
            tipo: feat.place_type[0], // country, place, poi
            coordenadas: feat.center, // [lng, lat]
            paisCodigo: codigoPais, // FR
            paisNombre: contextoPais?.text || feat.text // Francia
          };
        });

        setResultados(procesados);
      } catch (error) {
        console.error("Error buscando en Mapbox:", error);
      } finally {
        setCargando(false);
      }
    }, 400); // 400ms de espera al escribir

  }, [filtro]);

  const manejarSeleccion = (item) => {
    // Normalizamos la selección para enviarla a App.jsx
    seleccionarLugar({
      esPais: item.tipo === 'country',
      nombre: item.nombre,
      coordenadas: item.coordenadas,
      // Datos para crear el viaje padre si es necesario
      paisNombre: item.paisNombre,
      paisCodigo: item.paisCodigo, // Alpha-2 (ej: AR)
      // Datos para catálogo
      code: item.paisCodigo // Fallback
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        style={styles.modalOverlay}
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 30, opacity: 0, scale: 0.98 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }} 
          exit={{ y: 30, opacity: 0, scale: 0.98 }} 
          style={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.header}>
            <h3 style={styles.titulo}>Explora el Mundo</h3>
            <div onClick={onClose} style={{ cursor: 'pointer', padding: '5px' }}>
              <X size={20} color={COLORS.charcoalBlue} />
            </div>
          </div>
          
          <div style={styles.searchBox}>
            <Search size={20} color={COLORS.atomicTangerine} />
            <input 
              autoFocus 
              placeholder="Busca países, ciudades o monumentos..." 
              style={styles.inputStyle} 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)} 
            />
          </div>

          <div style={styles.listaContainer} className="custom-scroll">
            {cargando && <div style={{textAlign:'center', padding:'20px', color:'#94a3b8'}}>Explorando el mapa... 🗺️</div>}
            
            {!cargando && resultados.length === 0 && filtro.length > 2 && (
              <div style={{ textAlign: 'center', padding: '40px', color: COLORS.charcoalBlue, opacity: 0.5 }}>
                <p>No encontramos ese destino... todavía. 🌍</p>
              </div>
            )}

            {resultados.map(item => (
              <motion.div 
                key={item.id} 
                whileHover={{ backgroundColor: '#f8fafc', translateX: 5 }}
                style={{
                  ...styles.paisItem(false),
                  cursor: 'pointer',
                  borderBottom: '1px solid #f1f5f9'
                }} 
                onClick={() => manejarSeleccion(item)}
              >
                <div style={styles.paisInfo}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '8px', 
                    backgroundColor: item.tipo === 'country' ? `${COLORS.atomicTangerine}20` : `${COLORS.mutedTeal}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.tipo === 'country' ? COLORS.atomicTangerine : COLORS.mutedTeal
                  }}>
                    {item.tipo === 'country' ? <Globe size={18} /> : <MapPin size={18} />}
                  </div>
                  <div>
                    <span style={styles.nombrePais}>{item.nombre}</span>
                    <span style={{ display:'block', fontSize:'0.75rem', color:'#94a3b8' }}>
                        {item.tipo === 'country' ? 'País' : `${item.paisNombre || 'Lugar'}`}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BuscadorModal;