import { COLORS } from '../../theme';

export const styles = {
  modalOverlay: { 
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
    backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 9999, 
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '20px'
  },
  modalContent: { 
    backgroundColor: COLORS.linen, width: '100%', maxWidth: '800px', maxHeight: '90vh', 
    borderRadius: '32px', display: 'flex', flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.5)',
    overflow: 'hidden' // Importante para que el header no se vaya con el scroll
  },
  modalHeader: { padding: '30px 40px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' },
  scrollArea: { padding: '30px 40px', overflowY: 'auto' },
  footer: { padding: '20px 40px 30px', display: 'flex', justifyContent: 'flex-end', gap: '20px', borderTop: '1px solid rgba(0,0,0,0.05)' },
  closeBtn: { background: 'rgba(44, 62, 80, 0.1)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  formSection: { marginBottom: '30px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  formRow: { display: 'flex', gap: '25px', alignItems: 'flex-start' },
  inputGroup: { flex: 1, display: 'flex', flexDirection: 'column' },
  label: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '800', color: COLORS.charcoalBlue, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 },
  input: { width: '100%', border: '1px solid rgba(44, 62, 80, 0.1)', borderRadius: '14px', padding: '12px 16px', fontSize: '0.95rem', outline: 'none', backgroundColor: '#fff', color: COLORS.charcoalBlue, boxSizing: 'border-box' },
  uploadLabel: (foto) => ({ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '200px', backgroundColor: foto ? 'transparent' : '#fff', backgroundImage: foto ? `url(${foto})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', border: foto ? 'none' : `2px dashed ${COLORS.atomicTangerine}40`, borderRadius: '24px', cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'all 0.3s ease' }),
  textarea: { width: '100%', minHeight: '150px', border: '1px solid rgba(44, 62, 80, 0.1)', borderRadius: '18px', padding: '20px', fontSize: '1.1rem', resize: 'none', outline: 'none', backgroundColor: '#fff', color: COLORS.charcoalBlue, lineHeight: '1.6', fontFamily: '"Georgia", serif', boxSizing: 'border-box' },
  saveBtn: { backgroundColor: COLORS.atomicTangerine, color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '16px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' },
};