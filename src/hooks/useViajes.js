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
    } catch { return null; }
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

  // --- ACCIONES PRINCIPALES ---

  // NUEVO: Función para confirmar y guardar un viaje nuevo desde el Modal
  const guardarNuevoViaje = async (datosViaje, ciudadInicial = null) => {
    if (!usuario) return null;

    // 1. Verificar Foto: Si el usuario no subió una, buscamos en API/Caché
    let fotoFinal = datosViaje.foto;
    let creditoFinal = null;

    if (!fotoFinal || !fotoFinal.startsWith('data:image')) {
       // Si es URL existente (no base64) o null, intentamos buscar si está vacío
       if (!fotoFinal) {
         const fotoInfo = await obtenerFotoConCache(datosViaje.nombreEspanol, datosViaje.code);
         if (fotoInfo) {
            fotoFinal = fotoInfo.url;
            creditoFinal = fotoInfo.credito;
         }
       }
    } else {
        // Si es base64, se subirá a Storage en el paso siguiente (simulamos URL temporal o manejamos subida despues)
        // Por simplicidad, en este MVP la subida real a Storage la delegamos o la hacemos aquí:
        // (Para este código, asumimos que si es base64, se guarda en el documento y luego update)
    }

    const nuevoViaje = {
      code: datosViaje.code,
      nombreEspanol: datosViaje.nombreEspanol,
      titulo: datosViaje.titulo || `Viaje a ${datosViaje.nombreEspanol}`,
      flag: datosViaje.flag,
      continente: datosViaje.continente,
      latlng: datosViaje.latlng,
      fecha: datosViaje.fechaInicio || new Date().toISOString().split('T')[0],
      fechaInicio: datosViaje.fechaInicio,
      fechaFin: datosViaje.fechaFin,
      texto: datosViaje.texto || "",
      rating: 5,
      foto: fotoFinal,
      fotoCredito: creditoFinal,
      ciudades: ciudadInicial ? ciudadInicial.nombre : ""
    };

    try {
      const docRef = await addDoc(collection(db, `usuarios/${usuario.uid}/viajes`), nuevoViaje);
      
      // Si el usuario subió foto propia (Base64), subirla ahora que tenemos ID
      if (datosViaje.foto && datosViaje.foto.startsWith('data:image')) {
         await actualizarDetallesViaje(docRef.id, { foto: datosViaje.foto });
      }

      // Si había una ciudad inicial seleccionada, agregarla como parada
      if (ciudadInicial) {
         await agregarParada(ciudadInicial, docRef.id);
      }

      return docRef.id;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const agregarParada = async (lugarInfo, viajeId) => {
    if (!usuario || !viajeId) return null;

    const fechaHoy = new Date().toISOString().split('T')[0];
    // Intentar obtener clima para la fecha del viaje si es pasada, sino hoy
    const fechaClima = lugarInfo.fecha || fechaHoy;
    const climaInfo = await obtenerClimaHistorico(lugarInfo.coordenadas[1], lugarInfo.coordenadas[0], fechaClima);

    const nuevaParada = {
      nombre: lugarInfo.nombre,
      tipo: 'place',
      coordenadas: lugarInfo.coordenadas,
      fecha: fechaClima,
      clima: climaInfo,
      relato: "",
    };

    try {
      await addDoc(collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`), nuevaParada);
      
      // Actualizar string resumen
      const viajeRef = doc(db, `usuarios/${usuario.uid}/viajes`, viajeId);
      const viajeDoc = await getDoc(viajeRef);
      if(viajeDoc.exists()) {
          const actual = viajeDoc.data().ciudades ? viajeDoc.data().ciudades.split(', ') : [];
          if (!actual.includes(lugarInfo.nombre)) {
             await updateDoc(viajeRef, { ciudades: [...actual, lugarInfo.nombre].join(', ') });
          }
      }
    } catch (e) { console.error(e) }
  };

  const subirFotoStorage = async (viajeId, fotoBase64) => {
    try {
      const storageRef = ref(storage, `usuarios/${usuario.uid}/viajes/${viajeId}/portada.jpg`);
      await uploadString(storageRef, fotoBase64, 'data_url');
      return await getDownloadURL(storageRef);
    } catch { return null; }
  };

  const actualizarDetallesViaje = async (id, data) => {
    if (!usuario) return;
    try {
      let fotoUrl = data.foto;
      if (data.foto && data.foto.startsWith('data:image')) {
        fotoUrl = await subirFotoStorage(id, data.foto);
      }
      const datosLimpios = { ...data, foto: fotoUrl };
      // Si subió foto manual, borramos crédito
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

  const eliminarParada = async (viajeId, paradaId) => {
      if(!usuario) return;
      try {
          await deleteDoc(doc(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`, paradaId));
      } catch (e) { console.error(e) }
  };

  return {
    paisesVisitados, bitacora, bitacoraData, todasLasParadas,
    listaPaises: MAPA_SELLOS,
    buscarPaisEnCatalogo, // Exportada para usar en App.jsx
    guardarNuevoViaje, // NUEVA función principal
    agregarParada, eliminarParada,
    actualizarDetallesViaje, eliminarViaje
  };
};