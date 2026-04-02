import { COLORS, RADIUS, SHADOWS, SPACING } from '@shared/config';

const cardBase = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: SPACING.sm,
  borderRadius: RADIUS.xl,
  padding: SPACING.lg,
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
  gridMobile: {
    display: 'grid',
    gap: SPACING.md,
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gridAutoRows: 'minmax(120px, auto)',
    alignItems: 'stretch',
    width: '100%',
  },
  gridDesktop: {
    display: 'grid',
    gap: SPACING.md,
    gridTemplateColumns: 'minmax(0, 1.15fr) repeat(2, minmax(0, 1fr))',
    gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
    alignItems: 'stretch',
    width: '100%',
  },
  card: cardBase,
  heroCard: {
    background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.16), rgba(69, 176, 168, 0.12))',
    minHeight: '220px',
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
    border: '1px solid rgba(255, 107, 53, 0.14)',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.xs,
    minWidth: 0,
  },
  value: {
    fontSize: 'clamp(1.5rem, 3.4vw, 2rem)',
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: '-0.04em',
    color: COLORS.charcoalBlue,
    margin: 0,
    minWidth: 0,
  },
  heroValue: {
    fontSize: 'clamp(2.6rem, 6vw, 4rem)',
    color: COLORS.atomicTangerine,
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    margin: 0,
  },
  hint: {
    fontSize: '0.72rem',
    lineHeight: 1.45,
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
};