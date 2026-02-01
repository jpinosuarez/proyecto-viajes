import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Trash2, ArrowUp, ArrowDown, Plus, Search } from 'lucide-react';
import { COLORS } from '../../theme';
import { getCountryISO3, getFlagEmoji } from '../../utils/countryUtils';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const CityManager = ({ paradas, setParadas }) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  
  // Búsqueda reactiva al escribir
  useEffect(() => {
    if (busqueda.length < 3) {
        setResultados([]);
        return;
    }
    const timer = setTimeout(async () => {
        try {
            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(busqueda)}.json?types=place&language=es&access_token=${MAPBOX_TOKEN}`);
            const data = await res.json();
            setResultados(data.features || []);
        } catch (e) { console.error(e); }
    }, 300); // Debounce
    return () => clearTimeout(timer);
  }, [busqueda]);

  const agregarCiudad = (feature) => {
    const contextCountry = feature.context?.find(c => c.id.startsWith('country'));
    const countryCode = contextCountry?.short_code?.toUpperCase(); // Alpha-2

    const nuevaParada = {
      id: `temp-${Date.now()}`,
      nombre: feature.text,
      coordenadas: feature.center,
      fechaLlegada: '', // Nueva fecha
      fechaSalida: '',  // Nueva fecha
      fecha: new Date().toISOString().split('T')[0], // Fallback para compatibilidad
      paisCodigo: countryCode, 
      flag: getFlagEmoji(countryCode)
    };
    setParadas([...paradas, nuevaParada]);
    setBusqueda('');
    setResultados([]);
  };

  const moverParada = (index, direccion) => {
    const nuevas = [...paradas];
    const item = nuevas.splice(index, 1)[0];
    nuevas.splice(index + direccion, 0, item);
    setParadas(nuevas);
  };

  const actualizarDato = (index, campo, valor) => {
    const nuevas = [...paradas];
    nuevas[index][campo] = valor;
    // Sincronizar fecha principal con llegada para compatibilidad
    if(campo === 'fechaLlegada') nuevas[index].fecha = valor;
    setParadas(nuevas);
  };

  const eliminarParada = (index) => {
    const nuevas = [...paradas];
    nuevas.splice(index, 1);
    setParadas(nuevas);
  };

  return (
    <div style={styles.container}>
      {/* Buscador */}
      <div style={styles.searchRow}>
        <div style={styles.inputWrapper}>
          <Search size={16} color="#94a3b8" />
          <input 
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Escribe ciudad (min 3 letras)..."
            style={styles.searchInput}
          />
        </div>
      </div>

      {resultados.length > 0 && (
        <div style={styles.resultsList}>
          {resultados.map(res => (
            <div key={res.id} style={styles.resultItem} onClick={() => agregarCiudad(res)}>
              <MapPin size={14} /> {res.place_name}
            </div>
          ))}
        </div>
      )}

      {/* Lista de Ciudades */}
      <div style={styles.list}>
        {paradas.map((p, index) => (
          <div key={p.id || index} style={styles.item}>
            <div style={styles.itemHeader}>
               <span style={styles.cityName}>{p.flag} {p.nombre}</span>
               <div style={styles.actions}>
                  <button disabled={index === 0} onClick={() => moverParada(index, -1)} style={styles.moveBtn}><ArrowUp size={14} /></button>
                  <button disabled={index === paradas.length - 1} onClick={() => moverParada(index, 1)} style={styles.moveBtn}><ArrowDown size={14} /></button>
                  <button onClick={() => eliminarParada(index)} style={styles.deleteBtn}><Trash2 size={14} /></button>
               </div>
            </div>
            
            {/* Fechas */}
            <div style={styles.datesRow}>
                <div style={styles.dateGroup}>
                    <label>Llegada</label>
                    <input type="date" value={p.fechaLlegada} onChange={e => actualizarDato(index, 'fechaLlegada', e.target.value)} style={styles.dateInput} />
                </div>
                <div style={styles.dateGroup}>
                    <label>Salida</label>
                    <input type="date" value={p.fechaSalida} onChange={e => actualizarDato(index, 'fechaSalida', e.target.value)} style={styles.dateInput} />
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '15px' },
  searchRow: { display: 'flex', gap: '10px' },
  inputWrapper: { flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 12px' },
  searchInput: { border: 'none', background: 'transparent', padding: '12px 0', width: '100%', outline: 'none', fontSize: '0.9rem' },
  resultsList: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', maxHeight: '150px', overflowY: 'auto' },
  resultItem: { padding: '10px 15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '0.85rem', ':hover': { background: '#f8fafc' } },
  
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  item: { background: '#fff', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '12px' },
  itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cityName: { fontWeight: '700', fontSize: '0.95rem', color: COLORS.charcoalBlue },
  
  actions: { display: 'flex', gap: '6px' },
  moveBtn: { background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' },
  deleteBtn: { background: '#FEF2F2', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#EF4444' },

  datesRow: { display: 'flex', gap: '10px' },
  dateGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  dateInput: { border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px', fontSize: '0.8rem', color: COLORS.charcoalBlue }
};

export default CityManager;