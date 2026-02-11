import { doc, getDoc, setDoc } from 'firebase/firestore';
import { EXTERNAL_API_TIMEOUT_MS, FOTO_DEFAULT_URL } from '../../utils/viajeUtils';

const conTimeout = async (fn, fallbackValue, timeoutMs = EXTERNAL_API_TIMEOUT_MS) => {
  try {
    return await Promise.race([
      fn(),
      new Promise((resolve) => {
        setTimeout(() => resolve(fallbackValue), timeoutMs);
      })
    ]);
  } catch {
    return fallbackValue;
  }
};

export const obtenerFotoConCache = async ({
  db,
  paisNombre,
  paisCode,
  pexelsApiKey,
  logger = console
}) => {
  try {
    if (!paisNombre || !pexelsApiKey) return null;

    if (paisCode) {
      const docRef = doc(db, 'paises_info', paisCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().url) {
        return docSnap.data();
      }
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(`${paisNombre} travel landmark`)}&per_page=1`,
      { headers: { Authorization: pexelsApiKey } }
    );

    if (!response.ok) {
      logger.error(`Error de Pexels: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (!data.photos || data.photos.length === 0) return null;

    const foto = data.photos[0];
    const fotoUrl = foto.src?.large || foto.src?.medium || foto.src?.small;
    if (!fotoUrl) return null;

    const fotoInfo = {
      url: fotoUrl,
      credito: {
        nombre: foto.photographer || 'Fotografo',
        link: foto.photographer_url || 'https://pexels.com'
      }
    };

    if (paisCode) {
      await setDoc(doc(db, 'paises_info', paisCode), fotoInfo);
    }

    return fotoInfo;
  } catch (error) {
    logger.error('No se pudo cargar foto de Pexels:', error?.message || error);
    return null;
  }
};

export const obtenerFotoConCacheSeguro = async ({
  db,
  paisNombre,
  paisCode,
  pexelsApiKey,
  logger = console
}) => {
  const fotoPorDefecto = { url: FOTO_DEFAULT_URL, credito: null };
  if (!paisNombre) return fotoPorDefecto;

  const fotoInfo = await conTimeout(
    () => obtenerFotoConCache({ db, paisNombre, paisCode, pexelsApiKey, logger }),
    null
  );

  return fotoInfo || fotoPorDefecto;
};
