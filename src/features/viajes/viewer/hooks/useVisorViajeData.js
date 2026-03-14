import { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@shared/firebase';

export function useVisorViajeData({ viajeId, bitacoraData, bitacoraLista, usuario }) {
  const viajeBase = useMemo(
    () => bitacoraLista.find((v) => v.id === viajeId),
    [bitacoraLista, viajeId]
  );

  // Fallback data when we don't yet have the trip in the user's local bitácora.
  // This happens when the user navigates directly to a shared trip before the
  // shared-trip listener has populated the local state.
  const [fallbackData, setFallbackData] = useState(null);
  const [fallbackOwnerUid, setFallbackOwnerUid] = useState(null);
  const [fallbackAttempts, setFallbackAttempts] = useState(0);

  const hasViajeData = Boolean(
    viajeId && (bitacoraData[viajeId] || viajeBase || fallbackData)
  );

  const data = bitacoraData[viajeId] || viajeBase || fallbackData || {};
  const ownerUid = data.ownerId || fallbackOwnerUid || usuario?.uid || null;

  const [paradas, setParadas] = useState([]);
  const [ownerDisplayName, setOwnerDisplayName] = useState(null);
  const isSharedTrip = Boolean(data.ownerId && usuario && data.ownerId !== usuario.uid);

  // If the trip isn't part of the user's local bitacora yet, try to resolve it using
  // the accepted invitation record (this allows direct deep links to shared trips).
  useEffect(() => {
    if (!viajeId || !usuario?.uid) return;

    // If we already have it locally, clear any previous fallback state.
    if (bitacoraData[viajeId] || viajeBase) {
      setFallbackData(null);
      setFallbackOwnerUid(null);
      setFallbackAttempts(0);
      return;
    }

    const MAX_ATTEMPTS = 3;
    if (fallbackAttempts >= MAX_ATTEMPTS) return;

    let mounted = true;
    let timeoutId;

    const attemptFallbackLoad = async () => {
      try {
        const invitationsQ = query(
          collection(db, 'invitations'),
          where('inviteeUid', '==', usuario.uid),
          where('viajeId', '==', viajeId),
          where('status', '==', 'accepted')
        );
        const invSnap = await getDocs(invitationsQ);
        if (!mounted || invSnap.empty) return;

        const invDoc = invSnap.docs[0];
        if (!invDoc || !invDoc.exists()) return;

        const invData = invDoc.data();
        if (!invData || !invData.inviterId) return;

        const ownerId = invData.inviterId;
        const viajeSnap = await getDoc(doc(db, 'usuarios', ownerId, 'viajes', viajeId));
        if (!mounted || !viajeSnap.exists()) return;

        const viajeFromOwner = { id: viajeSnap.id, ownerId, ...viajeSnap.data() };
        setFallbackData(viajeFromOwner);
        setFallbackOwnerUid(ownerId);
      } catch (err) {
        // No bloquear el render del visor por fallas en esta fallback (puede ser
        // causado por reglas de seguridad o falta de invitación).
        console.warn('Error loading shared trip fallback data', err);
      } finally {
        if (mounted) setFallbackAttempts((prev) => prev + 1);
      }
    };

    attemptFallbackLoad();

    // Retry a few times in case the accepted invitation appears shortly after.
    if (fallbackAttempts + 1 < MAX_ATTEMPTS) {
      timeoutId = window.setTimeout(() => {
        if (mounted) setFallbackAttempts((prev) => prev + 1);
      }, 3000);
    }

    return () => {
      mounted = false;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [bitacoraData, viajeBase, viajeId, usuario?.uid, fallbackAttempts]);

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
