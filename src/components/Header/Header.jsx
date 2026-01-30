import React from 'react';
import { Search, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { styles } from './Header.styles';

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
          <input type="text" placeholder="Buscar recuerdo..." style={styles.searchInput} />
        </div>

        <button style={styles.addButton} onClick={onAddClick}>
          <Plus size={18} /> Añadir Destino
        </button>

        {usuario ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Avatar Clickeable para Editar Perfil */}
            <div 
              style={{ ...styles.avatar, cursor: 'pointer' }} 
              onClick={onProfileClick}
              title="Editar Perfil"
            >
              {usuario.photoURL ? (
                <img 
                  src={usuario.photoURL} 
                  alt="User" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                <span>{usuario.displayName?.[0] || 'U'}</span>
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
            Entrar
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;