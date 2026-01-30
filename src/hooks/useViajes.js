import { useState, useEffect, useMemo } from 'react';
import { MAPA_SELLOS } from '../assets/sellos';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { 
  collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, getDoc, setDoc, getDocs 
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

      // Cargar paradas para el mapa
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

  // --- UTILIDADES ---
  const buscarPaisEnCatalogo = (nombreMapbox, codigoMapbox) => {
    const busqueda = nombreMapbox ? nombreMapbox.toLowerCase() : '';
    // Intentar coincidencia por código (Alpha-2 vs Alpha-3) o nombre
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
        let desc = "Despejado ☀️";
        if (code > 3) desc = "Nublado ☁️";
        if (code > 50) desc = "Lluvioso 🌧️";
        if (code > 70) desc = "Nieve ❄️";
        return { desc, max };
      }
      return null;
    } catch (e) { return null; }
  };

  const obtenerFotoConCache = async (pais) => {
    try {
      const docRef = doc(db, 'paises_info', pais.code);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();

      const nombreBusqueda = pais.name || pais.nombreEspanol;
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(nombreBusqueda + ' landmark travel')}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`);
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

  const agregarViaje = async (pais, tituloPersonalizado = null) => {
    if (!usuario) return null;
    // Evitar duplicados exactos
    const viajeExistente = bitacora.find(v => v.code === pais.code);
    if (viajeExistente) return viajeExistente.id;

    const fechaISO = new Date().toISOString().split('T')[0];
    const fotoInfo = await obtenerFotoConCache(pais);

    const nuevoViaje = {
      code: pais.code,
      nombreEspanol: pais.nombreEspanol,
      titulo: tituloPersonalizado || `Viaje a ${pais.nombreEspanol}`,
      flag: pais.flag,
      continente: pais.continente,
      latlng: pais.latlng,
      fecha: fechaISO, fechaInicio: fechaISO, fechaFin: fechaISO,
      texto: "", rating: 5,
      foto: fotoInfo?.url || null,
      fotoCredito: fotoInfo?.credito || null,
      ciudades: ""
    };

    try {
      const docRef = await addDoc(collection(db, `usuarios/${usuario.uid}/viajes`), nuevoViaje);
      return docRef.id;
    } catch (e) { return null; }
  };

  const agregarParada = async (lugarInfo) => {
    if (!usuario) return null;
    // Buscar país padre. Si no viene código, intentamos buscar por nombre
    const paisCatalogo = buscarPaisEnCatalogo(lugarInfo.paisNombre, lugarInfo.paisCodigo);
    
    if (!paisCatalogo) {
      console.warn("País no encontrado en catálogo:", lugarInfo);
      // Fallback: Si no encontramos país, quizás podamos crearlo solo con el nombre, 
      // pero por seguridad retornamos null y alertamos en UI.
      return null;
    }

    let viajeId = bitacora.find(v => v.code === paisCatalogo.code)?.id;
    if (!viajeId) {
      viajeId = await agregarViaje(paisCatalogo, `Aventura en ${lugarInfo.nombre}`);
    }

    const fechaHoy = new Date().toISOString().split('T')[0];
    const climaInfo = await obtenerClimaHistorico(lugarInfo.coordenadas[1], lugarInfo.coordenadas[0], fechaHoy);

    const nuevaParada = {
      nombre: lugarInfo.nombre,
      tipo: lugarInfo.tipo || 'place',
      coordenadas: lugarInfo.coordenadas,
      fecha: fechaHoy,
      clima: climaInfo,
      relato: "",
    };

    try {
      await addDoc(collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`), nuevaParada);
      
      const viajeActual = bitacoraData[viajeId];
      const ciudadesPrevias = viajeActual?.ciudades ? viajeActual.ciudades.split(', ') : [];
      if (!ciudadesPrevias.includes(lugarInfo.nombre)) {
        await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, viajeId), { 
          ciudades: [...ciudadesPrevias, lugarInfo.nombre].join(', ') 
        });
      }
      return viajeId;
    } catch (e) { return null; }
  };

  const actualizarDetallesViaje = async (id, data) => {
    if (!usuario) return;
    try {
      let fotoUrl = data.foto;
      if (data.foto && data.foto.startsWith('data:image')) {
        fotoUrl = await subirFotoStorage(id, data.foto);
      }
      const datosLimpios = { ...data, foto: fotoUrl };
      if (data.foto && data.foto.startsWith('data:image')) datosLimpios.fotoCredito = null;
      await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id), datosLimpios);
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

  const manejarCambioPaises = async (nuevosCodes) => {
    if (!usuario) return null;
    if (nuevosCodes.length > paisesVisitados.length) {
      const codeAdded = nuevosCodes.find(c => !paisesVisitados.includes(c));
      const paisInfo = MAPA_SELLOS.find(p => p.code === codeAdded);
      if (paisInfo) return await agregarViaje(paisInfo);
    } else {
      const codeRemoved = paisesVisitados.find(c => !nuevosCodes.includes(c));
      const viajeAEliminar = bitacora.find(v => v.code === codeRemoved);
      if (viajeAEliminar) eliminarViaje(viajeAEliminar.id);
    }
    return null;
  };

  return {
    paisesVisitados, bitacora, bitacoraData, todasLasParadas,
    listaPaises: MAPA_SELLOS,
    agregarViaje, agregarParada, actualizarDetallesViaje, eliminarViaje, manejarCambioPaises
  };
};