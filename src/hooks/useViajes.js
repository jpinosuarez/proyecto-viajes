import { useState, useEffect, useMemo } from 'react';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { getCountryISO3, getFlagUrl } from '../utils/countryUtils';

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

  const paisesVisitados = useMemo(() => {
    const codigos = new Set();
    bitacora.forEach(v => { if(v.code) codigos.add(getCountryISO3(v.code)); });
    todasLasParadas.forEach(p => { if(p.paisCodigo) codigos.add(getCountryISO3(p.paisCodigo)); });
    return [...codigos].filter(Boolean);
  }, [bitacora, todasLasParadas]);

  // --- HELPERS ---
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

  const subirFotoStorage = async (viajeId, fotoBase64) => {
    try {
      const storageRef = ref(storage, `usuarios/${usuario.uid}/viajes/${viajeId}/portada.jpg`);
      await uploadString(storageRef, fotoBase64, 'data_url');
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, viajeId), { foto: url, fotoCredito: null });
    } catch { }
  };

  // --- LOGICA RESUMEN (Multipaís + Fechas) ---
  const actualizarResumenViaje = async (viajeId) => {
    try {
      const paradasRef = collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`);
      const snapshot = await getDocs(paradasRef);
      const paradas = snapshot.docs.map(d => d.data());

      if (paradas.length === 0) return;

      const fechas = paradas.flatMap(p => [p.fechaLlegada, p.fechaSalida, p.fecha].filter(Boolean));
      let inicio, fin;
      if (fechas.length > 0) {
          const fechasTime = fechas.map(f => new Date(f).getTime());
          inicio = new Date(Math.min(...fechasTime)).toISOString().split('T')[0];
          fin = new Date(Math.max(...fechasTime)).toISOString().split('T')[0];
      }

      const codigosUnicos = [...new Set(paradas.map(p => p.paisCodigo).filter(Boolean))];
      const banderas = codigosUnicos.map(code => getFlagUrl(code));
      const ciudadesStr = [...new Set(paradas.map(p => p.nombre))].join(', ');

      const updateData = { ciudades: ciudadesStr, banderas: banderas };
      if (inicio) updateData.fechaInicio = inicio;
      if (fin) updateData.fechaFin = fin;

      await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, viajeId), updateData);
    } catch (e) { console.error(e); }
  };

  // --- GUARDAR NUEVO VIAJE ---
  const guardarNuevoViaje = async (datosViaje, ciudadInicial = null) => {
    if (!usuario) return null;

    let fotoFinal = datosViaje.foto;
    let creditoFinal = null;

    if (!fotoFinal || !fotoFinal.startsWith('data:image')) {
       if (!fotoFinal) {
         const fotoInfo = await obtenerFotoConCache(datosViaje.nombreEspanol, datosViaje.code);
         if (fotoInfo) { fotoFinal = fotoInfo.url; creditoFinal = fotoInfo.credito; }
       }
    }

    const nuevoViaje = {
      code: datosViaje.code,
      nombreEspanol: datosViaje.nombreEspanol,
      titulo: datosViaje.titulo || `Viaje a ${datosViaje.nombreEspanol}`,
      fechaInicio: datosViaje.fechaInicio || new Date().toISOString().split('T')[0],
      fechaFin: datosViaje.fechaFin || datosViaje.fechaInicio || new Date().toISOString().split('T')[0],
      texto: datosViaje.texto || "",
      rating: 5,
      foto: (fotoFinal && fotoFinal.startsWith('data:image')) ? null : fotoFinal,
      fotoCredito: creditoFinal,
      banderas: [getFlagUrl(datosViaje.code)], 
      ciudades: ""
    };

    try {
      const docRef = await addDoc(collection(db, `usuarios/${usuario.uid}/viajes`), nuevoViaje);
      
      if (fotoFinal && fotoFinal.startsWith('data:image')) {
         await subirFotoStorage(docRef.id, fotoFinal);
      }
      return docRef.id;
    } catch (e) { return null; }
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
      relato: "",
    };
    try {
      await addDoc(collection(db, `usuarios/${usuario.uid}/viajes/${viajeId}/paradas`), nuevaParada);
      await actualizarResumenViaje(viajeId);
    } catch (e) { console.error(e) }
  };

  const actualizarDetallesViaje = async (id, data) => {
      if(!usuario) return;
      try {
        if (data.foto && data.foto.startsWith('data:image')) {
            await subirFotoStorage(id, data.foto);
            delete data.foto;
        }
        await updateDoc(doc(db, `usuarios/${usuario.uid}/viajes`, id), data);
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