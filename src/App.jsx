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
import LandingPage from './components/Landing/LandingPage';
import VisorViaje from './components/VisorViaje/VisorViaje';

import { useViajes } from './hooks/useViajes';
import { useAuth } from './context/AuthContext';
import { styles } from './App.styles'; 

function App() {
  const { usuario, cargando } = useAuth();
  
  const { 
    paisesVisitados, bitacora, bitacoraData, listaPaises, todasLasParadas, // <--- NUEVO
    agregarViaje, agregarParada, 
    actualizarDetallesViaje, manejarCambioPaises, eliminarViaje 
  } = useViajes();
  
  const [vistaActiva, setVistaActiva] = useState('home'); 
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [destino, setDestino] = useState(null);
  
  const [viajeEnEdicionId, setViajeEnEdicionId] = useState(null);
  const [viajeExpandidoId, setViajeExpandidoId] = useState(null);

  const abrirEditor = (viajeId) => setViajeEnEdicionId(viajeId);
  const abrirVisor = (viajeId) => setViajeExpandidoId(viajeId);

  const onLugarSeleccionado = useCallback(async (lugar) => {
    let viajeId = null;

    if (lugar.esPais) {
      const paisCatalogo = listaPaises.find(p => p.code === lugar.code) 
                        || listaPaises.find(p => p.name.includes(lugar.nombre));
      if (paisCatalogo) viajeId = await agregarViaje(paisCatalogo);
    } else {
      viajeId = await agregarParada(lugar);
    }

    if (viajeId) {
      setDestino({ 
        longitude: lugar.coordenadas[0], 
        latitude: lugar.coordenadas[1], 
        zoom: lugar.esPais ? 4 : 11, // Zoom profundo para ciudad
        essential: true 
      });
      setVistaActiva('mapa'); 
      setMostrarBuscador(false);
      setFiltro('');
      if (lugar.esPais) setTimeout(() => abrirEditor(viajeId), 500);
    }
  }, [agregarViaje, agregarParada, listaPaises]);

  const onMapaPaisToggle = async (nuevosCodes) => {
    const nuevoId = await manejarCambioPaises(nuevosCodes);
    if (nuevoId) abrirEditor(nuevoId);
  };

  const getTituloHeader = () => {
    switch(vistaActiva) {
      case 'home': return 'Panel de Inicio';
      case 'mapa': return 'Exploración Global';
      case 'bitacora': return 'Mi Bitácora';
      default: return 'Keeptrip';
    }
  };

  if (!cargando && !usuario) return <LandingPage />;

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
                  abrirVisor={abrirVisor} 
                />
              </motion.div>
            )}

            {vistaActiva === 'mapa' && (
              <motion.div key="mapa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.containerMapaStyle}>
                <StatsMapa bitacora={bitacora} paisesVisitados={paisesVisitados} />
                {/* Pasamos todas las paradas al mapa */}
                <MapaViajes 
                   paises={paisesVisitados} 
                   setPaises={onMapaPaisToggle} 
                   destino={destino} 
                   paradas={todasLasParadas} 
                />
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
                  abrirVisor={abrirVisor} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <BuscadorModal 
        isOpen={mostrarBuscador} onClose={() => setMostrarBuscador(false)} 
        filtro={filtro} setFiltro={setFiltro} listaPaises={listaPaises} 
        seleccionarLugar={onLugarSeleccionado} 
        paisesVisitados={paisesVisitados} 
      />

      <EdicionModal 
        viaje={viajeParaEditar} 
        bitacoraData={bitacoraData} 
        onClose={() => setViajeEnEdicionId(null)} 
        onSave={actualizarDetallesViaje} 
      />

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