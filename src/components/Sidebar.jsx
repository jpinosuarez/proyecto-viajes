import React from 'react';
import { Map as MapIcon, BookOpen, Navigation2, Home } from 'lucide-react';

const Sidebar = ({ vistaActiva, setVistaActiva }) => {
  // Colores de branding Keeptrip
  const COLORS = {
    atomicTangerine: '#FF6B35',
    charcoalBlue: '#2C3E50',
    linen: '#F4EDE4',
    slate400: '#94a3b8'
  };

  const navItemStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    padding: '14px 18px', 
    borderRadius: '12px', 
    color: COLORS.slate400, 
    cursor: 'pointer', 
    transition: 'all 0.3s ease',
    marginBottom: '8px',
    fontWeight: '500'
  };

  const navItemStyleActive = { 
    ...navItemStyle, 
    backgroundColor: COLORS.atomicTangerine, 
    color: COLORS.linen,
    boxShadow: `0 4px 12px ${COLORS.atomicTangerine}40`,
    fontWeight: '700'
  };

  return (
    <aside style={{ 
      width: '260px', 
      backgroundColor: COLORS.charcoalBlue, 
      color: COLORS.linen, 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: `1px solid rgba(255,255,255,0.05)`
    }}>
      {/* LOGO SECCIÓN */}
      <div style={{ padding: '30px 24px', marginBottom: '10px' }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '900', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          letterSpacing: '-1px'
        }}>
          <Navigation2 
            size={32} 
            color={COLORS.atomicTangerine} 
            fill={COLORS.atomicTangerine} 
            style={{ transform: 'rotate(45deg)' }}
          /> 
          Keeptrip
        </h1>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav style={{ flex: 1, padding: '0 16px' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          
          <li 
            style={vistaActiva === 'home' ? navItemStyleActive : navItemStyle} 
            onClick={() => setVistaActiva('home')}
            onMouseEnter={(e) => vistaActiva !== 'home' && (e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => vistaActiva !== 'home' && (e.currentTarget.style.color = COLORS.slate400)}
          >
            <Home size={20} /> Inicio
          </li>

          <li 
            style={vistaActiva === 'mapa' ? navItemStyleActive : navItemStyle} 
            onClick={() => setVistaActiva('mapa')}
            onMouseEnter={(e) => vistaActiva !== 'mapa' && (e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => vistaActiva !== 'mapa' && (e.currentTarget.style.color = COLORS.slate400)}
          >
            <MapIcon size={20} /> Mapa
          </li>

          <li 
            style={vistaActiva === 'bitacora' ? navItemStyleActive : navItemStyle} 
            onClick={() => setVistaActiva('bitacora')}
            onMouseEnter={(e) => vistaActiva !== 'bitacora' && (e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => vistaActiva !== 'bitacora' && (e.currentTarget.style.color = COLORS.slate400)}
          >
            <BookOpen size={20} /> Bitácora
          </li>

        </ul>
      </nav>

      {/* FOOTER OPCIONAL (Perfil o Ciudad actual) */}
      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontSize: '0.75rem', color: COLORS.slate400, margin: 0 }}>
          Desde <strong>Berlín</strong> para el mundo
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;