import { useState, useEffect, useMemo } from 'react';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, getDoc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { getCountryISO3, getFlagUrl, getCountryName } from '../utils/countryUtils';

// ⚠️ IMPORTANTE: Reemplaza esto con TU propia Access Key de Unsplash Developers
const UNSPLASH_ACCESS_KEY = 'IHckgwuhGnzg4MoJamPuB6rECV9MJsBb3rRE2ty3WJg'; 

export const useViajes = () => {
  const { usuario } = useAuth();
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

  // --- CORRECCIÓN PINTADO MAPA ---
  // Generamos un array limpio de códigos ISO-3 (ej: ['ARG', 'BRA', 'DEU'])
  const paisesVisitados = useMemo(() => {
    const codigos = new Set();
    // 1. Del código principal del viaje
    bitacora.forEach(v => { 
        const iso3 = getCountryISO3(v.code);
        if(iso3) codigos.add(iso3); 
    });
    // 2. De las paradas individuales
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
    } catch (e) { return null; }
  };

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

  // --- CORRECCIÓN FOTOS UNSPLASH ---
  const obtenerFotoConCache = async (paisNombre, paisCode) => {
    try {
      // 1. Verificar cache local en Firestore
      const docRef = doc(db, 'paises_info', paisCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();

      // 2. Llamada a API
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(paisNombre + ' travel landmark')}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`);
      
      if (!response.ok) {
          console.error("Error Unsplash:", response.status, response.statusText);
          throw new Error("Fallo Unsplash");
      }

      const data = await response.json();
      
      // 3. Validar respuesta
      if (!data || !data.urls || !data.urls.regular) return null;

      const urlOptimizada = data.urls.regular; // Usar 'regular' es más seguro y rápido
      const nuevaFotoInfo = { 
          url: urlOptimizada, 
          credito: { nombre: data.user.name, link: data.user.links.html } 
      };
      
      // 4. Guardar en cache
      await setDoc(docRef, nuevaFotoInfo);
      return nuevaFotoInfo;

    } catch (e) { 
        console.warn("Usando imagen de respaldo por error en API:", e);
        return null; 
    }
  };

  const subirFotoStorage = async (viajeId, fotoBase64) => {
    try {
      const storageRef = ref(storage, `usuarios/${usuario.uid}/viajes/${viajeId}/portada.jpg`);
      await uploadString(storageRef, fotoBase64, 'data_url');
      return await getDownloadURL(storageRef);
    } catch { return null; }
  };

  const guardarNuevoViaje = async (datosViaje, paradas = []) => {
    if (!usuario) return null;

    let fotoFinal = datosViaje.foto;
    let creditoFinal = datosViaje.fotoCredito || null;
    const esFotoBase64 = fotoFinal && fotoFinal.startsWith('data:image');

    // Si no hay foto o es base64 (que subiremos luego), intentamos buscar una en Unsplash si no es subida manual
    if (!fotoFinal && !esFotoBase64) {
         const fotoInfo = await obtenerFotoConCache(datosViaje.nombreEspanol, datosViaje.code);
         if (fotoInfo) { 
             fotoFinal = fotoInfo.url; 
             creditoFinal = fotoInfo.credito; 
         }
    }

    const banderasParadas = paradas.map(p => getFlagUrl(p.paisCodigo)).filter(Boolean);
    const banderasBase = [getFlagUrl(datosViaje.code)].filter(Boolean);
    const banderasFinales = banderasParadas.length > 0 ? [...new Set(banderasParadas)] : banderasBase;

    const titulo = generarTituloInteligente(datosViaje.nombreEspanol, paradas);
    const ciudadesStr = [...new Set(paradas.map(p => p.nombre))].join(', ');

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
      foto: esFotoBase64 ? null : fotoFinal, // Guardamos la URL o null (si es base64)
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
      
      // Subida diferida de imagen manual
      if (esFotoBase64) {
         const url = await subirFotoStorage(viajeRef.id, datosViaje.foto);
         if(url) await updateDoc(viajeRef, { foto: url });
      }
      return viajeRef.id;
    } catch (e) { 
      console.error("Error al guardar viaje:", e); 
      return null; 
    }
  };

  const actualizarDetallesViaje = async (id, data) => {
      if(!usuario) return;
      try {
        if (data.foto && data.foto.startsWith('data:image')) {
            const url = await subirFotoStorage(id, data.foto);
            data.foto = url;
        }
        await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id), data);
      } catch(e) { console.error(e); }
  };

  const agregarParada = async (lugarInfo, viajeId) => {
      if (!usuario || !viajeId) return;
      try {
          const fechaUso = lugarInfo.fecha || new Date().toISOString().split('T')[0];
          const climaInfo = await obtenerClimaHistorico(lugarInfo.coordenadas[1], lugarInfo.coordenadas[0], fechaUso);
          
          await addDoc(collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`), {
              ...lugarInfo,
              clima: climaInfo,
              tipo: 'place'
          });
      } catch(e) { console.error(e); }
  };

  const eliminarViaje = async (id) => {
      if (!usuario) return;
      await deleteDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id));
  };

  return {
    paisesVisitados, bitacora, bitacoraData, todasLasParadas,
    guardarNuevoViaje, agregarParada, 
    actualizarDetallesViaje, eliminarViaje
  };
};