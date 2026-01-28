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

import { useViajes } from './hooks/useViajes';
import { styles } from './App.styles'; 

function App() {
  const { 
    paisesVisitados, bitacora, bitacoraData, listaPaises, 
    agregarViaje, actualizarDetallesViaje, manejarCambioPaises, eliminarViaje 
  } = useViajes();
  
  const [vistaActiva, setVistaActiva] = useState('home'); 
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [destino, setDestino] = useState(null);
  
  const [viajeEnEdicionId, setViajeEnEdicionId] = useState(null);

  const abrirEditor = (viajeId) => setViajeEnEdicionId(viajeId);

  const seleccionarPais = useCallback((pais) => {
    const nuevoId = agregarViaje(pais);
    setDestino({ longitude: pais.latlng[1], latitude: pais.latlng[0], zoom: 4, essential: true });
    setVistaActiva('mapa'); 
    setMostrarBuscador(false);
    setFiltro('');
    setTimeout(() => abrirEditor(nuevoId), 300);
  }, [agregarViaje]);

  const onMapaPaisToggle = (nuevosCodes) => {
    const nuevoId = manejarCambioPaises(nuevosCodes);
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
                <DashboardHome paisesVisitados={paisesVisitados} bitacora={bitacora} setVistaActiva={setVistaActiva} />
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
                {/* AQUÍ ESTABA EL ERROR: Faltaba pasar la función actualizarDetallesViaje */}
                <BentoGrid 
                  viajes={bitacora} 
                  bitacoraData={bitacoraData} 
                  manejarEliminar={eliminarViaje}
                  abrirEditor={abrirEditor}
                  actualizarDetallesViaje={actualizarDetallesViaje} 
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

      <EdicionModal 
        viaje={viajeParaEditar} 
        bitacoraData={bitacoraData} 
        onClose={() => setViajeEnEdicionId(null)} 
        onSave={actualizarDetallesViaje} 
      />
    </div>
  );
}

export default App;