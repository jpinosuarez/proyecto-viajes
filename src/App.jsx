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
    buscarPaisEnCatalogo, guardarNuevoViaje, agregarParada, // Hooks actualizados
    actualizarDetallesViaje, manejarCambioPaises, eliminarViaje 
  } = useViajes();
  
  const [vistaActiva, setVistaActiva] = useState('home'); 
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [destino, setDestino] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [viajeEnEdicionId, setViajeEnEdicionId] = useState(null);
  const [viajeExpandidoId, setViajeExpandidoId] = useState(null);
  
  // NUEVO ESTADO: Viaje en Borrador (Para el Modal de Config Rápida)
  const [viajeBorrador, setViajeBorrador] = useState(null); 
  const [ciudadInicialBorrador, setCiudadInicialBorrador] = useState(null);

  const abrirEditor = (viajeId) => setViajeEnEdicionId(viajeId);
  const abrirVisor = (viajeId) => setViajeExpandidoId(viajeId);
  const irAPerfil = () => setVistaActiva('config');

  // Lógica de Selección: Prepara el borrador y abre modal, NO guarda directo
  const onLugarSeleccionado = useCallback((lugar) => {
    let datosPais = null;
    let ciudad = null;

    if (lugar.esPais) {
      // Intentar matchear con catálogo
      datosPais = listaPaises.find(p => p.code === lugar.code) 
                  || listaPaises.find(p => p.name.toLowerCase().includes(lugar.nombre.toLowerCase()));
      
      if (!datosPais) datosPais = { code: lugar.code, nombreEspanol: lugar.nombre, flag: '🌍', continente: 'Mundo', latlng: lugar.coordenadas };
    } else {
      // Es ciudad, buscar país padre
      datosPais = buscarPaisEnCatalogo(lugar.paisNombre, lugar.paisCodigo);
      if (!datosPais) {
        alert("País no soportado aún para esta ciudad.");
        return;
      }
      ciudad = { nombre: lugar.nombre, coordenadas: lugar.coordenadas, fecha: new Date().toISOString().split('T')[0] };
    }

    // Verificar si el viaje ya existe
    const viajeExistente = bitacora.find(v => v.code === datosPais.code);

    setMostrarBuscador(false);
    setFiltro('');

    if (viajeExistente) {
      // Si existe, si era ciudad, la agregamos directo? O abrimos editor? 
      // El prompt pide modal rápido siempre.
      if (ciudad) agregarParada(ciudad, viajeExistente.id);
      
      setDestino({ longitude: lugar.coordenadas[0], latitude: lugar.coordenadas[1], zoom: 6, essential: true });
      setVistaActiva('mapa');
      setTimeout(() => abrirEditor(viajeExistente.id), 500);
    } else {
      // NO EXISTE: Preparamos borrador
      const nuevoBorrador = {
        id: 'new', // Flag para el modal
        code: datosPais.code,
        nombreEspanol: datosPais.nombreEspanol,
        flag: datosPais.flag,
        continente: datosPais.continente,
        latlng: datosPais.latlng,
        titulo: `Viaje a ${datosPais.nombreEspanol}`,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: new Date().toISOString().split('T')[0],
        foto: null // Foto vacía para disparar lógica de API
      };
      
      setViajeBorrador(nuevoBorrador);
      setCiudadInicialBorrador(ciudad);
      
      // UX: Mover mapa al destino mientras edita
      setDestino({ longitude: datosPais.latlng[1], latitude: datosPais.latlng[0], zoom: 4, essential: true });
      setVistaActiva('mapa');
    }
  }, [bitacora, listaPaises, buscarPaisEnCatalogo, agregarParada]);

  // Handler de Guardado desde Modal
  const handleGuardarViaje = async (id, datos) => {
    if (id === 'new') {
      // Crear Nuevo
      const nuevoId = await guardarNuevoViaje(datos, ciudadInicialBorrador);
      if (nuevoId) {
        setViajeBorrador(null);
        setCiudadInicialBorrador(null);
        setTimeout(() => abrirVisor(nuevoId), 500); // Llevar al visor al terminar
      }
    } else {
      // Editar Existente
      actualizarDetallesViaje(id, datos);
    }
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
      case 'config': return 'Ajustes';
      default: return 'Keeptrip';
    }
  };

  if (!cargando && !usuario) return <LandingPage />;

  // Determinar qué viaje pasar al modal (Existente o Borrador)
  const viajeParaEditar = viajeEnEdicionId ? bitacora.find(v => v.id === viajeEnEdicionId) : viajeBorrador;

  return (
    <div style={styles.appWrapper}>
      <Sidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} collapsed={sidebarCollapsed} toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}/>

      <motion.main style={{...styles.mainContent, marginLeft: sidebarCollapsed ? '80px' : '260px'}}>
        <Header titulo={getTituloHeader()} onAddClick={() => setMostrarBuscador(true)} onProfileClick={irAPerfil} />

        <section style={styles.sectionWrapper}>
          <AnimatePresence mode="wait">
            {vistaActiva === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.scrollableContent} className="custom-scroll">
                <DashboardHome paisesVisitados={paisesVisitados} bitacora={bitacora} setVistaActiva={setVistaActiva} abrirVisor={abrirVisor} />
              </motion.div>
            )}
            {vistaActiva === 'mapa' && (
              <motion.div key="mapa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.containerMapaStyle}>
                <StatsMapa bitacora={bitacora} paisesVisitados={paisesVisitados} />
                <MapaViajes paises={paisesVisitados} setPaises={onMapaPaisToggle} destino={destino} paradas={todasLasParadas} />
              </motion.div>
            )}
            {vistaActiva === 'bitacora' && (
              <motion.div key="bitacora" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.scrollableContent} className="custom-scroll">
                <BentoGrid viajes={bitacora} bitacoraData={bitacoraData} manejarEliminar={eliminarViaje} abrirEditor={abrirEditor} abrirVisor={abrirVisor} />
              </motion.div>
            )}
            {vistaActiva === 'config' && (
              <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.scrollableContent} className="custom-scroll">
                <SettingsPage />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </motion.main>

      <BuscadorModal isOpen={mostrarBuscador} onClose={() => setMostrarBuscador(false)} filtro={filtro} setFiltro={setFiltro} seleccionarLugar={onLugarSeleccionado} />

      {/* Modal Reutilizado para Edición y Creación Rápida */}
      <EdicionModal 
        viaje={viajeParaEditar} 
        bitacoraData={bitacoraData} // Solo útil para edición, no borrador
        onClose={() => { setViajeEnEdicionId(null); setViajeBorrador(null); }} 
        onSave={handleGuardarViaje} 
        esBorrador={!!viajeBorrador}
        ciudadInicial={ciudadInicialBorrador}
      />

      <VisorViaje viajeId={viajeExpandidoId} bitacoraLista={bitacora} bitacoraData={bitacoraData} onClose={() => setViajeExpandidoId(null)} onEdit={abrirEditor} onSave={actualizarDetallesViaje} onAddParada={() => { setViajeExpandidoId(null); setMostrarBuscador(true); }} />
    </div>
  );
}

export default App;