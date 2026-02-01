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
import { getCountryISO3, getFlagEmoji } from '../utils/countryUtils';

const UNSPLASH_ACCESS_KEY = 'IHckgwuhGnzg4MoJamPuB6rECV9MJsBb3rRE2ty3WJg';

export const useViajes = () => {
  const { usuario } = useAuth();
  const [bitacora, setBitacora] = useState([]);
  const [bitacoraData, setBitacoraData] = useState({});
  const [todasLasParadas, setTodasLasParadas] = useState([]);

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
          id: p.id, viajeId: viaje.id, ...p.data() 
        }));
      });
      
      const paradasArrays = await Promise.all(paradasPromises);
      setTodasLasParadas(paradasArrays.flat());
    });

    return () => unsubscribe();
  }, [usuario]);

  // Códigos ISO-3 para colorear mapas
  const paisesVisitados = useMemo(() => {
    const codigos = new Set();
    bitacora.forEach(v => { if(v.code) codigos.add(getCountryISO3(v.code)); });
    // También incluir países de paradas individuales si son distintos al principal
    todasLasParadas.forEach(p => { if(p.paisCodigo) codigos.add(getCountryISO3(p.paisCodigo)); });
    return [...codigos].filter(Boolean);
  }, [bitacora, todasLasParadas]);

  // --- GENERADOR DE NOMBRES DINÁMICOS ---
  const generarTituloInteligente = (nombreBase, paradas) => {
    if (!paradas || paradas.length === 0) return nombreBase; // Fallback

    const ciudadesUnicas = [...new Set(paradas.map(p => p.nombre))];
    const paisesUnicos = [...new Set(paradas.map(p => p.paisCodigo).filter(Boolean))];

    // Caso 1: Una sola ciudad
    if (ciudadesUnicas.length === 1) return `${ciudadesUnicas[0]}`;
    
    // Caso 2: Dos ciudades
    if (ciudadesUnicas.length === 2) return `${ciudadesUnicas[0]} y ${ciudadesUnicas[1]}`;

    // Caso 3: Mismo país, muchas ciudades
    if (paisesUnicos.length === 1) {
        // Intentar obtener nombre del país del catálogo o usar el nombre base
        const paisInfo = MAPA_SELLOS.find(p => p.code.includes(paisesUnicos[0])); 
        const nombrePais = paisInfo ? paisInfo.nombreEspanol : nombreBase;
        return `Ruta por ${nombrePais}`;
    }

    // Caso 4: Multi-país
    if (paisesUnicos.length > 1) {
        if(paisesUnicos.length === 2) {
             // Buscar nombres
             const p1 = MAPA_SELLOS.find(p => p.code.includes(paisesUnicos[0]))?.nombreEspanol || paisesUnicos[0];
             const p2 = MAPA_SELLOS.find(p => p.code.includes(paisesUnicos[1]))?.nombreEspanol || paisesUnicos[1];
             return `${p1} y ${p2}`;
        }
        return `Travesía por ${paisesUnicos.length} Países`;
    }

    return nombreBase;
  };

  const actualizarResumenViaje = async (viajeId) => {
    try {
      const paradasRef = collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`);
      const snapshot = await getDocs(paradasRef);
      const paradas = snapshot.docs.map(d => d.data());

      if (paradas.length === 0) return;

      // 1. Fechas
      const fechas = paradas.flatMap(p => [p.fechaLlegada, p.fechaSalida, p.fecha].filter(Boolean));
      const fechasTime = fechas.map(f => new Date(f).getTime());
      const inicio = new Date(Math.min(...fechasTime)).toISOString().split('T')[0];
      const fin = new Date(Math.max(...fechasTime)).toISOString().split('T')[0];

      // 2. Banderas
      const codigosUnicos = [...new Set(paradas.map(p => p.paisCodigo).filter(Boolean))];
      const banderas = codigosUnicos.map(code => getFlagEmoji(code));

      // 3. Título Dinámico
      // Obtenemos el viaje actual para ver si tiene nombre manual, sino generamos
      const viajeDoc = await getDoc(doc(db, `usuarios/${usuario.uid}/viajes`, viajeId));
      const viajeData = viajeDoc.data();
      const tituloGenerado = generarTituloInteligente(viajeData.nombreEspanol, paradas);

      await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, viajeId), {
        ciudades: [...new Set(paradas.map(p => p.nombre))].join(', '),
        fechaInicio: inicio,
        fechaFin: fin,
        banderas: banderas,
        titulo: tituloGenerado // Actualizamos el título automáticamente
      });
    } catch (e) { console.error(e); }
  };

  // --- HELPERS FOTO ---
  const obtenerFotoConCache = async (paisNombre, paisCode) => {
    try {
      if(!paisCode) return null;
      // Usar código alpha-3 para consistencia en DB si es posible, sino el que venga
      const docRef = doc(db, 'paises_info', paisCode); 
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();

      const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(paisNombre + ' travel')}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`);
      const data = await response.json();
      if (!data.urls) return null;
      
      const nuevaFotoInfo = {
        url: `${data.urls.raw}&w=1600&q=80&auto=format&fit=crop`,
        credito: { nombre: data.user.name, link: data.user.links.html }
      };
      await setDoc(docRef, nuevaFotoInfo);
      return nuevaFotoInfo;
    } catch { return null; }
  };

  const subirFotoStorage = async (viajeId, fotoBase64) => {
    try {
      const storageRef = ref(storage, `usuarios/${usuario.uid}/viajes/${viajeId}/portada.jpg`);
      await uploadString(storageRef, fotoBase64, 'data_url');
      const url = await getDownloadURL(storageRef);
      // Actualizar el documento con la URL permanente
      await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, viajeId), { foto: url, fotoCredito: null });
      return url;
    } catch (e) { console.error("Error subiendo foto", e); return null; }
  };

  // --- GUARDAR NUEVO ---
  const guardarNuevoViaje = async (datosViaje, ciudadInicial = null) => {
    if (!usuario) return null;

    let fotoFinal = datosViaje.foto;
    let creditoFinal = datosViaje.fotoCredito || null;

    // Si no hay foto definida por el usuario (ni URL ni Base64), buscar en API
    if (!fotoFinal) {
         const fotoInfo = await obtenerFotoConCache(datosViaje.nombreEspanol, datosViaje.code);
         if (fotoInfo) { 
             fotoFinal = fotoInfo.url; 
             creditoFinal = fotoInfo.credito; 
         }
    }

    const nuevoViaje = {
      code: datosViaje.code,
      nombreEspanol: datosViaje.nombreEspanol,
      titulo: datosViaje.titulo || datosViaje.nombreEspanol, // Título inicial
      flag: datosViaje.flag,
      continente: datosViaje.continente || 'Mundo',
      latlng: datosViaje.latlng || [0,0],
      fechaInicio: datosViaje.fechaInicio,
      fechaFin: datosViaje.fechaFin,
      texto: datosViaje.texto || "",
      rating: 5,
      foto: (fotoFinal && fotoFinal.startsWith('data:image')) ? null : fotoFinal, // Si es base64 guardamos null temp
      fotoCredito: creditoFinal,
      banderas: [datosViaje.flag],
      ciudades: ""
    };

    try {
      const docRef = await addDoc(collection(db, `usuarios/${usuario.uid}/viajes`), nuevoViaje);
      
      // Si la foto era base64, subirla ahora y actualizar
      if (fotoFinal && fotoFinal.startsWith('data:image')) {
         await subirFotoStorage(docRef.id, fotoFinal);
      }

      return docRef.id;
    } catch (e) { return null; }
  };

  // Re-exportamos helpers
  const buscarPaisEnCatalogo = (nombreMapbox, codigoMapbox) => {
    const busqueda = nombreMapbox ? nombreMapbox.toLowerCase() : '';
    return MAPA_SELLOS.find(p => {
       const codeMatch = p.code.substring(0,2) === codigoMapbox?.toUpperCase();
       const nameMatch = p.name.toLowerCase() === busqueda || p.nombreEspanol.toLowerCase() === busqueda;
       return codeMatch || nameMatch;
    });
  };

  const agregarParada = async (lugarInfo, viajeId) => {
    if (!usuario || !viajeId) return null;
    const nuevaParada = {
      nombre: lugarInfo.nombre,
      coordenadas: lugarInfo.coordenadas,
      fecha: lugarInfo.fecha || new Date().toISOString().split('T')[0],
      fechaLlegada: lugarInfo.fechaLlegada || "",
      fechaSalida: lugarInfo.fechaSalida || "",
      paisCodigo: lugarInfo.paisCodigo || "",
      tipo: 'place'
    };
    try {
      await addDoc(collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`), nuevaParada);
      await actualizarResumenViaje(viajeId); // Recalcular todo
    } catch (e) { console.error(e) }
  };

  const actualizarDetallesViaje = async (id, data) => {
      // Wrapper para actualizar
      if(!usuario) return;
      if (data.foto && data.foto.startsWith('data:image')) {
          await subirFotoStorage(id, data.foto);
          delete data.foto;
      }
      await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id), data);
  };

  const eliminarViaje = async (id) => {
      if (!usuario) return;
      await deleteDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id));
      // Limpiar storage opcional
  };

  const eliminarParada = async (viajeId, paradaId) => {
      if(!usuario) return;
      await deleteDoc(doc(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`, paradaId));
      await actualizarResumenViaje(viajeId);
  };

  return {
    paisesVisitados, bitacora, bitacoraData, todasLasParadas,
    listaPaises: MAPA_SELLOS,
    buscarPaisEnCatalogo, 
    guardarNuevoViaje, agregarParada, eliminarParada,
    actualizarDetallesViaje, eliminarViaje
  };
};