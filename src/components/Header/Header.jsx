// src/components/Header/Header.jsx
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { styles } from './Header.styles';

const Header = ({ titulo, onAddClick }) => {
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

        <div style={styles.avatar}>
          {/* Aquí podrías poner una imagen o iniciales */}
          JS
        </div>
      </div>
    </header>
  );
};

export default Header;