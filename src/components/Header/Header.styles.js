// src/components/Header/Header.styles.js
import { COLORS } from '../../theme';

export const styles = {
  header: {
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  leftSide: { display: 'flex', alignItems: 'center', gap: '10px' },
  breadcrumb: { color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' },
  separator: { color: '#94a3b8', opacity: 0.5 },
  titulo: { 
    fontSize: '1.2rem', 
    color: COLORS.charcoalBlue, 
    fontWeight: '800', 
    margin: 0,
    letterSpacing: '-0.5px' 
  },
  rightSide: { display: 'flex', alignItems: 'center', gap: '20px' },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(0,0,0,0.04)',
    padding: '8px 15px',
    borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.02)'
  },
  searchInput: { border: 'none', background: 'none', outline: 'none', fontSize: '0.85rem', color: COLORS.charcoalBlue },
  addButton: {
    backgroundColor: COLORS.atomicTangerine,
    color: COLORS.linen,
    border: 'none',
    padding: '10px 20px',
    borderRadius: '12px',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: `0 4px 12px ${COLORS.atomicTangerine}40`
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: COLORS.sandyBrown,
    border: '2px solid white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  }
};