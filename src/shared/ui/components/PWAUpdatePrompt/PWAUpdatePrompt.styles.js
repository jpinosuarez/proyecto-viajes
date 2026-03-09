// Styles for PWAUpdatePrompt (CSS-in-JS, polished & normalized)
import { COLORS, RADIUS, SHADOWS, GLASS, FONTS } from '@shared/config';

const styles = {
  toast: {
    position: 'fixed',
    bottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(12px, 3vw, 24px)',
    padding: 'clamp(14px, 4vw, 24px)',
    borderRadius: RADIUS.lg || '32px',
    boxShadow: SHADOWS.float || '0 8px 32px rgba(44,62,80,0.12)',
    zIndex: 600,
    ...GLASS.medium,
    border: `1px solid ${COLORS.border || '#E5E7EB'}`,
    minHeight: '56px', // Touch target >=44px
    animation: 'slideIn 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
    fontFamily: FONTS.sans || 'Inter, Plus Jakarta Sans, sans-serif',
  },
  text: {
    fontSize: 'clamp(15px, 2vw, 18px)',
    fontWeight: 600,
    color: COLORS.textPrimary || '#2C3E50',
    flex: 1,
    textAlign: 'center',
    letterSpacing: '0.02em',
    lineHeight: 1.4,
    outline: 'none',
  },
  actions: {
    display: 'flex',
    gap: 'clamp(16px, 3vw, 24px)',
  },
  updateBtn: {
    padding: '14px 28px', // Touch target >=44px
    borderRadius: RADIUS.full || '999px',
    border: 'none',
    background: COLORS.atomicTangerine || '#FF6B35',
    color: '#fff',
    fontWeight: 600,
    fontSize: 'clamp(15px, 2vw, 18px)',
    cursor: 'pointer',
    minHeight: '44px',
    outline: '2px solid #FF6B35', // Focus-visible
    outlineOffset: '2px',
    transition: 'background 0.2s',
  },
  dismissBtn: {
    padding: '14px 28px', // Touch target >=44px
    borderRadius: RADIUS.full || '999px',
    border: `2px solid ${COLORS.border || '#E5E7EB'}`,
    background: 'transparent',
    color: COLORS.textSecondary || '#6B7280',
    fontWeight: 600,
    fontSize: 'clamp(15px, 2vw, 18px)',
    cursor: 'pointer',
    minHeight: '44px',
    outline: '2px solid #FF6B35', // Focus-visible
    outlineOffset: '2px',
    transition: 'background 0.2s',
  },
};

export default styles;
