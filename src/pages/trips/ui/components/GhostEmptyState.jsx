import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useUI } from '@app/providers/UIContext';
import { COLORS, SHADOWS, RADIUS } from '@shared/config';

const GhostEmptyState = () => {
  const { t } = useTranslation('dashboard');
  const { openBuscador } = useUI();

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '58vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 18% 24%, rgba(255,107,53,0.14), transparent 42%), radial-gradient(circle at 80% 82%, rgba(69,176,168,0.16), transparent 40%)',
        pointerEvents: 'none',
        opacity: 0.85,
      }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            position: 'absolute',
            width: i === 1 ? '140px' : i === 2 ? '96px' : '120px',
            height: i === 1 ? '140px' : i === 2 ? '96px' : '120px',
            top: i === 1 ? '14%' : i === 2 ? '62%' : '26%',
            left: i === 1 ? '8%' : i === 2 ? '74%' : '66%',
            borderRadius: RADIUS.full,
            background: i === 2 ? 'rgba(69,176,168,0.2)' : 'rgba(255,107,53,0.2)',
            filter: 'blur(1px)',
          }} />
        ))}
      </div>

      <Motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(255,255,255,0.95)',
          border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS.xl,
          padding: '36px 24px',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          boxShadow: SHADOWS.lg,
        }}
      >
        <h2 style={{ fontSize: '1.55rem', fontWeight: 900, color: COLORS.charcoalBlue, marginBottom: '12px', lineHeight: 1.2 }}>
          {t('ghostEmptyState.title')}
        </h2>
        <p style={{ fontSize: '0.98rem', color: COLORS.textSecondary, marginBottom: '28px', lineHeight: 1.55 }}>
          {t('ghostEmptyState.description')}
        </p>
        
        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openBuscador}
          style={{
            backgroundColor: COLORS.atomicTangerine,
            color: '#fff',
            border: 'none',
            minHeight: '56px',
            minWidth: '44px',
            borderRadius: '28px',
            padding: '0 26px',
            fontSize: '1rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: `0 10px 24px ${COLORS.atomicTangerine}44`,
            cursor: 'pointer'
          }}
        >
          <Plus size={22} strokeWidth={2.5} />
          {t('ghostEmptyState.action')}
        </Motion.button>
      </Motion.div>
    </div>
  );
};

export default GhostEmptyState;
