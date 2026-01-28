import { COLORS } from '../../theme';

export const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '20px',
    height: '100%',
    boxSizing: 'border-box',
  },
  heroSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  },
  welcomeTitle: {
    fontSize: '2.2rem',
    fontWeight: '900',
    color: COLORS.charcoalBlue,
    margin: 0,
    letterSpacing: '-1px',
  },
welcomeSubtitle: {
    fontSize: '1.1rem',
    color: COLORS.charcoalBlue,
    opacity: 0.8,
    marginTop: '8px',
    maxWidth: '500px',
    lineHeight: '1.5', // Importante para que los spans no se vean raros
  },
  quickActionsGrid: {
    display: 'flex',
    gap: '16px',
  },
  statBox: {
    backgroundColor: 'white',
    padding: '16px 24px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    border: '1px solid rgba(44, 62, 80, 0.05)',
  },
  iconCircle: (bgColor) => ({
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  statLabel: { 
    fontSize: '0.7rem', 
    color: COLORS.charcoalBlue, 
    opacity: 0.5, 
    fontWeight: '800', 
    textTransform: 'uppercase',
    display: 'block'
  },
  statValue: { 
    fontSize: '1.1rem', 
    fontWeight: '800', 
    color: COLORS.charcoalBlue 
  },
  mapBanner: {
    width: '100%',
    minHeight: '180px',
    borderRadius: '28px',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80")', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    padding: '40px',
  },
  mapBannerContent: {
    position: 'relative',
    zIndex: 2,
    color: COLORS.linen,
  },
  mapBannerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: `linear-gradient(90deg, ${COLORS.charcoalBlue}F2 0%, ${COLORS.charcoalBlue}88 100%)`,
    zIndex: 1,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: { 
    fontSize: '1.4rem', 
    fontWeight: '800', 
    color: COLORS.charcoalBlue, 
    margin: 0 
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: COLORS.atomicTangerine,
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  recentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  miniCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid rgba(44, 62, 80, 0.05)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  miniCardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  badge: {
    fontSize: '0.65rem',
    backgroundColor: `${COLORS.mutedTeal}15`,
    color: COLORS.mutedTeal,
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginTop: '4px'
  },
  emptyState: {
    gridColumn: '1 / -1',
    padding: '60px',
    textAlign: 'center',
    backgroundColor: 'rgba(44, 62, 80, 0.02)',
    borderRadius: '24px',
    border: '1px dashed #cbd5e1',
    color: COLORS.charcoalBlue,
    opacity: 0.5,
  }
};