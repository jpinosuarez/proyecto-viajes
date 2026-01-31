import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from './components/Layout/Sidebar';
import Header from './components/Header/Header';
import StatsMapa from './components/Dashboard/StatsMapa'; 
import MapaViajes from './components/Mapa/MapaView';
import BuscadorModal from './components/Buscador/BuscadorModal';
import BentoGrid from './components/Bento/BentoGrid';
import DashboardHome from './components/Dashboard/DashboardHome'; 
import EdicionModal from './components/Modals/EdicionModal';
import LandingPage from './components/Landing/LandingPage';
import VisorViaje from './components/VisorViaje/VisorViaje';
import SettingsPage from './pages/Configuracion/SettingsPage';

import { useViajes } from './hooks/useViajes';
import { useAuth } from './context/AuthContext';
import { styles } from './App.styles'; 

function App() {
  const { usuario, cargando } = useAuth();
  
  const { 
    paisesVisitados, bitacora, bitacoraData, listaPaises, todasLasParadas,
    agregarViaje, agregarParada, 
    actualizarDetallesViaje, manejarCambioPaises, eliminarViaje 
  } = useViajes();
  
  const [vistaActiva, setVistaActiva] = useState('home'); 
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [destino, setDestino] = useState(null);
  
  // ESTADO DE UI
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [viajeEnEdicionId, setViajeEnEdicionId] = useState(null);
  const [viajeExpandidoId, setViajeExpandidoId] = useState(null);

  const abrirEditor = (viajeId) => setViajeEnEdicionId(viajeId);
  const abrirVisor = (viajeId) => setViajeExpandidoId(viajeId);
  const irAPerfil = () => setVistaActiva('config');

  const onLugarSeleccionado = useCallback(async (lugar) => {
    let viajeId = null;
    if (lugar.esPais) {
      const paisCatalogo = listaPaises.find(p => p.code === lugar.code) 
                        || listaPaises.find(p => p.name.toLowerCase().includes(lugar.nombre.toLowerCase()));
      if (paisCatalogo) viajeId = await agregarViaje(paisCatalogo);
    } else {
      viajeId = await agregarParada(lugar);
    }

    if (viajeId) {
      setDestino({ 
        longitude: lugar.coordenadas[0], latitude: lugar.coordenadas[1], 
        zoom: lugar.esPais ? 4 : 11, essential: true 
      });
      setVistaActiva('mapa'); 
      setMostrarBuscador(false);
      setFiltro('');
      setTimeout(() => {
        if (!lugar.esPais) abrirVisor(viajeId);
        else abrirEditor(viajeId);
      }, 800);
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
      case 'config': return 'Ajustes';
      default: return 'Keeptrip';
    }
  };

  if (!cargando && !usuario) return <LandingPage />;

  const viajeParaEditar = bitacora.find(v => v.id === viajeEnEdicionId);

  return (
    <div style={styles.appWrapper}>
      
      <Sidebar 
        vistaActiva={vistaActiva} 
        setVistaActiva={setVistaActiva} 
        collapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main usa margin-left dinámico + background diferente en App.styles */}
      <motion.main 
        style={{
          ...styles.mainContent,
          marginLeft: sidebarCollapsed ? '80px' : '260px', 
        }}
      >
        <Header 
          titulo={getTituloHeader()} 
          onAddClick={() => setMostrarBuscador(true)} 
          onProfileClick={irAPerfil} 
        />

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

            {vistaActiva === 'config' && (
              <motion.div key="config" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                style={styles.scrollableContent} className="custom-scroll">
                <SettingsPage />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </motion.main>

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
        onAddParada={() => {
            setViajeExpandidoId(null);
            setMostrarBuscador(true);
        }}
      />
    </div>
  );
}

export default App;