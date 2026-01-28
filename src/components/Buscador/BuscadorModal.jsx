import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, Plus } from 'lucide-react';
import { COLORS } from '../../theme';
import { styles } from './BuscadorModal.styles';

const BuscadorModal = ({ isOpen, onClose, filtro, setFiltro, listaPaises = [], seleccionarPais, paisesVisitados }) => {
  const [hoveredCode, setHoveredCode] = useState(null);

  // VALIDACIÓN CRÍTICA: Nos aseguramos de que listaPaises sea un array antes de filtrar
  const resultadosFiltrados = Array.isArray(listaPaises) 
    ? listaPaises.filter(pais => {
        if (!filtro) return true;
        const busqueda = filtro.toLowerCase();
        
        // Uso de Optional Chaining para evitar errores si las propiedades no existen
        const nombreEs = pais?.nombreEspanol?.toLowerCase() || '';
        const nombreEn = pais?.name?.toLowerCase() || '';
        const nombreAlt = pais?.nombre?.toLowerCase() || '';

        return nombreEs.includes(busqueda) || nombreEn.includes(busqueda) || nombreAlt.includes(busqueda);
      }).slice(0, 50)
    : []; // Si no es un array, devolvemos una lista vacía para que no se rompa

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        style={styles.modalOverlay}
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 30, opacity: 0, scale: 0.98 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }} 
          exit={{ y: 30, opacity: 0, scale: 0.98 }} 
          style={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.header}>
            <h3 style={styles.titulo}>Registrar Nueva Aventura</h3>
            <div onClick={onClose} style={{ cursor: 'pointer', padding: '5px' }}>
              <X size={20} color={COLORS.charcoalBlue} />
            </div>
          </div>
          
          <div style={styles.searchBox}>
            <Search size={20} color={COLORS.atomicTangerine} />
            <input 
              autoFocus 
              placeholder="¿Cuál es tu próximo destino?" 
              style={styles.inputStyle} 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)} 
            />
          </div>

          <div style={styles.listaContainer} className="custom-scroll">
            {resultadosFiltrados.map(pais => {
              const isVisited = paisesVisitados.includes(pais.code);
              const isHovered = hoveredCode === pais.code;

              return (
                <motion.div 
                  key={pais.code} 
                  style={{
                    ...styles.paisItem(false),
                    borderColor: isHovered ? COLORS.atomicTangerine : 'rgba(44, 62, 80, 0.05)',
                    transform: isHovered ? 'translateX(8px)' : 'none',
                    backgroundColor: isHovered ? '#FFFFFF' : 'white',
                    cursor: 'pointer'
                  }} 
                  onMouseEnter={() => setHoveredCode(pais.code)}
                  onMouseLeave={() => setHoveredCode(null)}
                  onClick={() => seleccionarPais(pais)}
                >
                  <div style={styles.paisInfo}>
                    <span style={{ fontSize: '1.4rem' }}>{pais.flag}</span>
                    <span style={styles.nombrePais}>{pais.nombreEspanol}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isVisited && (
                      <span style={styles.badgeVisitado}>
                        <Check size={12} style={{ marginRight: '4px' }} strokeWidth={3} />
                        YA CONOCIDO
                      </span>
                    )}
                    
                    {isHovered && (
                      <span style={{ color: COLORS.atomicTangerine, fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Plus size={14} /> Registrar
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
            
            {resultadosFiltrados.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: COLORS.charcoalBlue, opacity: 0.5 }}>
                <p>No encontramos ese destino... todavía. 🌍</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BuscadorModal;