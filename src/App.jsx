import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes Modularizados
import Sidebar from './components/Sidebar';
import Stats from './components/Dashboard/Stats';
import Portada from './components/Pasaporte/Portada';
import PerfilBiometrico from './components/Pasaporte/PerfilBiometrico';
import PaginaSellos from './components/Pasaporte/PaginaSellos';
import MapaViajes from './components/MapaViajes';
import BuscadorModal from './components/Buscador/BuscadorModal';

// Hooks y Assets
import { useViajes } from './hooks/useViajes';
import './components/Pasaporte/Pasaporte.css';
import selloARG from './assets/sellos/sello_ARG.png'; 
import { Globe, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  // --- LÓGICA DE DATOS (CUSTOM HOOK) ---
  const { paisesVisitados, listaPaises, agruparPorRegion, manejarCambioPaises } = useViajes();
  
  // --- ESTADOS DE INTERFAZ ---
  const [vistaActiva, setVistaActiva] = useState('mapa'); 
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [destino, setDestino] = useState(null);
  const [paginaActual, setPaginaActual] = useState(0);

  const MAPA_SELLOS = { ARG: selloARG };
  const paisesAgrupados = agruparPorRegion();
  const regionesDisponibles = Object.keys(paisesAgrupados);
  const regionMostrada = regionesDisponibles[paginaActual];

  // --- MANEJADORES ---
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
      
      {/* 1. NAVEGACIÓN LATERAL */}
      <Sidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* 2. CABECERA */}
        <header style={headerStyle}>
          <h2 style={{ fontSize: '1.1rem', color: '#475569' }}>
            {vistaActiva === 'mapa' ? 'Mapa Interactivo' : 'Mi Pasaporte Digital'}
          </h2>
          <button style={buttonStyle} onClick={() => setMostrarBuscador(true)}>
            + Añadir Destino
          </button>
        </header>

        {/* 3. ESTADÍSTICAS */}
        <Stats stats={statsData} />

        {/* 4. ÁREA DE CONTENIDO DINÁMICO */}
        <section style={mainContentStyle}>
          <AnimatePresence mode="wait">
            {vistaActiva === 'mapa' ? (
              <motion.div key="mapa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', width: '100%' }}>
                <MapaViajes paises={paisesVisitados} setPaises={manejarCambioPaises} destino={destino} />
              </motion.div>
            ) : (
              <motion.div key="pasaporte" className="libro-abierto" style={libroStyle}>
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

                  {/* NAVEGACIÓN INTERNA DEL PASAPORTE */}
                  <div style={footerPasaporteStyle}>
                    <button disabled={paginaActual === 0} onClick={() => setPaginaActual(p => p - 1)} style={btnNavStyle}>
                      <ChevronLeft size={18} /> Anterior
                    </button>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>{regionMostrada}</span>
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

      {/* 5. MODAL DE BÚSQUEDA */}
      <BuscadorModal 
        isOpen={mostrarBuscador}
        onClose={() => setMostrarBuscador(false)}
        filtro={filtro}
        setFiltro={setFiltro}
        listaPaises={listaPaises}
        seleccionarPais={seleccionarPais}
        paisesVisitados={paisesVisitados}
      />
    </div>
  );
}

// --- ESTILOS DE SOPORTE (CLEAN UI) ---
const headerStyle = { height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' };
const mainContentStyle = { flex: 1, margin: '0 25px 25px 25px', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: 'white', display: 'flex', position: 'relative' };
const libroStyle = { height: '90%', margin: 'auto', width: '90%' };
const footerPasaporteStyle = { marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #e2e8f0' };
const texturaPapelStyle = { flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: '#fdfbf7', backgroundImage: `linear-gradient(90deg, rgba(200,0,0,.02) 50%, transparent 0), linear-gradient(rgba(200,0,0,.02) 50%, transparent 0), radial-gradient(circle at 50% 50%, rgba(0,0,0,0.01) 1px, transparent 1px)`, backgroundSize: '100% 2px, 2px 100%, 18px 18px' };
const btnNavStyle = { background: 'white', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' };
const buttonStyle = { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' };

export default App;