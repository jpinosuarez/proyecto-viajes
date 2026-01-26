import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

const BuscadorModal = ({ isOpen, onClose, filtro, setFiltro, listaPaises, seleccionarPais, paisesVisitados }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          style={modalOverlay}
        >
          <motion.div 
            initial={{ y: 50, scale: 0.95 }} 
            animate={{ y: 0, scale: 1 }} 
            exit={{ y: 50, scale: 0.95 }} 
            style={modalContent}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Añadir Destino</h3>
              <X onClick={onClose} style={{ cursor: 'pointer', color: '#64748b' }} />
            </div>
            
            <div style={searchBox}>
              <Search size={18} color="#94a3b8" />
              <input 
                autoFocus 
                placeholder="Ej: Italia, Japón..." 
                style={inputStyle} 
                value={filtro} 
                onChange={(e) => setFiltro(e.target.value)} 
              />
            </div>

            <div style={listaContainer}>
              {listaPaises
                .filter(n => 
                  n.nombreEspanol.toLowerCase().includes(filtro.toLowerCase()) || 
                  n.nombre.toLowerCase().includes(filtro.toLowerCase())
                )
                .slice(0, 50).map(n => (
                  <div 
                    key={n.code} 
                    style={paisItem} 
                    onClick={() => seleccionarPais(n)}
                    className="item-buscador" // Podés agregar hover effects en el CSS
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{n.flag}</span>
                      <span style={{ fontWeight: '500', color: '#334155' }}>{n.nombreEspanol}</span>
                    </div>
                    {paisesVisitados.includes(n.code) && (
                      <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        VISITADO
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- ESTILOS LOCALES DEL MODAL ---
const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(15, 23, 42, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 3000, // Aseguramos que esté por encima de todo
  backdropFilter: 'blur(4px)'
};

const modalContent = {
  backgroundColor: 'white',
  width: '450px',
  maxHeight: '75vh',
  borderRadius: '24px',
  padding: '30px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
};

const searchBox = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: '#f1f5f9',
  padding: '14px',
  borderRadius: '14px',
  marginBottom: '20px'
};

const inputStyle = {
  border: 'none',
  background: 'none',
  outline: 'none',
  width: '100%',
  fontSize: '1rem',
  color: '#1e293b'
};

const listaContainer = {
  overflowY: 'auto',
  flex: 1,
  paddingRight: '5px'
};

const paisItem = {
  padding: '14px',
  borderRadius: '12px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: '0.2s',
  marginBottom: '4px',
  border: '1px solid transparent',
  fontFamily: 'inherit'
};

export default BuscadorModal;