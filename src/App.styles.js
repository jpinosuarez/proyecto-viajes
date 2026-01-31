import { COLORS } from './theme';

export const styles = {
  appWrapper: {
    display: 'flex',
    backgroundColor: COLORS.background,
    height: '100vh',
    width: '100%',
    overflow: 'hidden'
  },
  
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: 0, // Evita que flex items rompan el layout
    transition: 'margin-left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    position: 'relative',
    overflow: 'hidden'
  },

  sectionWrapper: {
    flex: 1,
    padding: '30px', // Espacio interno
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1600px', // Tope para pantallas ultrawide
    margin: '0 auto'
  },

  scrollableContent: {
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: '8px', // Espacio para scrollbar
    paddingBottom: '40px'
  },

  containerMapaStyle: {
    width: '100%',
    height: '100%',
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }
};