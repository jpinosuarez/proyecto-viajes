import { COLORS, SHADOWS, RADIUS, TRANSITIONS, GLASS, Z_INDEX } from '@shared/config';

const baseSidebar = {
  height: '100vh',
  width: '260px',
  backgroundColor: COLORS.surface,
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${COLORS.border}`,
  top: 0,
  left: 0,
  boxShadow: SHADOWS.sm
};

export const styles = {
  sidebar: {
    ...baseSidebar,
    position: 'fixed',
    zIndex: Z_INDEX.sticky
  },
  mobileSidebar: {
    ...baseSidebar,
    position: 'fixed',
    zIndex: Z_INDEX.overlay + 1,
    width: '280px',
    maxWidth: '84vw'
  },
  mobileOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: Z_INDEX.overlay,
    ...GLASS.overlay
  },
  mobileTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 8px'
  },
  logoContainerMobile: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  mobileCloseBtn: {
    border: `1px solid ${COLORS.border}`,
    background: COLORS.surface,
    borderRadius: RADIUS.sm,
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.textSecondary,
    cursor: 'pointer'
  },
  toggleBtn: {
    position: 'absolute',
    top: '32px',
    right: '-16px',
    width: '44px',
    height: '44px',
    backgroundColor: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: RADIUS.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: COLORS.textSecondary,
    zIndex: Z_INDEX.sticky,
    boxShadow: SHADOWS.sm,
    transition: TRANSITIONS.fast
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '60px',
    marginBottom: '32px',
    padding: '0 16px',
    overflow: 'hidden'
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: '900',
    color: COLORS.charcoalBlue,
    letterSpacing: '-0.5px',
    margin: 0,
    whiteSpace: 'nowrap'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    padding: '0 16px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: TRANSITIONS.fast,
    width: '100%',
    minHeight: '44px',
    overflow: 'hidden'
  },
  labelSpan: { fontWeight: '600', marginLeft: '8px', whiteSpace: 'nowrap' },
  footer: {
    borderTop: `1px solid ${COLORS.background}`,
    padding: '16px',
    paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: COLORS.textSecondary,
    cursor: 'pointer',
    padding: '12px 8px',
    minHeight: '44px',
    fontWeight: '600',
    fontSize: '0.9rem',
    width: '100%',
    borderRadius: RADIUS.sm
  }
};
