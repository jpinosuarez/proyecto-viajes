import { COLORS } from '../../theme';

export const styles = {
  searchMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '10px 25px 0',
    color: '#64748b',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  clearSearchButton: {
    border: 'none',
    background: 'none',
    color: COLORS.atomicTangerine,
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.85rem'
  },
  masonryContainer: {
    columnCount: 4,
    columnGap: '20px',
    padding: '20px'
  },
  masonryItem: {
    breakInside: 'avoid',
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
    justifyContent: 'space-between'
  },
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
  metaRow: (isDark) => ({
    display: 'flex', gap: '12px', alignItems: 'center',
    fontSize: '0.7rem',
    color: isDark ? 'rgba(255,255,255,0.8)' : '#94a3b8',
    fontWeight: '600'
  }),
  emptyState: {
    background: 'white',
    border: '1px dashed #e2e8f0',
    borderRadius: '20px',
    padding: '32px',
    textAlign: 'center',
    color: COLORS.charcoalBlue,
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    columnSpan: 'all'
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: '#f1f5f9',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    marginBottom: '12px'
  },
  emptyTitle: {
    margin: '0 0 6px',
    fontSize: '1rem',
    fontWeight: '800'
  },
  emptyText: {
    margin: 0,
    color: '#64748b',
    fontSize: '0.85rem'
  },
  emptyAction: {
    marginTop: '14px',
    border: 'none',
    background: COLORS.atomicTangerine,
    color: COLORS.linen,
    padding: '8px 14px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  emptyStatePrimary: {
    background: `linear-gradient(155deg, ${COLORS.linen} 0%, #ffffff 65%)`,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '20px',
    padding: '38px 26px',
    textAlign: 'center',
    color: COLORS.charcoalBlue,
    boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
    columnSpan: 'all'
  },
  emptyIconPrimary: {
    width: '72px',
    height: '72px',
    borderRadius: '18px',
    background: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.atomicTangerine,
    marginBottom: '14px',
    border: `1px solid ${COLORS.border}`
  },
  emptyTitlePrimary: {
    margin: '0 0 8px',
    fontSize: '1.2rem',
    fontWeight: '900'
  },
  emptyTextPrimary: {
    margin: '0 auto',
    color: COLORS.textSecondary,
    fontSize: '0.9rem',
    lineHeight: 1.5,
    maxWidth: '480px'
  },
  emptyActionPrimary: {
    marginTop: '16px',
    border: 'none',
    background: COLORS.atomicTangerine,
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '12px',
    fontWeight: '800',
    cursor: 'pointer'
  }
};
