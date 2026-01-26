import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapaViajes from './components/MapaViajes';
import countries from 'world-countries';
import './components/Pasaporte.css';

// 1. IMPORTACIÓN DE SELLOS
import selloARG from './assets/sellos/sello_ARG.png'; 

import { 
  Globe, Map as MapIcon, BarChart3, BookOpen, 
  Navigation2, Search, X, Trash2, ChevronLeft, ChevronRight, User
} from 'lucide-react';

function App() {
  // CONFIGURACIÓN DE DATOS - Manteniendo tu formación y objetivos
  const listaPaisesProfesional = countries.map(country => ({
    nombre: country.name.common,
    nombreEspanol: country.translations.spa?.common || country.name.common,
    code: country.cca3, 
    flag: country.flag,
    latlng: country.latlng,
    region: country.region 
  })).sort((a, b) => a.nombreEspanol.localeCompare(b.nombreEspanol));

  const MAPA_SELLOS = { ARG: selloARG };

  // ESTADOS PRINCIPALES
  const [paisesVisitados, setPaisesVisitados] = useState(() => {
    const datosGuardados = localStorage.getItem('globalstamp-viajes');
    return datosGuardados ? JSON.parse(datosGuardados) : ['ARG', 'DEU'];
  });

  const [vistaActiva, setVistaActiva] = useState('mapa'); 
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [destino, setDestino] = useState(null);
  const [paginaActual, setPaginaActual] = useState(0);

  // LÓGICA DE AGRUPACIÓN ROBUSTA
  const agruparPorRegion = () => {
    const regiones = {};
    // Forzamos el orden: Portada y Perfil siempre primero
    regiones['PORTADA'] = []; 
    regiones['PERFIL'] = [];

    paisesVisitados.forEach(id => {
      const info = listaPaisesProfesional.find(p => p.code === id);
      if (info) {
        const reg = info.region || 'Otros'; 
        if (!regiones[reg]) regiones[reg] = [];
        regiones[reg].push(info);
      }
    });
    return regiones; 
  };

  const paisesAgrupados = agruparPorRegion();
  const regionesDisponibles = Object.keys(paisesAgrupados);

  // Efecto para no quedar en una página inexistente si se borran países
  useEffect(() => {
    if (paginaActual >= regionesDisponibles.length) {
      setPaginaActual(Math.max(0, regionesDisponibles.length - 1));
    }
  }, [paisesVisitados, regionesDisponibles.length]);

  const manejarCambioPaises = (nuevaLista) => {
    setPaisesVisitados(nuevaLista);
    localStorage.setItem('globalstamp-viajes', JSON.stringify(nuevaLista));
  };

  const seleccionarPais = (pais) => {
    if (!paisesVisitados.includes(pais.code)) {
      manejarCambioPaises([...paisesVisitados, pais.code]);
    }
    setDestino({ longitude: pais.latlng[1], latitude: pais.latlng[0], zoom: 4 });
    setVistaActiva('mapa'); 
    setMostrarBuscador(false);
    setFiltro('');
  };

  // Stats calculadas correctamente
  const stats = [
    { label: 'Países Visitados', value: paisesVisitados.length.toString(), icon: <Globe size={20} />, color: '#3b82f6' },
    { label: 'Exploración', value: `${((paisesVisitados.length / 195) * 100).toFixed(1)}%`, icon: <BarChart3 size={20} />, color: '#f59e0b' },
  ];

  const regionMostrada = regionesDisponibles[paginaActual];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', overflow: 'hidden', fontFamily: '"Noto Color Emoji", system-ui, sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #334155' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Navigation2 size={28} color="#3b82f6" fill="#3b82f6" /> GlobalStamp
          </h1>
        </div>
        <nav style={{ flex: 1, padding: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={vistaActiva === 'mapa' ? navItemStyleActive : navItemStyle} onClick={() => setVistaActiva('mapa')}>
              <MapIcon size={20} /> Mapa Interactivo
            </li>
            <li style={vistaActiva === 'pasaporte' ? navItemStyleActive : navItemStyle} onClick={() => setVistaActiva('pasaporte')}>
              <BookOpen size={20} /> Mi Pasaporte
            </li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#475569' }}>
            {vistaActiva === 'mapa' ? 'Explorador de Viajes' : 'Mi Pasaporte Digital'}
          </h2>
          <button style={buttonStyle} onClick={() => setMostrarBuscador(true)}>+ Añadir País</button>
        </header>

        {/* DASHBOARD STATS */}
        <section style={{ padding: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {stats.map((stat, index) => (
            <div key={index} style={cardStyle}>
              <div style={{ backgroundColor: `${stat.color}15`, padding: '10px', borderRadius: '10px', color: stat.color }}>{stat.icon}</div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{stat.label}</p>
                <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CONTENEDOR DE PASAPORTE / MAPA */}
        <section style={{ flex: 1, margin: '0 25px 25px 25px', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: 'white', position: 'relative', display: 'flex' }}>
          <AnimatePresence mode="wait">
            {vistaActiva === 'mapa' ? (
              <motion.div key="mapa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', width: '100%' }}>
                <MapaViajes paises={paisesVisitados} setPaises={manejarCambioPaises} destino={destino} />
              </motion.div>
            ) : (
              <motion.div 
                key="pasaporte"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="libro-abierto"
                style={{ height: '90%', margin: 'auto', width: '90%' }}
              >
                <div className="pliegue-central"></div>
                <div className="pagina-pasaporte">
                  <AnimatePresence mode="wait">
                    {regionMostrada === 'PORTADA' ? (
                      <motion.div key="portada" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', color: 'white', borderRadius: '12px', margin: '-20px' }}>
                        <Navigation2 size={80} color="#3b82f6" fill="#3b82f6" />
                        <h1 style={{ fontSize: '2rem', letterSpacing: '6px', marginTop: '20px' }}>PASAPORTE</h1>
                        <p style={{ opacity: 0.5, fontSize: '0.8rem', letterSpacing: '2px' }}>GLOBAL STAMP DIGITAL</p>
                      </motion.div>
                    ) : regionMostrada === 'PERFIL' ? (
                      <motion.div key="perfil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', color: '#1e293b' }}>PERFIL BIOMÉTRICO</h3>
                        <div style={{ display: 'flex', gap: '25px', marginTop: '30px' }}>
                          <div style={{ width: '140px', height: '170px', backgroundColor: '#f1f5f9', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={60} color="#cbd5e1" />
                          </div>
                          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                            <div><label style={{ color: '#94a3b8' }}>ORIGEN</label><div style={{ fontWeight: 'bold' }}>ARGENTINA 🇦🇷</div></div>
                            <div><label style={{ color: '#94a3b8' }}>RESIDENCIA</label><div style={{ fontWeight: 'bold' }}>BERLÍN 🇩🇪</div></div>
                            <div><label style={{ color: '#94a3b8' }}>ESTUDIOS</label><div style={{ fontWeight: 'bold' }}>MKT - SIGLO 21</div></div>
                            <div><label style={{ color: '#94a3b8' }}>OBJETIVO</label><div style={{ fontWeight: 'bold', color: '#3b82f6' }}>DATA SCIENCE</div></div>
                          </div>
                        </div>
                        <div style={{ marginTop: 'auto', padding: '12px', backgroundColor: '#f8fafc', border: '1px dashed #e2e8f0', borderRadius: '8px', fontSize: '0.7rem', color: '#64748b', letterSpacing: '1px' }}>
                          P&lt;ARGUSUARIO&lt;&lt;MARKETING&lt;BERLIN&lt;2026&lt;DS&lt;ML&lt;&lt;&lt;
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key={regionMostrada} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', color: '#1e293b' }}>{regionMostrada.toUpperCase()}</h3>
                        <div style={gridSellos}>
                          {paisesAgrupados[regionMostrada].map((p, i) => {
                            const tieneSello = MAPA_SELLOS[p.code];
                            const randomRotate = (p.code.charCodeAt(0) % 10) - 5;
                            return (
                              <div key={p.code} style={{ ...selloStyle, border: tieneSello ? 'none' : '2px dashed #cbd5e1', transform: `rotate(${randomRotate}deg)` }}>
                                {tieneSello ? <img src={tieneSello} alt={p.nombreEspanol} style={{ mixBlendMode: 'multiply', width: '100%' }} /> : (
                                  <div style={{ opacity: 0.5, textAlign: 'center' }}>
                                    <span style={{ fontSize: '2rem' }}>{p.flag}</span>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{p.nombreEspanol}</div>
                                  </div>
                                )}
                                <Trash2 size={12} style={{ position: 'absolute', top: 2, right: 2, color: '#ef4444', cursor: 'pointer', opacity: 0.3 }} onClick={() => manejarCambioPaises(paisesVisitados.filter(c => c !== p.code))} />
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* NAVEGACIÓN INFERIOR */}
                  <div className="footer-pasaporte" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                    <button className="btn-nav" disabled={paginaActual === 0} onClick={() => setPaginaActual(p => p - 1)} style={btnNavStyle}>
                      <ChevronLeft size={18} /> Anterior
                    </button>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {regionMostrada === 'PORTADA' ? 'INICIO' : `PÁGINA ${paginaActual} / ${regionesDisponibles.length - 1}`}
                    </span>
                    <button className="btn-nav" disabled={paginaActual === regionesDisponibles.length - 1} onClick={() => setPaginaActual(p => p + 1)} style={btnNavStyle}>
                      Siguiente <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* BUSCADOR DE PAÍSES - RESTAURADO TOTALMENTE */}
      <AnimatePresence>
        {mostrarBuscador && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={modalOverlay}>
            <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }} style={modalContent}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Añadir Destino</h3>
                <X onClick={() => setMostrarBuscador(false)} style={{ cursor: 'pointer', color: '#64748b' }} />
              </div>
              <div style={searchBox}>
                <Search size={18} color="#94a3b8" />
                <input autoFocus placeholder="Ej: Italia, Japón..." style={inputStyle} value={filtro} onChange={(e) => setFiltro(e.target.value)} />
              </div>
              <div style={listaContainer}>
                {listaPaisesProfesional
                  .filter(n => n.nombreEspanol.toLowerCase().includes(filtro.toLowerCase()) || n.nombre.toLowerCase().includes(filtro.toLowerCase()))
                  .slice(0, 50).map(n => (
                    <div key={n.code} style={paisItem} onClick={() => seleccionarPais(n)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{n.flag}</span>
                        <span style={{ fontWeight: '500' }}>{n.nombreEspanol}</span>
                      </div>
                      {paisesVisitados.includes(n.code) && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>VISITADO</span>}
                    </div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ESTILOS (Asegúrate de tener Pasaporte.css configurado)
const gridSellos = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '20px', marginTop: '20px' };
const selloStyle = { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderRadius: '4px', transition: '0.2s' };
const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #e2e8f0' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' };
const modalContent = { backgroundColor: 'white', width: '450px', maxHeight: '75vh', borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' };
const searchBox = { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f1f5f9', padding: '14px', borderRadius: '14px', marginBottom: '20px' };
const inputStyle = { border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: '#1e293b' };
const listaContainer = { overflowY: 'auto', flex: 1, paddingRight: '5px' };
const paisItem = { padding: '14px', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s', marginBottom: '4px', border: '1px solid transparent' };
const buttonStyle = { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const navItemStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer' };
const navItemStyleActive = { ...navItemStyle, backgroundColor: '#3b82f6', color: 'white' };
const btnNavStyle = { background: 'white', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' };

export default App;