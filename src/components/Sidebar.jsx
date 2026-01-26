import React from 'react';
import { Map as MapIcon, BookOpen, Navigation2 } from 'lucide-react';

const Sidebar = ({ vistaActiva, setVistaActiva }) => {
  const navItemStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', transition: '0.2s' };
  const navItemStyleActive = { ...navItemStyle, backgroundColor: '#3b82f6', color: 'white' };

  return (
    <aside style={{ width: '260px', backgroundColor: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #334155' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Navigation2 size={28} color="#3b82f6" fill="#3b82f6" /> GlobalStamp
        </h1>
      </div>
      <nav style={{ flex: 1, padding: '20px' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li 
            style={vistaActiva === 'mapa' ? navItemStyleActive : navItemStyle} 
            onClick={() => setVistaActiva('mapa')} // ESTO activa el Mapa
          >
            <MapIcon size={20} /> Mapa Interactivo
          </li>
          <li 
            style={vistaActiva === 'pasaporte' ? navItemStyleActive : navItemStyle} 
            onClick={() => setVistaActiva('pasaporte')} // ESTO activa el Pasaporte
          >
            <BookOpen size={20} /> Mi Pasaporte
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;