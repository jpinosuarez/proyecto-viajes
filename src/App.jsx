import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from './components/Layout/Sidebar';
import Header from './components/Header/Header';
import DashboardHome from './components/Dashboard/DashboardHome';
import StatsMapa from './components/Dashboard/StatsMapa';
import MapaViajes from './components/Mapa/MapaView'; 
import BentoGrid from './components/Bento/BentoGrid';
import LandingPage from './components/Landing/LandingPage';

import BuscadorModal from './components/Buscador/BuscadorModal';
import EdicionModal from './components/Modals/EdicionModal';
import VisorViaje from './components/VisorViaje/VisorViaje';
import SettingsPage from './pages/Configuracion/SettingsPage';

import { useViajes } from './hooks/useViajes';
import { useAuth } from './context/AuthContext';
import { styles } from './App.styles'; 
import { COUNTRIES_DATA, getFlagUrl } from './utils/countryUtils';

function App() {
  const { usuario, cargando } = useAuth();
  
  const { 
    paisesVisitados, bitacora, bitacoraData, todasLasParadas,
    guardarNuevoViaje, actualizarDetallesViaje, eliminarViaje, agregarParada 
  } = useViajes();
  
  const [vistaActiva, setVistaActiva] = useState('home'); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  
  const [viajeEnEdicionId, setViajeEnEdicionId] = useState(null);
  const [viajeExpandidoId, setViajeExpandidoId] = useState(null);
  const [viajeBorrador, setViajeBorrador] = useState(null); 
  const [ciudadInicialBorrador, setCiudadInicialBorrador] = useState(null);

  const abrirEditor = (viajeId) => setViajeEnEdicionId(viajeId);
  const abrirVisor = (viajeId) => setViajeExpandidoId(viajeId);
  const irAPerfil = () => setVistaActiva('config');
  const limpiarBusqueda = () => setBusqueda('');

  const onLugarSeleccionado = useCallback((lugar) => {
    let datosPais = null;
    let ciudad = null;

    if (lugar.esPais) {
      const paisInfo = COUNTRIES_DATA.find(c => c.code === lugar.code);
      datosPais = { 
        code: lugar.code, 
        nombreEspanol: paisInfo ? paisInfo.name : lugar.nombre, 
        flag: getFlagUrl(lugar.code), 
        continente: 'Mundo',
        latlng: lugar.coordenadas 
      };
    } else {
      const paisInfo = COUNTRIES_DATA.find(c => c.code === lugar.paisCodigo);
      datosPais = { 
        code: lugar.paisCodigo, 
        nombreEspanol: paisInfo ? paisInfo.name : lugar.paisNombre,
        flag: getFlagUrl(lugar.paisCodigo)
      };
      ciudad = { 
        nombre: lugar.nombre, 
        coordenadas: lugar.coordenadas, 
        fecha: new Date().toISOString().split('T')[0],
        paisCodigo: lugar.paisCodigo
      };
    }

    setMostrarBuscador(false);
    setFiltro('');

    const nuevoBorrador = {
      id: 'new',
      code: datosPais.code,
      nombreEspanol: datosPais.nombreEspanol,
      flag: datosPais.flag, 
      continente: 'Mundo',
      titulo: `Viaje a ${datosPais.nombreEspanol}`,
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date().toISOString().split('T')[0],
      foto: null 
    };
    
    setViajeBorrador(nuevoBorrador);
    setCiudadInicialBorrador(ciudad);
  }, []);

  // Guardado desde el Modal (Creación/Edición Completa)
  const handleGuardarModal = async (id, datosCombinados) => {
    const { paradasNuevas, ...datosViaje } = datosCombinados;

    if (id === 'new') {
      let todasLasParadas = [...(paradasNuevas || [])];
      if (ciudadInicialBorrador) {
          const yaExiste = todasLasParadas.some(p => p.nombre === ciudadInicialBorrador.nombre);
          if (!yaExiste) todasLasParadas.unshift(ciudadInicialBorrador);
      }

      const nuevoId = await guardarNuevoViaje(datosViaje, todasLasParadas);
      
      if (nuevoId) {
          setViajeBorrador(null);
          setCiudadInicialBorrador(null);
          setTimeout(() => abrirVisor(nuevoId), 500);
      }
    } else {
      actualizarDetallesViaje(id, datosViaje);
      if (paradasNuevas && paradasNuevas.length > 0) {
         // Solo agregar paradas con IDs temporales (nuevas)
         const nuevasReales = paradasNuevas.filter(p => p.id && p.id.toString().startsWith('temp'));
         for (const parada of nuevasReales) {
            await agregarParada(parada, id);
         }
      }
    }
  };

  // Guardado desde el Visor (Edición Rápida)
  const handleGuardarDesdeVisor = async (id, datosCombinados) => {
      const { paradasNuevas, ...datosViaje } = datosCombinados;
      
      // 1. Actualizar datos principales
      await actualizarDetallesViaje(id, datosViaje);

      // 2. Procesar paradas (solo las nuevas agregadas en el visor)
      if (paradasNuevas && paradasNuevas.length > 0) {
          const nuevas = paradasNuevas.filter(p => p.id && p.id.toString().startsWith('temp'));
          for (const parada of nuevas) {
              await agregarParada(parada, id);
          }
      }
  };

  const handleDeleteViaje = async (id) => {
      await eliminarViaje(id);
      setViajeExpandidoId(null); // Cerrar visor si estaba abierto
      setViajeEnEdicionId(null);
  };

  const getTituloHeader = () => {
    switch(vistaActiva) {
      case 'home': return 'Inicio';
      case 'mapa': return 'Mapa Mundial';
      case 'bitacora': return 'Mi Bitácora';
      case 'config': return 'Ajustes';
      default: return 'Keeptrip';
    }
  };

  useEffect(() => {
    if (vistaActiva !== 'bitacora' && busqueda) {
      setBusqueda('');
    }
  }, [vistaActiva, busqueda]);

  if (!cargando && !usuario) return <LandingPage />;

  const viajeParaEditar = viajeEnEdicionId ? bitacora.find(v => v.id === viajeEnEdicionId) : viajeBorrador;
  const mostrarBusqueda = vistaActiva === 'bitacora';
  const placeholderBusqueda = 'Buscar viajes, países o ciudades...';

  return (
    <div style={styles.appWrapper}>
      <Sidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} collapsed={sidebarCollapsed} toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}/>

      <motion.main style={{...styles.mainContent, marginLeft: sidebarCollapsed ? '80px' : '260px'}}>
        <Header
          titulo={getTituloHeader()}
          onAddClick={() => setMostrarBuscador(true)}
          onProfileClick={irAPerfil}
          mostrarBusqueda={mostrarBusqueda}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          onBusquedaClear={limpiarBusqueda}
          searchPlaceholder={placeholderBusqueda}
        />

        <section style={styles.sectionWrapper}>
          <AnimatePresence mode="wait">
            {vistaActiva === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.scrollableContent} className="custom-scroll">
                <DashboardHome paisesVisitados={paisesVisitados} bitacora={bitacora} setVistaActiva={setVistaActiva} abrirVisor={abrirVisor} />
              </motion.div>
            )}
            {vistaActiva === 'mapa' && (
              <motion.div key="mapa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.containerMapaStyle}>
                <div style={styles.mapStatsOverlay}><StatsMapa bitacora={bitacora} paisesVisitados={paisesVisitados} /></div>
                <MapaViajes paises={paisesVisitados} paradas={todasLasParadas} />
              </motion.div>
            )}
            {vistaActiva === 'bitacora' && (
              <motion.div key="bitacora" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.scrollableContent} className="custom-scroll">
                <BentoGrid
                  viajes={bitacora}
                  bitacoraData={bitacoraData}
                  manejarEliminar={eliminarViaje}
                  abrirEditor={abrirEditor}
                  abrirVisor={abrirVisor}
                  searchTerm={busqueda}
                  onClearSearch={limpiarBusqueda}
                />
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

      <EdicionModal 
        viaje={viajeParaEditar} 
        bitacoraData={bitacoraData} 
        onClose={() => { setViajeEnEdicionId(null); setViajeBorrador(null); }} 
        onSave={handleGuardarModal} 
        esBorrador={!!viajeBorrador}
        ciudadInicial={ciudadInicialBorrador}
      />

      <VisorViaje 
        viajeId={viajeExpandidoId} 
        bitacoraLista={bitacora} 
        bitacoraData={bitacoraData} 
        onClose={() => setViajeExpandidoId(null)} 
        onEdit={abrirEditor} 
        onSave={handleGuardarDesdeVisor} // CORREGIDO: Usar el handler wrapper
        onDelete={handleDeleteViaje}     // NUEVO: Pasar función de borrar
      />
    </div>
  );
}

export default App;
