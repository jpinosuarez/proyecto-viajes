import React from 'react';
import { Bell } from 'lucide-react';
import useInvitations from '../../hooks/useInvitations';
import { styles as headerStyles } from '../Header/Header.styles';
import { useUI } from '../../context/UIContext';
import { useToast } from '../../context/ToastContext';

export default function InvitationsList({ compact = false }) {
  const { invitations, acceptInvitation, declineInvitation } = useInvitations();
  const { abrirVisor, setVistaActiva } = useUI();
  const { pushToast } = useToast();

  if (!invitations || invitations.length === 0) {
    return compact ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Bell size={16} />
      </div>
    ) : (
      <div className="inv-empty">No hay invitaciones pendientes.</div>
    );
  }

  return (
    <div className="invitations-list" style={{ minWidth: compact ? 0 : 340 }}>
      {invitations.map((inv) => (
        <div key={inv.id} className="inv-card" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: 8, borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 600 }}>{inv.inviterId || 'Un usuario'}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{inv.viajeId}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {inv.status === 'pending' ? (
              <>
                <button
                  onClick={async () => {
                    const ok = await acceptInvitation(inv.id);
                    if (ok) {
                      pushToast('Invitación aceptada — ahora puedes ver el viaje', 'success');
                      // cambiar a la vista de bitácora y abrir el visor para el viaje compartido
                      setVistaActiva('bitacora');
                      abrirVisor(inv.viajeId);
                    } else {
                      pushToast('No se pudo aceptar la invitación', 'error');
                    }
                  }}
                  style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}
                >Aceptar</button>

                <button onClick={async () => { const ok = await declineInvitation(inv.id); if (ok) pushToast('Invitación rechazada', 'warning'); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Rechazar</button>
              </>
            ) : (
              <div style={{ fontSize: 12, color: '#6b7280' }}>{inv.status}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
