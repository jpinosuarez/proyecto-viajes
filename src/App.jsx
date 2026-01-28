import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from './components/Sidebar';
import Header from './components/Header/Header';
// Importamos los nuevos componentes de Stats especializados
import StatsMapa from './components/Dashboard/StatsMapa'; 
import MapaViajes from './components/Mapa/MapaView';
import BuscadorModal from './components/Buscador/BuscadorModal';
import BentoGrid from './components/Bento/BentoGrid';
import DashboardHome from './components/Dashboard/DashboardHome'; 

import { useViajes } from './hooks/useViajes';
import { styles } from './App.styles'; 

function App() {
  const { 
    paisesVisitados, 
    bitacora, 
    bitacoraData, 
    listaPaises, 
    agregarViaje, 
    actualizarDetallesViaje, 
    manejarCambioPaises, 
    eliminarViaje 
  } = useViajes();
  
  const [vistaActiva, setVistaActiva] = useState('home'); 
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [destino, setDestino] = useState(null);

  const seleccionarPais = useCallback((pais) => {
    agregarViaje(pais);
    setDestino({ 
      longitude: pais.latlng[1], 
      latitude: pais.latlng[0], 
      zoom: 4,
      essential: true 
    });
    setVistaActiva('mapa'); 
    cerrarBuscador();
  }, [agregarViaje]);

  const cerrarBuscador = () => {
    setMostrarBuscador(false);
    setFiltro('');
  };

  const getTituloHeader = () => {
    switch(vistaActiva) {
      case 'home': return 'Panel de Inicio';
      case 'mapa': return 'Exploración Global';
      case 'bitacora': return 'Mi Bitácora';
      default: return 'Keeptrip';
    }
  };

  return (
    <div style={styles.appWrapper}>
      <Sidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

      <main style={styles.mainContent}>
        <Header 
          titulo={getTituloHeader()} 
          onAddClick={() => setMostrarBuscador(true)} 
        />

        {/* Eliminamos la barra de Stats global de aquí para que no se duplique */}

        <section style={styles.sectionWrapper}>
          <AnimatePresence mode="wait">
            {vistaActiva === 'home' && (
              <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                style={styles.scrollableContent} className="custom-scroll">
                <DashboardHome paisesVisitados={paisesVisitados} bitacora={bitacora} setVistaActiva={setVistaActiva} />
              </motion.div>
            )}

            {vistaActiva === 'mapa' && (
              <motion.div key="mapa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.containerMapaStyle}>
                {/* Aquí inyectamos los Stats exclusivos del Mapa */}
                <StatsMapa bitacora={bitacora} paisesVisitados={paisesVisitados} />
                <MapaViajes paises={paisesVisitados} setPaises={manejarCambioPaises} destino={destino} />
              </motion.div>
            )}

            {vistaActiva === 'bitacora' && (
              <motion.div key="bitacora" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                style={styles.scrollableContent} className="custom-scroll">
                <BentoGrid 
                  viajes={bitacora} 
                  bitacoraData={bitacoraData} 
                  actualizarDetallesViaje={actualizarDetallesViaje} 
                  manejarEliminar={eliminarViaje}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <BuscadorModal 
        isOpen={mostrarBuscador} onClose={cerrarBuscador} filtro={filtro} setFiltro={setFiltro} 
        listaPaises={listaPaises || []} seleccionarPais={seleccionarPais} paisesVisitados={paisesVisitados} 
      />
    </div>
  );
}

export default App;