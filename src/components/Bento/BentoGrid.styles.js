import { COLORS } from '../../theme';

export const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gridAutoFlow: 'dense',
    gap: '30px',
    padding: '30px',
  },
  actionBtn: { background: 'white', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: COLORS.charcoalBlue, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  btnNavFoto: { background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: 'white', backdropFilter: 'blur(10px)' },
  fotoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)', zIndex: 1 },
  fullWidthGlass: { background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15, 23, 42, 0.9) 100%)', backdropFilter: 'blur(10px)', padding: '30px 20px', width: '100%', boxSizing: 'border-box' },
  badge: { padding: '5px 12px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '0.05em' },

  expandedOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: COLORS.linen, zIndex: 10000, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  expandedHeader: (foto) => ({ height: '60vh', width: '100%', position: 'relative', backgroundImage: foto ? `url(${foto})` : 'none', backgroundColor: !foto ? COLORS.charcoalBlue : 'transparent', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', boxSizing: 'border-box' }),
  backBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', padding: '12px', borderRadius: '50%', color: 'white', cursor: 'pointer', backdropFilter: 'blur(10px)' },
  
  editBtnInmersive: { background: COLORS.atomicTangerine, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
  saveBtnInmersive: { background: '#2C3E50', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
  cancelBtnInmersive: { background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '12px 24px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', backdropFilter: 'blur(10px)' },
  
  infoBar: { display: 'flex', justifyContent: 'center', gap: '60px', padding: '30px 60px', backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', width: 'fit-content', margin: '-50px auto 50px', zIndex: 110, border: '1px solid rgba(0,0,0,0.02)' },
  infoItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  infoLabel: { fontSize: '0.6rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' },
  
  miniInput: { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', fontSize: '0.85rem', fontWeight: '600', color: COLORS.charcoalBlue, outline: 'none', textAlign: 'center', width: '120px' },
  inmersiveTextarea: { width: '100%', minHeight: '350px', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px', fontSize: '1.15rem', lineHeight: '1.7', color: COLORS.charcoalBlue, backgroundColor: 'white', outline: 'none', resize: 'none' },
  readText: { fontSize: '1.2rem', lineHeight: '1.8', color: COLORS.charcoalBlue, whiteSpace: 'pre-wrap' },
  
  hybridBody: { maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 40px 100px', display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '80px', boxSizing: 'border-box' },
  sectionTitle: { fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', color: COLORS.mutedTeal, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' },
  highlightCard: { backgroundColor: '#fff', padding: '24px', borderRadius: '20px', marginBottom: '20px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '2px' },
  cameraLabel: { cursor: 'pointer', color: 'white', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(0,0,0,0.3)', padding: '15px 25px', borderRadius: '14px', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.2)' }
};