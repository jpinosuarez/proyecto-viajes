import { useState, useEffect, useMemo } from 'react';
import { MAPA_SELLOS } from '../assets/sellos';

export const useViajes = () => {
  // 1. Estado de la Bitácora (Listado principal de registros)
  const [bitacora, setBitacora] = useState(() => {
    const saved = localStorage.getItem('bitacora');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Estado de los detalles persistidos de cada aventura
  const [bitacoraData, setBitacoraData] = useState(() => {
    const saved = localStorage.getItem('bitacoraData');
    return saved ? JSON.parse(saved) : {};
  });

  // Persistencia automática en LocalStorage
  useEffect(() => {
    localStorage.setItem('bitacora', JSON.stringify(bitacora));
  }, [bitacora]);

  useEffect(() => {
    localStorage.setItem('bitacoraData', JSON.stringify(bitacoraData));
  }, [bitacoraData]);

  /** * 3. OPTIMIZACIÓN DE RENDIMIENTO (Auditoría): 
   * Derivamos los países visitados directamente de la bitácora.
   * Esto soluciona el bug de contadores en 0 y mantiene la integridad de los datos.
   */
  const paisesVisitados = useMemo(() => {
    // Retornamos un array de códigos ISO únicos extraídos de los viajes registrados
    return [...new Set(bitacora.map(v => v.code))];
  }, [bitacora]);

  // --- ACCIONES ---

  /**
   * Agrega un nuevo registro de viaje e inicializa sus detalles.
   */
  const agregarViaje = (pais) => {
    const id = Date.now();
    const fechaISO = new Date().toISOString().split('T')[0];
    
    const nuevoViaje = {
      id: id,
      code: pais.code,
      nombreEspanol: pais.nombreEspanol,
      flag: pais.flag,
      fecha: fechaISO,
      continente: pais.continente,
      latlng: pais.latlng
    };

    setBitacora(prev => [nuevoViaje, ...prev]);
    
    // Inicializamos detalles vacíos para el nuevo ID
    setBitacoraData(prev => ({
      ...prev,
      [id]: { 
        texto: "", 
        fechaInicio: fechaISO, 
        fechaFin: fechaISO, // Iniciamos con la misma fecha para evitar conflictos en stats
        rating: 5, 
        foto: null,
        ciudades: "",
        monumentos: "",
        clima: "",
        gastronomia: ""
      }
    }));
  };

  /**
   * Actualiza el relato y los hallazgos de un viaje específico.
   */
  const actualizarDetallesViaje = (id, data) => {
    setBitacoraData(prev => ({ ...prev, [id]: data }));
  };

  /**
   * Elimina un registro individual por su ID único.
   */
  const eliminarViaje = (id) => {
    setBitacora(prev => prev.filter(v => v.id !== id));
    setBitacoraData(prev => {
      const nuevaData = { ...prev };
      delete nuevaData[id];
      return nuevaData;
    });
  };

  /**
   * Sincroniza la bitácora con los cambios realizados desde el Mapa (Toggle).
   * Si el usuario marca un país en el mapa, se crea una aventura por defecto.
   * Si lo desmarca, se eliminan todos los registros asociados a ese país.
   */
  const manejarCambioPaises = (nuevosCodes) => {
    // Si la lista del mapa creció, identificamos el país añadido
    if (nuevosCodes.length > paisesVisitados.length) {
      const codeAdded = nuevosCodes.find(c => !paisesVisitados.includes(c));
      const paisInfo = MAPA_SELLOS.find(p => p.code === codeAdded);
      if (paisInfo) agregarViaje(paisInfo);
    } 
    // Si la lista disminuyó, eliminamos los registros de ese país
    else {
      const codeRemoved = paisesVisitados.find(c => !nuevosCodes.includes(c));
      const viajesAEliminar = bitacora.filter(v => v.code === codeRemoved);
      
      setBitacora(prev => prev.filter(v => v.code !== codeRemoved));
      setBitacoraData(prev => {
        const nuevaData = { ...prev };
        viajesAEliminar.forEach(v => delete nuevaData[v.id]);
        return nuevaData;
      });
    }
  };

  return {
    paisesVisitados,
    bitacora,
    bitacoraData,
    listaPaises: Array.isArray(MAPA_SELLOS) ? MAPA_SELLOS : [], 
    agregarViaje,
    actualizarDetallesViaje,
    eliminarViaje,
    manejarCambioPaises // Vital para la funcionalidad del mapa
  };
};