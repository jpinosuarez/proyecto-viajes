import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Globe, Plus, TrendingUp } from 'lucide-react';
import { COLORS } from '../../theme';
import { styles } from './BuscadorModal.styles';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const DESTINOS_POPULARES = [
  { nombre: 'Japón', code: 'JP', icon: '🇯🇵' },
  { nombre: 'Italia', code: 'IT', icon: '🇮🇹' },
  { nombre: 'Francia', code: 'FR', icon: '🇫🇷' },
  { nombre: 'México', code: 'MX', icon: '🇲🇽' },
  { nombre: 'Argentina', code: 'AR', icon: '🇦🇷' },
  { nombre: 'Nueva York', code: 'US', icon: '🗽', esCiudad: true, coords: [-74.006, 40.712] }
];

const BuscadorModal = ({ isOpen, onClose, filtro, setFiltro, seleccionarLugar }) => {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!filtro) {
        setResultados([]); // Limpiar si borra
        return;
    }
    
    if (filtro.length < 3) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setCargando(true);
      try {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(filtro)}.json?types=country,place,locality&language=es&access_token=${MAPBOX_TOKEN}`;
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
      } catch (error) { console.error(error); } 
      finally { setCargando(false); }
    }, 400);

  }, [filtro]);

  // Selección rápida de tags populares
  const seleccionarPopular = (destino) => {
    if (destino.esCiudad) {
        // Simular objeto de Mapbox para ciudad
        seleccionarLugar({
            esPais: false,
            nombre: destino.nombre,
            coordenadas: destino.coords,
            paisCodigo: destino.code, // Asumimos código
            paisNombre: 'USA' // Simplificado
        });
    } else {
        // Simular objeto país
        seleccionarLugar({
            esPais: true,
            nombre: destino.nombre,
            code: destino.code,
            coordenadas: [0, 0] // Coords dummy, el hook buscará en catalogo
        });
    }
  };

  const manejarSeleccion = (item) => {
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
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} 
          style={styles.modalContent} onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.header}>
            <h3 style={styles.titulo}>Nuevo Destino</h3>
            <div onClick={onClose} style={{ cursor: 'pointer' }}><X size={20} color={COLORS.charcoalBlue} /></div>
          </div>
          
          <div style={styles.searchBox}>
            <Search size={18} color={COLORS.atomicTangerine} />
            <input 
              autoFocus 
              placeholder="Escribe un país o ciudad..." 
              style={styles.inputStyle} 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)} 
            />
          </div>

          <div style={styles.listaContainer} className="custom-scroll">
            
            {/* Quick Tags si no hay búsqueda */}
            {!filtro && (
                <div style={{padding:'20px'}}>
                    <p style={{fontSize:'0.8rem', fontWeight:'700', color: COLORS.mutedTeal, marginBottom:'10px', display:'flex', alignItems:'center', gap:'6px'}}>
                        <TrendingUp size={14}/> DESTINOS POPULARES
                    </p>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                        {DESTINOS_POPULARES.map(dest => (
                            <button key={dest.nombre} onClick={() => seleccionarPopular(dest)} style={styles.tagBtn}>
                                <span>{dest.icon}</span> {dest.nombre}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Resultados de búsqueda */}
            {cargando && <div style={{textAlign:'center', padding:'20px', color:'#94a3b8'}}>Buscando...</div>}
            
            {resultados.map(item => (
              <div 
                key={item.id} 
                style={styles.resultItem}
                onClick={() => manejarSeleccion(item)}
              >
                <div style={styles.iconBox(item.tipo === 'country')}>
                    {item.tipo === 'country' ? <Globe size={18} /> : <MapPin size={18} />}
                </div>
                <div>
                    <span style={styles.nombrePais}>{item.nombre}</span>
                    <span style={styles.subtext}>{item.tipo === 'country' ? 'País' : item.paisNombre}</span>
                </div>
                <div style={styles.addLabel}><Plus size={14}/> Añadir</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BuscadorModal;