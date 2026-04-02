import { describe, it, expect } from 'vitest';
import { ViajeSchemaBase, ParadaSchema, validarParada, validarViaje } from './viajeSchema';

describe('viajeSchema - nuevos campos de storytelling y sharing', () => {
  it('ViajeSchemaBase acepta campos: presupuesto, vibe, highlights, companions, sharedWith', () => {
    const sample = {
      code: 'AR',
      nombreEspanol: 'Argentina',
      titulo: 'Roadtrip por la Patagonia',
      fechaInicio: '2025-01-10',
      fechaFin: '2025-01-20',
      presupuesto: 'Mochilero',
      vibe: ['Aventura', 'Naturaleza'],
      highlights: { topFood: 'Asado', topView: 'Fitz Roy', topTip: 'Ir temprano' },
      companions: [{ name: 'María', email: 'maria@example.com', status: 'pending' }],
      sharedWith: ['uid-123'],
      fotoCredito: null
    };

    const parsed = ViajeSchemaBase.parse(sample);
    expect(parsed.presupuesto).toBe('Mochilero');
    expect(parsed.vibe).toEqual(['Aventura', 'Naturaleza']);
    expect(parsed.highlights.topView).toBe('Fitz Roy');
    expect(Array.isArray(parsed.companions)).toBe(true);
    expect(parsed.sharedWith).toEqual(['uid-123']);
  });

  it('ParadaSchema acepta transporte y notaCorta', () => {
    const p = {
      nombre: 'El Calafate',
      coordenadas: [-72.27, -50.33],
      fecha: '2025-01-12',
      transporte: 'auto',
      notaCorta: 'Noche increíble con estrellas'
    };

    const parsed = ParadaSchema.parse(p);
    expect(parsed.transporte).toBe('auto');
    expect(parsed.notaCorta).toBe('Noche increíble con estrellas');
  });

  it('validarParada reconoce parada válida con transporte', () => {
    const resultado = validarParada({
      nombre: 'Test',
      coordenadas: [0, 0],
      transporte: 'bus'
    });
    expect(resultado.esValido).toBe(true);
  });

  it('validarViaje acepta objeto minimal que incluye nuevos campos (no estricta)', () => {
    const datos = {
      code: 'AR',
      nombreEspanol: 'Argentina',
      titulo: 'Corto',
      fechaInicio: '2025-02-01',
      fechaFin: '2025-02-05',
      vibe: ['Relax']
    };

    const resultado = validarViaje(datos, false);
    expect(resultado.esValido).toBe(true);
  });
});