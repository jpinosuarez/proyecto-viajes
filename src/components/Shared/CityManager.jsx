import React, { useState } from 'react';
import { MapPin, Calendar, Trash2, ArrowUp, ArrowDown, Plus, Search } from 'lucide-react';
import { COLORS } from '../../theme';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const CityManager = ({ paradas, setParadas }) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);

  // Buscar ciudad en Mapbox
  const buscarCiudad = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    try {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(busqueda)}.json?types=place&language=es&access_token=${MAPBOX_TOKEN}`);
      const data = await res.json();
      setResultados(data.features || []);
    } catch (e) {
      console.error(e);
    } finally {
      setBuscando(false);
    }
  };

  const agregarCiudad = (feature) => {
    const nuevaParada = {
      id: `temp-${Date.now()}`, // ID temporal
      nombre: feature.text,
      coordenadas: feature.center,
      fecha: new Date().toISOString().split('T')[0], // Fecha default hoy
      paisCodigo: feature.context?.find(c => c.id.startsWith('country'))?.short_code?.toUpperCase()
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

  const actualizarFecha = (index, fecha) => {
    const nuevas = [...paradas];
    nuevas[index].fecha = fecha;
    setParadas(nuevas);
  };

  const eliminarParada = (index) => {
    const nuevas = [...paradas];
    nuevas.splice(index, 1);
    setParadas(nuevas);
  };

  return (
    <div style={styles.container}>
      {/* Buscador Integrado */}
      <div style={styles.searchRow}>
        <div style={styles.inputWrapper}>
          <Search size={16} color="#94a3b8" />
          <input 
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscarCiudad()}
            placeholder="Buscar ciudad para agregar..."
            style={styles.searchInput}
          />
        </div>
        <button onClick={buscarCiudad} style={styles.addBtn} disabled={buscando}>
          <Plus size={18} />
        </button>
      </div>

      {/* Resultados de Búsqueda */}
      {resultados.length > 0 && (
        <div style={styles.resultsList}>
          {resultados.map(res => (
            <div key={res.id} style={styles.resultItem} onClick={() => agregarCiudad(res)}>
              <MapPin size={14} /> {res.place_name}
            </div>
          ))}
        </div>
      )}

      {/* Lista de Ciudades Agregadas */}
      <div style={styles.list}>
        {paradas.map((p, index) => (
          <div key={p.id || index} style={styles.item}>
            <div style={styles.itemInfo}>
              <span style={styles.cityName}>{index + 1}. {p.nombre}</span>
              <div style={styles.dateWrapper}>
                <Calendar size={12} color={COLORS.mutedTeal} />
                <input 
                  type="date" 
                  value={p.fecha} 
                  onChange={(e) => actualizarFecha(index, e.target.value)}
                  style={styles.dateInput}
                />
              </div>
            </div>
            
            <div style={styles.actions}>
              <button disabled={index === 0} onClick={() => moverParada(index, -1)} style={styles.actionBtn}>
                <ArrowUp size={14} />
              </button>
              <button disabled={index === paradas.length - 1} onClick={() => moverParada(index, 1)} style={styles.actionBtn}>
                <ArrowDown size={14} />
              </button>
              <button onClick={() => eliminarParada(index)} style={{...styles.actionBtn, color: '#ef4444'}}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {paradas.length === 0 && <p style={styles.empty}>No hay ciudades seleccionadas.</p>}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '15px' },
  searchRow: { display: 'flex', gap: '10px' },
  inputWrapper: { flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 12px' },
  searchInput: { border: 'none', background: 'transparent', padding: '12px 0', width: '100%', outline: 'none', fontSize: '0.9rem' },
  addBtn: { background: COLORS.atomicTangerine, color: 'white', border: 'none', borderRadius: '12px', width: '42px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  resultsList: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', maxHeight: '150px', overflowY: 'auto', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  resultItem: { padding: '10px 15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center', ':hover': { background: '#f8fafc' } },
  
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '12px' },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  cityName: { fontWeight: '700', fontSize: '0.9rem', color: COLORS.charcoalBlue },
  dateWrapper: { display: 'flex', alignItems: 'center', gap: '5px' },
  dateInput: { border: 'none', fontSize: '0.75rem', color: '#64748b', outline: 'none', background: 'transparent' },
  
  actions: { display: 'flex', gap: '4px' },
  actionBtn: { background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#64748b', display: 'flex' },
  empty: { fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' }
};

export default CityManager;