import { COLORS } from './theme';

export const styles = {
  appWrapper: {
    display: 'flex',
    backgroundColor: '#F8FAFC', // Fondo general suave
    minHeight: '100vh',
    width: '100vw',
    overflow: 'hidden' // Evita scroll doble
  },
  
  // Main Content Dinámico
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    // marginLeft se inyecta dinámicamente en App.jsx
    transition: 'margin-left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', // Animación suave
    width: '100%', // Asegura que tome el espacio restante
    position: 'relative'
  },

  sectionWrapper: {
    flex: 1,
    padding: '30px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  },

  scrollableContent: {
    height: '100%',
    overflowY: 'auto',
    paddingRight: '10px', // Espacio para scrollbar
    paddingBottom: '40px'
  },

  containerMapaStyle: {
    width: '100%',
    height: '100%',
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  }
};