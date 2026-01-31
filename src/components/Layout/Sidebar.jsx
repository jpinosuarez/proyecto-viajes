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
      animate={{ width: collapsed ? '80px' : '260px' }}
      transition={{ duration: 0.3, type: 'spring', damping: 15 }}
      style={styles.sidebar}
    >
      {/* Botón de Colapsar/Expandir */}
      <button onClick={toggleCollapse} style={styles.toggleBtn}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div style={{...styles.logoContainer, justifyContent: collapsed ? 'center' : 'flex-start'}}>
        <Disc size={32} color={COLORS.atomicTangerine} />
        <AnimatePresence>
          {!collapsed && (
            <motion.h1 
              initial={{ opacity: 0, width: 0 }} 
              animate={{ opacity: 1, width: 'auto' }} 
              exit={{ opacity: 0, width: 0 }}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVistaActiva(item.id)}
              style={{
                ...styles.navItem,
                backgroundColor: isActive ? COLORS.charcoalBlue : 'transparent',
                color: isActive ? COLORS.linen : '#64748b',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '14px 0' : '14px 18px',
              }}
              title={collapsed ? item.label : ''} // Tooltip nativo cuando está colapsado
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }} 
                    animate={{ opacity: 1, width: 'auto' }} 
                    exit={{ opacity: 0, width: 0 }}
                    style={{ fontWeight: isActive ? '700' : '500', marginLeft: '12px', whiteSpace: 'nowrap', overflow: 'hidden' }}
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
          {!collapsed && <span style={{marginLeft: '10px'}}>Salir</span>}
        </button>
      </div>
    </motion.aside>
  );
};

const styles = {
  sidebar: {
    height: '100vh',
    backgroundColor: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #f1f5f9',
    position: 'fixed', 
    left: 0, 
    top: 0, 
    zIndex: 50,
    overflow: 'hidden' // Evita scroll horizontal al animar
  },
  toggleBtn: {
    position: 'absolute',
    top: '28px',
    right: '-12px',
    width: '24px',
    height: '24px',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    zIndex: 60,
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  logoContainer: { display: 'flex', alignItems: 'center', height: '50px', marginBottom: '40px', overflow: 'hidden' },
  logoText: { fontSize: '1.5rem', fontWeight: '900', color: COLORS.charcoalBlue, letterSpacing: '-1px', marginLeft: '12px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center',
    borderRadius: '16px',
    border: 'none', cursor: 'pointer', fontSize: '1rem',
    transition: 'background-color 0.2s ease, color 0.2s ease', 
    width: '100%'
  },
  footer: { borderTop: '1px solid #f1f5f9', paddingTop: '20px' },
  logoutBtn: {
    display: 'flex', alignItems: 'center',
    background: 'none', border: 'none', color: '#94a3b8',
    cursor: 'pointer', padding: '10px', fontWeight: '600',
    fontSize: '0.9rem', width: '100%', borderRadius: '10px',
    ':hover': { background: '#f8fafc', color: '#ef4444' }
  }
};

export default Sidebar;