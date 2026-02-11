import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Map,
  BookOpen,
  Settings,
  LogOut,
  Disc,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme';

const Sidebar = ({
  vistaActiva,
  setVistaActiva,
  collapsed,
  toggleCollapse,
  isMobile = false,
  mobileOpen = false,
  onMobileOpenChange
}) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'home', icon: LayoutGrid, label: 'Inicio' },
    { id: 'mapa', icon: Map, label: 'Mapa' },
    { id: 'bitacora', icon: BookOpen, label: 'Bitacora' },
    { id: 'config', icon: Settings, label: 'Ajustes' }
  ];

  const handleSelect = (id) => {
    setVistaActiva(id);
    if (isMobile) onMobileOpenChange?.(false);
  };

  const handleLogout = () => {
    if (isMobile) onMobileOpenChange?.(false);
    logout();
  };

  const sidebarContent = (
    <>
      {isMobile ? (
        <div style={styles.mobileTopRow}>
          <div style={styles.logoContainerMobile}>
            <Disc size={28} color={COLORS.atomicTangerine} />
            <h1 style={styles.logoText}>Keeptrip</h1>
          </div>
          <button type="button" onClick={() => onMobileOpenChange?.(false)} style={styles.mobileCloseBtn}>
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          <button onClick={toggleCollapse} style={styles.toggleBtn}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <div style={{ ...styles.logoContainer, justifyContent: collapsed ? 'center' : 'flex-start' }}>
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
        </>
      )}

      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = vistaActiva === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              whileHover={{ backgroundColor: isActive ? COLORS.charcoalBlue : '#f1f5f9' }}
              whileTap={{ scale: 0.98 }}
              style={{
                ...styles.navItem,
                backgroundColor: isActive ? COLORS.charcoalBlue : 'transparent',
                color: isActive ? 'white' : '#64748b',
                justifyContent: isMobile || !collapsed ? 'flex-start' : 'center',
                padding: isMobile || !collapsed ? '12px 16px' : '12px'
              }}
              title={!isMobile && collapsed ? item.label : ''}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />

              <AnimatePresence>
                {(isMobile || !collapsed) && (
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
        <button
          onClick={handleLogout}
          style={{ ...styles.logoutBtn, justifyContent: isMobile || !collapsed ? 'flex-start' : 'center' }}
        >
          <LogOut size={20} />
          <AnimatePresence>
            {(isMobile || !collapsed) && (
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
    </>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={styles.mobileOverlay}
              onClick={() => onMobileOpenChange?.(false)}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              style={styles.mobileSidebar}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? '80px' : '260px'
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={styles.sidebar}
    >
      {sidebarContent}
    </motion.aside>
  );
};

const baseSidebar = {
  height: '100vh',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid #E2E8F0',
  top: 0,
  left: 0,
  boxShadow: '4px 0 24px rgba(0,0,0,0.02)'
};

const styles = {
  sidebar: {
    ...baseSidebar,
    position: 'fixed',
    zIndex: 60
  },
  mobileSidebar: {
    ...baseSidebar,
    position: 'fixed',
    zIndex: 120,
    width: '280px',
    maxWidth: '84vw'
  },
  mobileOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 110,
    backgroundColor: 'rgba(15, 23, 42, 0.48)'
  },
  mobileTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 10px'
  },
  logoContainerMobile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  mobileCloseBtn: {
    border: '1px solid #E2E8F0',
    background: '#fff',
    borderRadius: '10px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    cursor: 'pointer'
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    zIndex: 60,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.2s'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    height: '60px',
    marginBottom: '30px',
    padding: '0 20px',
    overflow: 'hidden'
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: '900',
    color: COLORS.charcoalBlue,
    letterSpacing: '-0.5px',
    margin: 0,
    whiteSpace: 'nowrap'
  },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, padding: '0 12px' },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    width: '100%',
    overflow: 'hidden'
  },
  labelSpan: { fontWeight: '600', marginLeft: '12px', whiteSpace: 'nowrap' },
  footer: { borderTop: '1px solid #F1F5F9', padding: '20px' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '10px',
    fontWeight: '600',
    fontSize: '0.9rem',
    width: '100%',
    borderRadius: '10px'
  }
};

export default Sidebar;
