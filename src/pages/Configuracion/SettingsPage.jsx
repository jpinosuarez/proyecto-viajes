import React, { useState } from 'react';
import { Save, User, Camera, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme';

const SettingsPage = () => {
  const { usuario, actualizarPerfilUsuario, logout, isAdmin } = useAuth();
  const [nombre, setNombre] = useState(usuario?.displayName || '');
  const [foto, setFoto] = useState(usuario?.photoURL || '');
  const [msg, setMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg('Guardando...');
    const exito = await actualizarPerfilUsuario(nombre, foto);
    setMsg(exito ? '¡Perfil actualizado con éxito!' : 'Hubo un error.');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.titleRow}>
        <h1 style={styles.title}>Configuración de Cuenta</h1>
        <div style={styles.badgeGroup}>
          {usuario?.email && (
            <span style={styles.emailBadge}>{usuario.email}</span>
          )}
          <span style={styles.adminBadge(isAdmin)}>
            {isAdmin ? 'Administrador' : 'Usuario'}
          </span>
        </div>
      </div>
      
      <div style={styles.card}>
        <div style={styles.section}>
          <h2 style={styles.subtitle}>Perfil Público</h2>
          
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              <img src={foto || 'https://via.placeholder.com/150'} alt="Avatar" style={{width:'100%', height:'100%', objectFit:'cover'}} />
            </div>
            <div style={{flex:1}}>
              <label style={styles.label}>URL de tu Foto</label>
              <div style={{display:'flex', gap:'10px'}}>
                <input 
                  style={styles.input} 
                  value={foto} 
                  onChange={e => setFoto(e.target.value)} 
                  placeholder="https://..." 
                />
              </div>
              <p style={styles.helper}>Recomendamos usar una URL de imagen pública.</p>
            </div>
          </div>

          <label style={styles.label}>Nombre de Viajero</label>
          <input 
            style={styles.input} 
            value={nombre} 
            onChange={e => setNombre(e.target.value)} 
          />
        </div>

        <div style={styles.actions}>
          <button onClick={handleSave} style={styles.saveBtn}>
            <Save size={18} /> Guardar Cambios
          </button>
          {msg && <span style={styles.msg}>{msg}</span>}
        </div>
      </div>

      <div style={{...styles.card, marginTop:'30px', borderColor: '#fee2e2'}}>
        <h2 style={{...styles.subtitle, color: '#ef4444'}}>Zona de Peligro</h2>
        <p style={{marginBottom:'20px', color:'#64748b'}}>Cerrar sesión en este dispositivo.</p>
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: '"Plus Jakarta Sans", sans-serif' },
  titleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' },
  badgeGroup: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' },
  title: { fontSize: '2.5rem', fontWeight: '900', color: COLORS.charcoalBlue, marginBottom: '30px' },
  emailBadge: {
    padding: '8px 14px',
    borderRadius: '999px',
    fontSize: '0.78rem',
    fontWeight: '700',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    color: '#475569'
  },
  adminBadge: (isAdmin) => ({
    padding: '8px 14px',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: '800',
    border: `1px solid ${isAdmin ? '#fde68a' : '#e2e8f0'}`,
    background: isAdmin ? '#fff7ed' : '#f8fafc',
    color: isAdmin ? '#c2410c' : '#64748b'
  }),
  card: { background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
  subtitle: { fontSize: '1.2rem', fontWeight: '800', color: COLORS.charcoalBlue, marginBottom: '20px', borderBottom:'2px solid #f1f5f9', paddingBottom:'10px' },
  section: { display: 'flex', flexDirection: 'column', gap: '20px' },
  avatarSection: { display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '20px' },
  avatar: { width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: `4px solid ${COLORS.linen}` },
  label: { fontSize: '0.9rem', fontWeight: '700', color: '#64748b', marginBottom: '8px', display: 'block' },
  input: { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' },
  helper: { fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' },
  actions: { marginTop: '30px', display: 'flex', alignItems: 'center', gap: '20px' },
  saveBtn: { background: COLORS.atomicTangerine, color: 'white', padding: '14px 28px', borderRadius: '12px', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', fontSize:'1rem' },
  logoutBtn: { background: '#fff', border: '2px solid #fee2e2', color: '#ef4444', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
  msg: { color: COLORS.mutedTeal, fontWeight: '700' }
};

export default SettingsPage;