import { COLORS, RADIUS, SHADOWS, SPACING } from '@shared/config';

const cardBase = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: '2px',
  borderRadius: RADIUS.xl,
  padding: '8px 9px',
  minWidth: 0,
  minHeight: 0,
  background: 'rgba(255, 255, 255, 0.78)',
  border: `1px solid rgba(15, 23, 42, 0.08)`,
  boxShadow: SHADOWS.sm,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
};

export const styles = {
  shell: {
    width: '100%',
  },
  heroGridMobile: {
    display: 'grid',
    gap: SPACING.md,
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gridAutoRows: 'minmax(120px, auto)',
    alignItems: 'stretch',
    width: '100%',
  },
  heroGridDesktop: {
    display: 'grid',
    gap: SPACING.xs,
    gridTemplateColumns: 'minmax(0, 1.15fr) repeat(2, minmax(0, 1fr))',
    gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
    alignItems: 'stretch',
    width: '100%',
  },
  compactGridMobile: {
    display: 'grid',
    gap: SPACING.sm,
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gridAutoRows: 'minmax(92px, auto)',
    alignItems: 'stretch',
    width: '100%',
  },
  compactGridDesktop: {
    display: 'grid',
    gap: SPACING.sm,
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    alignItems: 'stretch',
    width: '100%',
  },
  card: cardBase,
  compactCard: {
    padding: '6px 7px',
    gap: '2px',
    borderRadius: RADIUS.lg,
  },
  secondaryCard: {
    justifyContent: 'center',
  },
  heroCard: {
    background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.16), rgba(69, 176, 168, 0.12))',
    minHeight: '100px',
    padding: '6px 8px',
    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
    border: '1px solid rgba(255, 107, 53, 0.14)',
  },
  compactHeroCard: {
    minHeight: 'auto',
    boxShadow: SHADOWS.sm,
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    minWidth: 0,
    width: '100%',
  },
  heroCardBody: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: '100%',
    gap: '3px',
  },
  secondaryCardBody: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlign: 'left',
    gap: '2px',
  },
  secondaryValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    minWidth: 0,
  },
  secondaryIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.atomicTangerine,
    opacity: 0.9,
    flexShrink: 0,
  },
  value: {
    fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
    lineHeight: 0.95,
    fontWeight: 900,
    letterSpacing: '-0.04em',
    color: COLORS.charcoalBlue,
    margin: 0,
    minWidth: 0,
  },
  heroValue: {
    fontSize: 'clamp(1.85rem, 4vw, 2.4rem)',
    color: COLORS.atomicTangerine,
  },
  compactValue: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
  },
  compactHeroValue: {
    fontSize: 'clamp(1.4rem, 2.8vw, 1.8rem)',
  },
  label: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    margin: 0,
    lineHeight: 1,
  },
  secondaryLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.01em',
    textTransform: 'none',
    color: COLORS.textSecondary,
    margin: 0,
    lineHeight: 1.1,
  },
  hint: {
    fontSize: '0.62rem',
    lineHeight: 1.2,
    color: COLORS.textSecondary,
    opacity: 0.68,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    background: 'rgba(255, 255, 255, 0.65)',
    border: `1px dashed rgba(15, 23, 42, 0.12)`,
  },
  emptyStateTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: COLORS.charcoalBlue,
  },
  emptyStateMessage: {
    fontSize: '0.8rem',
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },
  heroPositionMobile: {
    gridColumn: '1 / -1',
    gridRow: '1',
  },
  uniqueCountriesPositionMobile: {
    gridColumn: '1',
    gridRow: '2',
  },
  completedTripsPositionMobile: {
    gridColumn: '2',
    gridRow: '2',
  },
  totalDaysPositionMobile: {
    gridColumn: '1',
    gridRow: '3',
  },
  totalStopsPositionMobile: {
    gridColumn: '2',
    gridRow: '3',
  },
  heroPositionDesktop: {
    gridColumn: '1',
    gridRow: '1 / span 2',
    minHeight: '100%',
  },
  uniqueCountriesPositionDesktop: {
    gridColumn: '2',
    gridRow: '1',
  },
  completedTripsPositionDesktop: {
    gridColumn: '3',
    gridRow: '1',
  },
  totalDaysPositionDesktop: {
    gridColumn: '2',
    gridRow: '2',
  },
  totalStopsPositionDesktop: {
    gridColumn: '3',
    gridRow: '2',
  },
  compactHeroPositionDesktop: {
    gridColumn: '1',
    gridRow: '1',
  },
  compactUniqueCountriesPositionDesktop: {
    gridColumn: '2',
    gridRow: '1',
  },
  compactCompletedTripsPositionDesktop: {
    gridColumn: '3',
    gridRow: '1',
  },
  compactTotalDaysPositionDesktop: {
    gridColumn: '4',
    gridRow: '1',
  },
  compactTotalStopsPositionDesktop: {
    gridColumn: '5',
    gridRow: '1',
  },
  compactHeroPositionMobile: {
    gridColumn: '1 / -1',
    gridRow: '1',
  },
  compactUniqueCountriesPositionMobile: {
    gridColumn: '1',
    gridRow: '2',
  },
  compactCompletedTripsPositionMobile: {
    gridColumn: '2',
    gridRow: '2',
  },
  compactTotalDaysPositionMobile: {
    gridColumn: '1',
    gridRow: '3',
  },
  compactTotalStopsPositionMobile: {
    gridColumn: '2',
    gridRow: '3',
  },
};