import { COLORS, SHADOWS, RADIUS } from '../../theme';

export const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)',
    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  modal: {
    width: '600px', maxWidth: '90%', maxHeight: '90vh',
    backgroundColor: 'white', borderRadius: RADIUS.lg,
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    boxShadow: SHADOWS.float
  },
  header: (img) => ({
    height: '180px', position: 'relative',
    backgroundImage: img ? `url(${img})` : 'none',
    backgroundColor: COLORS.charcoalBlue,
    backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
  }),
  headerOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
  },
  headerContent: {
    position: 'relative', zIndex: 2, padding: '20px',
    display: 'flex', alignItems: 'center', gap: '15px'
  },
  // ESTILO NUEVO PARA LA BANDERA IMG
  flagImg: {
    width: '50px', height: 'auto', borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    border: '2px solid rgba(255,255,255,0.3)'
  },
  titleInput: {
    fontSize: '1.5rem', fontWeight: '800', color: 'white',
    background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)',
    width: '100%', outline: 'none', paddingBottom: '4px'
  },
  cameraBtn: {
    position: 'absolute', top: '15px', right: '15px', zIndex: 10,
    background: 'rgba(0,0,0,0.4)', color: 'white',
    padding: '8px', borderRadius: '50%', cursor: 'pointer',
    display: 'flex', alignItems: 'center', backdropFilter: 'blur(4px)'
  },
  body: { padding: '25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  section: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.8rem', fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', display:'flex', alignItems:'center', gap:'6px' },
  row: { display: 'flex', alignItems: 'center', gap: '10px' },
  dateInput: {
    border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm,
    padding: '10px', fontSize: '0.9rem', color: COLORS.charcoalBlue,
    outline: 'none', background: '#F8FAFC'
  },
  textarea: {
    width: '100%', minHeight: '100px', padding: '12px',
    border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm,
    resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem',
    outline: 'none'
  },
  footer: {
    borderTop: `1px solid ${COLORS.border}`, padding: '20px',
    display: 'flex', justifyContent: 'flex-end', gap: '10px'
  },
  cancelBtn: {
    background: 'transparent', border: 'none', color: COLORS.textSecondary,
    fontWeight: '600', cursor: 'pointer', padding: '10px 20px'
  },
  saveBtn: {
    background: COLORS.atomicTangerine, color: 'white', border: 'none',
    padding: '10px 24px', borderRadius: '30px', fontWeight: '700',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: SHADOWS.sm
  }
};