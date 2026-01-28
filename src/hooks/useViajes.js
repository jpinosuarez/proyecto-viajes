import { useState, useEffect, useMemo } from 'react';
import { MAPA_SELLOS } from '../assets/sellos';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { 
  collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy 
} from 'firebase/firestore';

export const useViajes = () => {
  const { usuario } = useAuth();
  const [bitacora, setBitacora] = useState([]);
  const [bitacoraData, setBitacoraData] = useState({});

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

    const docRef = await addDoc(collection(db, `usuarios/${usuario.uid}/viajes`), nuevoViaje);
    return docRef.id;
  };

  const actualizarDetallesViaje = async (id, data) => {
    if (!usuario) return;
    const viajeRef = doc(db, `usuarios/${usuario.uid}/viajes`, id);
    await updateDoc(viajeRef, data);
  };

  const eliminarViaje = async (id) => {
    if (!usuario) return;
    await deleteDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id));
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