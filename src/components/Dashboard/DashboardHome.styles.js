import { COLORS, SHADOWS, RADIUS } from '../../theme';

export const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 20px 20px 0', // Padding derecho e inferior
    boxSizing: 'border-box',
    overflow: 'hidden' // ZERO SCROLL POLICY
  },
  welcomeArea: {
    marginBottom: '20px',
    flexShrink: 0
  },
  title: { fontSize: '1.8rem', fontWeight: '900', color: COLORS.charcoalBlue, margin: 0 },
  subtitle: { fontSize: '1rem', color: COLORS.textSecondary },

  // BENTO GRID PRINCIPAL
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr', // Mapa grande | Lateral
    gridTemplateRows: '1fr 1fr',    // Filas automáticas
    gap: '20px',
    flex: 1,
    minHeight: 0 // Importante para que el grid no desborde
  },

  // 1. MAPA CARD (Ocupa columna izq completa)
  mapCard: {
    gridColumn: '1 / 2',
    gridRow: '1 / 3',
    backgroundColor: 'white',
    borderRadius: RADIUS.lg,
    boxShadow: SHADOWS.md,
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  mapHeader: {
    position: 'absolute', top: 20, left: 20, zIndex: 10,
    background: 'rgba(255,255,255,0.9)', padding: '10px 15px',
    borderRadius: RADIUS.md, backdropFilter: 'blur(4px)',
    boxShadow: SHADOWS.sm
  },
  cardTitle: { display: 'block', fontSize: '0.8rem', fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase' },
  cardValue: { fontSize: '1.5rem', fontWeight: '900', color: COLORS.charcoalBlue },

  // 2. STATS COLUMN (Arriba derecha)
  statsColumn: {
    gridColumn: '2 / 3',
    gridRow: '1 / 2',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Dos stats lado a lado
    gap: '15px'
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: RADIUS.lg,
    padding: '20px',
    boxShadow: SHADOWS.sm,
    border: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '10px'
  },
  iconBox: (color) => ({
    width: '40px', height: '40px', borderRadius: '10px',
    backgroundColor: `${color}15`, color: color,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }),
  statLabel: { fontSize: '0.8rem', color: COLORS.textSecondary, fontWeight: '600' },
  statNumber: { fontSize: '1.8rem', fontWeight: '800', color: COLORS.charcoalBlue, lineHeight: 1 },

  // 3. RECIENTES (Abajo derecha)
  recentCard: {
    gridColumn: '2 / 3',
    gridRow: '2 / 3',
    backgroundColor: 'white',
    borderRadius: RADIUS.lg,
    padding: '20px',
    boxShadow: SHADOWS.sm,
    border: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  list: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' },
  listItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px', borderRadius: RADIUS.md,
    cursor: 'pointer', transition: 'background 0.2s',
    ':hover': { backgroundColor: '#F8FAFC' }
  },
  listIcon: { fontSize: '1.2rem', width: '30px', textAlign: 'center' },
  listTitle: { display: 'block', fontWeight: '700', fontSize: '0.9rem', color: COLORS.charcoalBlue },
  listDate: { display: 'block', fontSize: '0.75rem', color: COLORS.textSecondary },
  linkBtn: { background: 'none', border:'none', color: COLORS.atomicTangerine, fontWeight:'700', cursor:'pointer', fontSize:'0.85rem' }
};