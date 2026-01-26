import { useState } from 'react';
import countries from 'world-countries';

export const useViajes = () => {
  const [paisesVisitados, setPaisesVisitados] = useState(() => {
    const datos = localStorage.getItem('globalstamp-viajes');
    return datos ? JSON.parse(datos) : ['ARG', 'DEU'];
  });

  const listaPaises = countries.map(c => ({
    nombre: c.name.common,
    nombreEspanol: c.translations.spa?.common || c.name.common,
    code: c.cca3, 
    flag: c.flag, 
    latlng: c.latlng, 
    region: c.region 
  })).sort((a, b) => a.nombreEspanol.localeCompare(b.nombreEspanol));

  const manejarCambioPaises = (nuevaLista) => {
    setPaisesVisitados(nuevaLista);
    localStorage.setItem('globalstamp-viajes', JSON.stringify(nuevaLista));
  };

  const agruparPorRegion = () => {
    const regiones = { 'PORTADA': [], 'PERFIL': [] };
    paisesVisitados.forEach(id => {
      const info = listaPaises.find(p => p.code === id);
      if (info) {
        const reg = info.region || 'Otros';
        if (!regiones[reg]) regiones[reg] = [];
        regiones[reg].push(info);
      }
    });
    return regiones;
  };

  return { 
    paisesVisitados, 
    listaPaises, 
    agruparPorRegion, 
    manejarCambioPaises 
  };
};