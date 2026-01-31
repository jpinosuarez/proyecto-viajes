import { COLORS } from '../../theme';

export const styles = {
  dashboardContainer: {
    width: '100%',
    maxWidth: '1200px', // Limitar ancho en pantallas gigantes
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    paddingBottom: '40px'
  },
  header: {
    marginBottom: '10px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '900',
    color: COLORS.charcoalBlue,
    margin: 0
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    marginTop: '5px'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr', // Asimetría para interés visual
    gap: '30px',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr'
    }
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  mapTeaser: {
    height: '200px',
    borderRadius: '24px',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    ':hover': { transform: 'scale(1.01)' }
  },
  mapOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to right, rgba(44, 62, 80, 0.9), rgba(44, 62, 80, 0.4))'
  },
  mapContent: {
    position: 'relative', zIndex: 2, padding: '30px', height: '100%',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    color: 'white'
  },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: '1.1rem', fontWeight: '800', color: COLORS.charcoalBlue,
    '& button': {
        background: 'none', border:'none', color: COLORS.atomicTangerine, 
        fontWeight:'700', cursor:'pointer'
    }
  },
  cardsContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: {
    display: 'flex', alignItems: 'center', gap: '15px',
    background: 'white', padding: '15px', borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)',
    cursor: 'pointer', transition: 'transform 0.2s',
    ':hover': { transform: 'translateX(5px)' }
  },
  cardImage: (img) => ({
    width: '70px', height: '70px', borderRadius: '14px',
    backgroundImage: img ? `url(${img})` : 'none',
    backgroundColor: COLORS.charcoalBlue,
    backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }),
  cardContent: { display: 'flex', flexDirection: 'column', gap: '4px' },
  tag: { fontSize: '0.7rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', width: 'fit-content', color: COLORS.mutedTeal, fontWeight:'700' },
  emptyState: { padding: '30px', textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: '20px' }
};