import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { COLORS } from '../../theme';

// Estilos definidos inline para mantener el componente autocontenido como pediste
const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    border: '1px solid rgba(241, 245, 249, 0.8)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '200px', // Altura mínima para que se vea bien
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))',
    zIndex: 1
  },
  content: {
    position: 'relative',
    zIndex: 2,
    padding: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  flags: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center'
  },
  footer: {
    marginTop: 'auto'
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '800',
    margin: '0 0 8px 0',
    lineHeight: 1.2
  },
  meta: {
    display: 'flex',
    gap: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    alignItems: 'center'
  }
};

const BentoCard = ({ viaje, onClick }) => {
  // Asegurar fallback de datos
  const foto = viaje.foto;
  const banderas = viaje.banderas && viaje.banderas.length > 0 ? viaje.banderas : (viaje.flag ? [viaje.flag] : ['🏳️']);
  const titulo = viaje.titulo || viaje.nombreEspanol;

  return (
    <div 
      onClick={onClick}
      style={{
        ...styles.card,
        backgroundImage: foto ? `url(${foto})` : 'none',
        backgroundColor: foto ? 'transparent' : 'white' // Si no hay foto, fondo blanco
      }}
      // Efecto hover simple via onMouseEnter/Leave se podría agregar aquí si se desea,
      // pero BentoGrid ya suele manejar la estructura.
    >
      {/* Overlay oscuro para legibilidad si hay foto */}
      {foto && <div style={styles.overlay} />}

      <div style={styles.content}>
        {/* Header: Banderas */}
        <div style={styles.topRow}>
           <div style={styles.flags}>
              {banderas.slice(0,3).map((b, i) => (
                  <span key={i} style={{fontSize:'1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'}}>{b}</span>
              ))}
              {banderas.length > 3 && <span style={{color:'white', fontSize:'0.8rem', fontWeight:'bold'}}>+{banderas.length-3}</span>}
           </div>
        </div>

        {/* Footer: Textos */}
        <div style={styles.footer}>
           <h3 style={{
               ...styles.title, 
               color: foto ? 'white' : COLORS.charcoalBlue,
               textShadow: foto ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
           }}>
               {titulo}
           </h3>
           
           <div style={{
               ...styles.meta, 
               color: foto ? 'rgba(255,255,255,0.9)' : '#64748b'
           }}>
              <span style={{display:'flex', alignItems:'center', gap:'4px'}}>
                  <Calendar size={14}/> {viaje.fechaInicio?.split('-')[0]}
              </span>
              {viaje.ciudades && (
                  <span style={{display:'flex', alignItems:'center', gap:'4px'}}>
                      <MapPin size={14}/> {viaje.ciudades.split(',').length}
                  </span>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BentoCard;