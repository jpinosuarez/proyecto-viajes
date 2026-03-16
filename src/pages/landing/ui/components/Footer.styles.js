import { COLORS, FONTS, SHADOWS, RADIUS, SPACING, TRANSITIONS } from '@shared/config';

export const styles = {
  footerContainer: {
    background: COLORS.charcoalBlue,
    color: COLORS.textSecondary,
    padding: `${SPACING.xl} ${SPACING.lg}`,
    marginTop: `${SPACING['3xl']}`,
    borderTop: `1px solid ${COLORS.border}15`,
    zIndex: 5,
    position: 'relative',
  },

  footerWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.lg,
  },

  footerTop: (isMobile) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    gap: SPACING.lg,
  }),

  footerBrand: {
    fontSize: isMobile => isMobile ? '1.3rem' : '1.5rem',
    fontWeight: '900',
    color: COLORS.surface,
    letterSpacing: '-1px',
    fontFamily: FONTS.heading,
    cursor: 'pointer',
    transition: TRANSITIONS.normal,
    ':hover': {
      color: COLORS.atomicTangerine,
    },
  },

  footerLinks: (isMobile) => ({
    display: 'flex',
    gap: isMobile ? SPACING.md : SPACING.lg,
    flexWrap: 'wrap',
    justifyContent: isMobile ? 'flex-start' : 'center',
    alignItems: 'center',
  }),

  footerLink: {
    color: COLORS.textSecondary,
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontFamily: FONTS.body,
    fontWeight: '500',
    transition: TRANSITIONS.normal,
    cursor: 'pointer',
    padding: `${SPACING.xs} ${SPACING.sm}`,
    borderRadius: RADIUS.sm,
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    ':hover': {
      color: COLORS.atomicTangerine,
      backgroundColor: `${COLORS.atomicTangerine}10`,
    },
  },

  footerDivider: {
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${COLORS.border}40, transparent)`,
    margin: `${SPACING.md} 0`,
  },

  footerBottom: (isMobile) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile ? 'flex-start' : 'space-between',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    gap: SPACING.md,
    paddingTop: SPACING.md,
  }),

  copyrightText: {
    fontSize: '0.85rem',
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
    fontWeight: '400',
    margin: 0,
  },

  footerAccent: {
    color: COLORS.atomicTangerine,
    fontWeight: '600',
  },
};
