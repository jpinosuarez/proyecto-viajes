import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '@shared/lib/hooks/useWindowSize';
import { COLORS, RADIUS } from '@shared/config';
import AppScaffold from '@app/layout/AppScaffold';

export function DashboardContentSkeleton() {
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const isMobile = width < 768;
  const { t } = useTranslation('dashboard');

  // Replicamos la tipografía y márgenes del h1 en WelcomeBento mitigando CLS
  const titleStyle = {
    margin: 0,
    fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)',
    fontWeight: '900',
    lineHeight: 1.18,
    letterSpacing: '-0.02em',
    color: COLORS.charcoalBlue, // Visible para LCP de Lighthouse
    minHeight: '2.36em', // Previene CLS contra texto largo que envuelve 2 líneas
    width: 'fit-content',
  };

  return (
    <div style={{
      width: '100%',
      boxSizing: 'border-box',
      minWidth: 0,
      ...(isDesktop
        ? {
            height: '100dvh',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'minmax(350px, 5fr) minmax(400px, 7fr)',
            gridTemplateRows: 'min-content minmax(0, 1fr)',
            gap: '24px',
            padding: '24px',
          }
        : {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '16px',
            height: 'auto',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
          })
    }}>
      <div style={{
        minWidth: 0,
        ...(isDesktop
          ? { gridColumn: '1', gridRow: '1', alignSelf: 'stretch' }
          : { width: '100%' }
        )
      }}>
        {/* Simulamos WelcomeBento */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: isMobile ? '10px' : '12px',
          padding: isMobile ? '16px' : '20px',
        }} className="animate-pulse">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h1 style={titleStyle}>{t('preparingLogbook')}</h1>
            <div style={{ width: '60%', height: '1.2rem', backgroundColor: '#F1F5F9', borderRadius: '6px' }} />
          </div>
        </div>
      </div>
      
      {/* Simuladores visuales vacíos para que la pantalla no se vea cortada */}
      <div style={{ minWidth: 0, ...(isDesktop ? { gridColumn: '2', gridRow: '1', alignSelf: 'stretch' } : { width: '100%' }) }}>
         <div style={{ width: '100%', height: '140px', backgroundColor: '#F8FAFC', borderRadius: RADIUS.xl, border: `1px solid ${COLORS.border}` }} className="animate-pulse" />
      </div>
      
      <div style={{ minWidth: 0, ...(isDesktop ? { gridColumn: '1', gridRow: '2', height: '100%' } : { width: '100%' }) }}>
         <div style={{ width: '100%', height: '100%', minHeight: '300px', backgroundColor: '#F8FAFC', borderRadius: RADIUS.xl, border: `1px solid ${COLORS.border}` }} className="animate-pulse" />
      </div>

      <div style={{ minWidth: 0, ...(isDesktop ? { gridColumn: '2', gridRow: '2', height: '100%' } : { width: '100%' }) }}>
         <div style={{ width: '100%', height: '100%', minHeight: '300px', backgroundColor: '#F8FAFC', borderRadius: RADIUS.xl, border: `1px solid ${COLORS.border}` }} className="animate-pulse" />
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  return <AppScaffold isMobile={isMobile} content={<DashboardContentSkeleton />} />;
}
