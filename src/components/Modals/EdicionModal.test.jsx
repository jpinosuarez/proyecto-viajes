// @vitest-environment jsdom
import { describe, test, expect, vi } from 'vitest';

vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ usuario: { uid: 'u1' } }) }));
vi.mock('../../context/ToastContext', () => ({ useToast: () => ({ pushToast: vi.fn() }) }));
vi.mock('../../hooks/useWindowSize', () => ({ useWindowSize: () => ({ isMobile: false }) }));
vi.mock('../../hooks/useGaleriaViaje', () => ({ useGaleriaViaje: () => ({ fotos: [], uploading: false, limpiar: vi.fn(), cambiarPortada: vi.fn(), eliminar: vi.fn(), actualizarCaption: vi.fn() }) }));
vi.mock('../../firebase', () => ({ db: {}, storage: {} }));
vi.mock('../../context/UploadContext', () => ({ useUpload: () => ({ iniciarSubida: vi.fn(), getEstadoViaje: () => ({}) }) }));
vi.mock('../../services/invitationsService', () => ({ createInvitation: vi.fn() }));
// Mock ligero de firebase/firestore — EdicionModal solo usa collection + getDocs
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(async () => ({ docs: [] })),
  query: vi.fn(),
  where: vi.fn(),
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EdicionModal from './EdicionModal';

describe('EdicionModal (borrador)', () => {
  const defaultProps = {
    onClose: vi.fn(),
    onSave: vi.fn(async () => 'newId'),
    isSaving: false
  };

  test('genera título automático para borrador con ciudad inicial y no muestra galería del servidor', async () => {
    const viaje = {
      id: 'new',
      nombreEspanol: 'España',
      titulo: '',
      fechaInicio: '2024-01-01',
      fechaFin: '2024-01-02',
      foto: null,
      flag: null
    };

    const ciudadInicial = { nombre: 'Barcelona', coordenadas: [2.17, 41.38], paisCodigo: 'ESP' };

    render(<EdicionModal viaje={viaje} esBorrador={true} ciudadInicial={ciudadInicial} {...defaultProps} />);

    // Esperar que el input del título tenga el título generado
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Título del viaje/i);
      expect(input).toHaveValue('Escapada a Barcelona');
    });

    // La galería del servidor no debe mostrarse para borradores
    expect(screen.queryByText(/Portada/)).not.toBeInTheDocument();
  });

  test('cambiar a Manual al tipear en el título', async () => {
    const viaje = { id: 'new', nombreEspanol: 'Chile', titulo: '', fechaInicio: '2024-01-01', fechaFin: '2024-01-02' };
    render(<EdicionModal viaje={viaje} esBorrador={true} {...defaultProps} />);

    const input = await screen.findByPlaceholderText(/Título del viaje/i);
    // al inicio debe estar en Auto (badge)
    expect(screen.getByRole('button', { name: /Auto|Manual/ })).toHaveTextContent('Auto');

    await userEvent.type(input, 'Mi título manual');

    // Badge debe indicar Manual
    expect(screen.getByRole('button', { name: /Usando título manual/i })).toHaveTextContent('Manual');
  });
});

// Tests de companion autocomplete e invitaciones se cubren vía E2E (e2e/invitations.spec.ts)
// ya que requieren integración profunda con firebase/firestore que no es viable mockear unitariamente.
