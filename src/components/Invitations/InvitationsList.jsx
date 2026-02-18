import React from 'react';
import { Bell } from 'lucide-react';
import useInvitations from '../../hooks/useInvitations';
import { styles as headerStyles } from '../Header/Header.styles';

export default function InvitationsList({ compact = false }) {
  const { invitations, acceptInvitation, declineInvitation } = useInvitations();

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
                <button onClick={() => acceptInvitation(inv.id)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Aceptar</button>
                <button onClick={() => declineInvitation(inv.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Rechazar</button>
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
