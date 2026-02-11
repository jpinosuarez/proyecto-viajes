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
import ConfirmModal from './components/Modals/ConfirmModal';
import VisorViaje from './components/VisorViaje/VisorViaje';
import SettingsPage from './pages/Configuracion/SettingsPage';

import { useViajes } from './hooks/useViajes';
import { useWindowSize } from './hooks/useWindowSize';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { styles } from './App.styles';
import { COUNTRIES_DATA, getFlagUrl } from './utils/countryUtils';

function App() {
  const { usuario, cargando } = useAuth();
  const { pushToast } = useToast();
  const { isMobile } = useWindowSize(768);

  const {
    paisesVisitados, bitacora, bitacoraData, todasLasParadas,
    guardarNuevoViaje, actualizarDetallesViaje, eliminarViaje, agregarParada
  } = useViajes();

  const [vistaActiva, setVistaActiva] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const [viajeEnEdicionId, setViajeEnEdicionId] = useState(null);
  const [viajeExpandidoId, setViajeExpandidoId] = useState(null);
  const [viajeBorrador, setViajeBorrador] = useState(null);
  const [ciudadInicialBorrador, setCiudadInicialBorrador] = useState(null);
  const [isSavingModal, setIsSavingModal] = useState(false);
  const [isSavingViewer, setIsSavingViewer] = useState(false);
  const [viajesEliminando, setViajesEliminando] = useState(new Set());
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(null);

  const abrirEditor = (viajeId) => setViajeEnEdicionId(viajeId);
  const abrirVisor = (viajeId) => setViajeExpandidoId(viajeId);
  const irAPerfil = () => setVistaActiva('config');
  const limpiarBusqueda = () => setBusqueda('');
  const isDeletingViaje = (id) => viajesEliminando.has(id);

  const onLugarSeleccionado = useCallback((lugar) => {
    let datosPais = null;
    let ciudad = null;

    if (lugar.esPais) {
      const paisInfo = COUNTRIES_DATA.find((c) => c.code === lugar.code);
      datosPais = {
        code: lugar.code,
        nombreEspanol: paisInfo ? paisInfo.name : lugar.nombre,
        flag: getFlagUrl(lugar.code),
        continente: 'Mundo',
        latlng: lugar.coordenadas
      };
    } else {
      const paisInfo = COUNTRIES_DATA.find((c) => c.code === lugar.paisCodigo);
      datosPais = {
        code: lugar.paisCodigo,
        nombreEspanol: paisInfo ? paisInfo.name : lugar.paisNombre,
        flag: getFlagUrl(lugar.paisCodigo)
      };
      ciudad = {
        nombre: lugar.nombre,
        coordenadas: lugar.coordenadas,
        fecha: new Date().toISOString().split('T')[0],
        paisCodigo: lugar.paisCodigo,
        flag: getFlagUrl(lugar.paisCodigo)
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

  const handleGuardarModal = async (id, datosCombinados) => {
    if (isSavingModal) return false;
    setIsSavingModal(true);
    const { paradasNuevas, ...datosViaje } = datosCombinados;

    try {
      if (id === 'new') {
        let todasLasParadasLocal = [...(paradasNuevas || [])];
        if (ciudadInicialBorrador) {
          const yaExiste = todasLasParadasLocal.some((p) => p.nombre === ciudadInicialBorrador.nombre);
          if (!yaExiste) todasLasParadasLocal.unshift(ciudadInicialBorrador);
        }

        const nuevoId = await guardarNuevoViaje(datosViaje, todasLasParadasLocal);
        if (!nuevoId) {
          return false;
        }

        setViajeBorrador(null);
        setCiudadInicialBorrador(null);
        setTimeout(() => abrirVisor(nuevoId), 500);
        return true;
      }

      const okViaje = await actualizarDetallesViaje(id, datosViaje);
      let okParadas = true;

      if (paradasNuevas && paradasNuevas.length > 0) {
        const nuevasReales = paradasNuevas.filter((p) => p.id && p.id.toString().startsWith('temp'));
        for (const parada of nuevasReales) {
          const okParada = await agregarParada(parada, id);
          if (!okParada) okParadas = false;
        }
      }

      if (okViaje && okParadas) {
        return true;
      }

      if (okViaje && !okParadas) {
        pushToast('El viaje se actualizo, pero algunas paradas no se pudieron guardar', 'error');
      }
      return false;
    } finally {
      setIsSavingModal(false);
    }
  };

  const handleGuardarDesdeVisor = async (id, datosCombinados) => {
    if (isSavingViewer) return false;
    setIsSavingViewer(true);
    const { paradasNuevas, ...datosViaje } = datosCombinados;

    try {
      const okViaje = await actualizarDetallesViaje(id, datosViaje);
      let okParadas = true;

      if (paradasNuevas && paradasNuevas.length > 0) {
        const nuevas = paradasNuevas.filter((p) => p.id && p.id.toString().startsWith('temp'));
        for (const parada of nuevas) {
          const okParada = await agregarParada(parada, id);
          if (!okParada) okParadas = false;
        }
      }

      if (okViaje && okParadas) {
        return true;
      }

      if (okViaje && !okParadas) {
        pushToast('El viaje se actualizo, pero algunas paradas no se pudieron guardar', 'error');
      }
      return false;
    } finally {
      setIsSavingViewer(false);
    }
  };

  const solicitarEliminarViaje = (id) => {
    if (!id || viajesEliminando.has(id)) return;
    setConfirmarEliminacion(id);
  };

  const handleDeleteViaje = async () => {
    const id = confirmarEliminacion;
    if (!id || viajesEliminando.has(id)) return false;

    setViajesEliminando((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    try {
      const ok = await eliminarViaje(id);
      if (!ok) return false;
      setViajeExpandidoId(null);
      setViajeEnEdicionId(null);
      return true;
    } finally {
      setConfirmarEliminacion(null);
      setViajesEliminando((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const getTituloHeader = () => {
    switch (vistaActiva) {
      case 'home': return 'Inicio';
      case 'mapa': return 'Mapa Mundial';
      case 'bitacora': return 'Mi Bitacora';
      case 'config': return 'Ajustes';
      default: return 'Keeptrip';
    }
  };

  useEffect(() => {
    if (vistaActiva !== 'bitacora' && busqueda) {
      setBusqueda('');
    }
  }, [vistaActiva, busqueda]);

  useEffect(() => {
    if (isMobile && mobileDrawerOpen) {
      setMobileDrawerOpen(false);
    }
  }, [vistaActiva, isMobile, mobileDrawerOpen]);

  useEffect(() => {
    if (!isMobile && mobileDrawerOpen) {
      setMobileDrawerOpen(false);
    }
  }, [isMobile, mobileDrawerOpen]);

  if (!cargando && !usuario) return <LandingPage />;

  const viajeParaEditar = viajeEnEdicionId ? bitacora.find((v) => v.id === viajeEnEdicionId) : viajeBorrador;
  const viajeAEliminar = confirmarEliminacion
    ? (bitacoraData[confirmarEliminacion] || bitacora.find((v) => v.id === confirmarEliminacion))
    : null;
  const tituloViajeAEliminar = viajeAEliminar?.titulo || viajeAEliminar?.nombreEspanol || 'este viaje';
  const mostrarBusqueda = vistaActiva === 'bitacora';
  const placeholderBusqueda = 'Buscar viajes, paises o ciudades...';

  return (
    <div style={styles.appWrapper}>
      <Sidebar
        vistaActiva={vistaActiva}
        setVistaActiva={setVistaActiva}
        collapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobile={isMobile}
        mobileOpen={mobileDrawerOpen}
        onMobileOpenChange={setMobileDrawerOpen}
      />

      <motion.main
        style={{
          ...styles.mainContent(isMobile),
          marginLeft: isMobile ? 0 : (sidebarCollapsed ? '80px' : '260px')
        }}
      >
        <Header
          titulo={getTituloHeader()}
          onAddClick={() => setMostrarBuscador(true)}
          onProfileClick={irAPerfil}
          mostrarBusqueda={mostrarBusqueda}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          onBusquedaClear={limpiarBusqueda}
          searchPlaceholder={placeholderBusqueda}
          isMobile={isMobile}
          onMenuClick={() => setMobileDrawerOpen(true)}
        />

        <section style={styles.sectionWrapper(isMobile)}>
          <AnimatePresence mode="wait">
            {vistaActiva === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.scrollableContent} className="custom-scroll">
                <DashboardHome
                  paisesVisitados={paisesVisitados}
                  bitacora={bitacora}
                  setVistaActiva={setVistaActiva}
                  abrirVisor={abrirVisor}
                  onStartFirstTrip={() => setMostrarBuscador(true)}
                  isMobile={isMobile}
                />
              </motion.div>
            )}
            {vistaActiva === 'mapa' && (
              <motion.div key="mapa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.containerMapaStyle(isMobile)}>
                <div style={styles.mapStatsOverlay(isMobile)}><StatsMapa bitacora={bitacora} paisesVisitados={paisesVisitados} /></div>
                <MapaViajes paises={paisesVisitados} paradas={todasLasParadas} />
              </motion.div>
            )}
            {vistaActiva === 'bitacora' && (
              <motion.div key="bitacora" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.scrollableContent} className="custom-scroll">
                <BentoGrid
                  viajes={bitacora}
                  bitacoraData={bitacoraData}
                  manejarEliminar={solicitarEliminarViaje}
                  isDeletingViaje={isDeletingViaje}
                  abrirEditor={abrirEditor}
                  abrirVisor={abrirVisor}
                  searchTerm={busqueda}
                  onClearSearch={limpiarBusqueda}
                  onStartFirstTrip={() => setMostrarBuscador(true)}
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

      <BuscadorModal
        isOpen={mostrarBuscador}
        onClose={() => setMostrarBuscador(false)}
        filtro={filtro}
        setFiltro={setFiltro}
        seleccionarLugar={onLugarSeleccionado}
        onSearchError={() => pushToast('Error de conexion al buscar ciudad', 'error')}
        onNoResults={(query) => pushToast(`Sin resultados para "${query}"`, 'info', 2500)}
      />

      <EdicionModal
        viaje={viajeParaEditar}
        bitacoraData={bitacoraData}
        onClose={() => { setViajeEnEdicionId(null); setViajeBorrador(null); }}
        onSave={handleGuardarModal}
        isSaving={isSavingModal}
        esBorrador={!!viajeBorrador}
        ciudadInicial={ciudadInicialBorrador}
      />

      <VisorViaje
        viajeId={viajeExpandidoId}
        bitacoraLista={bitacora}
        bitacoraData={bitacoraData}
        onClose={() => setViajeExpandidoId(null)}
        onEdit={abrirEditor}
        onSave={handleGuardarDesdeVisor}
        onDelete={solicitarEliminarViaje}
        isSaving={isSavingViewer}
        isDeleting={!!(viajeExpandidoId && viajesEliminando.has(viajeExpandidoId))}
      />

      <ConfirmModal
        isOpen={!!confirmarEliminacion}
        title={`¿Eliminar ${tituloViajeAEliminar}?`}
        message="Esta accion eliminara el viaje y sus recuerdos asociados de forma permanente. No se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteViaje}
        onClose={() => setConfirmarEliminacion(null)}
        isLoading={!!(confirmarEliminacion && viajesEliminando.has(confirmarEliminacion))}
      />
    </div>
  );
}

export default App;
