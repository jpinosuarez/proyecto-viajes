import { COLORS, SHADOWS, RADIUS } from '../../theme';

export const styles = {
  dashboardContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    paddingBottom: '20px',
    boxSizing: 'border-box',
    overflow: 'hidden' // Evita que la página entera scrollee
  },

  // Header simplificado
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    paddingBottom: '10px',
    borderBottom: `1px solid ${COLORS.border}`,
    flexShrink: 0 // No se encoge
  },
  title: { fontSize: '1.8rem', fontWeight: '900', color: COLORS.charcoalBlue, margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '0.95rem', color: COLORS.textSecondary, margin: '4px 0 0 0' },

  // GRID DE 3 COLUMNAS
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr 340px', // Estructura fija: Info | Mapa | Recientes
    gridTemplateRows: '100%',
    gap: '24px',
    flex: 1, // Ocupa el resto del alto
    minHeight: 0, // Clave para que los hijos scrolleen
    
    '@media (max-width: 1200px)': {
      gridTemplateColumns: '1fr 1fr', // Tablet
      gridTemplateRows: 'auto 1fr',
      overflowY: 'auto'
    },
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr', // Mobile
      overflowY: 'auto'
    }
  },

  // COL 1: Stats & Perfil
  colLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
    paddingRight: '5px'
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: RADIUS.lg,
    padding: '24px',
    boxShadow: SHADOWS.sm,
    border: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  statRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: COLORS.textSecondary },
  statValue: { fontWeight: '800', color: COLORS.charcoalBlue, fontSize: '1.1rem' },

  // COL 2: Mapa Hero
  colCenter: {
    backgroundColor: 'white',
    borderRadius: RADIUS.lg,
    boxShadow: SHADOWS.md,
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  },
  mapContainer: { flex: 1, position: 'relative', minHeight: '300px' },

  // COL 3: Recientes
  colRight: {
    backgroundColor: 'white',
    borderRadius: RADIUS.lg,
    boxShadow: SHADOWS.sm,
    border: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden' // El scroll va dentro
  },
  recentsHeader: {
    padding: '20px',
    borderBottom: `1px solid ${COLORS.border}`,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontWeight: '800', color: COLORS.charcoalBlue
  },
  recentsList: {
    flex: 1,
    overflowY: 'auto', // Scroll interno
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  
  // Tarjetas pequeñas de recientes
  miniCard: {
    display: 'flex', gap: '12px',
    cursor: 'pointer', padding: '10px', borderRadius: RADIUS.md,
    transition: 'background 0.2s',
    ':hover': { backgroundColor: '#F8FAFC' }
  },
  miniImg: (url) => ({
    width: '60px', height: '60px', borderRadius: '12px',
    backgroundColor: '#eee', backgroundImage: url ? `url(${url})` : 'none',
    backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
  }),
  miniInfo: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  miniTitle: { fontWeight: '700', fontSize: '0.9rem', color: COLORS.charcoalBlue, lineHeight: 1.2 },
  miniDate: { fontSize: '0.75rem', color: COLORS.textSecondary, marginTop: '4px' },
  
  actionBtn: { background: 'none', border:'none', color: COLORS.atomicTangerine, fontSize:'0.85rem', fontWeight:'700', cursor:'pointer' }
};