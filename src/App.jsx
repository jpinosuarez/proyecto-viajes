import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from './components/Layout/Sidebar';
import Header from './components/Header/Header';
import DashboardHome from './components/Dashboard/DashboardHome';
import StatsMapa from './components/Dashboard/StatsMapa';
import MapaViajes from './components/Mapa/MapaView'; // Mapa 3D para Sección Mapa
import BentoGrid from './components/Bento/BentoGrid';
import LandingPage from './components/Landing/LandingPage';

import BuscadorModal from './components/Buscador/BuscadorModal';
import EdicionModal from './components/Modals/EdicionModal';
import VisorViaje from './components/VisorViaje/VisorViaje';
import SettingsPage from './pages/Configuracion/SettingsPage';

import { useViajes } from './hooks/useViajes';
import { useAuth } from './context/AuthContext';
import { styles } from './App.styles'; 
import { COUNTRIES_DATA } from './utils/countryUtils';

function App() {
  const { usuario, cargando } = useAuth();
  
  const { 
    paisesVisitados, bitacora, bitacoraData, todasLasParadas,
    guardarNuevoViaje, agregarParada, 
    actualizarDetallesViaje, eliminarViaje 
  } = useViajes();
  
  const [vistaActiva, setVistaActiva] = useState('home'); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  
  // Estado de Selección
  const [viajeEnEdicionId, setViajeEnEdicionId] = useState(null);
  const [viajeExpandidoId, setViajeExpandidoId] = useState(null);
  const [viajeBorrador, setViajeBorrador] = useState(null); 
  const [ciudadInicialBorrador, setCiudadInicialBorrador] = useState(null);

  const abrirEditor = (viajeId) => setViajeEnEdicionId(viajeId);
  const abrirVisor = (viajeId) => setViajeExpandidoId(viajeId);
  const irAPerfil = () => setVistaActiva('config');

  // Lógica Principal de Selección (Buscador)
  const onLugarSeleccionado = useCallback((lugar) => {
    let datosPais = null;
    let ciudad = null;

    if (lugar.esPais) {
      // Buscar en nuestra lista hardcoded para tener nombre oficial en español
      const paisInfo = COUNTRIES_DATA.find(c => c.code === lugar.code);
      datosPais = { 
        code: lugar.code, 
        nombreEspanol: paisInfo ? paisInfo.name : lugar.nombre, 
        flag: `https://flagcdn.com/${lugar.code.toLowerCase()}.svg`, 
        continente: 'Mundo',
        latlng: lugar.coordenadas 
      };
    } else {
      // Es ciudad
      const paisInfo = COUNTRIES_DATA.find(c => c.code === lugar.paisCodigo);
      datosPais = { 
        code: lugar.paisCodigo, 
        nombreEspanol: paisInfo ? paisInfo.name : lugar.paisNombre,
        flag: `https://flagcdn.com/${lugar.paisCodigo.toLowerCase()}.svg`
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

    // CORRECCIÓN LÓGICA: SIEMPRE CREAMOS UN NUEVO BORRADOR PARA "AÑADIR VIAJE"
    // No buscamos si existe, porque el usuario quiere AGREGAR uno nuevo.
    
    const nuevoBorrador = {
      id: 'new',
      code: datosPais.code,
      nombreEspanol: datosPais.nombreEspanol,
      flag: datosPais.flag, // URL del SVG
      continente: 'Mundo',
      titulo: `Viaje a ${datosPais.nombreEspanol}`,
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date().toISOString().split('T')[0],
      foto: null 
    };
    
    setViajeBorrador(nuevoBorrador);
    setCiudadInicialBorrador(ciudad);
    
  }, []);

  const handleGuardarViaje = async (id, datosCombinados) => {
    const { paradasNuevas, ...datosViaje } = datosCombinados;

    if (id === 'new') {
      // Crear Nuevo Viaje
      const nuevoId = await guardarNuevoViaje(datosViaje, null);
      
      if (nuevoId) {
          // Si había ciudad inicial en el borrador, se guarda
          if (ciudadInicialBorrador && (!paradasNuevas || paradasNuevas.length === 0)) {
             await agregarParada(ciudadInicialBorrador, nuevoId);
          }
          // Si el usuario agregó paradas en el modal
          if (paradasNuevas && paradasNuevas.length > 0) {
              for (const parada of paradasNuevas) {
                  await agregarParada(parada, nuevoId);
              }
          }
      }
      
      setViajeBorrador(null);
      setCiudadInicialBorrador(null);
      setTimeout(() => abrirVisor(nuevoId), 500); 

    } else {
      // Editar Existente
      actualizarDetallesViaje(id, datosViaje);
      if (paradasNuevas && paradasNuevas.length > 0) {
         // Filtrar las que son nuevas (tienen ID temporal)
         const nuevasReales = paradasNuevas.filter(p => p.id && p.id.toString().startsWith('temp'));
         for (const parada of nuevasReales) {
            await agregarParada(parada, id);
         }
      }
    }
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

  if (!cargando && !usuario) return <LandingPage />;

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
                {/* Mapa 3D Interactivo Completo */}
                <MapaViajes paises={paisesVisitados} paradas={todasLasParadas} />
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

      <EdicionModal 
        viaje={viajeParaEditar} 
        bitacoraData={bitacoraData} 
        onClose={() => { setViajeEnEdicionId(null); setViajeBorrador(null); }} 
        onSave={handleGuardarViaje} 
        esBorrador={!!viajeBorrador}
        ciudadInicial={ciudadInicialBorrador}
      />

      <VisorViaje viajeId={viajeExpandidoId} bitacoraLista={bitacora} bitacoraData={bitacoraData} onClose={() => setViajeExpandidoId(null)} onEdit={abrirEditor} onSave={actualizarDetallesViaje} />
    </div>
  );
}

export default App;