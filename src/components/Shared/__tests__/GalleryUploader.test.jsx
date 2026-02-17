import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '../../../context/ToastContext';
import { GalleryUploader } from '../GalleryUploader';

// Mock FileReader para que onload ocurra sincrónicamente en tests
class MockFileReader {
  constructor() {
    this.onload = null;
  }
  readAsDataURL(file) {
    if (this.onload) this.onload({ target: { result: `data:${file.name}` } });
  }
}

beforeAll(() => {
  // @ts-ignore
  global.FileReader = MockFileReader;
});

describe('GalleryUploader', () => {
  test('llama onChange al seleccionar archivos y muestra el nombre', async () => {
    const handleChange = vi.fn();
    render(
      <ToastProvider>
        <GalleryUploader files={[]} onChange={handleChange} maxFiles={5} />
      </ToastProvider>
    );

    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();

    const file = new File(['content'], 'photo.png', { type: 'image/png' });

    // Simular selección de archivo
    fireEvent.change(input, { target: { files: [file] } });

    // onChange debe haber sido llamado con el archivo
    await waitFor(() => expect(handleChange).toHaveBeenCalled());
    const calledWith = handleChange.mock.calls[0][0];
    expect(Array.isArray(calledWith)).toBe(true);
    expect(calledWith[0].name).toBe('photo.png');

    // Verificar que el nombre del archivo aparece en la UI (preview card)
    await waitFor(() => expect(screen.getByText('photo.png')).toBeInTheDocument());
  });

  test('elimina archivo y ajusta onChange', async () => {
    const handleChange = vi.fn();
    const file = new File(['x'], 'a.jpg', { type: 'image/jpeg' });

    const { getByLabelText } = render(
      <ToastProvider>
        <GalleryUploader files={[file]} onChange={handleChange} maxFiles={5} />
      </ToastProvider>
    );

    // El nombre del archivo debe mostrarse
    expect(screen.getByText('a.jpg')).toBeInTheDocument();

    // Botón eliminar tiene aria-label="Eliminar"
    const btn = getByLabelText('Eliminar');
    await userEvent.click(btn);

    expect(handleChange).toHaveBeenCalledWith([]);
  });
});
