import { useState, useEffect, useMemo } from 'react';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, getDoc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { ref, uploadString, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getCountryISO3, getFlagUrl, getCountryName } from '../utils/countryUtils';

// Clave API de Pexels desde variables de entorno
const PEXELS_ACCESS_KEY = import.meta.env.VITE_PEXELS_ACCESS_KEY || '';

// DEBUG: Verificar que la clave está disponible
if (!PEXELS_ACCESS_KEY) {
  console.warn('⚠️ VITE_PEXELS_ACCESS_KEY no está configurada en .env');
} else {
  console.log('✅ VITE_PEXELS_ACCESS_KEY cargada correctamente (primeros 10 caracteres):', PEXELS_ACCESS_KEY.substring(0, 10) + '...');
}

export const useViajes = () => {
  const { usuario } = useAuth();
  const { pushToast } = useToast();
  const toast = {
    success: (message) => pushToast(message, 'success'),
    error: (message) => pushToast(message, 'error')
  };
  const [bitacora, setBitacora] = useState([]);
  const [bitacoraData, setBitacoraData] = useState({});
  const [todasLasParadas, setTodasLasParadas] = useState([]);

  useEffect(() => {
    if (!usuario) { setBitacora([]); setBitacoraData({}); setTodasLasParadas([]); return; }

    const viajesRef = collection(db, `usuarios/${usuario.uid}/viajes`);
    const q = query(viajesRef, orderBy("fechaInicio", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBitacora(docs);
      
      const dataMap = docs.reduce((acc, viaje) => {
        acc[viaje.id] = { ...viaje };
        return acc;
      }, {});
      setBitacoraData(dataMap);

      const paradasPromises = docs.map(async (viaje) => {
        const paradasRef = collection(db, `usuarios/${usuario.uid}/viajes/${viaje.id}/paradas`);
        const paradasSnap = await getDocs(paradasRef);
        return paradasSnap.docs.map(p => ({ 
          id: p.id, viajeId: viaje.id, ...p.data() 
        }));
      });
      const paradasArrays = await Promise.all(paradasPromises);
      setTodasLasParadas(paradasArrays.flat());
    });
    return () => unsubscribe();
  }, [usuario]);

  // ISO3 para Mapbox
  const paisesVisitados = useMemo(() => {
    const codigos = new Set();
    bitacora.forEach(v => { 
        const iso3 = getCountryISO3(v.code);
        if(iso3) codigos.add(iso3);
    });
    todasLasParadas.forEach(p => { 
        const iso3 = getCountryISO3(p.paisCodigo);
        if(iso3) codigos.add(iso3);
    });
    return [...codigos].filter(Boolean);
  }, [bitacora, todasLasParadas]);

  // --- API CLIMA ---
  const obtenerClimaHistorico = async (lat, lng, fecha) => {
    if (!lat || !lng || !fecha) return null;
    try {
      const res = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${fecha}&end_date=${fecha}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
      const data = await res.json();
      
      if (data.daily?.weathercode && data.daily.weathercode.length > 0) {
        const code = data.daily.weathercode[0];
        const max = data.daily.temperature_2m_max[0];
        let desc = "Despejado";
        if (code > 3) desc = "Nublado";
        if (code > 45) desc = "Niebla";
        if (code > 50) desc = "Lluvioso";
        if (code > 70) desc = "Nieve";
        if (code > 95) desc = "Tormenta";
        return { desc, max, code };
      }
      return null;
    } catch { return null; }
  };

  // --- GENERADOR DE NOMBRES ---
  const generarTituloInteligente = (nombreBase, paradas) => {
    if (!paradas || paradas.length === 0) return nombreBase || "Nuevo Viaje";
    const ciudadesUnicas = [...new Set(paradas.map(p => p.nombre))];
    const paisesUnicos = [...new Set(paradas.map(p => p.paisCodigo).filter(Boolean))];

    if (ciudadesUnicas.length === 1) return `Escapada a ${ciudadesUnicas[0]}`;
    if (ciudadesUnicas.length === 2) return `${ciudadesUnicas[0]} y ${ciudadesUnicas[1]}`;
    
    if (paisesUnicos.length === 1) {
        const nombrePais = getCountryName(paisesUnicos[0]) || nombreBase;
        return `Ruta por ${nombrePais}`;
    }
    if (paisesUnicos.length > 1) {
        return `Gran Viaje: ${paisesUnicos.map(c => getCountryName(c)).join(' - ')}`;
    }
    return nombreBase;
  };

  // --- FOTOS PEXELS CON CACHÉ ---
  const obtenerFotoConCache = async (paisNombre, paisCode) => {
    try {
      // Validar parámetros
      if (!paisNombre) {
        console.warn("❌ Nombre de país no proporcionado");
        return null;
      }

      // Si no hay clave de API, no consultar
      if (!PEXELS_ACCESS_KEY) {
        console.warn("❌ Clave de API de Pexels no configurada. Usa VITE_PEXELS_ACCESS_KEY en .env");
        return null;
      }

      console.log(`🔍 Buscando foto de Pexels para: ${paisNombre} (${paisCode || 'sin código'})`);

      // Si hay código, verificar si está en caché
      if (paisCode) {
        const docRef = doc(db, 'paises_info', paisCode);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().url) {
          console.log(`📦 Foto encontrada en caché para ${paisCode}`);
          return docSnap.data(); // Devolver objeto con url y credito
        }
      }

      // Consultar API de Pexels
      console.log(`🌐 Consultando API de Pexels...`);
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(paisNombre + ' travel landmark')}&per_page=1`, {
        headers: {
          'Authorization': PEXELS_ACCESS_KEY
        }
      });
      
      if (!response.ok) {
        console.error(`❌ Error de Pexels: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const data = await response.json();
      if (!data.photos || data.photos.length === 0) {
        console.warn(`⚠️ No se encontraron fotos en Pexels para: ${paisNombre}`);
        return null;
      }

      const foto = data.photos[0];
      const fotoUrl = foto.src?.large || foto.src?.medium || foto.src?.small;
      
      if (!fotoUrl) {
        console.warn("⚠️ Foto de Pexels sin URL válida");
        return null;
      }
      
      const nuevaFotoInfo = { 
          url: fotoUrl,
          credito: { nombre: foto.photographer || 'Fotógrafo', link: foto.photographer_url || 'https://pexels.com' } 
      };
      
      // Guardar en caché solo si hay código válido
      if (paisCode) {
        const docRef = doc(db, 'paises_info', paisCode);
        await setDoc(docRef, nuevaFotoInfo);
        console.log(`✅ Foto de Pexels cacheada para: ${paisCode}`);
      }
      
      return nuevaFotoInfo;
    } catch (e) { 
        console.error("❌ No se pudo cargar foto de Pexels:", e.message);
        return null; 
    }
  };

  const subirFotoStorage = async (viajeId, fotoOptimizada) => {
    try {
      const storageRef = ref(storage, `usuarios/${usuario.uid}/viajes/${viajeId}/portada.jpg`);
      if (fotoOptimizada instanceof Blob) {
        await uploadBytes(storageRef, fotoOptimizada, { contentType: fotoOptimizada.type || 'image/jpeg' });
      } else if (typeof fotoOptimizada === 'string' && fotoOptimizada.startsWith('data:image')) {
        await uploadString(storageRef, fotoOptimizada, 'data_url');
      } else {
        return null;
      }
      return await getDownloadURL(storageRef);
    } catch { return null; }
  };

  // --- GUARDADO ---
  const guardarNuevoViaje = async (datosViaje, paradas = []) => {
    if (!usuario) return null;

    console.log("📝 Guardando viaje:", { nombreEspanol: datosViaje.nombreEspanol, code: datosViaje.code });

    let fotoFinal = datosViaje.foto;
    let creditoFinal = datosViaje.fotoCredito || null;
    const fotoFileOptimizada = datosViaje.fotoFile || null;
    const esFotoBase64 = fotoFinal && typeof fotoFinal === 'string' && fotoFinal.startsWith('data:image');
    const esFotoParaStorage = !!fotoFileOptimizada || !!esFotoBase64;

    // Si no hay foto o es Base64, intentar obtener de Pexels
    if (!fotoFinal || esFotoBase64) {
       if (!fotoFinal) {
         console.log("📸 Intentando obtener foto de Pexels...");
         const fotoInfo = await obtenerFotoConCache(datosViaje.nombreEspanol, datosViaje.code);
         if (fotoInfo) { 
           fotoFinal = fotoInfo.url; 
           creditoFinal = fotoInfo.credito;
           console.log("✅ Foto obtenida de Pexels"); 
         } else {
           console.log("⚠️ No se pudo obtener foto de Pexels");
         }
       }
    }

    const banderasParadas = paradas.map(p => getFlagUrl(p.paisCodigo)).filter(Boolean);
    const banderasBase = [getFlagUrl(datosViaje.code)].filter(Boolean);
    const banderasFinales = banderasParadas.length > 0 ? [...new Set(banderasParadas)] : banderasBase;

    const titulo = generarTituloInteligente(datosViaje.nombreEspanol, paradas);
    const ciudadesStr = [...new Set(paradas.map(p => p.nombre))].join(', ');

    // Procesar Paradas + Clima (Paralelo)
    const paradasProcesadas = await Promise.all(paradas.map(async (p) => {
        const fechaUso = p.fecha || datosViaje.fechaInicio;
        const climaInfo = await obtenerClimaHistorico(p.coordenadas[1], p.coordenadas[0], fechaUso);
        return {
            nombre: p.nombre,
            coordenadas: p.coordenadas,
            fecha: fechaUso,
            fechaLlegada: p.fechaLlegada || "",
            fechaSalida: p.fechaSalida || "",
            paisCodigo: p.paisCodigo || "",
            clima: climaInfo,
            tipo: 'place'
        };
    }));

    const nuevoViaje = {
      code: datosViaje.code || "",
      nombreEspanol: datosViaje.nombreEspanol || "Viaje",
      titulo: datosViaje.titulo || titulo,
      fechaInicio: datosViaje.fechaInicio || new Date().toISOString().split('T')[0],
      fechaFin: datosViaje.fechaFin || new Date().toISOString().split('T')[0],
      texto: datosViaje.texto || "",
      rating: 5,
      foto: esFotoParaStorage ? null : (fotoFinal || null),
      fotoCredito: creditoFinal,
      banderas: banderasFinales,
      ciudades: ciudadesStr
    };

    const batch = writeBatch(db);
    const viajeRef = doc(collection(db, `usuarios/${usuario.uid}/viajes`));
    batch.set(viajeRef, nuevoViaje);

    paradasProcesadas.forEach(p => {
        const paradaRef = doc(collection(db, `usuarios/${usuario.uid}/viajes/${viajeRef.id}/paradas`));
        batch.set(paradaRef, p);
    });

    try {
      await batch.commit();
      if (esFotoParaStorage) {
         const url = await subirFotoStorage(viajeRef.id, fotoFileOptimizada || datosViaje.foto);
         if(url) await updateDoc(viajeRef, { foto: url });
      }
      toast.success('Viaje guardado');
      return viajeRef.id;
    } catch (e) { 
      console.error("Error guardando:", e); 
      toast.error('No se pudo guardar el viaje');
      return null; 
    }
  };

  const actualizarDetallesViaje = async (id, data) => {
      if(!usuario) return false;
      try {
        const dataToSave = { ...data };
        if (dataToSave.fotoFile instanceof Blob) {
            const url = await subirFotoStorage(id, dataToSave.fotoFile);
            if (!url) throw new Error('No se pudo subir la imagen optimizada');
            dataToSave.foto = url;
        } else if (dataToSave.foto && typeof dataToSave.foto === 'string' && dataToSave.foto.startsWith('data:image')) {
            const url = await subirFotoStorage(id, dataToSave.foto);
            if (!url) throw new Error('No se pudo subir la imagen en base64');
            dataToSave.foto = url;
        }
        delete dataToSave.fotoFile;
        await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id), dataToSave);
        toast.success('Viaje actualizado');
        return true;
      } catch(e) {
        console.error(e);
        toast.error('No se pudo actualizar el viaje');
        return false;
      }
  };

  const agregarParada = async (lugarInfo, viajeId) => {
      if (!usuario || !viajeId) return false;
      try {
          const fechaUso = lugarInfo.fecha || new Date().toISOString().split('T')[0];
          const climaInfo = await obtenerClimaHistorico(lugarInfo.coordenadas[1], lugarInfo.coordenadas[0], fechaUso);
          
          await addDoc(collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`), {
              ...lugarInfo,
              clima: climaInfo,
              tipo: 'place'
          });
          return true;
      } catch(e) {
          console.error(e);
          return false;
      }
  };

  const eliminarViaje = async (id) => {
      if (!usuario) return false;
      try {
        await deleteDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id));
        toast.success('Eliminado correctamente');
        return true;
      } catch (e) {
        console.error(e);
        toast.error('No se pudo eliminar el viaje');
        return false;
      }
  };

  return {
    paisesVisitados, bitacora, bitacoraData, todasLasParadas,
    guardarNuevoViaje, agregarParada, 
    actualizarDetallesViaje, eliminarViaje
  };
};
