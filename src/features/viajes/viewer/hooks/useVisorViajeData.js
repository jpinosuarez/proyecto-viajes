import { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@shared/firebase';

export function useVisorViajeData({ viajeId, bitacoraData, bitacoraLista, usuario }) {
  const viajeBase = useMemo(
    () => bitacoraLista.find((v) => v.id === viajeId),
    [bitacoraLista, viajeId]
  );

  const hasViajeData = Boolean(viajeId && (bitacoraData[viajeId] || viajeBase));
  const data = bitacoraData[viajeId] || viajeBase || {};
  const ownerUid = data.ownerId || usuario?.uid || null;

  const [paradas, setParadas] = useState([]);
  const [ownerDisplayName, setOwnerDisplayName] = useState(null);
  const isSharedTrip = Boolean(data.ownerId && usuario && data.ownerId !== usuario.uid);

  useEffect(() => {
    if (!isSharedTrip) return;

    let mounted = true;

    (async () => {
      try {
        const perfilSnap = await getDoc(doc(db, 'usuarios', data.ownerId));
        if (!mounted) return;
        if (!perfilSnap.exists()) return;
        setOwnerDisplayName(perfilSnap.data().displayName || data.ownerId);
      } catch (err) {
        // No bloquear el render del visor por fallas de perfil.
        console.warn('Failed to load owner profile for shared trip', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isSharedTrip, data.ownerId]);

  const reloadParadas = useCallback(async () => {
    if (!viajeId || !ownerUid) return;
    try {
      const ref = collection(db, `usuarios/${ownerUid}/viajes/${viajeId}/paradas`);
      const snap = await getDocs(ref);
      const loaded = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setParadas(loaded.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
    } catch (err) {
      console.warn('Error reloading paradas:', err);
    }
  }, [viajeId, ownerUid]);

  useEffect(() => {
    if (!viajeId || !ownerUid) return;

    let mounted = true;

    const fetchParadas = async () => {
      try {
        const ref = collection(db, `usuarios/${ownerUid}/viajes/${viajeId}/paradas`);
        const snap = await getDocs(ref);
        if (!mounted) return;
        const loaded = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setParadas(loaded.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
      } catch (err) {
        if (!mounted) return;
        console.warn('Error loading paradas:', err);
      }
    };

    fetchParadas();

    return () => {
      mounted = false;
    };
  }, [viajeId, ownerUid]);

  return {
    viajeBase,
    hasViajeData,
    data,
    ownerUid,
    paradas,
    isSharedTrip,
    ownerDisplayName,
    reloadParadas,
  };
}
