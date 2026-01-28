import React from 'react';
import { Globe, Award, Zap, Compass } from 'lucide-react';

const Stats = ({ bitacora = [], paisesVisitados = [], listaPaises = [] }) => {
  // --- LÓGICA DE GAMIFICACIÓN GLOBAL ---
  const totalPaisesMundo = 195; // Estándar UN
  const porcentajeMundo = ((paisesVisitados.length / totalPaisesMundo) * 100).toFixed(1);
  
  const continentesUnicos = [...new Set(bitacora.map(v => v.continente))].length;
  
  const ultimaFecha = bitacora.length > 0 
    ? new Date(Math.max(...bitacora.map(v => new Date(v.fecha).getTime())))
    : null;
  
  const mesesDesdeUltimo = ultimaFecha 
    ? Math.floor((new Date() - ultimaFecha) / (1000 * 60 * 60 * 24 * 30))
    : 0;

  const statsGlobales = [
    { 
      label: 'Dominio Global', 
      value: `${porcentajeMundo}%`, 
      icon: <Globe size={20} />, 
      color: '#3b82f6',
      sub: `${paisesVisitados.length} países`
    },
    { 
      label: 'Diversidad', 
      value: `${continentesUnicos}/7`, 
      icon: <Compass size={20} />, 
      color: '#10b981',
      sub: 'Continentes'
    },
    { 
      label: 'Racha Viajera', 
      value: mesesDesdeUltimo === 0 ? 'Activa' : `${mesesDesdeUltimo}m`, 
      icon: <Zap size={20} />, 
      color: '#f59e0b',
      sub: 'Desde el último'
    },
    { 
      label: 'Memorias', 
      value: bitacora.length, 
      icon: <Award size={20} />, 
      color: '#8b5cf6',
      sub: 'Capítulos'
    }
  ];

  return (
    <section style={{ padding: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
      {statsGlobales.map((stat, index) => (
        <div key={index} style={{ 
          backgroundColor: 'white', padding: '20px', borderRadius: '24px', 
          display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ backgroundColor: `${stat.color}15`, padding: '12px', borderRadius: '14px', color: stat.color }}>
            {stat.icon}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>{stat.value}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700' }}>{stat.sub}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Stats;