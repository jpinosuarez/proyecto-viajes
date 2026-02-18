import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';

/**
 * Servicio mínimo para manejar invitations (creación y aceptación).
 * - createInvitation: crea un documento en `invitations/`
 * - acceptInvitation: marca accepted y agrega uid a `usuarios/{inviterId}/viajes/{viajeId}.sharedWith`
 * - getInvitationsForEmail: consulta invitaciones por email
 */

export const createInvitation = async ({ db, inviterId, inviteeEmail = null, inviteeUid = null, viajeId }) => {
  const invitationsRef = collection(db, 'invitations');
  const payload = {
    inviterId: inviterId || null,
    inviteeEmail: inviteeEmail || null,
    inviteeUid: inviteeUid || null,
    viajeId: viajeId || null,
    status: 'pending',
    createdAt: new Date()
  };
  const docRef = await addDoc(invitationsRef, payload);
  return docRef.id;
};

export const acceptInvitation = async ({ db, invitationId, acceptorUid, inviterId, viajeId }) => {
  try {
    // Marcar invitación como accepted
    const invitationRef = doc(db, 'invitations', invitationId);
    await updateDoc(invitationRef, { status: 'accepted', acceptedAt: new Date(), acceptedBy: acceptorUid });

    // Agregar al sharedWith del viaje (siempre que conozcamos inviterId y viajeId)
    if (inviterId && viajeId) {
      const viajeRef = doc(db, 'usuarios', inviterId, 'viajes', viajeId);
      await updateDoc(viajeRef, { sharedWith: arrayUnion(acceptorUid) });
    }

    return true;
  } catch (err) {
    console.error('acceptInvitation error', err);
    return false;
  }
};

export const getInvitationsForEmail = async ({ db, email }) => {
  const q = query(collection(db, 'invitations'), where('inviteeEmail', '==', email));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
