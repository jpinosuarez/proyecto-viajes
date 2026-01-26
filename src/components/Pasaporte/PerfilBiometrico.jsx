import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const PerfilBiometrico = () => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
  >
    <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', color: '#1e293b', fontFamily: 'serif' }}>
      PERFIL BIOMÉTRICO
    </h3>
    <div style={{ display: 'flex', gap: '25px', marginTop: '30px' }}>
      <div style={{ 
        width: '140px', height: '170px', backgroundColor: '#f1f5f9', 
        border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center' 
      }}>
        <User size={60} color="#cbd5e1" />
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
        <div><label style={{ color: '#94a3b8' }}>ORIGEN</label><div style={{ fontWeight: 'bold' }}>ARGENTINA 🇦🇷</div></div>
        <div><label style={{ color: '#94a3b8' }}>RESIDENCIA</label><div style={{ fontWeight: 'bold' }}>BERLÍN 🇩🇪</div></div>
        <div><label style={{ color: '#94a3b8' }}>ESTUDIOS</label><div style={{ fontWeight: 'bold' }}>MKT - SIGLO 21</div></div>
        <div><label style={{ color: '#94a3b8' }}>OBJETIVO</label><div style={{ fontWeight: 'bold', color: '#3b82f6' }}>DATA SCIENCE</div></div>
      </div>
    </div>
    <div style={{ 
      marginTop: 'auto', padding: '12px', backgroundColor: '#f8fafc', 
      border: '1px dashed #e2e8f0', borderRadius: '8px', 
      fontSize: '0.7rem', color: '#64748b', letterSpacing: '1px' 
    }}>
      P&lt;ARGUSUARIO&lt;&lt;MARKETING&lt;BERLIN&lt;2026&lt;DS&lt;ML&lt;&lt;&lt;
    </div>
  </motion.div>
);

export default PerfilBiometrico;