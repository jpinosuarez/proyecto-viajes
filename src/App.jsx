import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from './components/Sidebar';
import Header from './components/Header/Header';
import StatsMapa from './components/Dashboard/StatsMapa'; 
import MapaViajes from './components/Mapa/MapaView';
import BuscadorModal from './components/Buscador/BuscadorModal';
import BentoGrid from './components/Bento/BentoGrid';
import DashboardHome from './components/Dashboard/DashboardHome'; 
import EdicionModal from './components/Modals/EdicionModal';
import LandingPage from './components/Landing/LandingPage'; // NUEVO
import VisorViaje from './components/VisorViaje/VisorViaje'; // NUEVO

import { useViajes } from './hooks/useViajes';
import { useAuth } from './context/AuthContext'; // Importar Auth
import { styles } from './App.styles'; 

function App() {
  const { usuario, cargando } = useAuth(); // Estado de autenticación
  
  const { 
    paisesVisitados, bitacora, bitacoraData, listaPaises, 
    agregarViaje, actualizarDetallesViaje, manejarCambioPaises, eliminarViaje 
  } = useViajes();
  
  const [vistaActiva, setVistaActiva] = useState('home'); 
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [destino, setDestino] = useState(null);
  
  // Estado para el Editor (Modal pequeño)
  const [viajeEnEdicionId, setViajeEnEdicionId] = useState(null);
  // Estado para el Visor (Pantalla completa - Shared State)
  const [viajeExpandidoId, setViajeExpandidoId] = useState(null);

  // Helpers
  const abrirEditor = (viajeId) => setViajeEnEdicionId(viajeId);
  const abrirVisor = (viajeId) => setViajeExpandidoId(viajeId);

  const seleccionarPais = useCallback(async (pais) => {
    const nuevoId = await agregarViaje(pais);
    if (nuevoId) {
      setDestino({ longitude: pais.latlng[1], latitude: pais.latlng[0], zoom: 4, essential: true });
      setVistaActiva('mapa'); 
      setMostrarBuscador(false);
      setFiltro('');
      setTimeout(() => abrirEditor(nuevoId), 300);
    }
  }, [agregarViaje]);

  const onMapaPaisToggle = async (nuevosCodes) => {
    const nuevoId = await manejarCambioPaises(nuevosCodes);
    if (nuevoId) {
      abrirEditor(nuevoId);
    }
  };

  const getTituloHeader = () => {
    switch(vistaActiva) {
      case 'home': return 'Panel de Inicio';
      case 'mapa': return 'Exploración Global';
      case 'bitacora': return 'Mi Bitácora';
      default: return 'Keeptrip';
    }
  };

  // 1. Si no hay usuario, mostrar Landing Page
  if (!cargando && !usuario) {
    return <LandingPage />;
  }

  const viajeParaEditar = bitacora.find(v => v.id === viajeEnEdicionId);

  return (
    <div style={styles.appWrapper}>
      <Sidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

      <main style={styles.mainContent}>
        <Header titulo={getTituloHeader()} onAddClick={() => setMostrarBuscador(true)} />

        <section style={styles.sectionWrapper}>
          <AnimatePresence mode="wait">
            {vistaActiva === 'home' && (
              <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                style={styles.scrollableContent} className="custom-scroll">
                <DashboardHome 
                  paisesVisitados={paisesVisitados} 
                  bitacora={bitacora} 
                  setVistaActiva={setVistaActiva}
                  abrirVisor={abrirVisor} // Pasamos la función para abrir el detalle
                />
              </motion.div>
            )}

            {vistaActiva === 'mapa' && (
              <motion.div key="mapa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.containerMapaStyle}>
                <StatsMapa bitacora={bitacora} paisesVisitados={paisesVisitados} />
                <MapaViajes paises={paisesVisitados} setPaises={onMapaPaisToggle} destino={destino} />
              </motion.div>
            )}

            {vistaActiva === 'bitacora' && (
              <motion.div key="bitacora" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                style={styles.scrollableContent} className="custom-scroll">
                <BentoGrid 
                  viajes={bitacora} 
                  bitacoraData={bitacoraData} 
                  manejarEliminar={eliminarViaje}
                  abrirEditor={abrirEditor}
                  abrirVisor={abrirVisor} // Ahora usa el estado global
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <BuscadorModal 
        isOpen={mostrarBuscador} onClose={() => setMostrarBuscador(false)} 
        filtro={filtro} setFiltro={setFiltro} listaPaises={listaPaises} 
        seleccionarPais={seleccionarPais} paisesVisitados={paisesVisitados} 
      />

      {/* Editor Modal (Datos rápidos) */}
      <EdicionModal 
        viaje={viajeParaEditar} 
        bitacoraData={bitacoraData} 
        onClose={() => setViajeEnEdicionId(null)} 
        onSave={actualizarDetallesViaje} 
      />

      {/* Visor Inmersivo (Pantalla Completa) */}
      <VisorViaje 
        viajeId={viajeExpandidoId}
        bitacoraLista={bitacora}
        bitacoraData={bitacoraData}
        onClose={() => setViajeExpandidoId(null)}
        onEdit={abrirEditor}
        onSave={actualizarDetallesViaje}
      />
    </div>
  );
}

export default App;