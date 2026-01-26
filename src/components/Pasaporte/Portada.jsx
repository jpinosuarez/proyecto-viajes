import React from 'react';
import { motion } from 'framer-motion';
import { Navigation2 } from 'lucide-react';

const Portada = () => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    style={{ 
      height: '100%', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', 
      backgroundColor: '#1e293b', color: 'white', 
      borderRadius: '12px', margin: '-20px' 
    }}
  >
    <Navigation2 size={80} color="#3b82f6" fill="#3b82f6" />
    <h1 style={{ fontSize: '2rem', letterSpacing: '6px', marginTop: '20px' }}>PASAPORTE</h1>
    <p style={{ opacity: 0.5, fontSize: '0.8rem', letterSpacing: '2px' }}>GLOBAL STAMP DIGITAL</p>
  </motion.div>
);

export default Portada;