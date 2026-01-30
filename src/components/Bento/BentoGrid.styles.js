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
  
  // Ajuste Glassmorphism para Bento Cards
  fullWidthGlass: { 
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15, 23, 42, 0.9) 100%)', 
    padding: '20px 20px', // Menos padding
    width: '100%', 
    boxSizing: 'border-box' 
  },
  // ... (El resto de estilos de portal se han movido a VisorViaje.styles.js, se pueden borrar de aquí si quieres limpiar código)
};