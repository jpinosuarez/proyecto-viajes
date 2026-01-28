import { useState, useEffect, useMemo } from 'react';
import { MAPA_SELLOS } from '../assets/sellos';
import { db, storage } from '../firebase'; // Importamos storage
import { useAuth } from '../context/AuthContext';
import { 
  collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy 
} from 'firebase/firestore';
import { 
  ref, uploadString, getDownloadURL, deleteObject 
} from 'firebase/storage';

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

      // Mapear data para compatibilidad con BentoGrid
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

  // --- FUNCIONES AUXILIARES DE STORAGE ---
  
  const subirFotoStorage = async (viajeId, fotoBase64) => {
    if (!fotoBase64 || !fotoBase64.startsWith('data:image')) return fotoBase64; // Si ya es URL o null, devolver tal cual
    
    try {
      // Crear referencia: usuarios/[uid]/viajes/[viajeId]/portada.jpg
      const storageRef = ref(storage, `usuarios/${usuario.uid}/viajes/${viajeId}/portada.jpg`);
      
      // Subir la cadena Base64
      await uploadString(storageRef, fotoBase64, 'data_url');
      
      // Obtener la URL pública
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      return null;
    }
  };

  // --- ACCIONES FIRESTORE ---

  const agregarViaje = async (pais) => {
    if (!usuario) return null;
    const fechaISO = new Date().toISOString().split('T')[0];
    
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
      foto: null,
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
      // 1. Verificar si hay una foto nueva para subir
      let fotoUrl = data.foto;
      if (data.foto && data.foto.startsWith('data:image')) {
        fotoUrl = await subirFotoStorage(id, data.foto);
      }

      // 2. Guardar en Firestore con la URL (no el Base64)
      const datosLimpios = { ...data, foto: fotoUrl };
      const viajeRef = doc(db, `usuarios/${usuario.uid}/viajes`, id);
      
      await updateDoc(viajeRef, datosLimpios);
    } catch (e) {
      console.error("Error actualizando viaje:", e);
    }
  };

  const eliminarViaje = async (id) => {
    if (!usuario) return;
    try {
      // 1. Eliminar documento
      await deleteDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id));
      
      // 2. Intentar eliminar foto asociada (limpieza)
      const fotoRef = ref(storage, `usuarios/${usuario.uid}/viajes/${id}/portada.jpg`);
      await deleteObject(fotoRef).catch(() => {}); // Ignoramos error si no existía foto
    } catch (e) {
      console.error("Error eliminando:", e);
    }
  };

  const manejarCambioPaises = (nuevosCodes) => {
    if (!usuario) return null;
    
    if (nuevosCodes.length > paisesVisitados.length) {
      const codeAdded = nuevosCodes.find(c => !paisesVisitados.includes(c));
      const paisInfo = MAPA_SELLOS.find(p => p.code === codeAdded);
      if (paisInfo) return agregarViaje(paisInfo);
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