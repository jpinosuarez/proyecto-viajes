import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus, Navigation } from 'lucide-react';
import { COLORS, RADIUS } from '@shared/config';
import { useUI } from '@app/providers/UIContext';

/**
 * MapFabGroup — Floating action buttons for the Map Command Center.
 *
 * Desktop only (mobile actions live in the TripRoster BottomSheet).
 * Positioned bottom-right to avoid conflict with TripRoster (bottom-left).
 * Uses light glassmorphism matching the roster's aesthetic.
 */
const MapFabGroup = ({ onLocateMe }) => {
  const { t } = useTranslation('dashboard');
  const { openBuscador } = useUI();

  const fabBase = {
    width: '48px',
    height: '48px',
    borderRadius: RADIUS.full,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    pointerEvents: 'auto',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: 'background 0.2s, box-shadow 0.2s',
  };

  return (
    <Motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '20px',
        zIndex: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      {/* Locate Me */}
      <Motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          ...fabBase,
          background: 'rgba(248, 250, 252, 0.85)',
          color: COLORS.charcoalBlue,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.5)',
        }}
        onClick={onLocateMe}
        title={t('map.roster.locateMe', 'Locate me')}
        aria-label={t('map.roster.locateMe', 'Locate me')}
      >
        <Navigation size={18} fill={COLORS.charcoalBlue} />
      </Motion.button>

      {/* Add Trip (Primary) */}
      <Motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          ...fabBase,
          width: '52px',
          height: '52px',
          background: `linear-gradient(135deg, ${COLORS.atomicTangerine}, #ff9a4d)`,
          color: '#fff',
          boxShadow: `0 6px 20px ${COLORS.atomicTangerine}40, 0 2px 8px rgba(0,0,0,0.15)`,
          border: 'none',
        }}
        onClick={openBuscador}
        title={t('welcome.emptyStateCTA', 'Register First Adventure')}
        aria-label={t('welcome.emptyStateCTA', 'Register First Adventure')}
      >
        <Plus size={22} strokeWidth={2.5} />
      </Motion.button>
    </Motion.div>
  );
};

export default React.memo(MapFabGroup);
