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

  // --- LÓGICA DE FOTOS (STORAGE & CACHÉ HÍBRIDO) ---

  const subirFotoStorage = async (viajeId, fotoBase64) => {
    // Si no es base64 (es null o una URL ya existente), devolvemos tal cual
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
      // A. ESTRATEGIA DE CACHÉ: Verificar si ya tenemos foto para este país en Firestore
      const docRef = doc(db, 'paises_info', pais.code);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(`⚡ Usando caché global para ${pais.nombreEspanol}`);
        return docSnap.data();
      }

      // B. FALLBACK: Si no existe, llamar a Unsplash API
      console.log(`🌍 Buscando en Unsplash para ${pais.nombreEspanol}...`);
      // Usamos palabras clave para asegurar calidad temática (travel, landmark, architecture)
      const nombreBusqueda = pais.name || pais.nombreEspanol;
      const queryBusqueda = `${nombreBusqueda} famous landmark travel architecture`;
      
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(queryBusqueda)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );

      if (!response.ok) throw new Error('Error en Unsplash API');

      const data = await response.json();
      
      // OPTIMIZACIÓN DE IMAGEN (Quality & Size Control)
      // Usamos la URL 'raw' y le inyectamos parámetros de procesamiento para asegurar nitidez.
      // w=1920: Ancho Full HD para que se vea nítida en el Visor.
      // q=80: Compresión inteligente.
      // auto=format: Usa WebP/AVIF si es posible (carga más rápida).
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

      // C. ACTUALIZAR CACHÉ: Guardamos la foto optimizada para todos
      await setDoc(docRef, nuevaFotoInfo);
      
      return nuevaFotoInfo;

    } catch (error) {
      console.warn("⚠️ Fallback: No se pudo obtener foto automática.", error);
      return null;
    }
  };

  // --- ACCIONES FIRESTORE ---

  const agregarViaje = async (pais) => {
    if (!usuario) return null;
    const fechaISO = new Date().toISOString().split('T')[0];
    
    // Obtenemos la foto (del caché o de la API)
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
      foto: fotoInfo?.url || null, // Guardamos la URL optimizada
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

  const actualizarDetallesViaje = async (id, data) => {
    if (!usuario) return;
    try {
      let fotoUrl = data.foto;
      
      // Prioridad 1: Si el usuario sube una foto nueva (Base64), la procesamos
      if (data.foto && data.foto.startsWith('data:image')) {
        fotoUrl = await subirFotoStorage(id, data.foto);
      }
      
      const datosLimpios = { ...data, foto: fotoUrl };
      
      // Si el usuario subió foto propia, limpiamos el crédito de Unsplash para evitar confusión
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
      // Intentar borrar de Storage por si era una foto propia
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
    agregarViaje, actualizarDetallesViaje, eliminarViaje, manejarCambioPaises
  };
};