import { COLORS } from '../../theme';

export const styles = {
  expandedOverlay: { 
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
    backgroundColor: COLORS.linen, zIndex: 10000, overflowY: 'auto', 
    display: 'flex', flexDirection: 'column' 
  },
  expandedHeader: (foto) => ({ 
    height: '60vh', width: '100%', position: 'relative', 
    backgroundImage: foto ? `url(${foto})` : 'none', 
    backgroundColor: !foto ? COLORS.charcoalBlue : 'transparent', 
    backgroundSize: 'cover', backgroundPosition: 'center', 
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
  }),
  fotoOverlay: { 
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)', 
    zIndex: 1 
  },
  // CORRECCIÓN GLASSMORPHISM: Reducimos padding y ajustamos gradiente
  fullWidthGlass: { 
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15, 23, 42, 0.8) 100%)', 
    padding: '20px 40px 40px', // Menos padding arriba
    width: '100%', boxSizing: 'border-box',
    marginTop: 'auto', // Asegura que esté abajo
    zIndex: 10,
    position: 'relative'
  },
  backBtn: { 
    background: 'rgba(255,255,255,0.2)', border: 'none', padding: '12px', 
    borderRadius: '50%', color: 'white', cursor: 'pointer', backdropFilter: 'blur(10px)' 
  },
  editBtnInmersive: { 
    background: COLORS.atomicTangerine, color: 'white', border: 'none', 
    padding: '12px 24px', borderRadius: '14px', fontWeight: '700', 
    cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' 
  },
  infoBar: { 
    display: 'flex', justifyContent: 'center', gap: '60px', padding: '30px 60px', 
    backgroundColor: '#fff', borderRadius: '24px', 
    boxShadow: '0 15px 35px rgba(0,0,0,0.06)', width: 'fit-content', 
    margin: '-50px auto 50px', zIndex: 110, position: 'relative',
    border: '1px solid rgba(0,0,0,0.02)', flexWrap: 'wrap'
  },
  infoItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  infoLabel: { fontSize: '0.6rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' },
  hybridBody: { 
    maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 40px 100px', 
    display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '80px', boxSizing: 'border-box' 
  },
  sectionTitle: { fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', color: COLORS.mutedTeal, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' },
  highlightCard: { backgroundColor: '#fff', padding: '24px', borderRadius: '20px', marginBottom: '20px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '2px' },
  readText: { fontSize: '1.2rem', lineHeight: '1.8', color: COLORS.charcoalBlue, whiteSpace: 'pre-wrap' },
  emojiSpan: { fontSize: '5rem', display: 'block', marginBottom: '15px' },
  stamp: { width: '130px', filter: 'invert(1) brightness(2)', opacity: 0.7, transform: 'rotate(-10deg)' },
  monoData: { fontFamily: 'JetBrains Mono, monospace', fontWeight: '700' }
};