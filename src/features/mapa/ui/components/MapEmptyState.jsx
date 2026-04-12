import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Plus, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUI } from '@app/providers/UIContext';
import { COLORS, RADIUS, SHADOWS, BUTTONS } from '@shared/config';

/**
 * MapEmptyState — Cinematic empty state for users with 0 trips.
 *
 * Design decisions:
 *  - The spinning globe IS the hero — this card is a "supporting whisper."
 *  - Uses light glassmorphism per brand guidelines (map overlay).
 *  - Centered on screen, max-width 400px, minimal footprint.
 *  - CTA triggers the global trip search palette (openBuscador).
 */
const MapEmptyState = () => {
  const { t } = useTranslation('dashboard');
  const { openBuscador, isReadOnlyMode } = useUI();

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 10,
      padding: '24px',
    }}>
      <Motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.6 }}
        style={{
          pointerEvents: 'auto',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          padding: '32px 28px',
          borderRadius: RADIUS.xl,
          background: 'rgba(248, 250, 252, 0.82)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(226, 232, 240, 0.5)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Globe icon — large hero element */}
        <Motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: RADIUS.full,
            background: `linear-gradient(135deg, ${COLORS.atomicTangerine}20, ${COLORS.mutedTeal}20)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Globe size={28} color={COLORS.atomicTangerine} strokeWidth={1.5} />
        </Motion.div>

        {/* Headline */}
        <h2 style={{
          margin: '0 0 8px',
          fontSize: '1.3rem',
          fontWeight: 900,
          color: COLORS.charcoalBlue,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}>
          {t('map.emptyState.title', 'Your world awaits')}
        </h2>

        {/* Subtitle */}
        <p style={{
          margin: '0 0 24px',
          fontSize: '0.9rem',
          color: COLORS.textSecondary,
          lineHeight: 1.5,
          fontWeight: 500,
        }}>
          {t('map.emptyState.subtitle', 'Every explorer starts here. Drop your first pin and watch your story unfold.')}
        </p>

        {/* CTA Button — Primary gradient pill */}
        <Motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openBuscador}
          disabled={isReadOnlyMode}
          style={{
            ...BUTTONS.primary,
            width: '100%',
            maxWidth: '260px',
            opacity: isReadOnlyMode ? 0.55 : 1,
            cursor: isReadOnlyMode ? 'not-allowed' : 'pointer',
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          {t('map.emptyState.cta', 'Log First Adventure')}
        </Motion.button>
      </Motion.div>
    </div>
  );
};

export default React.memo(MapEmptyState);
