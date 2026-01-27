import React from 'react';
import { motion } from 'framer-motion';

const BentoCard = ({ tipo, children, style, onClick }) => {
  const gridStyles = {
    grande: { gridColumn: 'span 2', gridRow: 'span 2' },
    ancho: { gridColumn: 'span 2', gridRow: 'span 1' },
    normal: { gridColumn: 'span 1', gridRow: 'span 1' }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        ...gridStyles[tipo || 'normal'],
        backgroundColor: 'white',
        borderRadius: '32px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(241, 245, 249, 0.8)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        transition: 'box-shadow 0.3s ease',
        ...style
      }}
    >
      {children}
    </motion.div>
  );
};

export default BentoCard;