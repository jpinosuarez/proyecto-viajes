import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes de Layout y UI
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Header/Header';
import DashboardHome from './components/Dashboard/DashboardHome';
import StatsMapa from './components/Dashboard/StatsMapa';
import MapaViajes from './components/Mapa/MapaView';
import BentoGrid from './components/Bento/BentoGrid';
import LandingPage from './components/Landing/LandingPage';

// Modales y Páginas
import BuscadorModal from './components/Buscador/BuscadorModal';
import EdicionModal from './components/Modals/EdicionModal';
import VisorViaje from './components/VisorViaje/VisorViaje';
import SettingsPage from './pages/Configuracion/SettingsPage';

// Lógica y Contexto
import { useViajes } from './hooks/useViajes';
import { useAuth } from './context/AuthContext';
import { styles } from './App.styles';

function App() {
  const { usuario, cargando } = useAuth();
  
  const { 
    paisesVisitados, bitacora, bitacoraData, listaPaises, todasLasParadas,
    buscarPaisEnCatalogo, guardarNuevoViaje, agregarParada, 
    actualizarDetallesViaje, manejarCambioPaises, eliminarViaje 
  } = useViajes();
  
  // Estado de Navegación y UI
  const [vistaActiva, setVistaActiva] = useState('home'); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  
  // Estado del Mapa
  const [filtro, setFiltro] = useState('');
  const [destino, setDestino] = useState(null);
  
  // Estado de Selección / Edición
  const [viajeEnEdicionId, setViajeEnEdicionId] = useState(null);
  const [viajeExpandidoId, setViajeExpandidoId] = useState(null);
  
  // Estado para el Flujo de Creación (Borrador)
  const [viajeBorrador, setViajeBorrador] = useState(null); 
  const [ciudadInicialBorrador, setCiudadInicialBorrador] = useState(null);

  // --- Handlers de Navegación ---
  const abrirEditor = (viajeId) => setViajeEnEdicionId(viajeId);
  const abrirVisor = (viajeId) => setViajeExpandidoId(viajeId);
  const irAPerfil = () => setVistaActiva('config');

  // --- Lógica Principal: Selección desde el Buscador ---
  const onLugarSeleccionado = useCallback((lugar) => {
    let datosPais = null;
    let ciudad = null;

    if (lugar.esPais) {
      // 1. Es un País: Buscamos datos extendidos en nuestro catálogo local (bandera, continente)
      datosPais = listaPaises.find(p => p.code === lugar.code) 
                  || listaPaises.find(p => p.name.toLowerCase().includes(lugar.nombre.toLowerCase()));
      
      // Fallback si no está en el catálogo (ej: país muy pequeño)
      if (!datosPais) {
        datosPais = { 
          code: lugar.code, 
          nombreEspanol: lugar.nombre, 
          flag: '🌍', 
          continente: 'Mundo', 
          latlng: lugar.coordenadas 
        };
      }
    } else {
      // 2. Es una Ciudad: Identificamos el país al que pertenece
      datosPais = buscarPaisEnCatalogo(lugar.paisNombre, lugar.paisCodigo);
      
      if (!datosPais) {
        alert("Lo sentimos, aún no soportamos el registro en este territorio.");
        return;
      }
      
      ciudad = { 
        nombre: lugar.nombre, 
        coordenadas: lugar.coordenadas, 
        fecha: new Date().toISOString().split('T')[0] 
      };
    }

    // Verificamos si ya tenemos un viaje registrado a este país
    const viajeExistente = bitacora.find(v => v.code === datosPais.code);

    setMostrarBuscador(false);
    setFiltro('');

    if (viajeExistente) {
      // A. EL VIAJE EXISTE
      if (ciudad) {
        // Si seleccionó una ciudad, la agregamos al viaje existente
        agregarParada(ciudad, viajeExistente.id);
      }
      
      // Movemos el mapa y abrimos el editor/visor
      setDestino({ longitude: lugar.coordenadas[0], latitude: lugar.coordenadas[1], zoom: 6, essential: true });
      setVistaActiva('mapa');
      setTimeout(() => abrirEditor(viajeExistente.id), 500);

    } else {
      // B. EL VIAJE NO EXISTE (CREAR NUEVO BORRADOR)
      const nuevoBorrador = {
        id: 'new', // ID temporal
        code: datosPais.code,
        nombreEspanol: datosPais.nombreEspanol,
        flag: datosPais.flag,
        continente: datosPais.continente,
        latlng: datosPais.latlng,
        titulo: `Viaje a ${datosPais.nombreEspanol}`,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: new Date().toISOString().split('T')[0],
        foto: null // Se buscará automáticamente al guardar si el usuario no sube una
      };
      
      setViajeBorrador(nuevoBorrador);
      setCiudadInicialBorrador(ciudad); // Guardamos la ciudad seleccionada para el modal
      
      // UX: Centrar mapa en el destino mientras se configura
      setDestino({ 
        longitude: datosPais.latlng[1], 
        latitude: datosPais.latlng[0], 
        zoom: 4, 
        essential: true 
      });
      setVistaActiva('mapa');
    }
  }, [bitacora, listaPaises, buscarPaisEnCatalogo, agregarParada]);

  // --- Handler: Guardar cambios desde el Modal ---
  const handleGuardarViaje = async (id, datosCombinados) => {
    // Separamos las paradas nuevas que vienen del CityManager
    const { paradasNuevas, ...datosViaje } = datosCombinados;

    if (id === 'new') {
      // 1. CREAR NUEVO VIAJE
      // Notar que pasamos 'null' como ciudad inicial porque 'paradasNuevas' ya contiene todo
      const nuevoId = await guardarNuevoViaje(datosViaje, null);
      
      if (nuevoId && paradasNuevas && paradasNuevas.length > 0) {
          // Agregar todas las paradas configuradas en el modal
          for (const parada of paradasNuevas) {
              await agregarParada({
                  nombre: parada.nombre,
                  coordenadas: parada.coordenadas,
                  fecha: parada.fecha
              }, nuevoId);
          }
      }
      
      // Limpieza y redirección
      setViajeBorrador(null);
      setCiudadInicialBorrador(null);
      setTimeout(() => abrirVisor(nuevoId), 500); // Abrir inmersivo para ver el resultado

    } else {
      // 2. ACTUALIZAR EXISTENTE
      actualizarDetallesViaje(id, datosViaje);
      
      // Si se agregaron paradas nuevas en el modo edición
      if (paradasNuevas && paradasNuevas.length > 0) {
         // Filtramos las que ya tienen ID real de firebase (no empiezan con 'temp')
         const nuevasReales = paradasNuevas.filter(p => p.id && p.id.toString().startsWith('temp'));
         for (const parada of nuevasReales) {
            await agregarParada({
                nombre: parada.nombre,
                coordenadas: parada.coordenadas,
                fecha: parada.fecha
            }, id);
         }
      }
    }
  };

  // Handler para clicks en el mapa global (países)
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

  // --- Renderizado Condicional (Auth) ---
  if (!cargando && !usuario) return <LandingPage />;

  // Determinar qué viaje pasar al modal
  const viajeParaEditar = viajeEnEdicionId ? bitacora.find(v => v.id === viajeEnEdicionId) : viajeBorrador;

  return (
    <div style={styles.appWrapper}>
      
      {/* 1. Sidebar Controlable */}
      <Sidebar 
        vistaActiva={vistaActiva} 
        setVistaActiva={setVistaActiva} 
        collapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* 2. Contenido Principal con Margen Dinámico */}
      <motion.main 
        style={{
          ...styles.mainContent,
          marginLeft: sidebarCollapsed ? '80px' : '260px'
        }}
      >
        <Header 
          titulo={getTituloHeader()} 
          onAddClick={() => setMostrarBuscador(true)} 
          onProfileClick={irAPerfil} 
        />

        <section style={styles.sectionWrapper}>
          <AnimatePresence mode="wait">
            
            {/* VISTA: DASHBOARD */}
            {vistaActiva === 'home' && (
              <motion.div 
                key="home" 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                style={styles.scrollableContent} 
                className="custom-scroll"
              >
                <DashboardHome 
                  paisesVisitados={paisesVisitados} 
                  bitacora={bitacora} 
                  setVistaActiva={setVistaActiva}
                  abrirVisor={abrirVisor} 
                />
              </motion.div>
            )}

            {/* VISTA: MAPA GLOBAL */}
            {vistaActiva === 'mapa' && (
              <motion.div 
                key="mapa" 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                style={styles.containerMapaStyle}
              >
                <StatsMapa bitacora={bitacora} paisesVisitados={paisesVisitados} />
                <MapaViajes 
                   paises={paisesVisitados} 
                   setPaises={onMapaPaisToggle} 
                   destino={destino} 
                   paradas={todasLasParadas} 
                />
              </motion.div>
            )}

            {/* VISTA: BITÁCORA */}
            {vistaActiva === 'bitacora' && (
              <motion.div 
                key="bitacora" 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                style={styles.scrollableContent} 
                className="custom-scroll"
              >
                <BentoGrid 
                  viajes={bitacora} 
                  bitacoraData={bitacoraData} 
                  manejarEliminar={eliminarViaje}
                  abrirEditor={abrirEditor}
                  abrirVisor={abrirVisor} 
                />
              </motion.div>
            )}

            {/* VISTA: CONFIGURACIÓN */}
            {vistaActiva === 'config' && (
              <motion.div 
                key="config" 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                style={styles.scrollableContent} 
                className="custom-scroll"
              >
                <SettingsPage />
              </motion.div>
            )}

          </AnimatePresence>
        </section>
      </motion.main>

      {/* --- MODALES Y OVERLAYS --- */}

      <BuscadorModal 
        isOpen={mostrarBuscador} 
        onClose={() => setMostrarBuscador(false)} 
        filtro={filtro} 
        setFiltro={setFiltro} 
        listaPaises={listaPaises} 
        seleccionarLugar={onLugarSeleccionado} 
        paisesVisitados={paisesVisitados} 
      />

      <EdicionModal 
        viaje={viajeParaEditar} 
        bitacoraData={bitacoraData} 
        onClose={() => { setViajeEnEdicionId(null); setViajeBorrador(null); }} 
        onSave={handleGuardarViaje} 
        esBorrador={!!viajeBorrador}
        ciudadInicial={ciudadInicialBorrador}
      />

      <VisorViaje 
        viajeId={viajeExpandidoId}
        bitacoraLista={bitacora}
        bitacoraData={bitacoraData}
        onClose={() => setViajeExpandidoId(null)}
        onEdit={abrirEditor}
        onSave={actualizarDetallesViaje}
        onAddParada={(idViaje) => {
            // Cerrar visor y abrir buscador para añadir parada a este viaje específico
            // NOTA: Para MVP abrimos buscador general, idealmente se pasaría el contexto.
            setViajeExpandidoId(null);
            setMostrarBuscador(true);
        }}
      />
    </div>
  );
}

export default App;