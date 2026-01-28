import { useState, useEffect, useMemo } from 'react';
import { MAPA_SELLOS } from '../assets/sellos';

export const useViajes = () => {
  const [bitacora, setBitacora] = useState(() => {
    const saved = localStorage.getItem('bitacora');
    return saved ? JSON.parse(saved) : [];
  });

  const [bitacoraData, setBitacoraData] = useState(() => {
    const saved = localStorage.getItem('bitacoraData');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('bitacora', JSON.stringify(bitacora));
  }, [bitacora]);

  useEffect(() => {
    localStorage.setItem('bitacoraData', JSON.stringify(bitacoraData));
  }, [bitacoraData]);

  const paisesVisitados = useMemo(() => {
    return [...new Set(bitacora.map(v => v.code))];
  }, [bitacora]);

  // --- ACCIONES ---

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
    
    setBitacoraData(prev => ({
      ...prev,
      [id]: { 
        texto: "", 
        fechaInicio: fechaISO, 
        fechaFin: fechaISO, 
        rating: 5, 
        foto: null,
        ciudades: "",
        monumentos: "",
        clima: "",
        gastronomia: ""
      }
    }));

    return id; // RETORNAMOS EL ID PARA ABRIR EL EDITOR
  };

  const actualizarDetallesViaje = (id, data) => {
    setBitacoraData(prev => ({ ...prev, [id]: data }));
  };

  const eliminarViaje = (id) => {
    setBitacora(prev => prev.filter(v => v.id !== id));
    setBitacoraData(prev => {
      const nuevaData = { ...prev };
      delete nuevaData[id];
      return nuevaData;
    });
  };

  const manejarCambioPaises = (nuevosCodes) => {
    let viajeAgregadoId = null;

    if (nuevosCodes.length > paisesVisitados.length) {
      const codeAdded = nuevosCodes.find(c => !paisesVisitados.includes(c));
      // Buscamos en nuestra base de datos, si no existe, creamos un objeto básico para que no rompa
      const paisInfo = MAPA_SELLOS.find(p => p.code === codeAdded) || {
        code: codeAdded,
        nombreEspanol: codeAdded, // Fallback nombre
        flag: "🌍",
        continente: "Desconocido",
        latlng: [0, 0]
      };
      
      if (paisInfo) {
        viajeAgregadoId = agregarViaje(paisInfo);
      }
    } else {
      const codeRemoved = paisesVisitados.find(c => !nuevosCodes.includes(c));
      const viajesAEliminar = bitacora.filter(v => v.code === codeRemoved);
      
      setBitacora(prev => prev.filter(v => v.code !== codeRemoved));
      setBitacoraData(prev => {
        const nuevaData = { ...prev };
        viajesAEliminar.forEach(v => delete nuevaData[v.id]);
        return nuevaData;
      });
    }
    
    return viajeAgregadoId; // RETORNAMOS EL ID SI SE AGREGÓ
  };

  return {
    paisesVisitados,
    bitacora,
    bitacoraData,
    listaPaises: Array.isArray(MAPA_SELLOS) ? MAPA_SELLOS : [], 
    agregarViaje,
    actualizarDetallesViaje,
    eliminarViaje,
    manejarCambioPaises 
  };
};