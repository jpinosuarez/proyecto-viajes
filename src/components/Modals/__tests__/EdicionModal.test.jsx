// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as authModule from '../../../context/AuthContext';
import * as windowSizeModule from '../../../hooks/useWindowSize';
import * as galeriaHook from '../../../hooks/useGaleriaViaje';
import { ToastProvider } from '../../../context/ToastContext';

// Mocks para UploadContext y Firestore used in autocomplete
vi.mock('../../../context/UploadContext', () => ({ useUpload: () => ({ iniciarSubida: vi.fn(), getEstadoViaje: () => ({}) }) }));
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // asegurar que getFirestore existe para evitar errores en otros módulos
    getFirestore: actual.getFirestore || (app => ({})),
    // solo mockear getDocs para los tests de autocomplete; preservar el resto
    getDocs: vi.fn(async () => ({ docs: [] }))
  };
});

// Evitar que se ejecute la inicialización real de Firebase en tests
vi.mock('../../../firebase', () => ({ db: {}, storage: {} }));


// Mocks de componentes hijos para aislar el test
vi.mock('../../Shared/GalleryUploader', () => ({
  GalleryUploader: ({ files = [] }) => (
    <div data-testid="mock-gallery">files:{files.length}</div>
  )
}));

vi.mock('../../Shared/CityManager', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-city-manager" />
}));

// Mock hooks que EdicionModal consume
vi.spyOn(authModule, 'useAuth').mockImplementation(() => ({ usuario: { uid: 'u1' } }));
vi.spyOn(windowSizeModule, 'useWindowSize').mockImplementation(() => ({ isMobile: false }));

import EdicionModal from '../EdicionModal';

describe('EdicionModal (comportamiento básico)', () => {
  test('abre vacío para nuevo borrador (no persistir imágenes)', () => {
    // useGaleriaViaje debe devolver vacío cuando se pasa null (borrador)
    vi.spyOn(galeriaHook, 'useGaleriaViaje').mockReturnValue({ fotos: [], uploading: false, limpiar: vi.fn() });

    const viaje = { id: 'new', nombreEspanol: 'Chile', titulo: '', code: 'CL', flag: null };

    render(
      <ToastProvider>
        <EdicionModal viaje={viaje} onClose={vi.fn()} onSave={vi.fn()} esBorrador={true} ciudadInicial={null} />
      </ToastProvider>
    );

    const tituloInput = screen.getByPlaceholderText('Título del viaje');
    expect(tituloInput).toHaveValue('');

    // GalleryUploader mock debe recibir files vacío
    expect(screen.getByTestId('mock-gallery')).toHaveTextContent('files:0');

    // No debe mostrarse la galería del servidor (se renderiza solo para viajes guardados)
    expect(screen.queryByText('Portada')).not.toBeInTheDocument();
  });

  test('muestra galería del servidor para viaje guardado', () => {
    // Simular que la galería del viaje guardado tiene fotos
    vi.spyOn(galeriaHook, 'useGaleriaViaje').mockReturnValue({
      fotos: [ { id: 'f1', url: 'x.jpg', esPortada: true, caption: 'c' } ],
      uploading: false,
      limpiar: vi.fn(),
      eliminar: vi.fn(),
      cambiarPortada: vi.fn(),
      actualizarCaption: vi.fn()
    });

    const viaje = { id: 'v1', nombreEspanol: 'Perú', titulo: 'Viaje a Perú', code: 'PE', flag: null };

    render(
      <ToastProvider>
        <EdicionModal viaje={viaje} onClose={vi.fn()} onSave={vi.fn()} esBorrador={false} ciudadInicial={null} />
      </ToastProvider>
    );

    // Debería mostrarse el badge "Portada" proveniente de la galería del servidor
    expect(screen.getByText('Portada')).toBeInTheDocument();
  });

  test('agrega companion por freeform y lo muestra en la lista', async () => {
    vi.spyOn(galeriaHook, 'useGaleriaViaje').mockReturnValue({ fotos: [], uploading: false, limpiar: vi.fn() });
    const viaje = { id: 'new', nombreEspanol: 'Chile', titulo: '', code: 'CL', flag: null };

    render(
      <ToastProvider>
        <EdicionModal viaje={viaje} onClose={vi.fn()} onSave={vi.fn()} esBorrador={true} ciudadInicial={null} />
      </ToastProvider>
    );

    const input = screen.getByPlaceholderText('Nombre o email');
    await userEvent.type(input, 'Ana');
    await userEvent.click(screen.getByRole('button', { name: /Agregar/i }));

    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  test('autocomplete encuentra usuario y al agregar crea invitación si viaje guardado (debounced)', async () => {
    // Mock de useGaleriaViaje
    vi.spyOn(galeriaHook, 'useGaleriaViaje').mockReturnValue({ fotos: [], uploading: false, limpiar: vi.fn() });

    // Mock del módulo de firestore getDocs para devolver un usuario simulado
    const mockDocs = [{ id: 'u2', data: () => ({ displayName: 'Test User', email: 'test@example.com' }) }];
    const firestore = await import('firebase/firestore');
    firestore.getDocs.mockResolvedValue({ docs: mockDocs });

    // Espiar createInvitation para verificar llamado
    const invitations = await import('../../../services/invitationsService');
    vi.spyOn(invitations, 'createInvitation').mockResolvedValue('inv-1');

    const viaje = { id: 'v1', nombreEspanol: 'Perú', titulo: 'Viaje a Perú', code: 'PE', flag: null };

    render(
      <ToastProvider>
        <EdicionModal viaje={viaje} onClose={vi.fn()} onSave={vi.fn()} esBorrador={false} ciudadInicial={null} />
      </ToastProvider>
    );

    const input = screen.getByPlaceholderText('Nombre o email');

    // Usar timers falsos para verificar debounce
    vi.useFakeTimers();
    await userEvent.type(input, 'Test');
    // aun no debe haberse mostrado
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    // avanzar tiempo > debounce
    vi.advanceTimersByTime(300);
    // esperar a que los resultados aparezcan
    await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());

    // Click en agregar desde resultados
    await userEvent.click(screen.getAllByText('Agregar')[0]);

    // Debe mostrarse el companion en la lista
    expect(screen.getByText('Test User')).toBeInTheDocument();

    // Debe haberse llamado createInvitation (viaje guardado)
    expect(invitations.createInvitation).toHaveBeenCalled();
    vi.useRealTimers();
  });

  test('cuando no hay resultados y se escribe un email, mostrar "Invitar por email" y crear invitation', async () => {
    vi.spyOn(galeriaHook, 'useGaleriaViaje').mockReturnValue({ fotos: [], uploading: false, limpiar: vi.fn() });
    const firestore = await import('firebase/firestore');
    firestore.getDocs.mockResolvedValue({ docs: [] });

    const invitations = await import('../../../services/invitationsService');
    vi.spyOn(invitations, 'createInvitation').mockResolvedValue('inv-2');

    const viaje = { id: 'v2', nombreEspanol: 'Perú', titulo: 'Viaje a Perú', code: 'PE', flag: null };

    render(
      <ToastProvider>
        <EdicionModal viaje={viaje} onClose={vi.fn()} onSave={vi.fn()} esBorrador={false} ciudadInicial={null} />
      </ToastProvider>
    );

    const input = screen.getByPlaceholderText('Nombre o email');
    vi.useFakeTimers();
    await userEvent.type(input, 'noone@example.com');
    vi.advanceTimersByTime(300);

    await waitFor(() => expect(screen.getByText(/Invitar por email/i)).toBeInTheDocument());

    await userEvent.click(screen.getByText(/Invitar por email/i));

    expect(invitations.createInvitation).toHaveBeenCalledWith(expect.objectContaining({ inviteeEmail: 'noone@example.com' }));
    expect(screen.getByText('noone@example.com')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
