import React, { useState, useEffect } from 'react';
import { MapPin, ArrowUp, ArrowDown, Plus, Search, Trash2 } from 'lucide-react';
import { COLORS } from '../../theme';
import { getFlagUrl } from '../../utils/countryUtils';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const CityManager = ({ paradas, setParadas }) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  
  // Búsqueda reactiva (3 chars)
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
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda]);

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
      flag: getFlagUrl(countryCode), // Guardar URL SVG
      transporte: null,
      notaCorta: ''
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
            placeholder="Buscar ciudad (min 3 letras)..."
            style={styles.searchInput}
          />
        </div>
      </div>

      {resultados.length > 0 && (
        <div style={styles.resultsList}>
          {resultados.map(res => {
            // Extraer país para el icono en resultados
            const contextCountry = res.context?.find(c => c.id.startsWith('country'));
            const code = contextCountry?.short_code?.toUpperCase();
            const flag = getFlagUrl(code);

            return (
                <div key={res.id} style={styles.resultItem} onClick={() => agregarCiudad(res)}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    {flag ? <img src={flag} alt="flag" style={{width:'20px', borderRadius:'2px'}}/> : <MapPin size={14} />}
                    <span>{res.text}, <span style={{color:'#94a3b8', fontSize:'0.8rem'}}>{contextCountry?.text}</span></span>
                </div>
                <Plus size={14} color={COLORS.atomicTangerine}/>
                </div>
            );
          })}
        </div>
      )}

      <div style={styles.list}>
        {paradas.map((p, index) => (
          <div key={p.id || index} style={styles.item}>
            <div style={styles.itemHeader}>
               <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                   {p.flag && <img src={p.flag} alt="flag" style={{width:'24px', borderRadius:'3px', border:'1px solid #eee'}} />}
                   <span style={styles.cityName}>{p.nombre}</span>
               </div>
               <div style={styles.actions}>
                  <button disabled={index === 0} onClick={() => moverParada(index, -1)} style={styles.actionBtn}><ArrowUp size={14} /></button>
                  <button disabled={index === paradas.length - 1} onClick={() => moverParada(index, 1)} style={styles.actionBtn}><ArrowDown size={14} /></button>
                  <button onClick={() => eliminarParada(index)} style={{...styles.actionBtn, color:'#ef4444', background:'#FEF2F2'}}><Trash2 size={14} /></button>
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

            <div style={styles.transportRow}>
                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <button type="button" onClick={() => actualizarDato(index, 'transporte', 'avion')} style={styles.transportBtn(p.transporte === 'avion')}>✈️ Avión</button>
                    <button type="button" onClick={() => actualizarDato(index, 'transporte', 'tren')} style={styles.transportBtn(p.transporte === 'tren')}>🚆 Tren</button>
                    <button type="button" onClick={() => actualizarDato(index, 'transporte', 'auto')} style={styles.transportBtn(p.transporte === 'auto')}>🚗 Auto</button>
                    <button type="button" onClick={() => actualizarDato(index, 'transporte', 'bus')} style={styles.transportBtn(p.transporte === 'bus')}>🚌 Bus</button>
                    <button type="button" onClick={() => actualizarDato(index, 'transporte', 'otro')} style={styles.transportBtn(p.transporte === 'otro')}>🔁 Otro</button>
                </div>
                <div style={{flex:1, marginLeft:12}}>
                    <label style={styles.label}>Nota</label>
                    <input type="text" value={p.notaCorta || ''} onChange={e => actualizarDato(index, 'notaCorta', e.target.value)} placeholder="Nota corta (ej: 'Perdí el tren')" style={styles.dateInput} />
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
  resultsList: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', maxHeight: '180px', overflowY: 'auto', boxShadow:'0 4px 10px rgba(0,0,0,0.05)' },
  resultItem: { padding: '12px 15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '0.9rem', display:'flex', justifyContent:'space-between', alignItems:'center', ':hover': { background: '#f8fafc' } },
  
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  item: { background: '#fff', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '12px', boxShadow:'0 2px 5px rgba(0,0,0,0.02)' },
  itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  cityName: { fontWeight: '700', fontSize: '0.95rem', color: COLORS.charcoalBlue },
  actions: { display: 'flex', gap: '6px' },
  actionBtn: { background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#64748b', display:'flex', alignItems:'center', justifyContent:'center' },
  datesRow: { display: 'flex', gap: '15px' },
  dateGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  transportRow: { display: 'flex', gap: '12px', alignItems: 'center', marginTop: 10 },
  transportBtn: (active) => ({ padding: '6px 10px', borderRadius: 8, border: active ? '1px solid #3b82f6' : '1px solid #e2e8f0', background: active ? '#eff6ff' : '#fff', cursor: 'pointer' }),
  label: { fontSize: '0.7rem', textTransform:'uppercase', color:'#94a3b8', fontWeight:'700' },
  dateInput: { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', fontSize: '0.85rem', color: COLORS.charcoalBlue, outline:'none', background:'#f8fafc' }
};

export default CityManager;