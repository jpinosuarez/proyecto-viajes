// Styles for OfflineBanner (CSS-in-JS, polished & normalized)
import { COLORS, RADIUS, FONTS } from '@shared/config';

const styles = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '56px', // Touch target >=44px
    padding: 'clamp(12px, 3vw, 20px)',
    fontFamily: FONTS.sans || 'Inter, Plus Jakarta Sans, sans-serif',
    fontWeight: 600,
    fontSize: 'clamp(15px, 2vw, 18px)',
    borderRadius: RADIUS.lg || '32px',
    boxShadow: '0 4px 16px rgba(44,62,80,0.10)',
    transition: 'transform 0.4s cubic-bezier(.68,-0.55,.27,1.55), background 0.2s',
    willChange: 'transform',
  },
  bannerOffline: {
    background: COLORS.charcoalBlue || '#2C3E50',
    color: COLORS.atomicTangerine || '#FF6B35',
    border: `2px solid ${COLORS.atomicTangerine || '#FF6B35'}`,
  },
  bannerOnline: {
    background: COLORS.mutedTeal || '#45B0A8',
    color: '#FFFFFF',
    border: `2px solid ${COLORS.mutedTeal || '#45B0A8'}`,
  },
  text: {
    flex: 1,
    textAlign: 'center',
    fontSize: 'clamp(15px, 2vw, 18px)',
    letterSpacing: '0.02em',
    lineHeight: 1.4,
    outline: 'none',
  },
  slideIn: {
    transform: 'translateY(0)',
    animation: 'slideIn 0.4s',
  },
};

export default styles;
