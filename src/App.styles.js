import { COLORS } from './theme';

export const styles = {
  appWrapper: {
    display: 'flex',
    backgroundColor: '#F1F5F9', 
    height: '100vh',       // Fuerza altura exacta de pantalla
    width: '100%',         // Usa % en lugar de vw para evitar scrollbar fantasma
    overflow: 'hidden'     // BLOQUEA cualquier scroll a nivel de ventana
  },
  
  // Main Content Dinámico
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',        // Hereda 100vh del padre
    // width: '100%',      <--- ELIMINADO: Esto causaba el scroll horizontal al sumar el margen
    minWidth: 0,           // Truco Flexbox: evita que hijos grandes rompan el layout
    transition: 'margin-left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', 
    position: 'relative',
    overflow: 'hidden'     // Asegura que nada se desborde del contenedor principal
  },

  sectionWrapper: {
    flex: 1,
    padding: '30px',
    overflow: 'hidden',    // El wrapper no scrollea, lo hace el contenido interno
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1600px',    // Buenas práctica: evita que en pantallas ultra-wide se vea eterno
    width: '100%',
    margin: '0 auto'       // Centra el contenido si la pantalla es gigante
  },

  // Este es el único lugar donde permitimos scroll vertical controlado
  scrollableContent: {
    height: '100%',
    overflowY: 'auto',     // Scroll vertical solo aquí
    overflowX: 'hidden',   // Prohibido scroll horizontal
    paddingRight: '6px',   // Espacio para que la scrollbar no tape contenido
    paddingBottom: '40px',
    // Estilización de Scrollbar (WebKit)
    scrollbarWidth: 'thin',
    scrollbarColor: `${COLORS.mutedTeal} transparent`
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