// @vitest-environment jsdom
import { describe, test, expect, vi, afterEach } from 'vitest';

// Stable usuario reference to prevent useEffect infinite loops caused by new
// object references on each render when the mock returns a plain object literal.
const { mockUsuario } = vi.hoisted(() => ({ mockUsuario: { uid: 'u1' } }));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ usuario: mockUsuario }) }));
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
// Mock framer-motion para evitar animaciones infinitas en jsdom
vi.mock('framer-motion', () => {
  const React = require('react');
  const motion = new Proxy({}, {
    get: (_, tag) => ({ children, ...props }) => React.createElement(tag, props, children)
  });
  return { motion, AnimatePresence: ({ children }) => children };
});

import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EdicionModal from './EdicionModal';

afterEach(cleanup);

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
      expect(input.value).toBe('Escapada a Barcelona');
    });

    // La galería del servidor no debe mostrarse para borradores
    expect(screen.queryByText(/^Portada$/)).toBeNull();
  });

  test('cambiar a Manual al tipear en el título', async () => {
    const viaje = { id: 'new', nombreEspanol: 'Chile', titulo: '', fechaInicio: '2024-01-01', fechaFin: '2024-01-02' };
    render(<EdicionModal viaje={viaje} esBorrador={true} {...defaultProps} />);

    const input = await screen.findByPlaceholderText(/Título del viaje/i);
    // al inicio debe estar en Auto (badge)
    const badge = screen.getByRole('button', { name: /^Auto$/ });
    expect(badge.textContent).toBe('Auto');

    await userEvent.type(input, 'Mi título manual');

    // Badge debe indicar Manual después de editar manualmente
    await waitFor(() => {
      const badgeManual = screen.getByRole('button', { name: /^Manual$/ });
      expect(badgeManual.textContent).toBe('Manual');
    });
  });
});

// Tests de companion autocomplete e invitaciones se cubren vía E2E (e2e/invitations.spec.ts)
// ya que requieren integración profunda con firebase/firestore que no es viable mockear unitariamente.
