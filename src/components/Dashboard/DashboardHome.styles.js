import { COLORS, SHADOWS, RADIUS } from '../../theme';

export const styles = {
  dashboardContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '0 20px 20px 0',
    boxSizing: 'border-box',
    overflow: 'hidden'
  },
  welcomeArea: { marginBottom: '10px', flexShrink: 0 },
  title: { fontSize: '2rem', fontWeight: '900', color: COLORS.charcoalBlue, margin: 0 },
  subtitle: { fontSize: '1rem', color: COLORS.textSecondary },

  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr', 
    gridTemplateRows: 'repeat(3, 1fr)', // 3 filas iguales
    gap: '20px',
    flex: 1,
    minHeight: 0
  },

  // Mapa ocupa 2/3 de ancho y 2/3 de alto
  mapCard: {
    gridColumn: '1 / 2',
    gridRow: '1 / 3',
    backgroundColor: '#F8FAFC', // Match con el mapa
    borderRadius: RADIUS.lg,
    boxShadow: SHADOWS.md,
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  mapOverlayInfo: {
    position: 'absolute', top: 20, left: 20, zIndex: 10,
    background: 'rgba(255,255,255,0.95)', padding: '15px 20px',
    borderRadius: RADIUS.md, backdropFilter: 'blur(8px)',
    boxShadow: SHADOWS.lg,
    border: `1px solid ${COLORS.border}`
  },
  mapTitle: { display: 'block', fontSize: '0.75rem', fontWeight: '800', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' },
  mapProgress: { display: 'flex', alignItems: 'baseline', gap: '10px' },
  mapPercent: { fontSize: '2.5rem', fontWeight: '900', color: COLORS.atomicTangerine, lineHeight: 1 },
  mapTotal: { fontSize: '0.9rem', color: COLORS.charcoalBlue, fontWeight: '700' },

  // Stats
  statsColumn: {
    gridColumn: '2 / 3',
    gridRow: '1 / 4', // Ocupa toda la altura derecha
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  recentCard: {
    gridColumn: '1 / 2',
    gridRow: '3 / 4',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    boxShadow: SHADOWS.sm,
    border: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  statCard: (color) => ({
    flex: 1, // Se distribuyen equitativamente
    backgroundColor: color,
    borderRadius: RADIUS.lg,
    padding: '20px',
    boxShadow: SHADOWS.sm,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  }),
  statIcon: { 
    background: 'rgba(255,255,255,0.2)', width: '40px', height: '40px', 
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
  },
  statLabel: { fontSize: '0.85rem', opacity: 0.9, fontWeight: '600' },
  statValue: { fontSize: '2rem', fontWeight: '800' },

  // Recientes (Abajo a la izquierda)
  recentItem: {
    position: 'relative',
    height: '80px',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    padding: '0 20px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: SHADOWS.sm,
    ':hover': { transform: 'scale(1.01)' }
},
  recentHeader: {
    padding: '15px 20px',
    borderBottom: `1px solid ${COLORS.border}`,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#F8FAFC'
  },
  cardTitle: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: COLORS.charcoalBlue,
    display: 'flex',
    alignItems: 'center',
    gap: '8px' },
  
  linkBtn: { background: 'none', border:'none', color: COLORS.atomicTangerine, fontWeight:'700', cursor:'pointer', fontSize:'0.8rem' },
  
  list: { flex: 1, overflowY: 'auto', padding: '10px' },
  listItem: {
    display: 'flex', alignItems: 'center', gap: '15px',
    padding: '10px 15px', borderRadius: RADIUS.md,
    cursor: 'pointer', transition: 'all 0.2s',
    ':hover': { backgroundColor: '#F1F5F9', transform: 'translateX(4px)' }
  },
  listIcon: { 
    fontSize: '1.5rem', width: '40px', height: '40px', 
    background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  listTitle: { display: 'block', fontWeight: '700', fontSize: '0.95rem', color: COLORS.charcoalBlue },
  listDate: { fontSize: '0.8rem', color: COLORS.textSecondary },
  listSub: { fontSize: '0.75rem', color: COLORS.mutedTeal, fontWeight: '600', background: '#F0FDFA', padding: '2px 6px', borderRadius: '4px' },
  emptyText: { padding: '20px', textAlign: 'center', color: COLORS.textSecondary, fontStyle: 'italic' }
};