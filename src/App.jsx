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
import PerfilModal from './components/Modals/PerfilModal'; // NUEVO

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
  const [mostrarPerfil, setMostrarPerfil] = useState(false); // NUEVO
  const [filtro, setFiltro] = useState('');
  const [destino, setDestino] = useState(null);
  
  const [viajeEnEdicionId, setViajeEnEdicionId] = useState(null);
  const [viajeExpandidoId, setViajeExpandidoId] = useState(null);

  const abrirEditor = (viajeId) => setViajeEnEdicionId(viajeId);
  const abrirVisor = (viajeId) => setViajeExpandidoId(viajeId);

  // LÓGICA CORE: Selección de Lugar
  const onLugarSeleccionado = useCallback(async (lugar) => {
    let viajeId = null;

    if (lugar.esPais) {
      // 1. Es País: Buscamos en catálogo o creamos
      const paisCatalogo = listaPaises.find(p => p.code === lugar.code) 
                        || listaPaises.find(p => p.name.toLowerCase().includes(lugar.nombre.toLowerCase()));
      if (paisCatalogo) viajeId = await agregarViaje(paisCatalogo);
    } else {
      // 2. Es Ciudad: Agregamos parada
      viajeId = await agregarParada(lugar);
    }

    if (viajeId) {
      setDestino({ 
        longitude: lugar.coordenadas[0], 
        latitude: lugar.coordenadas[1], 
        zoom: lugar.esPais ? 4 : 11,
        essential: true 
      });
      setVistaActiva('mapa'); 
      setMostrarBuscador(false);
      setFiltro('');
      
      // UX MEJORADA: Si es ciudad, abrimos el Visor inmediatamente para ver el contexto
      // Si es país nuevo, abrimos el Editor de título/fecha
      setTimeout(() => {
        if (!lugar.esPais) {
          abrirVisor(viajeId);
        } else {
          abrirEditor(viajeId);
        }
      }, 800);
    }
  }, [agregarViaje, agregarParada, listaPaises]);

  // Handler para agregar parada desde el Visor
  const handleAddParadaDesdeVisor = (viajeId) => {
    // Cerramos visor y abrimos buscador, pero podríamos pasarle el contexto del país
    // Por simplicidad, abrimos buscador general
    setViajeExpandidoId(null);
    setMostrarBuscador(true);
  };

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
        {/* Pasamos onProfileClick para abrir el modal */}
        <Header 
          titulo={getTituloHeader()} 
          onAddClick={() => setMostrarBuscador(true)} 
          onProfileClick={() => setMostrarPerfil(true)} 
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
        onAddParada={handleAddParadaDesdeVisor} // Nuevo botón + en visor
      />

      <PerfilModal 
        isOpen={mostrarPerfil} 
        onClose={() => setMostrarPerfil(false)} 
      />
    </div>
  );
}

export default App;