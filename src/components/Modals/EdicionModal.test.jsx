// @vitest-environment jsdom
import { describe, test, expect, vi } from 'vitest';

// Mocks para hooks usados dentro del componente
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ usuario: { uid: 'u1' } }) }));
vi.mock('../../context/ToastContext', () => ({ useToast: () => ({ pushToast: vi.fn() }) }));
vi.mock('../../hooks/useWindowSize', () => ({ useWindowSize: () => ({ isMobile: false }) }));
vi.mock('../../hooks/useGaleriaViaje', () => ({ useGaleriaViaje: () => ({ fotos: [], uploading: false, limpiar: vi.fn(), cambiarPortada: vi.fn(), eliminar: vi.fn(), actualizarCaption: vi.fn() }) }));
// Mock del módulo firebase para evitar referencias a `window` durante tests
vi.mock('../../firebase', () => ({ db: {}, storage: {} }));
// Mock simple para UploadContext (evita necesidad de provider en tests)
vi.mock('../../context/UploadContext', () => ({ useUpload: () => ({ iniciarSubida: vi.fn(), getEstadoViaje: () => ({}) }) }));
// Mock simple para UploadContext (evita necesidad de provider en tests)
vi.mock('../../context/UploadContext', () => ({ useUpload: () => ({ iniciarSubida: vi.fn(), getEstadoViaje: () => ({}) }) }));

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
