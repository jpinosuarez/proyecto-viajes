import { COLORS } from '../../theme';

export const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    maxWidth: '100%', // Evita desbordamiento
    padding: '0 0 40px 0', // Padding solo abajo, el lateral lo da el contenedor padre
    boxSizing: 'border-box',
    overflowX: 'hidden'
  },

  heroSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '30px',
    flexWrap: 'wrap', // Clave para móviles
    marginBottom: '10px'
  },

  welcomeTitle: {
    fontSize: '2.2rem',
    fontWeight: '900',
    color: COLORS.charcoalBlue,
    margin: 0,
    letterSpacing: '-1px',
    lineHeight: 1.2
  },

  welcomeSubtitle: {
    fontSize: '1.1rem',
    color: COLORS.charcoalBlue,
    opacity: 0.8,
    marginTop: '8px',
    maxWidth: '500px',
    lineHeight: '1.5',
  },

  quickActionsGrid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },

  statBox: {
    backgroundColor: 'white',
    padding: '12px 20px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    border: '1px solid rgba(44, 62, 80, 0.05)',
    transition: 'transform 0.2s ease',
    minWidth: '140px'
  },

  iconCircle: (bgColor) => ({
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  }),

  statLabel: { 
    fontSize: '0.65rem', 
    color: COLORS.charcoalBlue, 
    opacity: 0.6, 
    fontWeight: '800', 
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '2px'
  },

  statValue: { 
    fontSize: '1rem', 
    fontWeight: '800', 
    color: COLORS.charcoalBlue 
  },

  mapBanner: {
    width: '100%',
    minHeight: '220px',
    borderRadius: '24px',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80")', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
  },

  mapBannerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: `linear-gradient(90deg, ${COLORS.charcoalBlue}F2 0%, ${COLORS.charcoalBlue}88 100%)`,
    zIndex: 1,
  },

  mapBannerContent: {
    position: 'relative',
    zIndex: 2,
    color: COLORS.linen,
    maxWidth: '600px'
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    marginTop: '20px'
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Auto-fit evita huecos
    gap: '20px',
    width: '100%'
  },

  miniCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '20px',
    border: '1px solid rgba(44, 62, 80, 0.05)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    overflow: 'hidden'
  },

  miniCardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    minWidth: 0 // Permite truncar texto
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
  }
};