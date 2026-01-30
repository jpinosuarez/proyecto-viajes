import { COLORS } from '../../theme';

export const styles = {
  expandedOverlay: { 
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
    backgroundColor: '#fff', zIndex: 10000, overflowY: 'auto' 
  },
  expandedHeader: (foto) => ({ 
    height: '50vh', width: '100%', position: 'relative', 
    backgroundImage: foto ? `url(${foto})` : 'none', 
    backgroundColor: COLORS.charcoalBlue, 
    backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
  }),
  fotoOverlay: { 
    position: 'absolute', inset: 0, 
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))' 
  },
  navBar: {
    position: 'absolute', top: 30, left: 30, right: 30,
    display: 'flex', justifyContent: 'space-between', zIndex: 10
  },
  backBtn: { background: 'rgba(255,255,255,0.2)', border:'none', borderRadius:'50%', padding:'10px', color:'white', cursor:'pointer', backdropFilter:'blur(5px)' },
  editBtnInmersive: { background: 'white', border:'none', borderRadius:'20px', padding:'8px 16px', color: COLORS.charcoalBlue, fontWeight:'700', cursor:'pointer', display:'flex', gap:'6px', alignItems:'center' },
  
  headerContent: {
    position: 'relative', zIndex: 5, padding: '0 40px 40px', maxWidth: '1000px', margin: '0 auto', width: '100%'
  },
  titleDisplay: { color: 'white', fontSize: '3.5rem', fontWeight: '900', margin: '10px 0', lineHeight: 1 },
  titleInput: { fontSize: '3rem', fontWeight: '900', background: 'transparent', border: 'none', borderBottom: '2px solid white', color: 'white', width: '100%', outline: 'none' },
  metaBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '8px', color: 'white', fontSize: '0.9rem', backdropFilter: 'blur(4px)' },
  creditBox: { position: 'absolute', bottom: 20, right: 20, color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', zIndex: 5, display:'flex', gap:'5px', alignItems:'center' },

  bodyContent: {
    maxWidth: '1000px', margin: '0 auto', padding: '60px 40px',
    display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px'
  },
  sectionTitle: { fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', color: COLORS.mutedTeal, marginBottom: '20px', fontWeight: '800' },
  readText: { fontSize: '1.2rem', lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-wrap' },
  
  // Timeline Styles
  timeline: { borderLeft: `2px solid #e2e8f0`, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '30px' },
  timelineItem: { position: 'relative' },
  timelineDot: { position: 'absolute', left: '-26px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', background: COLORS.atomicTangerine, border: '2px solid white' },
  stopCard: { background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9' },
  weatherTag: { fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontStyle: 'italic' }
};