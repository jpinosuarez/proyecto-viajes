import { useState, useEffect, useMemo } from 'react';
import { MAPA_SELLOS } from '../assets/sellos';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { 
  collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, getDoc, setDoc, getDocs, writeBatch 
} from 'firebase/firestore';
import { 
  ref, uploadString, getDownloadURL, deleteObject 
} from 'firebase/storage';

const UNSPLASH_ACCESS_KEY = 'IHckgwuhGnzg4MoJamPuB6rECV9MJsBb3rRE2ty3WJg';

export const useViajes = () => {
  const { usuario } = useAuth();
  const [bitacora, setBitacora] = useState([]);
  const [bitacoraData, setBitacoraData] = useState({});
  const [todasLasParadas, setTodasLasParadas] = useState([]);

  // 1. ESCUCHAR CAMBIOS
  useEffect(() => {
    if (!usuario) {
      setBitacora([]); setBitacoraData({}); setTodasLasParadas([]); return;
    }

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
          id: p.id, viajeId: viaje.id, paisCodigo: viaje.code, ...p.data() 
        }));
      });
      
      const paradasArrays = await Promise.all(paradasPromises);
      setTodasLasParadas(paradasArrays.flat());
    });

    return () => unsubscribe();
  }, [usuario]);

  const paisesVisitados = useMemo(() => [...new Set(bitacora.map(v => v.code))], [bitacora]);

  // --- HELPERS ---
  const buscarPaisEnCatalogo = (nombreMapbox, codigoMapbox) => {
    const busqueda = nombreMapbox ? nombreMapbox.toLowerCase() : '';
    return MAPA_SELLOS.find(p => {
       const codeMatch = p.code.substring(0,2) === codigoMapbox?.toUpperCase();
       const nameMatch = p.name.toLowerCase() === busqueda || p.nombreEspanol.toLowerCase() === busqueda;
       return codeMatch || nameMatch;
    });
  };

  const obtenerClimaHistorico = async (lat, lng, fecha) => {
    try {
      const res = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${fecha}&end_date=${fecha}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
      const data = await res.json();
      if (data.daily?.weathercode) {
        const code = data.daily.weathercode[0];
        const max = data.daily.temperature_2m_max[0];
        let desc = "Despejado";
        if (code > 3) desc = "Nublado";
        if (code > 50) desc = "Lluvioso";
        if (code > 60) desc = "Tormenta";
        if (code > 70) desc = "Nevado";
        return { desc, max };
      }
      return null;
    } catch { return null; }
  };

  // --- LÓGICA DE ACTUALIZACIÓN INTELIGENTE (PADRE) ---
  const actualizarResumenViaje = async (viajeId) => {
    try {
      const paradasRef = collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`);
      const snapshot = await getDocs(paradasRef);
      const paradas = snapshot.docs.map(d => d.data());

      if (paradas.length === 0) return;

      // 1. Fechas
      const fechas = paradas.map(p => new Date(p.fecha).getTime());
      const inicio = new Date(Math.min(...fechas)).toISOString().split('T')[0];
      const fin = new Date(Math.max(...fechas)).toISOString().split('T')[0];

      // 2. Título Dinámico
      const ciudadesNombres = [...new Set(paradas.map(p => p.nombre))];
      let tituloNuevo = "";
      if (ciudadesNombres.length === 1) tituloNuevo = `${ciudadesNombres[0]}`;
      else if (ciudadesNombres.length === 2) tituloNuevo = `${ciudadesNombres[0]} y ${ciudadesNombres[1]}`;
      else if (ciudadesNombres.length === 3) tituloNuevo = `${ciudadesNombres[0]}, ${ciudadesNombres[1]} y ${ciudadesNombres[2]}`;
      else tituloNuevo = `Ruta por ${paradas[0].paisCodigo || 'Europa'}`; // Fallback

      // 3. Banderas Multi-país
      // Buscamos las banderas de los códigos de país de las paradas
      const codigosPaises = [...new Set(paradas.map(p => p.paisCodigo).filter(Boolean))];
      const banderas = codigosPaises.map(code => {
          const pais = MAPA_SELLOS.find(p => p.code.startsWith(code)); // Match flexible Alpha-2/3
          return pais ? pais.flag : '🏳️';
      });

      await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, viajeId), {
        ciudades: ciudadesNombres.join(', '),
        fechaInicio: inicio,
        fechaFin: fin,
        banderas: banderas, // Nuevo campo array
        // Opcional: Si el usuario no editó el título manualmente, podríamos sugerir actualizarlo
        // titulo: tituloNuevo 
      });

    } catch (e) { console.error("Error actualizando resumen:", e); }
  };

  const obtenerFotoConCache = async (paisNombre, paisCode) => {
    try {
      const docRef = doc(db, 'paises_info', paisCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();

      const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(paisNombre + ' travel landmark')}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`);
      const data = await response.json();
      const rawUrl = data.urls.raw;
      const urlOptimizada = `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}w=1600&q=80&auto=format&fit=crop`;

      const nuevaFotoInfo = {
        url: urlOptimizada,
        credito: { nombre: data.user.name, link: data.user.links.html }
      };
      await setDoc(docRef, nuevaFotoInfo);
      return nuevaFotoInfo;
    } catch { return null; }
  };

  // --- ACCIONES ---

  const guardarNuevoViaje = async (datosViaje, ciudadInicial = null) => {
    if (!usuario) return null;

    let fotoFinal = datosViaje.foto;
    let creditoFinal = null;

    if (!fotoFinal || !fotoFinal.startsWith('data:image')) {
       if (!fotoFinal) {
         const fotoInfo = await obtenerFotoConCache(datosViaje.nombreEspanol, datosViaje.code);
         if (fotoInfo) {
            fotoFinal = fotoInfo.url;
            creditoFinal = fotoInfo.credito;
         }
       }
    }

    const nuevoViaje = {
      code: datosViaje.code,
      nombreEspanol: datosViaje.nombreEspanol,
      titulo: datosViaje.titulo || `Viaje a ${datosViaje.nombreEspanol}`,
      flag: datosViaje.flag,
      continente: datosViaje.continente,
      latlng: datosViaje.latlng,
      fechaInicio: datosViaje.fechaInicio,
      fechaFin: datosViaje.fechaFin,
      texto: datosViaje.texto || "",
      rating: 5,
      foto: fotoFinal,
      fotoCredito: creditoFinal,
      banderas: [datosViaje.flag], // Inicial
      ciudades: ""
    };

    try {
      const docRef = await addDoc(collection(db, `usuarios/${usuario.uid}/viajes`), nuevoViaje);
      
      if (datosViaje.foto && datosViaje.foto.startsWith('data:image')) {
         await subirFotoStorage(docRef.id, datosViaje.foto);
      }
      return docRef.id;
    } catch (e) { return null; }
  };

  const agregarParada = async (lugarInfo, viajeId) => {
    if (!usuario || !viajeId) return null;

    const fechaUsar = lugarInfo.fecha || new Date().toISOString().split('T')[0];
    const climaInfo = await obtenerClimaHistorico(lugarInfo.coordenadas[1], lugarInfo.coordenadas[0], fechaUsar);

    const nuevaParada = {
      nombre: lugarInfo.nombre,
      tipo: 'place',
      coordenadas: lugarInfo.coordenadas,
      fecha: fechaUsar,
      clima: climaInfo,
      relato: "",
      paisCodigo: lugarInfo.paisCodigo || "" 
    };

    try {
      await addDoc(collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`), nuevaParada);
      await actualizarResumenViaje(viajeId); // Recalcular banderas/fechas
    } catch (e) { console.error(e) }
  };

  const subirFotoStorage = async (viajeId, fotoBase64) => {
    try {
      const storageRef = ref(storage, `usuarios/${usuario.uid}/viajes/${viajeId}/portada.jpg`);
      await uploadString(storageRef, fotoBase64, 'data_url');
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, viajeId), { foto: url, fotoCredito: null });
    } catch { }
  };

  const actualizarDetallesViaje = async (id, data) => {
    if (!usuario) return;
    try {
      if (data.foto && data.foto.startsWith('data:image')) {
        await subirFotoStorage(id, data.foto);
        delete data.foto; 
      }
      await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id), data);
    } catch (e) { console.error(e); }
  };

  const eliminarViaje = async (id) => {
    if (!usuario) return;
    try {
      await deleteDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id));
      const fotoRef = ref(storage, `usuarios/${usuario.uid}/viajes/${id}/portada.jpg`);
      await deleteObject(fotoRef).catch(() => {});
    } catch (e) { console.error(e); }
  };

  const eliminarParada = async (viajeId, paradaId) => {
      if(!usuario) return;
      try {
          await deleteDoc(doc(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`, paradaId));
          await actualizarResumenViaje(viajeId);
      } catch (e) { console.error(e) }
  };

  return {
    paisesVisitados, bitacora, bitacoraData, todasLasParadas,
    listaPaises: MAPA_SELLOS,
    buscarPaisEnCatalogo, 
    guardarNuevoViaje, 
    agregarParada, eliminarParada,
    actualizarDetallesViaje, eliminarViaje
  };
};