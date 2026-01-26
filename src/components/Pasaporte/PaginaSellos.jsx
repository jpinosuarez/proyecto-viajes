import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

const PaginaSellos = ({ region, paises, MAPA_SELLOS, manejarEliminar }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', color: '#1e293b', fontFamily: 'serif' }}>
      {region.toUpperCase()}
    </h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '20px', marginTop: '20px' }}>
      {paises.map((p) => {
        const tieneSello = MAPA_SELLOS[p.code];
        const randomRotate = (p.code.charCodeAt(0) % 10) - 5;
        return (
          <motion.div 
            key={p.code}
            initial={{ scale: 0 }} animate={{ scale: 1, rotate: randomRotate }}
            whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
            style={{ 
              position: 'relative', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', padding: '10px', borderRadius: '4px',
              border: tieneSello ? 'none' : '2px dashed #cbd5e1'
            }}
          >
            {tieneSello ? (
              <img src={tieneSello} alt={p.nombreEspanol} style={{ mixBlendMode: 'multiply', width: '100%' }} />
            ) : (
              <div style={{ opacity: 0.5, textAlign: 'center' }}>
                <span style={{ fontSize: '2rem' }}>{p.flag}</span>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{p.nombreEspanol}</div>
              </div>
            )}
            <Trash2 
              size={12} 
              style={{ position: 'absolute', top: 2, right: 2, color: '#ef4444', cursor: 'pointer', opacity: 0.3 }} 
              onClick={() => manejarEliminar(p.code)} 
            />
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

export default PaginaSellos;