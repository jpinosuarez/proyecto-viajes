import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

// Mock the hook used by the component
vi.mock('../../../hooks/useInvitations', () => ({
  default: () => ({
    invitations: [{ id: 'inv1', inviterId: 'userA', viajeId: 'viaje-1', status: 'pending' }],
    acceptInvitation: vi.fn().mockResolvedValue(true),
    declineInvitation: vi.fn().mockResolvedValue(true)
  })
}));

// Mock UIContext and ToastContext used by the component
vi.mock('../../../context/UIContext', () => ({
  useUI: () => ({ abrirVisor: vi.fn(), setVistaActiva: vi.fn() })
}));
vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ pushToast: vi.fn() })
}));

import InvitationsList from '../InvitationsList';
import useInvitations from '../../../hooks/useInvitations';

describe('InvitationsList', () => {
  it('muestra invitaciones y dispara aceptar/rechazar y abre el visor al aceptar', async () => {
    const hook = useInvitations();
    const ui = require('../../../context/UIContext').useUI();
    const toast = require('../../../context/ToastContext').useToast();

    render(<InvitationsList />);

    expect(screen.getByText('userA')).toBeInTheDocument();
    expect(screen.getByText('viaje-1')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Aceptar'));
    expect(hook.acceptInvitation).toHaveBeenCalledWith('inv1');
    expect(toast.pushToast).toHaveBeenCalledWith(expect.stringContaining('Invitación aceptada'), 'success');
    expect(ui.setVistaActiva).toHaveBeenCalledWith('bitacora');
    expect(ui.abrirVisor).toHaveBeenCalledWith('viaje-1');

    await userEvent.click(screen.getByText('Rechazar'));
    expect(hook.declineInvitation).toHaveBeenCalledWith('inv1');
    expect(toast.pushToast).toHaveBeenCalledWith(expect.stringContaining('Invitación rechazada'), 'warning');
  });
});
