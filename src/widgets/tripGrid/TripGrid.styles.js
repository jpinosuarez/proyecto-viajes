import { COLORS } from '@shared/config';

export const styles = {
  searchMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '8px 12px',
    backgroundColor: COLORS.slate50,
    borderRadius: '12px',
    fontSize: '0.875rem',
    color: COLORS.charcoalBlue,
    fontWeight: '500'
  },
  clearSearchButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: COLORS.orangeAtomic,
    fontWeight: '600',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'background-color 0.2s ease',
    fontSize: '0.875rem',
    minHeight: '44px',
    minWidth: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  masonryItem: {
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: COLORS.white,
    marginBottom: '16px'
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '120px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '12px',
    zIndex: 2
  },
  miniBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    transition: 'background-color 0.2s ease',
    minHeight: '44px',
    minWidth: '44px'
  },
  bottomContentGlass: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '12px',
    background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
    backdropFilter: 'blur(8px)',
    zIndex: 1
  },
  bottomContentSolid: (bgColor) => ({
    padding: '12px',
    backgroundColor: bgColor,
    color: COLORS.white
  }),
  metaRow: (isPhoto) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: isPhoto ? 'rgba(255,255,255,0.9)' : COLORS.charcoalBlue,
    marginTop: '8px'
  }),
  emptyStatePrimary: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '16px'
  },
  emptyIconPrimary: {
    color: COLORS.mutedTeal,
    marginBottom: '16px'
  },
  emptyTitlePrimary: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: COLORS.charcoalBlue,
    marginBottom: '8px'
  },
  emptyTextPrimary: {
    fontSize: '0.875rem',
    color: COLORS.slate600,
    marginBottom: '24px',
    maxWidth: '280px'
  },
  emptyActionPrimary: {
    backgroundColor: COLORS.orangeAtomic,
    color: COLORS.white,
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    minHeight: '44px'
  },
  emptyState: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    textAlign: 'center',
    backgroundColor: COLORS.white,
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '16px'
  },
  emptyIcon: {
    color: COLORS.slate500,
    marginBottom: '12px'
  },
  emptyTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: COLORS.charcoalBlue,
    marginBottom: '4px'
  },
  emptyText: {
    fontSize: '0.875rem',
    color: COLORS.slate600,
    marginBottom: '16px',
    maxWidth: '280px'
  },
  emptyAction: {
    backgroundColor: COLORS.mutedTeal,
    color: COLORS.white,
    border: 'none',
    borderRadius: '12px',
    padding: '10px 20px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    minHeight: '44px'
  }
};