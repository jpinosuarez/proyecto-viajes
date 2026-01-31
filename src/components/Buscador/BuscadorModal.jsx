import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Globe, Plus } from 'lucide-react';
import { COLORS } from '../../theme';
import { styles } from './BuscadorModal.styles';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const BuscadorModal = ({ isOpen, onClose, filtro, setFiltro, seleccionarLugar }) => {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const debounceRef = useRef(null);

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
        
        const procesados = data.features.map(feat => {
          const contextoPais = feat.context?.find(c => c.id.startsWith('country')) || (feat.place_type.includes('country') ? feat : null);
          const codigoPais = contextoPais?.properties?.short_code?.toUpperCase();
          
          return {
            id: feat.id,
            nombre: feat.text, 
            nombreCompleto: feat.place_name,
            tipo: feat.place_type[0], 
            coordenadas: feat.center, 
            paisCodigo: codigoPais, 
            paisNombre: contextoPais?.text || feat.text 
          };
        });

        setResultados(procesados);
      } catch (error) {
        console.error("Error buscando en Mapbox:", error);
      } finally {
        setCargando(false);
      }
    }, 400);

  }, [filtro]);

  const manejarSeleccion = (item) => {
    // Normalizar para enviar
    seleccionarLugar({
      esPais: item.tipo === 'country',
      nombre: item.nombre,
      coordenadas: item.coordenadas,
      paisNombre: item.paisNombre,
      paisCodigo: item.paisCodigo,
      code: item.paisCodigo 
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        style={styles.modalOverlay} onClick={onClose}
      >
        <motion.div 
          initial={{ y: 30, opacity: 0, scale: 0.98 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }} 
          exit={{ y: 30, opacity: 0, scale: 0.98 }} 
          style={styles.modalContent} onClick={(e) => e.stopPropagation()}
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
              placeholder="Busca países o ciudades..." 
              style={styles.inputStyle} 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)} 
            />
          </div>

          <div style={styles.listaContainer} className="custom-scroll">
            {cargando && <div style={{textAlign:'center', padding:'20px', color:'#94a3b8'}}>Explorando... 🗺️</div>}
            
            {resultados.map(item => (
              <div 
                key={item.id} 
                className="resultado-item" // Clase para CSS hover si necesario
                style={{
                  ...styles.paisItem(false),
                  cursor: 'pointer',
                  borderBottom: '1px solid #f1f5f9',
                  position: 'relative'
                }} 
                onClick={() => manejarSeleccion(item)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                        {item.tipo === 'country' ? 'País' : `${item.paisNombre}`}
                    </span>
                  </div>
                </div>
                
                {/* Botón Añadir en Hover (Simulado con posición absoluta o renderizado simple) */}
                <div style={{ color: COLORS.atomicTangerine, fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <Plus size={14} /> Añadir
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BuscadorModal;