import { COLORS } from '../../theme';

export const styles = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modal: { backgroundColor: '#fff', width: '500px', maxWidth: '90%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '85vh' },
  
  header: (img) => ({
    height: '180px', position: 'relative',
    backgroundImage: img ? `url(${img})` : 'none',
    backgroundColor: COLORS.charcoalBlue,
    backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', alignItems: 'flex-end', padding: '20px'
  }),
  headerOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' },
  headerContent: { position: 'relative', zIndex: 10, width: '100%' },
  flag: { fontSize: '2rem', display: 'block', marginBottom: '5px' },
  titleInput: { 
    fontSize: '1.8rem', fontWeight: '800', color: 'white', 
    background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)',
    width: '100%', outline: 'none', paddingBottom: '5px'
  },
  
  cameraBtn: {
    position: 'absolute', top: 15, right: 15, zIndex: 20,
    background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '50%',
    color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)'
  },

  body: { padding: '30px', overflowY: 'auto' },
  section: { marginBottom: '25px' },
  label: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', color: COLORS.mutedTeal, textTransform: 'uppercase', marginBottom: '10px' },
  
  // Custom Date Input Style via CSS
  dateInput: {
    padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
    fontFamily: 'inherit', fontSize: '0.95rem', color: COLORS.charcoalBlue,
    outline: 'none', background: '#f8fafc',
    cursor: 'pointer'
  },
  row: { display: 'flex', alignItems: 'center', gap: '15px' },

  // Cities Styles
  cityList: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' },
  cityTag: { background: '#f1f5f9', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', color: COLORS.charcoalBlue, display: 'flex', alignItems: 'center', gap: '6px' },
  deleteCityBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' },
  addCityRow: { display: 'flex', gap: '10px' },
  cityInput: { flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' },
  addBtn: { background: COLORS.atomicTangerine, color: 'white', border: 'none', borderRadius: '10px', width: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  textarea: { width: '100%', minHeight: '100px', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'inherit', resize: 'vertical' },

  footer: { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' },
  cancelBtn: { padding: '12px 20px', borderRadius: '12px', border: 'none', background: '#f1f5f9', color: '#64748b', fontWeight: '700', cursor: 'pointer' },
  saveBtn: { padding: '12px 24px', borderRadius: '12px', border: 'none', background: COLORS.charcoalBlue, color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }
};