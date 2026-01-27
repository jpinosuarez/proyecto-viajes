import { useState, useEffect } from 'react';
import { MAPA_SELLOS } from '../assets/sellos';

export const useViajes = () => {
  const [paisesVisitados, setPaisesVisitados] = useState(() => {
    const saved = localStorage.getItem('paisesVisitados');
    return saved ? JSON.parse(saved) : [];
  });

  const [bitacora, setBitacora] = useState(() => {
    const saved = localStorage.getItem('bitacora');
    return saved ? JSON.parse(saved) : [];
  });

  const [bitacoraData, setBitacoraData] = useState(() => {
    const saved = localStorage.getItem('bitacoraData');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('paisesVisitados', JSON.stringify(paisesVisitados));
  }, [paisesVisitados]);

  useEffect(() => {
    localStorage.setItem('bitacora', JSON.stringify(bitacora));
  }, [bitacora]);

  useEffect(() => {
    localStorage.setItem('bitacoraData', JSON.stringify(bitacoraData));
  }, [bitacoraData]);

  const agregarViaje = (pais) => {
    const id = Date.now();
    const nuevoViaje = {
      id: id,
      code: pais.code,
      nombreEspanol: pais.nombreEspanol,
      flag: pais.flag,
      fecha: new Date().toISOString().split('T')[0], // Guardamos formato YYYY-MM-DD
      continente: pais.continente,
      latlng: pais.latlng
    };

    setBitacora(prev => [nuevoViaje, ...prev]);
    
    // Inicializamos campos vacíos para los nuevos registros
    setBitacoraData(prev => ({
      ...prev,
      [id]: { 
        texto: "", 
        fechaInicio: nuevoViaje.fecha, 
        fechaFin: "", 
        rating: 5, 
        foto: null,
        ciudades: "",
        monumentos: "",
        clima: "",
        gastronomia: ""
      }
    }));

    setPaisesVisitados(prev => prev.includes(pais.code) ? prev : [...prev, pais.code]);
  };

  const actualizarDetallesViaje = (id, data) => {
    setBitacoraData(prev => ({ ...prev, [id]: data }));
  };

  const eliminarViaje = (id, code) => {
    const nuevaBitacora = bitacora.filter(v => v.id !== id);
    setBitacora(nuevaBitacora);
    const nuevaData = { ...bitacoraData };
    delete nuevaData[id];
    setBitacoraData(nuevaData);

    if (!nuevaBitacora.some(v => v.code === code)) {
      setPaisesVisitados(prev => prev.filter(c => c !== code));
    }
  };

  return {
      paisesVisitados,
      bitacora,
      bitacoraData,
      listaPaises: Array.isArray(MAPA_SELLOS) ? MAPA_SELLOS : [], 
      agregarViaje,
      actualizarDetallesViaje,
      eliminarViaje
    };
  };

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

    setPaisesVisitados(prev => prev.includes(pais.code) ? prev : [...prev, pais.code]);
  };