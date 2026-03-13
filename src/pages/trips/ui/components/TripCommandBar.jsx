import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, List, SlidersHorizontal, Search } from 'lucide-react';
import { COLORS, SHADOWS, RADIUS, GLASS } from '@shared/config';
import { useSearch } from '@app/providers/UIContext';

const TripCommandBar = ({ activeFilter, onFilterChange, tripCount }) => {
  const { t } = useTranslation('dashboard');
  const { busqueda, setBusqueda } = useSearch();

  const handleListToggle = () => {
    alert('Vista de lista Próximamente');
  };

  const btnStyle = (active) => ({
    padding: '6px 16px',
    borderRadius: RADIUS.full,
    border: `1px solid ${active ? COLORS.atomicTangerine : COLORS.border}`,
    background: active ? `${COLORS.atomicTangerine}15` : 'transparent',
    color: active ? COLORS.atomicTangerine : COLORS.charcoalBlue,
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  });

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      ...GLASS.light,
      borderBottom: `1px solid ${COLORS.border}`,
      padding: '12px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: COLORS.charcoalBlue }}>
          Librería de Legado
          <span style={{ marginLeft: 8, fontSize: '0.9rem', color: COLORS.textSecondary, fontWeight: 600 }}>
            {tripCount}
          </span>
        </h1>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
           <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: COLORS.atomicTangerine }} title="Vista Grid">
             <LayoutGrid size={20} />
           </button>
           <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: COLORS.textSecondary }} onClick={handleListToggle} title="Vista Lista">
             <List size={20} />
           </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          background: COLORS.surface, border: `1px solid ${COLORS.border}`, 
          borderRadius: RADIUS.full, padding: '4px 12px', flexShrink: 0 
        }}>
          <Search size={14} color={COLORS.textSecondary} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100px' }}
          />
        </div>
        
        <div style={{ width: '1px', height: '20px', background: COLORS.border, flexShrink: 0 }}></div>
        
        <button style={btnStyle(activeFilter === 'all')} onClick={() => onFilterChange('all')}>Todos</button>
        <button style={btnStyle(activeFilter === 'year')} onClick={() => onFilterChange('year')}>Este Año</button>
        <button style={btnStyle(activeFilter === 'favorites')} onClick={() => onFilterChange('favorites')}>Favoritos</button>
      </div>
    </div>
  );
};

export default React.memo(TripCommandBar);
