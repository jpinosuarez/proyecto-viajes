import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Map, BookOpen, Settings, LogOut, Disc, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme';

const Sidebar = ({ vistaActiva, setVistaActiva, collapsed, toggleCollapse }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'home', icon: LayoutGrid, label: 'Inicio' },
    { id: 'mapa', icon: Map, label: 'Mapa' },
    { id: 'bitacora', icon: BookOpen, label: 'Bitácora' },
    { id: 'config', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: collapsed ? '80px' : '260px',
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={styles.sidebar}
    >
      {/* Botón de Colapsar/Expandir en el borde */}
      <button onClick={toggleCollapse} style={styles.toggleBtn}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div style={{...styles.logoContainer, justifyContent: collapsed ? 'center' : 'flex-start'}}>
        <Disc size={32} color={COLORS.atomicTangerine} />
        <AnimatePresence>
          {!collapsed && (
            <motion.h1 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
              style={styles.logoText}
            >
              Keeptrip
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = vistaActiva === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setVistaActiva(item.id)}
              whileHover={{ backgroundColor: isActive ? COLORS.charcoalBlue : '#f1f5f9' }}
              whileTap={{ scale: 0.98 }}
              style={{
                ...styles.navItem,
                backgroundColor: isActive ? COLORS.charcoalBlue : 'transparent',
                color: isActive ? 'white' : '#64748b',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '12px' : '12px 16px',
              }}
              title={collapsed ? item.label : ''} // Tooltip nativo
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }} 
                    animate={{ opacity: 1, width: 'auto' }} 
                    exit={{ opacity: 0, width: 0 }}
                    style={styles.labelSpan}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <button onClick={logout} style={{...styles.logoutBtn, justifyContent: collapsed ? 'center' : 'flex-start'}}>
          <LogOut size={20} /> 
          <AnimatePresence>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }} 
                animate={{ opacity: 1, width: 'auto' }} 
                exit={{ opacity: 0, width: 0 }}
                style={{ marginLeft: '10px', whiteSpace: 'nowrap' }}
              >
                Salir
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

const styles = {
  sidebar: {
    height: '100vh',
    backgroundColor: '#FFFFFF', // Blanco puro para contraste
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #E2E8F0', // Borde sutil para separar del main
    position: 'fixed', 
    left: 0, 
    top: 0, 
    zIndex: 50,
    boxShadow: '4px 0 24px rgba(0,0,0,0.02)' // Sombra muy leve para profundidad
  },
  toggleBtn: {
    position: 'absolute',
    top: '32px',
    right: '-12px',
    width: '24px',
    height: '24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    zIndex: 60,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.2s'
  },
  logoContainer: { display: 'flex', alignItems: 'center', height: '60px', marginBottom: '30px', padding: '0 20px', overflow: 'hidden' },
  logoText: { fontSize: '1.4rem', fontWeight: '900', color: COLORS.charcoalBlue, letterSpacing: '-0.5px', marginLeft: '10px', whiteSpace: 'nowrap' },
  
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, padding: '0 12px' },
  navItem: {
    display: 'flex', alignItems: 'center',
    borderRadius: '12px',
    border: 'none', cursor: 'pointer', fontSize: '0.95rem',
    transition: 'background-color 0.2s ease, color 0.2s ease', 
    width: '100%',
    overflow: 'hidden'
  },
  labelSpan: { fontWeight: '600', marginLeft: '12px', whiteSpace: 'nowrap' },
  
  footer: { borderTop: '1px solid #F1F5F9', padding: '20px' },
  logoutBtn: {
    display: 'flex', alignItems: 'center',
    background: 'none', border: 'none', color: '#94a3b8',
    cursor: 'pointer', padding: '10px', fontWeight: '600',
    fontSize: '0.9rem', width: '100%', borderRadius: '10px',
    ':hover': { backgroundColor: '#FEF2F2', color: '#EF4444' } // Rojo suave al hover
  }
};

export default Sidebar;