import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus, Navigation } from 'lucide-react';
import { COLORS, SHADOWS, RADIUS } from '@shared/config';
import { useUI } from '@app/providers/UIContext';

const MapFabGroup = ({ onLocateMe }) => {
  const { t } = useTranslation('dashboard');
  const { setBuscadorOpen } = useUI();
  
  const fabStyle = (isPrimary) => ({
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    pointerEvents: 'auto', // Overrides none from wrapper
    
    backgroundColor: isPrimary ? COLORS.atomicTangerine : COLORS.surface,
    color: isPrimary ? '#fff' : COLORS.charcoalBlue,
    boxShadow: isPrimary 
      ? `0 8px 24px ${COLORS.atomicTangerine}60, 0 4px 12px rgba(0,0,0,0.2)`
      : SHADOWS.float,
    transition: 'background-color 0.2s',
  });

  return (
    <div style={{
      position: 'absolute',
      bottom: '32px',
      right: '24px',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      pointerEvents: 'none', // Let map clicks pass through the gap
    }}>
      <Motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={fabStyle(false)}
        onClick={onLocateMe}
        title="Localizarme"
        aria-label="Localizarme"
      >
        <Navigation size={22} fill={COLORS.charcoalBlue} />
      </Motion.button>
      
      <Motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={fabStyle(true)}
        onClick={() => setBuscadorOpen(true)}
        title={t('welcome.emptyStateCTA', 'Añadir Aventura')}
        aria-label="Añadir Viaje"
      >
        <Plus size={26} strokeWidth={2.5} />
      </Motion.button>
    </div>
  );
};

export default React.memo(MapFabGroup);
