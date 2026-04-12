import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { compressImage } from '@shared/lib/utils/imageUtils';
import { logger } from '@shared/lib/utils/logger';

const isImageDataUrl = (value) =>
  typeof value === 'string' && value.trim().startsWith('data:image/');

export const suscribirViajesConParadas = ({ db, userId, onData, onError }) => {
  const stopUnsubscribers = new Map();
  const stopsByTrip = new Map();
  let currentTrips = [];

  const viajesRef = collection(db, `usuarios/${userId}/viajes`);
  const q = query(viajesRef);

  const toMillis = (value) => {
    if (!value) return 0;
    if (typeof value?.toMillis === 'function') return value.toMillis();
    const millis = new Date(value).getTime();
    return Number.isFinite(millis) ? millis : 0;
  };

  const emitSnapshot = () => {
    onData({
      viajes: currentTrips,
      paradas: Array.from(stopsByTrip.values()).flat()
    });
  };

  const clearTripStopsListener = (tripId) => {
    const unsubscribeStops = stopUnsubscribers.get(tripId);
    if (unsubscribeStops) {
      unsubscribeStops();
      stopUnsubscribers.delete(tripId);
    }
    stopsByTrip.delete(tripId);
  };

  const subscribeTripStops = (tripId) => {
    if (stopUnsubscribers.has(tripId)) return;

    const paradasRef = collection(db, `usuarios/${userId}/viajes/${tripId}/paradas`);
    const unsubscribeStops = onSnapshot(
      paradasRef,
      (paradasSnap) => {
        const tripStops = paradasSnap.docs.map((parada) => ({
          id: parada.id,
          viajeId: tripId,
          ...parada.data({ serverTimestamps: 'estimate' })
        }));

        stopsByTrip.set(tripId, tripStops);
        emitSnapshot();
      },
      (error) => {
        clearTripStopsListener(tripId);
        onError?.(error);
        emitSnapshot();
      }
    );

    stopUnsubscribers.set(tripId, unsubscribeStops);
  };

  const unsubscribeTrips = onSnapshot(
    q,
    (snapshot) => {
      currentTrips = snapshot.docs
        .map((item) => {
          const data = item.data({ serverTimestamps: 'estimate' });
          return {
            id: item.id,
            ...data,
            createdAt:
              data.createdAt ??
              (item.metadata.hasPendingWrites ? new Date() : null),
          };
        })
        .sort((a, b) => {
          const createdAtDiff = toMillis(b.createdAt) - toMillis(a.createdAt);
          if (createdAtDiff !== 0) return createdAtDiff;
          return toMillis(b.fechaInicio) - toMillis(a.fechaInicio);
        });

      const activeTripIds = new Set(currentTrips.map((viaje) => viaje.id));

      currentTrips.forEach((viaje) => {
        subscribeTripStops(viaje.id);
      });

      for (const tripId of stopUnsubscribers.keys()) {
        if (!activeTripIds.has(tripId)) {
          clearTripStopsListener(tripId);
        }
      }

      emitSnapshot();
    },
    (error) => onError?.(error)
  );

  return () => {
    unsubscribeTrips();
    for (const unsubscribeStops of stopUnsubscribers.values()) {
      unsubscribeStops();
    }
    stopUnsubscribers.clear();
    stopsByTrip.clear();
    currentTrips = [];
  };
};

export const guardarViajeConParadas = async ({ db, userId, viaje, paradas = [] }) => {
  const batch = writeBatch(db);
  const viajeRef = doc(collection(db, `usuarios/${userId}/viajes`));
  batch.set(viajeRef, viaje);

  paradas.forEach((parada) => {
    const paradaRef = doc(collection(db, `usuarios/${userId}/viajes/${viajeRef.id}/paradas`));
    batch.set(paradaRef, parada);
  });

  try {
    await batch.commit();
  } catch (err) {
    logger.error('guardarViajeConParadas commit failed', {
      userId,
      viajeId: viajeRef.id,
      error: err?.message,
      code: err?.code,
    });
    throw err;
  }

  return viajeRef.id;
};

export const actualizarViaje = ({ db, userId, viajeId, data }) =>
  updateDoc(doc(db, `usuarios/${userId}/viajes`, viajeId), data);

export const crearParada = ({ db, userId, viajeId, data }) =>
  addDoc(collection(db, `usuarios/${userId}/viajes/${viajeId}/paradas`), data);

export const actualizarParada = ({ db, userId, viajeId, paradaId, data }) =>
  updateDoc(doc(db, `usuarios/${userId}/viajes/${viajeId}/paradas`, paradaId), data);

export const eliminarParada = ({ db, userId, viajeId, paradaId }) =>
  deleteDoc(doc(db, `usuarios/${userId}/viajes/${viajeId}/paradas`, paradaId));

const sanitizeStopPayload = (stop = {}) => {
  const {
    id: _id,
    viajeId: _viajeId,
    tripId: _tripId,
    ownerId: _ownerId,
    ...payload
  } = stop;

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  payload.tipo = payload.tipo || 'place';
  return payload;
};

const areValuesEqual = (a, b) => {
  if (Array.isArray(a) || Array.isArray(b)) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  return a === b;
};

const hasStopChanges = (nextPayload, currentPayload = {}) => {
  const keys = new Set([...Object.keys(nextPayload), ...Object.keys(currentPayload)]);
  for (const key of keys) {
    if (!areValuesEqual(nextPayload[key], currentPayload[key])) {
      return true;
    }
  }
  return false;
};

export const applyStopsBatchMutations = async ({ db, userId, tripId, draftStops = [], existingStops = [] }) => {
  const batch = writeBatch(db);
  const stopsRef = collection(db, `usuarios/${userId}/viajes/${tripId}/paradas`);
  let hasChanges = false;

  // Use Firestore as canonical source to avoid silent data loss when existingStops is malformed.
  const existingSnapshot = await getDocs(stopsRef);
  const currentStopMap = new Map(
    existingSnapshot.docs.map((docSnap) => [docSnap.id, { id: docSnap.id, ...docSnap.data() }])
  );

  // Keep caller-provided data as fallback only when not present in Firestore snapshot.
  if (Array.isArray(existingStops)) {
    existingStops
      .filter((stop) => stop?.id)
      .forEach((stop) => {
        if (!currentStopMap.has(stop.id)) {
          currentStopMap.set(stop.id, stop);
        }
      });
  }

  const incomingPersistedIds = new Set();
  const stopsToCreate = [];
  const stopsToUpdate = [];

  for (const draftStop of draftStops) {
    const rawStopId = draftStop?.id;
    const isNewStop = !rawStopId || String(rawStopId).startsWith('temp-');
    const sanitizedPayload = sanitizeStopPayload(draftStop);

    if (isNewStop) {
      stopsToCreate.push(sanitizedPayload);
      continue;
    }

    incomingPersistedIds.add(rawStopId);
    const currentStop = currentStopMap.get(rawStopId);

    if (!currentStop) {
      // Unknown persisted id: prefer set/merge over dropping data.
      stopsToUpdate.push({ id: rawStopId, payload: sanitizedPayload, useSetMerge: true });
      continue;
    }

    const currentPayload = sanitizeStopPayload(currentStop);
    if (hasStopChanges(sanitizedPayload, currentPayload)) {
      stopsToUpdate.push({ id: rawStopId, payload: sanitizedPayload, useSetMerge: false });
    }
  }

  const stopsToDelete = [];
  for (const [currentStopId] of currentStopMap.entries()) {
    if (!incomingPersistedIds.has(currentStopId)) {
      stopsToDelete.push(currentStopId);
    }
  }

  for (const newStopPayload of stopsToCreate) {
    batch.set(doc(stopsRef), newStopPayload);
    hasChanges = true;
  }

  for (const stopToUpdate of stopsToUpdate) {
    const stopRef = doc(stopsRef, stopToUpdate.id);
    if (stopToUpdate.useSetMerge) {
      batch.set(stopRef, stopToUpdate.payload, { merge: true });
    } else {
      batch.update(stopRef, stopToUpdate.payload);
    }
    hasChanges = true;
  }

  for (const stopIdToDelete of stopsToDelete) {
    batch.delete(doc(stopsRef, stopIdToDelete));
    hasChanges = true;
  }

  if (hasChanges) {
    await batch.commit();
  }

  return {
    hasChanges,
    created: stopsToCreate.length,
    updated: stopsToUpdate.length,
    deleted: stopsToDelete.length,
  };
};

export const eliminarViaje = async ({ db, userId, viajeId }) => {
  // Firestore deleteDoc resolves even if the document doesn't exist.
  // We check after deletion to ensure the document is gone.
  const primaryRef = doc(db, `usuarios/${userId}/viajes`, viajeId);

  try {
    await deleteDoc(primaryRef);
    const after = await getDoc(primaryRef);
    if (after.exists()) {
      throw new Error('Deletion did not remove the document');
    }
    return true;
  } catch (primaryError) {
    // Attempt legacy deletion path (e.g. older tests) to avoid silent failures.
    try {
      const legacyRef = doc(db, `viajes`, viajeId);
      await deleteDoc(legacyRef);
      const afterLegacy = await getDoc(legacyRef);
      if (afterLegacy.exists()) {
        throw new Error('Legacy deletion did not remove the document');
      }
      return true;
    } catch {
      // Prefer returning the original error for better logging.
      throw primaryError;
    }
  }
};

export const subirFotoViaje = async ({ storage, userId, viajeId, foto }) => {
  try {
    const storageRef = ref(storage, `usuarios/${userId}/viajes/${viajeId}/portada.jpg`);

    if (foto instanceof Blob) {
      let blobToUpload = foto;

      try {
        const compressed = await compressImage(foto, 1920, 0.8);
        blobToUpload = compressed.blob;
      } catch (err) {
        // If compression fails for any reason, fall back to the original blob.
        // We log to help understand frequency without breaking uploads.
        logger.warn('Image compression failed, falling back to original blob', {
          error: err?.message,
          code: err?.code,
        });
      }

      await uploadBytes(storageRef, blobToUpload, { contentType: blobToUpload.type || 'image/jpeg' });
      return await getDownloadURL(storageRef);
    }

    if (isImageDataUrl(foto)) {
      await uploadString(storageRef, foto.trim(), 'data_url');
      return await getDownloadURL(storageRef);
    }

    return null;
  } catch (error) {
    logger.error('Upload to Firebase Storage failed', {
      userId,
      viajeId,
      code: error?.code,
      message: error?.message,
    });
    throw error;
  }
};
