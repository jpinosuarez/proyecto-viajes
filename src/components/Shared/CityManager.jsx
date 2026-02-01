import React, { useState } from 'react';
import { MapPin, Calendar, Trash2, ArrowUp, ArrowDown, Plus, Search } from 'lucide-react';
import { COLORS } from '../../theme';
import { getFlagUrl } from '../../utils/countryUtils';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const CityManager = ({ paradas, setParadas }) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  
  const buscarCiudad = async () => {
    if (busqueda.length < 3) return;
    try {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(busqueda)}.json?types=place&language=es&access_token=${MAPBOX_TOKEN}`);
        const data = await res.json();
        setResultados(data.features || []);
    } catch (e) { console.error(e); }
  };

  const agregarCiudad = (feature) => {
    const contextCountry = feature.context?.find(c => c.id.startsWith('country'));
    const countryCode = contextCountry?.short_code?.toUpperCase();

    const nuevaParada = {
      id: `temp-${Date.now()}`,
      nombre: feature.text,
      coordenadas: feature.center,
      fechaLlegada: '', 
      fechaSalida: '', 
      fecha: new Date().toISOString().split('T')[0], 
      paisCodigo: countryCode, 
      flag: getFlagUrl(countryCode)
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
      <div style={styles.searchRow}>
        <div style={styles.inputWrapper}>
          <Search size={16} color="#94a3b8" />
          <input 
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscarCiudad()}
            placeholder="Buscar ciudad..."
            style={styles.searchInput}
          />
        </div>
        <button onClick={buscarCiudad} style={styles.addBtn}><Plus size={18} /></button>
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

      <div style={styles.list}>
        {paradas.map((p, index) => (
          <div key={p.id || index} style={styles.item}>
            <div style={styles.itemHeader}>
               <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                   {p.flag && <img src={p.flag} alt="flag" style={{width:'20px', borderRadius:'2px'}} />}
                   <span style={styles.cityName}>{p.nombre}</span>
               </div>
               <div style={styles.actions}>
                  <button disabled={index === 0} onClick={() => moverParada(index, -1)} style={styles.actionBtn}><ArrowUp size={14} /></button>
                  <button disabled={index === paradas.length - 1} onClick={() => moverParada(index, 1)} style={styles.actionBtn}><ArrowDown size={14} /></button>
                  <button onClick={() => eliminarParada(index)} style={{...styles.actionBtn, color:'#ef4444'}}><Trash2 size={14} /></button>
               </div>
            </div>
            
            <div style={styles.datesRow}>
                <div style={styles.dateGroup}>
                    <label style={styles.label}>Llegada</label>
                    <input type="date" value={p.fechaLlegada} onChange={e => actualizarDato(index, 'fechaLlegada', e.target.value)} style={styles.dateInput} />
                </div>
                <div style={styles.dateGroup}>
                    <label style={styles.label}>Salida</label>
                    <input type="date" value={p.fechaSalida} onChange={e => actualizarDato(index, 'fechaSalida', e.target.value)} style={styles.dateInput} />
                </div>
            </div>
          </div>
        ))}
        {paradas.length === 0 && <p style={styles.empty}>Agrega ciudades para tu hoja de ruta.</p>}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '15px' },
  searchRow: { display: 'flex', gap: '10px' },
  inputWrapper: { flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 12px' },
  searchInput: { border: 'none', background: 'transparent', padding: '12px 0', width: '100%', outline: 'none', fontSize: '0.9rem' },
  addBtn: { background: COLORS.atomicTangerine, color: 'white', border: 'none', borderRadius: '12px', width: '40px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' },
  resultsList: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', maxHeight: '150px', overflowY: 'auto' },
  resultItem: { padding: '10px 15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '0.85rem', ':hover': { background: '#f8fafc' } },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  item: { background: '#fff', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '12px' },
  itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  cityName: { fontWeight: '700', fontSize: '0.95rem', color: COLORS.charcoalBlue },
  actions: { display: 'flex', gap: '6px' },
  actionBtn: { background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' },
  datesRow: { display: 'flex', gap: '15px' },
  dateGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '0.7rem', textTransform:'uppercase', color:'#94a3b8', fontWeight:'700' },
  dateInput: { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', fontSize: '0.85rem', color: COLORS.charcoalBlue, outline:'none', background:'#f8fafc' },
  empty: { fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' }
};

export default CityManager;