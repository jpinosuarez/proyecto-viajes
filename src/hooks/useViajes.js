import { useState, useEffect, useMemo } from 'react';
import { MAPA_SELLOS } from '../assets/sellos';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { 
  collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, getDoc, setDoc 
} from 'firebase/firestore';
import { 
  ref, uploadString, getDownloadURL, deleteObject 
} from 'firebase/storage';

// CLAVE API UNSPLASH (Access Key)
const UNSPLASH_ACCESS_KEY = 'IHckgwuhGnzg4MoJamPuB6rECV9MJsBb3rRE2ty3WJg';

export const useViajes = () => {
  const { usuario } = useAuth();
  const [bitacora, setBitacora] = useState([]);
  const [bitacoraData, setBitacoraData] = useState({});

  // 1. ESCUCHAR CAMBIOS EN TIEMPO REAL
  useEffect(() => {
    if (!usuario) {
      setBitacora([]);
      setBitacoraData({});
      return;
    }

    const viajesRef = collection(db, `usuarios/${usuario.uid}/viajes`);
    const q = query(viajesRef, orderBy("fechaInicio", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setBitacora(docs);

      const dataMap = docs.reduce((acc, viaje) => {
        acc[viaje.id] = { ...viaje };
        return acc;
      }, {});
      setBitacoraData(dataMap);
    });

    return () => unsubscribe();
  }, [usuario]);

  const paisesVisitados = useMemo(() => {
    return [...new Set(bitacora.map(v => v.code))];
  }, [bitacora]);

  // --- UTILIDADES ---
  
  // Función para matchear el resultado de Mapbox con nuestro catálogo de sellos
  const buscarPaisEnCatalogo = (nombreMapbox, codigoMapbox) => {
    const busqueda = nombreMapbox.toLowerCase();
    return MAPA_SELLOS.find(p => 
      p.code === codigoMapbox || // Coincidencia exacta por código (Ideal)
      p.name.toLowerCase() === busqueda || 
      p.nombreEspanol.toLowerCase() === busqueda
    );
  };

  // --- LÓGICA DE FOTOS (STORAGE & CACHÉ HÍBRIDO) ---

  const subirFotoStorage = async (viajeId, fotoBase64) => {
    if (!fotoBase64 || !fotoBase64.startsWith('data:image')) return fotoBase64;
    try {
      const storageRef = ref(storage, `usuarios/${usuario.uid}/viajes/${viajeId}/portada.jpg`);
      await uploadString(storageRef, fotoBase64, 'data_url');
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      return null;
    }
  };

  const obtenerFotoConCache = async (pais) => {
    try {
      const docRef = doc(db, 'paises_info', pais.code);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) return docSnap.data();

      const nombreBusqueda = pais.name || pais.nombreEspanol;
      const queryBusqueda = `${nombreBusqueda} famous landmark travel architecture`;
      
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(queryBusqueda)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );

      if (!response.ok) throw new Error('Error en Unsplash API');

      const data = await response.json();
      
      const rawUrl = data.urls.raw;
      const separador = rawUrl.includes('?') ? '&' : '?';
      const urlOptimizada = `${rawUrl}${separador}w=1920&q=80&auto=format&fit=crop`;

      const nuevaFotoInfo = {
        url: urlOptimizada,
        credito: {
          nombre: data.user.name,
          username: data.user.username,
          link: data.user.links.html
        }
      };

      await setDoc(docRef, nuevaFotoInfo);
      return nuevaFotoInfo;

    } catch (error) {
      console.warn("⚠️ Fallback: No se pudo obtener foto automática.", error);
      return null;
    }
  };

  // --- ACCIONES FIRESTORE ---

  // Agregar Viaje (Nivel País)
  const agregarViaje = async (pais) => {
    if (!usuario) return null;
    
    // Verificar si ya existe el viaje para no duplicarlo
    const viajeExistente = bitacora.find(v => v.code === pais.code);
    if (viajeExistente) return viajeExistente.id;

    const fechaISO = new Date().toISOString().split('T')[0];
    const fotoInfo = await obtenerFotoConCache(pais);

    const nuevoViaje = {
      code: pais.code,
      nombreEspanol: pais.nombreEspanol,
      flag: pais.flag,
      continente: pais.continente,
      latlng: pais.latlng,
      fecha: fechaISO,
      fechaInicio: fechaISO,
      fechaFin: fechaISO,
      texto: "",
      rating: 5,
      foto: fotoInfo?.url || null,
      fotoCredito: fotoInfo?.credito || null,
      ciudades: "", 
      monumentos: "",
      clima: "",
      gastronomia: "",
      companero: ""
    };

    try {
      const docRef = await addDoc(collection(db, `usuarios/${usuario.uid}/viajes`), nuevoViaje);
      return docRef.id;
    } catch (e) {
      console.error("Error al agregar viaje:", e);
      return null;
    }
  };

  // NUEVO: Agregar Parada (Nivel Ciudad/Lugar)
  const agregarParada = async (lugarInfo) => {
    if (!usuario) return null;

    // 1. Identificar el país padre
    const paisCatalogo = buscarPaisEnCatalogo(lugarInfo.paisNombre, lugarInfo.paisCodigo);
    
    if (!paisCatalogo) {
      alert("Lo siento, aún no soportamos registros en este país o territorio.");
      return null;
    }

    // 2. Asegurar que existe el "Contenedor del Viaje" (El País)
    // Si no existe, lo creamos automáticamente (Cascada Inversa)
    const viajeId = await agregarViaje(paisCatalogo);
    if (!viajeId) return null;

    // 3. Crear el documento de la parada en la sub-colección
    const nuevaParada = {
      nombre: lugarInfo.nombre,
      tipo: lugarInfo.tipo || 'place',
      coordenadas: lugarInfo.coordenadas, // [lng, lat]
      fecha: new Date().toISOString().split('T')[0],
      relato: "",
      foto: null // Pendiente: Implementar foto específica de ciudad
    };

    try {
      const paradasRef = collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`);
      await addDoc(paradasRef, nuevaParada);
      
      // Opcional: Actualizar el campo 'ciudades' del viaje padre como resumen texto
      const viajeRef = doc(db, `usuarios/${usuario.uid}/viajes`, viajeId);
      const viajeActual = bitacoraData[viajeId];
      const ciudadesPrevias = viajeActual?.ciudades ? viajeActual.ciudades.split(', ') : [];
      if (!ciudadesPrevias.includes(lugarInfo.nombre)) {
        const nuevasCiudades = [...ciudadesPrevias, lugarInfo.nombre].join(', ');
        await updateDoc(viajeRef, { ciudades: nuevasCiudades });
      }

      return viajeId; // Devolvemos el ID del viaje padre para abrir el visor/mapa
    } catch (e) {
      console.error("Error al agregar parada:", e);
      return null;
    }
  };

  const actualizarDetallesViaje = async (id, data) => {
    if (!usuario) return;
    try {
      let fotoUrl = data.foto;
      if (data.foto && data.foto.startsWith('data:image')) {
        fotoUrl = await subirFotoStorage(id, data.foto);
      }
      
      const datosLimpios = { ...data, foto: fotoUrl };
      if (data.foto && data.foto.startsWith('data:image')) {
         datosLimpios.fotoCredito = null; 
      }

      const viajeRef = doc(db, `usuarios/${usuario.uid}/viajes`, id);
      await updateDoc(viajeRef, datosLimpios);
    } catch (e) {
      console.error("Error actualizando viaje:", e);
    }
  };

  const eliminarViaje = async (id) => {
    if (!usuario) return;
    try {
      await deleteDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id));
      const fotoRef = ref(storage, `usuarios/${usuario.uid}/viajes/${id}/portada.jpg`);
      await deleteObject(fotoRef).catch(() => {}); 
    } catch (e) {
      console.error("Error eliminando:", e);
    }
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
    paisesVisitados, bitacora, bitacoraData,
    listaPaises: MAPA_SELLOS,
    agregarViaje, agregarParada, // Exportamos la nueva función
    actualizarDetallesViaje, eliminarViaje, manejarCambioPaises
  };
};