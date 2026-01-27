import { COLORS } from '../../theme';

export const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000,
    backdropFilter: 'blur(8px)',
  },
  modalContent: {
    backgroundColor: COLORS.linen,
    width: '480px',
    height: '80vh', // Altura fija para que el scroll interno funcione
    borderRadius: '28px',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  titulo: {
    margin: 0,
    color: COLORS.charcoalBlue,
    fontWeight: '800',
    fontSize: '1.4rem',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(44, 62, 80, 0.05)',
    padding: '16px',
    borderRadius: '16px',
    marginBottom: '20px',
    border: '1px solid rgba(44, 62, 80, 0.1)',
  },
  inputStyle: {
    border: 'none',
    background: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '1rem',
    color: COLORS.charcoalBlue,
    fontWeight: '500',
  },
  listaContainer: {
    overflowY: 'auto', // Permite ver todos los países
    flex: 1,
    paddingRight: '8px',
  },
  paisItem: (isVisited) => ({
    padding: '14px 16px',
    borderRadius: '14px',
    cursor: isVisited ? 'default' : 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    marginBottom: '6px',
    backgroundColor: 'white',
    border: '1px solid rgba(44, 62, 80, 0.05)',
  }),
  paisInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  nombrePais: {
    fontWeight: '600',
    color: COLORS.charcoalBlue,
  },
  badgeVisitado: {
    color: COLORS.mutedTeal,
    fontSize: '0.7rem',
    fontWeight: '800',
    backgroundColor: `${COLORS.mutedTeal}15`,
    padding: '4px 8px',
    borderRadius: '6px',
  }
};