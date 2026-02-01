import { COLORS } from './theme';

export const styles = {
  appWrapper: {
    display: 'flex',
    backgroundColor: '#F8FAFC',
    height: '100vh',
    width: '100%',
    overflow: 'hidden'
  },
  
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: 0,
    transition: 'margin-left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    position: 'relative',
    overflow: 'hidden'
  },

  sectionWrapper: {
    flex: 1,
    padding: '20px', // Reduje un poco el padding para ganar espacio en mapa
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%', // Asegura uso total
    margin: '0 auto'
  },

  scrollableContent: {
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: '6px',
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
  },

  // NUEVO: Contenedor flotante para las stats sobre el mapa
  mapStatsOverlay: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 10,
    width: '260px', // Ancho fijo para que se apilen verticalmente
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'none' // Para que no bloquee clicks en el área vacía (si el hijo tiene pointer-events: auto)
  }
};