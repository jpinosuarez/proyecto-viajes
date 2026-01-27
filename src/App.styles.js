// src/App.styles.js
import { COLORS } from './theme';

export const styles = {
  appWrapper: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    backgroundColor: COLORS.linen,
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    minWidth: 0,
    overflow: 'hidden',
  },
  sectionWrapper: {
    flex: 1,
    padding: '0 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
    position: 'relative',
    /* ELIMINADO: WebkitMaskImage y maskImage. 
       Estas propiedades creaban un Stacking Context que atrapaba el modal 
       por debajo de las Stats.
    */
  },
  containerMapaStyle: {
    flex: 1,
    width: '100%',
    borderRadius: '24px',
    overflow: 'hidden',
    border: `1px solid ${COLORS.sandyBrown}40`,
    boxShadow: '0 10px 25px -5px rgba(44, 62, 80, 0.1)',
    position: 'relative',
    zIndex: 1, // Mantenemos el mapa en su nivel
  },
  scrollableContent: {
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    /* Añadimos un padding superior para que las tarjetas no choquen 
       bruscamente con las stats al scrollear 
    */
    paddingTop: '10px', 
    paddingBottom: '20px',
  }
};