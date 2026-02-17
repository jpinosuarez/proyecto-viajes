import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as authModule from '../../../context/AuthContext';
import * as windowSizeModule from '../../../hooks/useWindowSize';
import * as galeriaHook from '../../../hooks/useGaleriaViaje';
import { ToastProvider } from '../../../context/ToastContext';

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
});
