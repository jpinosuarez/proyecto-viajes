import { COLORS, SHADOWS, RADIUS } from '@shared/config';

export const tripStyles = {
  cardBase: (isMobile, variant) => {
    const isGrid = variant === 'grid';
    return {
      position: 'relative',
      minWidth: isGrid ? 'auto' : (isMobile ? undefined : '160px'),
      width: isGrid ? '100%' : (isMobile ? '100%' : '160px'),
      height: isGrid ? '260px' : '208px', // Slightly taller for masonry/grid if needed
      borderRadius: isMobile ? RADIUS.lg : RADIUS.xl,
      overflow: 'hidden',
      cursor: 'pointer',
      flexShrink: isGrid || isMobile ? undefined : 0,
      boxShadow: SHADOWS.md,
      backgroundColor: COLORS.surface,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end', // pushes content to bottom
    };
  },

  bgImage: (url) => ({
    position: 'absolute',
    inset: 0,
    backgroundImage: url ? `url(${url})` : 'none',
    backgroundColor: url ? 'transparent' : COLORS.mutedTeal,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  }),

  // Subtle glassmorphic shelf at the bottom
  glassShelf: {
    position: 'relative',
    zIndex: 2,
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
    backdropFilter: 'blur(4px)',
    padding: '32px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  flagsRow: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 2,
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  flagImg: {
    width: '28px',
    height: '20px',
    objectFit: 'cover',
    borderRadius: RADIUS.xs,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },

  actionBtn: {
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(4px)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
    marginLeft: '4px',
    transition: 'background-color 0.2s',
  },

  title: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '800',
    color: 'white',
    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.2,
  },

  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.75rem',
    fontWeight: '600',
  },

  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};
