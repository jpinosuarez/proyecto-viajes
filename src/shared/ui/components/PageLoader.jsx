import React from 'react';
import { BentoCardSkeleton } from './Skeletons';
import { COLORS, SHADOWS, RADIUS } from '@shared/config';

/**
 * Full-screen page loader used during route chunk loading.
 * Designed to feel premium and match Keeptrip's glassy layer system.
 */
export default function PageLoader() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(10px)',
        zIndex: 13000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: 'min(420px, 90vw)',
          padding: '24px',
          borderRadius: RADIUS.xl,
          boxShadow: SHADOWS.float,
          background: 'rgba(255,255,255,0.92)',
          border: `1px solid rgba(255,255,255,0.55)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
        }}
      >
        <BentoCardSkeleton />
        <div style={{ textAlign: 'center', color: COLORS.textSecondary, fontWeight: 600 }}>
          Cargando contenido…
        </div>
      </div>
    </div>
  );
}
