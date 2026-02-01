import { useState, useEffect, useMemo } from 'react';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { getCountryISO3, getFlagEmoji } from '../utils/countryUtils';

const UNSPLASH_ACCESS_KEY = 'IHckgwuhGnzg4MoJamPuB6rECV9MJsBb3rRE2ty3WJg';

export const useViajes = () => {
  const { usuario } = useAuth();
  const [bitacora, setBitacora] = useState([]);
  const [todasLasParadas, setTodasLasParadas] = useState([]);

  useEffect(() => {
    if (!usuario) { setBitacora([]); setTodasLasParadas([]); return; }

    const viajesRef = collection(db, `usuarios/${usuario.uid}/viajes`);
    const q = query(viajesRef, orderBy("fechaInicio", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBitacora(docs);

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

  // CORRECCIÓN: Generar códigos ISO-3 para el mapa
  const paisesVisitados = useMemo(() => {
    const codigos = new Set();
    // 1. Del código principal del viaje (si existe)
    bitacora.forEach(v => { if(v.code) codigos.add(getCountryISO3(v.code)); });
    // 2. De las paradas individuales (para multi-país)
    todasLasParadas.forEach(p => { if(p.paisCodigo) codigos.add(getCountryISO3(p.paisCodigo)); });
    
    return [...codigos].filter(Boolean);
  }, [bitacora, todasLasParadas]);

  // --- LÓGICA DE ACTUALIZACIÓN DEL PADRE ---
  const actualizarResumenViaje = async (viajeId) => {
    try {
      const paradasRef = collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`);
      const snapshot = await getDocs(paradasRef);
      const paradas = snapshot.docs.map(d => d.data());

      if (paradas.length === 0) return;

      // 1. Fechas Min/Max
      const fechas = paradas.flatMap(p => [p.fechaLlegada, p.fechaSalida, p.fecha].filter(Boolean));
      const fechasTime = fechas.map(f => new Date(f).getTime());
      const inicio = new Date(Math.min(...fechasTime)).toISOString().split('T')[0];
      const fin = new Date(Math.max(...fechasTime)).toISOString().split('T')[0];

      // 2. Banderas Unicas (Desde paisCodigo)
      const codigosUnicos = [...new Set(paradas.map(p => p.paisCodigo).filter(Boolean))];
      const banderas = codigosUnicos.map(code => getFlagEmoji(code));

      // 3. Ciudades
      const ciudadesStr = [...new Set(paradas.map(p => p.nombre))].join(', ');

      await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, viajeId), {
        ciudades: ciudadesStr,
        fechaInicio: inicio,
        fechaFin: fin,
        banderas: banderas // Guardamos array de emojis
      });
    } catch (e) { console.error(e); }
  };

  // --- CREAR VIAJE ---
  const guardarNuevoViaje = async (datosViaje, paradas = []) => {
    if (!usuario) return null;

    let fotoFinal = datosViaje.foto;
    let creditoFinal = null;

    if (!fotoFinal || !fotoFinal.startsWith('data:image')) {
       // Buscar foto si no hay
       const fotoInfo = await obtenerFotoConCache(datosViaje.nombreEspanol, datosViaje.code);
       if (fotoInfo) { fotoFinal = fotoInfo.url; creditoFinal = fotoInfo.credito; }
    }

    const nuevoViaje = {
      code: datosViaje.code, // Código base (entry point)
      nombreEspanol: datosViaje.nombreEspanol,
      titulo: datosViaje.titulo || `Viaje a ${datosViaje.nombreEspanol}`,
      fechaInicio: datosViaje.fechaInicio,
      fechaFin: datosViaje.fechaFin,
      texto: datosViaje.texto || "",
      foto: fotoFinal,
      fotoCredito: creditoFinal,
      // Banderas iniciales se calculan después al agregar paradas, o aquí si es simple
      banderas: [] 
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
    
    // Guardamos código de país (Alpha-2) en la parada para luego generar banderas
    const nuevaParada = {
      nombre: lugarInfo.nombre,
      coordenadas: lugarInfo.coordenadas,
      fecha: lugarInfo.fecha || new Date().toISOString().split('T')[0],
      fechaLlegada: lugarInfo.fechaLlegada || "",
      fechaSalida: lugarInfo.fechaSalida || "",
      paisCodigo: lugarInfo.paisCodigo || "", // Vital para banderas
      relato: "",
    };

    try {
      await addDoc(collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`), nuevaParada);
      await actualizarResumenViaje(viajeId);
    } catch (e) { console.error(e) }
  };

  const obtenerFotoConCache = async (paisNombre, paisCode) => {
      // ... (Misma lógica de antes)
      return null; // Simplificado aquí, usar implementación previa
  };
  
  const subirFotoStorage = async (viajeId, fotoBase64) => { /* ... */ };
  const actualizarDetallesViaje = async (id, data) => { 
      // ... 
      await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id), data);
  };
  const eliminarViaje = async (id) => { /* ... */ };
  const eliminarParada = async (viajeId, paradaId) => {
      await deleteDoc(doc(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`, paradaId));
      await actualizarResumenViaje(viajeId);
  };

  return {
    paisesVisitados, bitacora, bitacoraData: {}, todasLasParadas,
    guardarNuevoViaje, agregarParada, eliminarParada,
    actualizarDetallesViaje, eliminarViaje
  };
};