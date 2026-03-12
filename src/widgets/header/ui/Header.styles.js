import { COLORS, SHADOWS, RADIUS, TRANSITIONS, Z_INDEX } from '@shared/config';

export const styles = {
  header: (isMobile) => ({
    minHeight: '72px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isMobile ? '0 16px' : '0 32px',
    gap: isMobile ? '8px' : '16px',
    backgroundColor: 'transparent',
    zIndex: Z_INDEX.dropdown,
    position: 'relative',
    transition: TRANSITIONS.normal
  }),
  leftSide: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 },
  breadcrumb: { color: COLORS.textSecondary, fontSize: '0.85rem', fontWeight: '500' },
  separator: { color: COLORS.textSecondary, opacity: 0.5 },
  titulo: (isMobile) => ({
    fontSize: isMobile ? '1rem' : '1.2rem',
    color: COLORS.charcoalBlue,
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-0.5px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }),
  menuButton: {
    width: '44px',
    height: '44px',
    borderRadius: RADIUS.md,
    border: `1px solid ${COLORS.borderLight}`,
    backgroundColor: COLORS.surface,
    color: COLORS.charcoalBlue,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: TRANSITIONS.fast
  },
  rightSide: (isMobile) => ({
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '8px' : '16px',
    minWidth: 0
  }),
  searchContainer: (isMobile) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: COLORS.surface,
    padding: '8px 16px',
    borderRadius: RADIUS.md,
    border: `1px solid ${COLORS.border}`,
    minWidth: isMobile ? '0' : '280px',
    width: isMobile ? 'min(92vw, 360px)' : 'auto',
    boxShadow: SHADOWS.sm
  }),
  mobileSearchPanel: {
    position: 'absolute',
    top: '64px',
    right: '16px'
  },
  searchInput: {
    border: 'none',
    background: 'none',
    fontSize: '1rem',
    color: COLORS.charcoalBlue,
    width: '100%'
  },
  clearButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: COLORS.textSecondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: RADIUS.sm
  },
  addButton: (isMobile) => ({
    backgroundColor: COLORS.atomicTangerine,
    color: COLORS.linen,
    border: 'none',
    padding: isMobile ? '12px' : '12px 24px',
    borderRadius: RADIUS.md,
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '0' : '8px',
    boxShadow: `0 4px 12px ${COLORS.atomicTangerine}40`,
    whiteSpace: 'nowrap',
    transition: TRANSITIONS.fast,
    minHeight: '44px'
  }),
  addButtonLabel: {
    display: 'inline-flex',
    alignItems: 'center'
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.mutedTeal,
    border: `2px solid ${COLORS.surface}`,
    boxShadow: SHADOWS.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: '0.9rem',
    flexShrink: 0
  },
  avatarInitials: {
    fontWeight: '700',
    fontSize: '0.85rem',
    letterSpacing: '0.5px'
  }
};
