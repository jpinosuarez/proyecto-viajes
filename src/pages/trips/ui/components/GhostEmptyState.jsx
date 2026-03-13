import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useUI } from '@app/providers/UIContext';
import { COLORS, SHADOWS, RADIUS, GLASS } from '@shared/config';

const GhostEmptyState = () => {
  const { t } = useTranslation('dashboard');
  const { openBuscador } = useUI();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Ghost Cards Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        padding: '24px',
        opacity: 0.4,
        pointerEvents: 'none',
        filter: 'blur(8px)',
      }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{
            height: '240px',
            borderRadius: RADIUS.lg,
            backgroundColor: COLORS.mutedTeal,
            backgroundImage: `linear-gradient(45deg, ${COLORS.mutedTeal} 25%, #e2e8f0 25%, #e2e8f0 50%, ${COLORS.mutedTeal} 50%, ${COLORS.mutedTeal} 75%, #e2e8f0 75%, #e2e8f0 100%)`,
            backgroundSize: '20px 20px',
          }} />
        ))}
      </div>

      {/* Premium Glassmorphic Overlay */}
      <Motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          zIndex: 10,
          ...GLASS.light,
          border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS['2xl'],
          padding: '48px 32px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: SHADOWS.xl,
          margin: '0 24px'
        }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: COLORS.charcoalBlue, marginBottom: '16px' }}>
           Tu biblioteca está en blanco.
        </h2>
        <p style={{ fontSize: '1.1rem', color: COLORS.textSecondary, marginBottom: '32px', lineHeight: 1.5 }}>
           Las mejores historias aún están por escribirse. Registra tu primera aventura y comienza tu legado.
        </p>
        
        <Motion.button
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={openBuscador}
           style={{
             backgroundColor: COLORS.atomicTangerine,
             color: '#fff',
             border: 'none',
             height: '56px',
             borderRadius: '28px',
             padding: '0 32px',
             fontSize: '1.1rem',
             fontWeight: 800,
             display: 'inline-flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '12px',
             boxShadow: `0 8px 24px ${COLORS.atomicTangerine}60, 0 4px 12px rgba(0,0,0,0.2)`,
             cursor: 'pointer'
           }}
        >
           <Plus size={24} strokeWidth={2.5} />
           Escribir Historia
        </Motion.button>
      </Motion.div>
    </div>
  );
};

export default GhostEmptyState;
