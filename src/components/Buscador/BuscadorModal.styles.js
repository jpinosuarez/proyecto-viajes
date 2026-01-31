import { COLORS } from '../../theme';

export const styles = {
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(44, 62, 80, 0.4)', backdropFilter: 'blur(4px)',
    zIndex: 2000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '100px'
  },
  modalContent: {
    width: '500px', maxWidth: '90%',
    backgroundColor: 'white', borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.1)', overflow: 'hidden'
  },
  header: { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { margin: 0, fontSize: '1.1rem', color: COLORS.charcoalBlue, fontWeight: '800' },
  
  searchBox: {
    margin: '0 20px 10px', padding: '12px 16px',
    backgroundColor: '#F8FAFC', borderRadius: '12px', border: `1px solid ${COLORS.border}`,
    display: 'flex', alignItems: 'center', gap: '10px'
  },
  inputStyle: { border: 'none', background: 'transparent', fontSize: '1rem', width: '100%', outline: 'none', color: COLORS.charcoalBlue },
  
  listaContainer: { maxHeight: '300px', overflowY: 'auto' },
  
  tagBtn: {
    background: 'white', border: `1px solid ${COLORS.border}`, padding: '8px 12px',
    borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem', color: COLORS.charcoalBlue,
    display: 'flex', alignItems: 'center', gap: '6px',
    transition: 'all 0.2s',
    ':hover': { borderColor: COLORS.atomicTangerine, color: COLORS.atomicTangerine }
  },

  resultItem: {
    padding: '12px 20px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '15px',
    transition: 'background 0.1s',
    position: 'relative',
    ':hover': { backgroundColor: '#F8FAFC' }
  },
  iconBox: (isCountry) => ({
    width: '36px', height: '36px', borderRadius: '10px',
    backgroundColor: isCountry ? `${COLORS.atomicTangerine}15` : `${COLORS.mutedTeal}15`,
    color: isCountry ? COLORS.atomicTangerine : COLORS.mutedTeal,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }),
  nombrePais: { fontWeight: '700', color: COLORS.charcoalBlue, display: 'block' },
  subtext: { fontSize: '0.8rem', color: '#94a3b8' },
  
  addLabel: {
    position: 'absolute', right: '20px',
    fontSize: '0.8rem', fontWeight: '700', color: COLORS.mutedTeal,
    display: 'none', alignItems: 'center', gap: '4px',
    // Se muestra vía hover en CSS o lógica de JS si se usa styled-components real, 
    // aquí simulado o dependiente del hover del padre
  }
};