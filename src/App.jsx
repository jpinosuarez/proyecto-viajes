import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import countries from 'world-countries';

// Componentes Modularizados
import Sidebar from './components/Sidebar';
import Stats from './components/Dashboard/Stats';
import Portada from './components/Pasaporte/Portada';
import PerfilBiometrico from './components/Pasaporte/PerfilBiometrico';
import PaginaSellos from './components/Pasaporte/PaginaSellos';
import MapaViajes from './components/MapaViajes';

// Estilos e Iconos
import './components/Pasaporte/Pasaporte.css';
import selloARG from './assets/sellos/sello_ARG.png'; 
import { 
  Globe, 
  BarChart3, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

function App() {
  // --- ESTADOS ---
  const [paisesVisitados, setPaisesVisitados] = useState(() => {
    const datos = localStorage.getItem('globalstamp-viajes');
    return datos ? JSON.parse(datos) : ['ARG', 'DEU'];
  });

  const [vistaActiva, setVistaActiva] = useState('mapa'); 
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [destino, setDestino] = useState(null);
  const [paginaActual, setPaginaActual] = useState(0);

  const MAPA_SELLOS = { ARG: selloARG };

  // --- LÓGICA DE DATOS ---
  const listaPaises = countries.map(c => ({
    nombre: c.name.common,
    nombreEspanol: c.translations.spa?.common || c.name.common,
    code: c.cca3, 
    flag: c.flag, 
    latlng: c.latlng, 
    region: c.region 
  })).sort((a, b) => a.nombreEspanol.localeCompare(b.nombreEspanol));

  const agruparPorRegion = () => {
    const regiones = { 'PORTADA': [], 'PERFIL': [] };
    paisesVisitados.forEach(id => {
      const info = listaPaises.find(p => p.code === id);
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
  const regionMostrada = regionesDisponibles[paginaActual];

  // --- MANEJADORES ---
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

  const statsData = [
    { label: 'Países Visitados', value: paisesVisitados.length.toString(), icon: <Globe size={20} />, color: '#3b82f6' },
    { label: 'Exploración', value: `${((paisesVisitados.length / 195) * 100).toFixed(1)}%`, icon: <BarChart3 size={20} />, color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      
      {/* SIDEBAR MODULARIZADO */}
      <Sidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#475569' }}>
            {vistaActiva === 'mapa' ? 'Mapa Interactivo' : 'Mi Pasaporte Digital'}
          </h2>
          <button style={buttonStyle} onClick={() => setMostrarBuscador(true)}>+ Añadir Destino</button>
        </header>

        {/* STATS MODULARIZADO */}
        <Stats stats={statsData} />

        <section style={{ flex: 1, margin: '0 25px 25px 25px', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: 'white', display: 'flex', position: 'relative' }}>
          <AnimatePresence mode="wait">
            {vistaActiva === 'mapa' ? (
              <motion.div key="mapa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', width: '100%' }}>
                <MapaViajes paises={paisesVisitados} setPaises={manejarCambioPaises} destino={destino} />
              </motion.div>
            ) : (
              <motion.div key="pasaporte" className="libro-abierto" style={{ height: '90%', margin: 'auto', width: '90%' }}>
                <div className="pliegue-central"></div>
                <div className="pagina-pasaporte" style={texturaPapelStyle}>
                  <AnimatePresence mode="wait">
                    {regionMostrada === 'PORTADA' && <Portada />}
                    {regionMostrada === 'PERFIL' && <PerfilBiometrico />}
                    {!['PORTADA', 'PERFIL'].includes(regionMostrada) && (
                      <PaginaSellos 
                        region={regionMostrada} 
                        paises={paisesAgrupados[regionMostrada]} 
                        MAPA_SELLOS={MAPA_SELLOS} 
                        manejarEliminar={(code) => manejarCambioPaises(paisesVisitados.filter(c => c !== code))}
                      />
                    )}
                  </AnimatePresence>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                    <button disabled={paginaActual === 0} onClick={() => setPaginaActual(p => p - 1)} style={btnNavStyle}>
                      <ChevronLeft size={18} /> Anterior
                    </button>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>
                      {regionMostrada}
                    </span>
                    <button disabled={paginaActual === regionesDisponibles.length - 1} onClick={() => setPaginaActual(p => p + 1)} style={btnNavStyle}>
                      Siguiente <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* MODAL BUSCADOR */}
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

// --- ESTILOS EN LÍNEA ---
const texturaPapelStyle = {
  flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative',
  backgroundColor: '#fdfbf7',
  backgroundImage: `linear-gradient(90deg, rgba(200,0,0,.02) 50%, transparent 0), linear-gradient(rgba(200,0,0,.02) 50%, transparent 0), radial-gradient(circle at 50% 50%, rgba(0,0,0,0.01) 1px, transparent 1px)`,
  backgroundSize: '100% 2px, 2px 100%, 18px 18px'
};

const btnNavStyle = { background: 'white', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' };
const buttonStyle = { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' };
const modalContent = { backgroundColor: 'white', width: '450px', maxHeight: '75vh', borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' };
const searchBox = { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f1f5f9', padding: '14px', borderRadius: '14px', marginBottom: '20px' };
const inputStyle = { border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: '#1e293b' };
const listaContainer = { overflowY: 'auto', flex: 1, paddingRight: '5px' };
const paisItem = { padding: '14px', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s', marginBottom: '4px', border: '1px solid transparent' };

export default App;