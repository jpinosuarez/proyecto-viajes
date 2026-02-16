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

const validarDatosViaje = ({ datosViaje = {}, viajeActual = null, paradas = [], tituloGenerado = '' }) => {
  const codigoPais = datosViaje.code ?? datosViaje.paisCodigo ?? viajeActual?.code ?? viajeActual?.paisCodigo;
  if (!isNonEmptyString(codigoPais)) {
    return { esValido: false, mensaje: 'Debes seleccionar un pais valido' };
  }

  const fechaInicio = parseDateSafe(datosViaje.fechaInicio ?? viajeActual?.fechaInicio);
  const fechaFin = parseDateSafe(datosViaje.fechaFin ?? viajeActual?.fechaFin);
  if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
    return { esValido: false, mensaje: 'La fecha de fin no puede ser anterior al inicio' };
  }

  const coordenadas = obtenerCoordenadasViaje({ datosViaje, viajeActual, paradas });
  if (!sonCoordenadasValidas(coordenadas)) {
    return { esValido: false, mensaje: 'Debes seleccionar un destino valido' };
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
      setBitacora([]);
      setBitacoraData({});
      setTodasLasParadas([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = suscribirViajesConParadas({
      db,
      userId: usuario.uid,
      onData: ({ viajes, paradas }) => {
        setBitacora(viajes);
        setBitacoraData(construirBitacoraData(viajes));
        setTodasLasParadas(paradas);
        setLoading(false);
      },
      onError: (snapshotError) => {
        console.error(snapshotError);
        setError(snapshotError);
        setLoading(false);
      }
    });

    return () => unsubscribe();
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
      const viajeId = await guardarViajeConParadas({
        db,
        userId: usuario.uid,
        viaje: payloadViaje,
        paradas: paradasProcesadas
      });

      if (esFotoParaStorage) {
        const url = await subirFotoViaje({
          storage,
          userId: usuario.uid,
          viajeId,
          foto: fotoFileOptimizada || datosViaje.foto
        });
        if (url) {
          await actualizarViaje({ db, userId: usuario.uid, viajeId, data: { foto: url } });
        }
      }

      toast.success('Viaje guardado');
      return viajeId;
    } catch (saveError) {
      console.error('Error guardando:', saveError);
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
      const dataToSave = { ...data };
      if (dataToSave.fotoFile instanceof Blob) {
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
      toast.success('Viaje actualizado');
      return true;
    } catch (updateError) {
      console.error(updateError);
      setError(updateError);
      toast.error('No se pudo actualizar el viaje');
      return false;
    }
  };

  const agregarParada = async (lugarInfo, viajeId) => {
    if (!usuario || !viajeId) return false;

    try {
      const fechaUso = lugarInfo.fecha || getTodayIsoDate();
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
      return true;
    } catch (stopError) {
      console.error(stopError);
      setError(stopError);
      return false;
    }
  };

  const eliminar = async (id) => {
    if (!usuario) return false;
    try {
      await eliminarViaje({ db, userId: usuario.uid, viajeId: id });
      toast.success('Eliminado correctamente');
      return true;
    } catch (deleteError) {
      console.error(deleteError);
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
