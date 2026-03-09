// Styles for ErrorFallback (CSS-in-JS, polished & normalized)
import { COLORS, SHADOWS, RADIUS, TRANSITIONS, FONTS } from '@shared/config';

const styles = {
  colors: {
    danger: COLORS.danger || '#FF6B35',
  },
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background || '#F8FAFC',
    padding: '20px',
  },
  card: {
    backgroundColor: COLORS.surface || '#FFFFFF',
    borderRadius: RADIUS.lg || '32px',
    boxShadow: SHADOWS.lg || '0 8px 32px rgba(44,62,80,0.12)',
    padding: 'clamp(32px, 6vw, 48px)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: 'clamp(22px, 4vw, 32px)',
    fontWeight: 800,
    color: COLORS.textPrimary || '#2C3E50',
    marginBottom: '12px',
  },
  description: {
    fontSize: 'clamp(15px, 2vw, 18px)',
    color: COLORS.textSecondary || '#6B7280',
    marginBottom: '24px',
    lineHeight: 1.6,
  },
  errorDetails: {
    backgroundColor: '#FEF2F2',
    border: `1px solid ${(COLORS.danger || '#FF6B35')}20`,
    borderRadius: RADIUS.sm || '16px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  errorTitle: {
    fontSize: 'clamp(13px, 1.5vw, 16px)',
    fontWeight: 600,
    color: COLORS.danger || '#FF6B35',
    marginBottom: '8px',
  },
  errorMessage: {
    fontSize: 'clamp(12px, 1vw, 14px)',
    color: '#991B1B',
    fontFamily: FONTS.mono || 'monospace',
    overflow: 'auto',
    margin: 0,
    padding: '8px',
    backgroundColor: COLORS.surface || '#FFFFFF',
    borderRadius: RADIUS.xs || '8px',
  },
  stackTrace: {
    marginTop: '12px',
  },
  stackSummary: {
    cursor: 'pointer',
    fontSize: 'clamp(12px, 1vw, 14px)',
    fontWeight: 600,
    color: COLORS.textSecondary || '#6B7280',
    marginBottom: '8px',
    outline: '2px solid #FF6B35', // Focus-visible
    outlineOffset: '2px',
  },
  stackCode: {
    fontSize: 'clamp(11px, 1vw, 13px)',
    color: COLORS.textSecondary || '#6B7280',
    fontFamily: FONTS.mono || 'monospace',
    overflow: 'auto',
    maxHeight: '200px',
    margin: '8px 0 0',
    padding: '8px',
    backgroundColor: COLORS.surface || '#FFFFFF',
    borderRadius: RADIUS.xs || '8px',
  },
  actions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '16px',
  },
  primaryButton: {
    backgroundColor: COLORS.atomicTangerine || '#FF6B35',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: RADIUS.full || '999px',
    padding: '14px 28px', // Touch target >=44px
    fontSize: 'clamp(15px, 2vw, 18px)',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: TRANSITIONS.fast || 'all 0.2s',
    minHeight: '44px',
    outline: '2px solid #FF6B35', // Focus-visible
    outlineOffset: '2px',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: COLORS.textPrimary || '#2C3E50',
    border: `2px solid ${COLORS.border || '#E5E7EB'}`,
    borderRadius: RADIUS.full || '999px',
    padding: '14px 28px', // Touch target >=44px
    fontSize: 'clamp(15px, 2vw, 18px)',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: TRANSITIONS.fast || 'all 0.2s',
    minHeight: '44px',
    outline: '2px solid #FF6B35', // Focus-visible
    outlineOffset: '2px',
  },
  supportText: {
    fontSize: 'clamp(13px, 1.5vw, 16px)',
    color: COLORS.textSecondary || '#6B7280',
    marginTop: '24px',
    fontStyle: 'italic',
  },
};

export default styles;
