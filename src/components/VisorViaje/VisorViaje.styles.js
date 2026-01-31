import { COLORS } from '../../theme';

export const styles = {
  expandedOverlay: { 
    position: 'fixed', inset: 0, backgroundColor: '#fff', zIndex: 10000, overflowY: 'auto' 
  },
  expandedHeader: (foto) => ({ 
    height: '50vh', width: '100%', position: 'relative', 
    backgroundImage: foto ? `url(${foto})` : 'none', 
    backgroundColor: COLORS.charcoalBlue, 
    backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
  }),
  // Gradiente más fuerte para legibilidad
  fotoOverlay: { 
    position: 'absolute', inset: 0, 
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9))' 
  },
  navBar: {
    position: 'absolute', top: 20, left: 20, right: 20,
    display: 'flex', justifyContent: 'space-between', zIndex: 20
  },
  iconBtn: { 
    background: 'rgba(255,255,255,0.2)', border:'none', borderRadius:'50%', width:'40px', height:'40px', 
    display:'flex', alignItems:'center', justifyContent:'center', color: 'white', cursor:'pointer', backdropFilter:'blur(10px)' 
  },
  primaryBtn: (isSave) => ({
    background: isSave ? COLORS.atomicTangerine : 'white', 
    color: isSave ? 'white' : COLORS.charcoalBlue,
    border: 'none', borderRadius: '50px', padding: '10px 20px', 
    fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center'
  }),
  secondaryBtn: {
    background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width:'40px', height:'40px',
    display: 'flex', alignItems:'center', justifyContent:'center', cursor: 'pointer', backdropFilter:'blur(10px)'
  },
  headerContent: {
    position: 'relative', zIndex: 10, padding: '0 40px 40px', maxWidth: '1000px', margin: '0 auto', width: '100%'
  },
  flagIcon: { fontSize: '3rem', textShadow: '0 4px 10px rgba(0,0,0,0.3)' },
  titleDisplay: { 
    color: 'white', fontSize: '3.5rem', fontWeight: '900', margin: '10px 0', lineHeight: 1.1,
    textShadow: '0 4px 20px rgba(0,0,0,0.5)' 
  },
  titleInput: { 
    fontSize: '2.5rem', fontWeight: '900', background: 'rgba(255,255,255,0.1)', border: 'none', 
    borderBottom: '2px solid white', color: 'white', width: '100%', outline: 'none' 
  },
  metaBadge: { 
    display: 'inline-flex', alignItems: 'center', gap: '6px', 
    background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '8px', 
    color: 'white', fontSize: '0.9rem', fontWeight:'600', backdropFilter:'blur(5px)' 
  },
  
  bodyContent: {
    maxWidth: '1000px', margin: '0 auto', padding: '40px',
    display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '60px',
    '@media (max-width: 900px)': { gridTemplateColumns: '1fr', gap: '30px' }
  },
  mainColumn: { display: 'flex', flexDirection: 'column' },
  sectionTitle: { 
    fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', 
    color: COLORS.mutedTeal, marginBottom: '15px', fontWeight: '800' 
  },
  readText: { fontSize: '1.1rem', lineHeight: 1.7, color: COLORS.charcoalBlue, whiteSpace: 'pre-wrap' },
  textArea: { 
    width: '100%', minHeight: '200px', padding: '20px', borderRadius: '16px', 
    border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none',
    ':focus': { borderColor: COLORS.atomicTangerine } 
  },
  
  timeline: { borderLeft: `2px solid #e2e8f0`, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  timelineItem: { position: 'relative' },
  timelineDot: { position: 'absolute', left: '-25px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', background: COLORS.atomicTangerine, border: '2px solid white' },
  stopCard: { background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' },
  emptyState: { fontStyle: 'italic', color: '#94a3b8' }
};