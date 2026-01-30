import { COLORS } from '../../theme';

export const styles = {
  // Masonry Layout Real usando Columnas CSS
  masonryContainer: {
    columnCount: 4, // 4 Columnas en escritorio
    columnGap: '20px',
    padding: '20px',
    '@media (max-width: 1200px)': { columnCount: 3 },
    '@media (max-width: 800px)': { columnCount: 2 },
    '@media (max-width: 500px)': { columnCount: 1 }
  },
  masonryItem: {
    breakInside: 'avoid', // Evita que la tarjeta se parta entre columnas
    marginBottom: '20px',
    borderRadius: '20px',
    backgroundColor: 'white',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    ':hover': { transform: 'translateY(-5px)' }
  },
  // Imagen Full Bleed (Ocupa todo)
  cardConFoto: (foto) => ({
    backgroundImage: `url(${foto})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white'
  }),
  topGradient: {
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)'
  },
  miniBtn: {
    background: 'rgba(255,255,255,0.25)',
    border: 'none',
    borderRadius: '50%',
    width: '28px', height: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)'
  },
  bottomContentGlass: {
    padding: '15px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
    marginTop: 'auto'
  },
  bottomContentSolid: (color) => ({
    padding: '15px',
    borderTop: `4px solid ${color}`,
    backgroundColor: 'white',
    marginTop: 'auto'
  }),
  regionTag: (color) => ({
    margin: 0,
    color: color,
    fontSize: '0.6rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }),
  metaRow: (isDark) => ({
    display: 'flex', gap: '12px', alignItems: 'center',
    fontSize: '0.7rem',
    color: isDark ? 'rgba(255,255,255,0.8)' : '#94a3b8',
    fontWeight: '600'
  })
};