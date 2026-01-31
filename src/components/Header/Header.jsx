import React from 'react';
import { Search, Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { styles } from './Header.styles';
import { COLORS } from '../../theme';

const Header = ({ titulo, onAddClick, onProfileClick }) => {
  const { usuario, login, logout } = useAuth();

  return (
    <header style={styles.header}>
      <div style={styles.leftSide}>
        <span style={styles.breadcrumb}>Keeptrip</span>
        <span style={styles.separator}>/</span>
        <h2 style={styles.titulo}>{titulo}</h2>
      </div>

      <div style={styles.rightSide}>
        <div style={styles.searchContainer}>
          <Search size={16} color="#94a3b8" />
          <input type="text" placeholder="Buscar en mis recuerdos..." style={styles.searchInput} />
        </div>

        <button style={styles.addButton} onClick={onAddClick}>
          <Plus size={18} /> Añadir Viaje
        </button>

        {usuario ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Avatar Clickeable con Fallback a Icono */}
            <div 
              style={{ ...styles.avatar, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0', color: '#94a3b8' }} 
              onClick={onProfileClick}
              title="Configurar Perfil"
            >
              {usuario.photoURL ? (
                <img 
                  src={usuario.photoURL} 
                  alt="User" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.style.display='none'; e.target.parentNode.firstChild.style.display='block'; }} // Fallback si rompe url
                />
              ) : (
                <User size={20} />
              )}
            </div>
            
            <button 
              onClick={logout} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              title="Cerrar Sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button onClick={login} style={{ ...styles.addButton, backgroundColor: '#4285F4' }}>
            Iniciar Sesión
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;