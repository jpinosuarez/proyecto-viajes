import { COLORS, SHADOWS, RADIUS } from '../../theme';

export const styles = {
  overlay: (isMobile) => ({
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)',
    zIndex: 2000, display: 'flex', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'center',
    padding: isMobile ? 0 : '20px'
  }),
  modal: (isMobile) => ({
    width: isMobile ? '100%' : 'min(600px, 100%)',
    maxWidth: '100%',
    maxHeight: isMobile ? '100vh' : '90vh',
    backgroundColor: 'white',
    borderRadius: isMobile ? 0 : RADIUS.lg,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: SHADOWS.float
  }),
  header: (img, isMobile) => ({
    height: isMobile ? '160px' : '180px', position: 'relative',
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
  titleInputAutoPulse: {
    fontSize: '1.5rem', fontWeight: '800', color: 'white',
    background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.6)',
    width: '100%', outline: 'none', paddingBottom: '4px',
    boxShadow: '0 6px 18px rgba(255,255,255,0.2)'
  },
  autoBadge: (isAuto) => ({
    fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.5px',
    background: isAuto ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
    color: 'white',
    padding: '4px 8px', borderRadius: '999px', textTransform: 'uppercase',
    border: '1px solid rgba(255,255,255,0.2)',
    cursor: 'pointer'
  }),
  cameraBtn: (disabled = false) => ({
    position: 'absolute', top: '15px', right: '15px', zIndex: 10,
    background: 'rgba(0,0,0,0.4)', color: 'white',
    padding: '8px', borderRadius: '50%', cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', backdropFilter: 'blur(4px)',
    opacity: disabled ? 0.6 : 1
  }),
  processingBadge: {
    position: 'absolute', top: '18px', right: '64px', zIndex: 10,
    background: 'rgba(0,0,0,0.55)', color: 'white', borderRadius: '999px',
    padding: '6px 10px', fontSize: '0.75rem', fontWeight: '700',
    display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)'
  },
  body: { padding: '25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 },
  section: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.8rem', fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', display:'flex', alignItems:'center', gap:'6px' },
  row: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
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
  inlineError: {
    fontSize: '0.8rem', fontWeight: '600', color: '#b91c1c'
  },
  footer: {
    borderTop: `1px solid ${COLORS.border}`, padding: '20px',
    display: 'flex', justifyContent: 'flex-end', gap: '10px'
  },
  cancelBtn: (disabled = false) => ({
    background: 'transparent', border: 'none', color: COLORS.textSecondary,
    fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer', padding: '10px 20px',
    opacity: disabled ? 0.6 : 1
  }),
  saveBtn: (disabled = false) => ({
    background: COLORS.atomicTangerine, color: 'white', border: 'none',
    padding: '10px 24px', borderRadius: '30px', fontWeight: '700',
    cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: SHADOWS.sm, opacity: disabled ? 0.7 : 1
  })
};
