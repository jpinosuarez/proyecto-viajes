import { COLORS } from '../../theme';

export const styles = {
  expandedOverlay: { 
    position: 'fixed', inset: 0, backgroundColor: '#fff', zIndex: 10000, overflowY: 'auto' 
  },
  expandedHeader: (foto) => ({ 
    height: '45vh', width: '100%', position: 'relative', 
    backgroundImage: foto ? `url(${foto})` : 'none', 
    backgroundColor: COLORS.charcoalBlue, 
    backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
  }),
  fotoOverlay: { 
    position: 'absolute', inset: 0, 
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6) 80%, rgba(255,255,255,1))' 
  },
  navBar: {
    position: 'absolute', top: 20, left: 20, right: 20,
    display: 'flex', justifyContent: 'space-between', zIndex: 20
  },
  iconBtn: { background: 'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', color: COLORS.charcoalBlue, cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' },
  
  primaryBtn: (isSave) => ({
    background: isSave ? COLORS.mutedTeal : 'white', 
    color: isSave ? 'white' : COLORS.charcoalBlue,
    border: 'none', borderRadius: '50px', padding: '10px 20px', 
    fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }),
  secondaryBtn: {
    background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 20px', 
    fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', backdropFilter:'blur(4px)'
  },
  addStopBtn: {
    background: COLORS.atomicTangerine, color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },

  headerContent: {
    position: 'relative', zIndex: 10, padding: '0 40px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%'
  },
  titleDisplay: { color: COLORS.charcoalBlue, fontSize: '3rem', fontWeight: '900', margin: '10px 0', lineHeight: 1, textShadow: '0 2px 10px rgba(255,255,255,0.5)' },
  titleInput: { fontSize: '2.5rem', fontWeight: '900', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius:'10px', padding:'10px', color: COLORS.charcoalBlue, width: '100%', outline: 'none' },
  metaBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: COLORS.charcoalBlue, padding: '6px 12px', borderRadius: '8px', color: 'white', fontSize: '0.8rem', fontWeight:'600' },
  creditBox: { position: 'absolute', bottom: 10, right: 10, color: 'rgba(0,0,0,0.5)', fontSize: '0.7rem', zIndex: 10, display:'flex', gap:'5px', alignItems:'center' },

  bodyContent: {
    maxWidth: '1000px', margin: '0 auto', padding: '40px',
    display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '60px',
    '@media (max-width: 768px)': { gridTemplateColumns: '1fr', gap: '30px', padding: '20px' }
  },
  sectionTitle: { fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: COLORS.mutedTeal, marginBottom: '20px', fontWeight: '800' },
  readText: { fontSize: '1.1rem', lineHeight: 1.7, color: COLORS.charcoalBlue, whiteSpace: 'pre-wrap' },
  textArea: { width: '100%', minHeight: '300px', padding: '20px', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '1rem', lineHeight: 1.6, fontFamily: 'inherit', resize: 'vertical', outline: 'none', ':focus': { borderColor: COLORS.atomicTangerine } },

  timeline: { borderLeft: `2px solid #e2e8f0`, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  timelineItem: { position: 'relative' },
  timelineDot: { position: 'absolute', left: '-25px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', background: COLORS.atomicTangerine, border: '2px solid white' },
  stopCard: { background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' },
  weatherTag: { fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', width: 'fit-content' },
  emptyState: { color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }
};