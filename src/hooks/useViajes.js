import { useState, useEffect, useMemo } from 'react';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { obtenerClimaHistoricoSeguro } from '../services/external/weatherService';
import { obtenerFotoConCacheSeguro } from '../services/external/photoService';
import {
  suscribirViajesConParadas,
  guardarViajeConParadas,
  actualizarViaje,
  crearParada,
  eliminarViaje,
  subirFotoViaje
} from '../services/viajes/viajesRepository';
import {
  FOTO_DEFAULT_URL,
  construirBitacoraData,
  obtenerPaisesVisitados,
  generarTituloInteligente,
  construirBanderasViaje,
  construirCiudadesViaje,
  construirParadaPayload,
  construirViajePayload,
  getTodayIsoDate
} from '../utils/viajeUtils';
import { validarViaje, validarCoordenadas } from '../schemas/viajeSchema';
import { logger } from '../utils/logger';

const PEXELS_ACCESS_KEY = import.meta.env.VITE_PEXELS_ACCESS_KEY || '';
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const parseDateSafe = (value) => {
  if (!isNonEmptyString(value)) return null;
  const time = Date.parse(value);
  if (Number.isNaN(time)) return null;
  return new Date(time);
};

const sonCoordenadasValidas = (coordenadas) =>
  Array.isArray(coordenadas) &&
  coordenadas.length === 2 &&
  coordenadas.every((value) => typeof value === 'number' && Number.isFinite(value));

const obtenerCoordenadasViaje = ({ datosViaje = {}, viajeActual = null, paradas = [] }) => {
  const primeraParadaConCoords = paradas.find((parada) => Array.isArray(parada?.coordenadas))?.coordenadas;
  return (
    datosViaje.coordenadas ||
    datosViaje.latlng ||
    datosViaje.ubicacion?.coordenadas ||
    viajeActual?.coordenadas ||
    viajeActual?.latlng ||
    viajeActual?.ubicacion?.coordenadas ||
    primeraParadaConCoords
  );
};

/**
 * Validación de datos de viaje usando Zod schemas
 * Mantiene compatibilidad con la interfaz anterior
 */
const validarDatosViaje = ({ datosViaje = {}, viajeActual = null, paradas = [], tituloGenerado = '' }) => {
  // Construir objeto completo para validación
  const datosCompletos = {
    code: datosViaje.code ?? datosViaje.paisCodigo ?? viajeActual?.code ?? viajeActual?.paisCodigo,
    nombreEspanol: datosViaje.nombreEspanol ?? viajeActual?.nombreEspanol,
    titulo: datosViaje.titulo || tituloGenerado || viajeActual?.titulo,
    fechaInicio: datosViaje.fechaInicio ?? viajeActual?.fechaInicio,
    fechaFin: datosViaje.fechaFin ?? viajeActual?.fechaFin
  };

  // Validar con Zod (validación minimal - solo campos críticos)
  const resultado = validarViaje(datosCompletos, false);
  
  if (!resultado.esValido) {
    logger.warn('Validación de viaje falló', {
      mensaje: resultado.mensaje,
      errores: resultado.errores,
      datosViaje: { ...datosCompletos, titulo: datosCompletos.titulo?.substring(0, 50) }
    });
    return resultado;
  }

  // Validación adicional de coordenadas (no está en el schema minimal)
  const coordenadas = obtenerCoordenadasViaje({ datosViaje, viajeActual, paradas });
  const coordsValidas = validarCoordenadas(coordenadas);
  
  if (!coordsValidas.esValido) {
    logger.warn('Coordenadas inválidas', { coordenadas });
    return { esValido: false, mensaje: 'Debes seleccionar un destino válido' };
  }

  return { esValido: true };
};

if (!PEXELS_ACCESS_KEY) {
  console.warn('VITE_PEXELS_ACCESS_KEY no esta configurada en .env');
}

export const useViajes = () => {
  const { usuario } = useAuth();
  const { pushToast } = useToast();
  const toast = {
    success: (message) => pushToast(message, 'success'),
    error: (message) => pushToast(message, 'error'),
    warning: (message) => pushToast(message, 'warning')
  };

  const [bitacora, setBitacora] = useState([]);
  const [bitacoraData, setBitacoraData] = useState({});
  const [todasLasParadas, setTodasLasParadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario) {
      logger.debug('Usuario no autenticado, limpiando estado de viajes');
      setBitacora([]);
      setBitacoraData({});
      setTodasLasParadas([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Configurar userId en el logger para contexto global
    logger.setUserId(usuario.uid);
    logger.info('Suscribiendo a viajes del usuario', { userId: usuario.uid });

    setLoading(true);
    setError(null);

    const unsubscribe = suscribirViajesConParadas({
      db,
      userId: usuario.uid,
      onData: ({ viajes, paradas }) => {
        logger.debug('Datos de viajes actualizados', { 
          totalViajes: viajes.length, 
          totalParadas: paradas.length 
        });
        setBitacora(viajes);
        setBitacoraData(construirBitacoraData(viajes));
        setTodasLasParadas(paradas);
        setLoading(false);
      },
      onError: (snapshotError) => {
        logger.error('Error en suscripción de viajes', {
          error: snapshotError.message,
          stack: snapshotError.stack,
          userId: usuario.uid
        });
        setError(snapshotError);
        setLoading(false);
      }
    });

    return () => {
      logger.debug('Desuscribiendo de viajes del usuario');
      unsubscribe();
    };
  }, [usuario]);

  const paisesVisitados = useMemo(
    () => obtenerPaisesVisitados(bitacora, todasLasParadas),
    [bitacora, todasLasParadas]
  );

  const guardarNuevoViaje = async (datosViaje, paradas = []) => {
    if (!usuario) return null;

    const tituloDefault = isNonEmptyString(datosViaje?.nombreEspanol)
      ? `Viaje a ${datosViaje.nombreEspanol}`
      : '';
    const tituloPersonalizado = isNonEmptyString(datosViaje?.titulo) && datosViaje.titulo !== tituloDefault
      ? datosViaje.titulo
      : '';
    const datosViajeNormalizados = {
      ...datosViaje,
      titulo: tituloPersonalizado
    };

    const titulo = generarTituloInteligente(datosViajeNormalizados.nombreEspanol, paradas);
    const validacion = validarDatosViaje({ datosViaje: datosViajeNormalizados, paradas, tituloGenerado: titulo });
    if (!validacion.esValido) {
      toast.warning(validacion.mensaje);
      return null;
    }

    let fotoFinal = datosViajeNormalizados.foto;
    let creditoFinal = datosViajeNormalizados.fotoCredito || null;
    const fotoFileOptimizada = datosViajeNormalizados.fotoFile || null;
    const esFotoBase64 = fotoFinal && typeof fotoFinal === 'string' && fotoFinal.startsWith('data:image');
    const esFotoParaStorage = !!fotoFileOptimizada || !!esFotoBase64;

    const banderas = construirBanderasViaje(datosViajeNormalizados.code, paradas);
    const ciudades = construirCiudadesViaje(paradas);
    const ciudadesLista = [...new Set(paradas.map((parada) => parada.nombre).filter(isNonEmptyString))];

    const fotoPromise = !fotoFinal
      ? obtenerFotoConCacheSeguro({
          db,
          paisNombre: datosViajeNormalizados.nombreEspanol,
          paisCode: datosViajeNormalizados.code,
          pexelsApiKey: PEXELS_ACCESS_KEY,
          ciudades: ciudadesLista
        })
      : Promise.resolve(null);

    const paradasPromise = Promise.all(
      paradas.map(async (parada) => {
        const fechaUso = parada.fecha || datosViajeNormalizados.fechaInicio || getTodayIsoDate();
        const climaInfo = await obtenerClimaHistoricoSeguro(
          parada.coordenadas?.[1],
          parada.coordenadas?.[0],
          fechaUso
        );
        return construirParadaPayload(parada, fechaUso, climaInfo);
      })
    );

    const [fotoInfo, paradasProcesadas] = await Promise.all([fotoPromise, paradasPromise]);

    if (fotoInfo) {
      fotoFinal = fotoInfo.url;
      creditoFinal = fotoInfo.credito;
    }

    const payloadViaje = construirViajePayload({
      datosViaje: datosViajeNormalizados,
      titulo,
      banderas,
      ciudades,
      foto: esFotoParaStorage ? null : fotoFinal || FOTO_DEFAULT_URL,
      fotoCredito: creditoFinal
    });

    try {
      logger.info('Guardando nuevo viaje', { 
        userId: usuario.uid,
        paisCodigo: datosViajeNormalizados.code,
        totalParadas: paradasProcesadas.length 
      });

      const viajeId = await guardarViajeConParadas({
        db,
        userId: usuario.uid,
        viaje: payloadViaje,
        paradas: paradasProcesadas
      });

      if (esFotoParaStorage) {
        logger.debug('Subiendo foto a Storage', { viajeId });
        const url = await subirFotoViaje({
          storage,
          userId: usuario.uid,
          viajeId,
          foto: fotoFileOptimizada || datosViaje.foto
        });
        if (url) {
          await actualizarViaje({ db, userId: usuario.uid, viajeId, data: { foto: url } });
          logger.debug('Foto subida exitosamente', { viajeId, fotoUrl: url.substring(0, 50) });
        }
      }

      logger.info('Viaje guardado exitosamente', { viajeId });
      toast.success('Viaje guardado');
      return viajeId;
    } catch (saveError) {
      logger.error('Error guardando viaje', { 
        error: saveError.message,
        stack: saveError.stack,
        userId: usuario.uid,
        paisCodigo: datosViajeNormalizados.code
      });
      setError(saveError);
      toast.error('No se pudo guardar el viaje');
      return null;
    }
  };

  const actualizarDetallesViaje = async (id, data) => {
    if (!usuario) return false;
    const viajeActual = bitacoraData[id] || bitacora.find((viaje) => viaje.id === id) || null;
    const paradasDelViaje = todasLasParadas.filter((parada) => parada.viajeId === id);
    const validacion = validarDatosViaje({
      datosViaje: data,
      viajeActual,
      paradas: paradasDelViaje
    });
    if (!validacion.esValido) {
      toast.warning(validacion.mensaje);
      return false;
    }

    try {
      logger.info('Actualizando viaje', { viajeId: id, userId: usuario.uid });
      
      const dataToSave = { ...data };
      if (dataToSave.fotoFile instanceof Blob) {
        logger.debug('Subiendo nueva foto (Blob)', { viajeId: id });
        const url = await subirFotoViaje({
          storage,
          userId: usuario.uid,
          viajeId: id,
          foto: dataToSave.fotoFile
        });
        if (!url) throw new Error('No se pudo subir la imagen optimizada');
        dataToSave.foto = url;
      } else if (
        dataToSave.foto &&
        typeof dataToSave.foto === 'string' &&
        dataToSave.foto.startsWith('data:image')
      ) {
        logger.debug('Subiendo nueva foto (base64)', { viajeId: id });
        const url = await subirFotoViaje({
          storage,
          userId: usuario.uid,
          viajeId: id,
          foto: dataToSave.foto
        });
        if (!url) throw new Error('No se pudo subir la imagen en base64');
        dataToSave.foto = url;
      }

      delete dataToSave.fotoFile;
      await actualizarViaje({ db, userId: usuario.uid, viajeId: id, data: dataToSave });
      logger.info('Viaje actualizado exitosamente', { viajeId: id });
      toast.success('Viaje actualizado');
      return true;
    } catch (updateError) {
      logger.error('Error actualizando viaje', {
        error: updateError.message,
        stack: updateError.stack,
        viajeId: id,
        userId: usuario.uid
      });
      setError(updateError);
      toast.error('No se pudo actualizar el viaje');
      return false;
    }
  };

  const agregarParada = async (lugarInfo, viajeId) => {
    if (!usuario || !viajeId) return false;

    try {
      const fechaUso = lugarInfo.fecha || getTodayIsoDate();
      
      logger.debug('Agregando parada a viaje', { 
        viajeId, 
        paradaNombre: lugarInfo.nombre,
        coordenadas: lugarInfo.coordenadas 
      });
      
      const climaInfo = await obtenerClimaHistoricoSeguro(
        lugarInfo.coordenadas?.[1],
        lugarInfo.coordenadas?.[0],
        fechaUso
      );

      await crearParada({
        db,
        userId: usuario.uid,
        viajeId,
        data: {
          ...lugarInfo,
          clima: climaInfo,
          tipo: 'place'
        }
      });
      
      logger.info('Parada agregada exitosamente', { viajeId, paradaNombre: lugarInfo.nombre });
      return true;
    } catch (stopError) {
      logger.error('Error agregando parada', {
        error: stopError.message,
        viajeId,
        paradaNombre: lugarInfo.nombre
      });
      setError(stopError);
      return false;
    }
  };

  const eliminar = async (id) => {
    if (!usuario) return false;
    
    try {
      logger.info('Eliminando viaje', { viajeId: id, userId: usuario.uid });
      
      await eliminarViaje({ db, userId: usuario.uid, viajeId: id });
      
      logger.info('Viaje eliminado exitosamente', { viajeId: id });
      toast.success('Eliminado correctamente');
      return true;
    } catch (deleteError) {
      logger.error('Error eliminando viaje', {
        error: deleteError.message,
        stack: deleteError.stack,
        viajeId: id,
        userId: usuario.uid
      });
      setError(deleteError);
      toast.error('No se pudo eliminar el viaje');
      return false;
    }
  };

  return {
    paisesVisitados,
    bitacora,
    bitacoraData,
    todasLasParadas,
    guardarNuevoViaje,
    agregarParada,
    actualizarDetallesViaje,
    eliminarViaje: eliminar,
    loading,
    error
  };
};
