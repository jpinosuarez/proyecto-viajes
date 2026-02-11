import { COLORS, SHADOWS, RADIUS } from '../../theme';

export const styles = {
  dashboardContainer: (isMobile) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: isMobile ? '0 0 14px 0' : '0 20px 20px 0',
    boxSizing: 'border-box',
    overflow: 'hidden'
  }),

  welcomeArea: {
    marginBottom: '20px',
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  title: { fontSize: '1.8rem', fontWeight: '900', color: COLORS.charcoalBlue, margin: 0 },
  subtitle: { fontSize: '0.95rem', color: COLORS.textSecondary, marginTop: '4px' },

  headerStatsRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  statPill: {
    display: 'flex', alignItems: 'center', gap: '10px',
    backgroundColor: 'white', padding: '8px 14px', borderRadius: '16px',
    boxShadow: SHADOWS.sm, border: `1px solid ${COLORS.border}`
  },
  pillIcon: (color) => ({
    width: '28px', height: '28px', borderRadius: '8px',
    backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center'
  }),
  pillValue: { fontSize: '1rem', fontWeight: '800', color: COLORS.charcoalBlue, lineHeight: 1 },
  pillLabel: { fontSize: '0.65rem', color: COLORS.textSecondary, textTransform: 'uppercase', fontWeight: '700' },

  mainGrid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1.8fr 1.2fr',
    gap: isMobile ? '14px' : '24px',
    flex: 1,
    minHeight: 0,
    transition: 'grid-template-columns 0.25s ease, gap 0.25s ease'
  }),

  mapCard: (isMobile) => ({
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    border: `1px solid ${COLORS.border}`,
    boxShadow: SHADOWS.md,
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
    minHeight: isMobile ? '300px' : 0
  }),

  recentsContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    gap: '15px'
  },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexShrink: 0
  },
  sectionTitle: { fontSize: '1rem', fontWeight: '800', color: COLORS.charcoalBlue, display: 'flex', alignItems: 'center', gap: '8px' },
  viewAllBtn: { background: 'none', border: 'none', color: COLORS.atomicTangerine, fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' },

  cardsList: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  travelCard: {
    position: 'relative',
    height: '140px',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: SHADOWS.sm,
    border: `1px solid ${COLORS.border}`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    flexShrink: 0
  },
  cardBackground: {
    position: 'absolute', inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'transform 0.5s'
  },
  cardGradient: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)'
  },
  cardContent: {
    position: 'relative', zIndex: 2,
    height: '100%',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  flagImg: { width: '28px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' },
  cardBottom: { color: 'white' },
  cardTitle: { margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.5)' },
  cardMeta: { display: 'flex', gap: '12px', fontSize: '0.8rem', opacity: 0.9, fontWeight: '500' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '4px' },

  welcomeCard: {
    width: '100%',
    minHeight: '260px',
    borderRadius: RADIUS.lg,
    border: `1px solid ${COLORS.border}`,
    boxShadow: SHADOWS.md,
    padding: '24px',
    background: `linear-gradient(145deg, ${COLORS.linen} 0%, #fff 60%)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '12px'
  },
  welcomeArt: {
    width: '116px',
    height: '116px',
    borderRadius: RADIUS.full,
    background: 'white',
    border: `1px solid ${COLORS.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxShadow: SHADOWS.sm
  },
  welcomeArtOrbit: {
    width: '42px',
    height: '42px',
    borderRadius: RADIUS.full,
    background: COLORS.linen,
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    border: `1px solid ${COLORS.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  welcomeTitle: {
    margin: '4px 0 0 0',
    color: COLORS.charcoalBlue,
    fontSize: '1.3rem',
    fontWeight: '900'
  },
  welcomeText: {
    margin: 0,
    color: COLORS.textSecondary,
    maxWidth: '320px',
    fontSize: '0.92rem',
    lineHeight: 1.45
  },
  welcomeCta: {
    marginTop: '6px',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 16px',
    background: COLORS.atomicTangerine,
    color: 'white',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: SHADOWS.sm
  }
};
