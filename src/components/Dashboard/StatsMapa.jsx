import React from 'react';
import { Globe, Compass, Clock, Map } from 'lucide-react';
import { COLORS } from '../../theme'; // Importación añadida

const StatsMapa = ({ bitacora = [], paisesVisitados = [] }) => {
  const totalPaisesMundo = 195;
  const countPaises = paisesVisitados.length;
  const continentesUnicos = [...new Set(bitacora.map(v => v.continente))].filter(Boolean).length;
  
  const obtenerUltimaAventura = () => {
    if (bitacora.length === 0) return "---";
    const fechas = bitacora.map(v => new Date(v.fecha).getTime());
    const ultima = new Date(Math.max(...fechas));
    const hoy = new Date();
    const difMeses = (hoy.getFullYear() - ultima.getFullYear()) * 12 + (hoy.getMonth() - ultima.getMonth());
    return difMeses === 0 ? "Este mes" : `Hace ${difMeses}m`;
  };

  const obtenerRegionPredominante = () => {
    if (bitacora.length === 0) return "---";
    const conteo = bitacora.reduce((acc, v) => {
      acc[v.continente] = (acc[v.continente] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(conteo).reduce((a, b) => conteo[a] > conteo[b] ? a : b);
  };

const statsGeo = [
    { label: 'Países visitados', value: `${countPaises} / ${totalPaisesMundo}`, icon: <Globe size={20} />, color: COLORS.mutedTeal }, // Usando theme
    { label: 'Continentes', value: `${continentesUnicos} de 7`, icon: <Compass size={20} />, color: COLORS.atomicTangerine }, // Usando theme
    { label: 'Última aventura', value: obtenerUltimaAventura(), icon: <Clock size={20} />, color: COLORS.charcoalBlue },
    { label: 'Región principal', value: obtenerRegionPredominante(), icon: <Map size={20} />, color: COLORS.atomicTangerine }
  ];

  return (
    <section style={{ padding: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
      {statsGeo.map((stat, index) => (
        <div key={index} style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px', 
          border: `1px solid ${COLORS.border}`, // Consistencia de bordes
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)' 
        }}>
          <div style={{ backgroundColor: `${stat.color}15`, padding: '12px', borderRadius: '14px', color: stat.color }}>{stat.icon}</div>
          <div>
            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</p>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: COLORS.charcoalBlue }}>{stat.value}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default StatsMapa;