import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, LogOut, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { styles } from './Header.styles';

const Header = ({
  titulo,
  onAddClick,
  onProfileClick,
  mostrarBusqueda = false,
  busqueda = '',
  onBusquedaChange,
  onBusquedaClear,
  searchPlaceholder = 'Buscar...'
}) => {
  const { usuario, login, logout } = useAuth();
  const [avatarError, setAvatarError] = useState(false);
  const iniciales = useMemo(() => usuario?.displayName?.trim()?.[0]?.toUpperCase() || '', [usuario?.displayName]);

  useEffect(() => {
    setAvatarError(false);
  }, [usuario?.photoURL]);

  return (
    <header style={styles.header}>
      <div style={styles.leftSide}>
        <span style={styles.breadcrumb}>Keeptrip</span>
        <span style={styles.separator}>/</span>
        <h2 style={styles.titulo}>{titulo}</h2>
      </div>

      <div style={styles.rightSide}>
        {mostrarBusqueda && (
          <div style={styles.searchContainer}>
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              aria-label="Buscar en la bitácora"
              value={busqueda}
              onChange={(event) => onBusquedaChange?.(event.target.value)}
              style={styles.searchInput}
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => onBusquedaClear?.()}
                style={styles.clearButton}
                aria-label="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        <button style={styles.addButton} onClick={onAddClick}>
          <Plus size={18} /> Añadir Viaje
        </button>

        {usuario ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Avatar Clickeable con Fallback a Icono */}
            <div
              style={{ ...styles.avatar, cursor: 'pointer' }}
              onClick={onProfileClick}
              title="Configurar Perfil"
              role="button"
            >
              {usuario.photoURL && !avatarError ? (
                <img
                  src={usuario.photoURL}
                  alt={`Foto de ${usuario.displayName || 'usuario'}`}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  onError={() => setAvatarError(true)}
                />
              ) : iniciales ? (
                <span style={styles.avatarInitials}>{iniciales}</span>
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
