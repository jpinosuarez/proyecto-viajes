import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { COLORS, SHADOWS, RADIUS, GLASS } from '@shared/config';
import { useToast } from '@app/providers';

const TripCommandBar = ({ activeFilter, onFilterChange }) => {
  const { t } = useTranslation('dashboard');
  const { pushToast } = useToast();

  const handleListToggle = () => {
    pushToast(t('toast.comingSoon'), 'info');
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: '12px',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button style={btnStyle(activeFilter === 'all')} onClick={() => onFilterChange('all')}>{t('filters.all')}</button>
        <button style={btnStyle(activeFilter === 'year')} onClick={() => onFilterChange('year')}>{t('filters.year')}</button>
        <button style={btnStyle(activeFilter === 'favorites')} onClick={() => onFilterChange('favorites')}>{t('filters.favorites')}</button>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: COLORS.atomicTangerine, minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center' }} title={t('view.grid')}>
          <LayoutGrid size={20} />
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: COLORS.textSecondary, minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center' }} onClick={handleListToggle} title={t('view.list')}>
          <List size={20} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(TripCommandBar);
