import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@app/providers/AuthContext';
import { auth } from '@shared/firebase';
import * as invitationsService from '../api/invitationsService';

export default function useInvitations() {
  const { usuario } = useAuth();
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    if (!usuario?.uid) return undefined;
    const unsub = invitationsService.listenToInvitationsForUser(usuario.uid, setInvitations);
    return () => unsub && unsub();
  }, [usuario?.uid]);

  const acceptInvitation = useCallback(async (invId) => {
    if (!usuario?.uid) throw new Error('Not authenticated');

    // Ensure a fresh auth token is available before the batched Firestore write.
    if (auth?.currentUser?.getIdToken) {
      await auth.currentUser.getIdToken(true);
    }

    const result = await invitationsService.acceptInvitation({ db: null, invitationId: invId, acceptorUid: usuario.uid });
    
    if (result) {
      // Margen breve para que listeners/reactividad consuman el ACK del batch
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    
    return result;
  }, [usuario]);

  const declineInvitation = useCallback(async (invId) => {
    if (!usuario?.uid) throw new Error('Not authenticated');
    return invitationsService.declineInvitation({ db: null, invitationId: invId, declinerUid: usuario.uid });
  }, [usuario]);

  return { invitations, acceptInvitation, declineInvitation };
}
