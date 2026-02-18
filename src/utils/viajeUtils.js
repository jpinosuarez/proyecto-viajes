import { getCountryISO3, getCountryName, getFlagUrl } from './countryUtils';

export const EXTERNAL_API_TIMEOUT_MS = 3000;

export const FOTO_DEFAULT_URL =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%231f2937'/><stop offset='100%' stop-color='%230f766e'/></linearGradient></defs><rect width='1200' height='800' fill='url(%23g)'/><circle cx='180' cy='160' r='90' fill='rgba(255,255,255,0.15)'/><path d='M100 650 L420 360 L600 560 L780 420 L1100 700 L100 700 Z' fill='rgba(255,255,255,0.18)'/><text x='80' y='120' fill='white' font-size='56' font-family='Arial, sans-serif' opacity='0.9'>Viaje</text></svg>";

export const getTodayIsoDate = () => new Date().toISOString().split('T')[0];

export const construirBitacoraData = (viajes = []) =>
  viajes.reduce((acc, viaje) => {
    acc[viaje.id] = { ...viaje };
    return acc;
  }, {});

export const obtenerPaisesVisitados = (bitacora = [], todasLasParadas = []) => {
  const codigos = new Set();

  bitacora.forEach((viaje) => {
    const iso3 = getCountryISO3(viaje.code);
    if (iso3) codigos.add(iso3);
  });

  todasLasParadas.forEach((parada) => {
    const iso3 = getCountryISO3(parada.paisCodigo);
    if (iso3) codigos.add(iso3);
  });

  return [...codigos].filter(Boolean);
};

export const generarTituloInteligente = (nombreBase, paradas = []) => {
  if (!paradas || paradas.length === 0) return nombreBase || 'Nuevo Viaje';

  const ciudadesUnicas = [...new Set(paradas.map((p) => p.nombre).filter(Boolean))];
  const paisesUnicos = [...new Set(paradas.map((p) => p.paisCodigo).filter(Boolean))];

  // Priorizar títulos por ciudad cuando quedan claros y cortos
  if (ciudadesUnicas.length === 1) return `Escapada a ${ciudadesUnicas[0]}`;
  if (ciudadesUnicas.length === 2) return `${ciudadesUnicas[0]} y ${ciudadesUnicas[1]}`;

  // Construir nombres de países legibles
  const nombresPaises = paisesUnicos.map((c) => getCountryName(c)).filter(Boolean);

  // Reglas de storytelling por país
  if (paisesUnicos.length === 1) {
    const nombrePais = nombresPaises[0] || nombreBase;
    return `Ruta por ${nombrePais}`; // claro y directo
  }

  if (paisesUnicos.length === 2) {
    // Evocar movimiento/transición entre dos países
    return `Aventura entre ${nombresPaises[0]} y ${nombresPaises[1]}`;
  }

  if (paisesUnicos.length === 3) {
    // Listado evocador pero legible
    return `Travesía por ${nombresPaises.join(', ')}`;
  }

  if (paisesUnicos.length > 3) {
    // Mantener título corto y sugerir escala
    const firstTwo = nombresPaises.slice(0, 2).join(', ');
    const others = nombresPaises.length - 2;
    return `Gran travesía por ${firstTwo} y ${others} más`;
  }

  return nombreBase || 'Nuevo Viaje';
};

export const construirBanderasViaje = (codigoPaisBase, paradas = []) => {
  const banderasParadas = paradas.map((parada) => getFlagUrl(parada.paisCodigo)).filter(Boolean);
  const banderasBase = [getFlagUrl(codigoPaisBase)].filter(Boolean);
  return banderasParadas.length > 0 ? [...new Set(banderasParadas)] : banderasBase;
};

export const construirCiudadesViaje = (paradas = []) => [...new Set(paradas.map((p) => p.nombre))].join(', ');

export const construirParadaPayload = (parada, fechaUso, climaInfo) => ({
  nombre: parada.nombre,
  coordenadas: parada.coordenadas,
  fecha: fechaUso,
  fechaLlegada: parada.fechaLlegada || '',
  fechaSalida: parada.fechaSalida || '',
  paisCodigo: parada.paisCodigo || '',
  clima: climaInfo,
  tipo: 'place'
});

export const construirViajePayload = ({
  datosViaje,
  titulo,
  banderas,
  ciudades,
  foto,
  fotoCredito
}) => {
  const hoy = getTodayIsoDate();

  return {
    code: datosViaje.code || '',
    nombreEspanol: datosViaje.nombreEspanol || 'Viaje',
    titulo: datosViaje.titulo || titulo,
    fechaInicio: datosViaje.fechaInicio || hoy,
    fechaFin: datosViaje.fechaFin || hoy,
    texto: datosViaje.texto || '',
    rating: 5,
    foto: foto || FOTO_DEFAULT_URL,
    fotoCredito: fotoCredito || null,
    banderas,
    ciudades
  };
};
