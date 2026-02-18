import { describe, it, expect } from 'vitest';
import {
  FOTO_DEFAULT_URL,
  generarTituloInteligente,
  construirBanderasViaje,
  construirCiudadesViaje,
  construirParadaPayload,
  construirViajePayload,
  obtenerPaisesVisitados
} from './viajeUtils';

describe('viajeUtils', () => {
  it('genera titulo por ciudad unica', () => {
    const titulo = generarTituloInteligente('Base', [{ nombre: 'Madrid', paisCodigo: 'ES' }]);
    expect(titulo).toBe('Escapada a Madrid');
  });

  it('genera titulo por dos ciudades', () => {
    const titulo = generarTituloInteligente('Base', [
      { nombre: 'Madrid', paisCodigo: 'ES' },
      { nombre: 'Barcelona', paisCodigo: 'ES' }
    ]);
    expect(titulo).toBe('Madrid y Barcelona');
  });

  it('genera titulo por pais cuando hay varias ciudades del mismo pais', () => {
    const titulo = generarTituloInteligente('Base', [
      { nombre: 'Madrid', paisCodigo: 'ES' },
      { nombre: 'Sevilla', paisCodigo: 'ES' },
      { nombre: 'Valencia', paisCodigo: 'ES' }
    ]);
    expect(titulo.startsWith('Ruta por ')).toBe(true);
    expect(titulo).not.toBe('Base');
  });

  it('genera titulo para dos paises', () => {
    const titulo = generarTituloInteligente('Base', [
      { nombre: 'Madrid', paisCodigo: 'ES' },
      { nombre: 'Paris', paisCodigo: 'FR' }
    ]);
    expect(titulo).toBe('Aventura entre España y Francia');
  });

  it('genera titulo para multiples paises (3 paises)', () => {
    const titulo = generarTituloInteligente('Base', [
      { nombre: 'Madrid', paisCodigo: 'ES' },
      { nombre: 'Paris', paisCodigo: 'FR' },
      { nombre: 'Roma', paisCodigo: 'IT' }
    ]);
    expect(titulo.startsWith('Travesía por ')).toBe(true);
    expect(titulo).toContain('España');
    expect(titulo).toContain('Francia');
    expect(titulo).toContain('Italia');
  });

  it('genera titulo para mas de tres paises', () => {
    const titulo = generarTituloInteligente('Base', [
      { nombre: 'Uno', paisCodigo: 'ES' },
      { nombre: 'Dos', paisCodigo: 'FR' },
      { nombre: 'Tres', paisCodigo: 'IT' },
      { nombre: 'Cuatro', paisCodigo: 'DE' }
    ]);
    expect(titulo.startsWith('Gran travesía por ')).toBe(true);
    expect(titulo).toContain('España');
    expect(titulo).toContain('Francia');
    expect(titulo).toContain('y 2 más');
  });

  it('prioriza banderas de paradas y elimina duplicados', () => {
    const banderas = construirBanderasViaje('AR', [
      { paisCodigo: 'ES' },
      { paisCodigo: 'ES' },
      { paisCodigo: 'FR' }
    ]);
    expect(banderas).toEqual(['https://flagcdn.com/es.svg', 'https://flagcdn.com/fr.svg']);
  });

  it('construye string de ciudades unicas', () => {
    const ciudades = construirCiudadesViaje([{ nombre: 'Lima' }, { nombre: 'Cusco' }, { nombre: 'Lima' }]);
    expect(ciudades).toBe('Lima, Cusco');
  });

  it('construye payload de parada con defaults y campos nuevos', () => {
    const payload = construirParadaPayload(
      { nombre: 'Lima', coordenadas: [-77.04, -12.04], paisCodigo: 'PE', transporte: 'tren', notaCorta: 'Comer ceviche' },
      '2026-02-11',
      { desc: 'Nublado', max: 26, code: 4 }
    );

    expect(payload).toEqual({
      nombre: 'Lima',
      coordenadas: [-77.04, -12.04],
      fecha: '2026-02-11',
      fechaLlegada: '',
      fechaSalida: '',
      paisCodigo: 'PE',
      clima: { desc: 'Nublado', max: 26, code: 4 },
      tipo: 'place',
      transporte: 'tren',
      notaCorta: 'Comer ceviche'
    });
  });

  it('construye payload de viaje con fallbacks', () => {
    const payload = construirViajePayload({
      datosViaje: { code: 'AR', nombreEspanol: 'Argentina' },
      titulo: 'Mi viaje',
      banderas: ['https://flagcdn.com/ar.svg'],
      ciudades: 'Buenos Aires',
      foto: null,
      fotoCredito: null
    });

    expect(payload.code).toBe('AR');
    expect(payload.nombreEspanol).toBe('Argentina');
    expect(payload.titulo).toBe('Mi viaje');
    expect(payload.rating).toBe(5);
    expect(payload.foto).toBe(FOTO_DEFAULT_URL);
    expect(payload.banderas).toEqual(['https://flagcdn.com/ar.svg']);
    expect(payload.ciudades).toBe('Buenos Aires');
  });

  it('construye payload de viaje incluyendo presupuesto y vibe', () => {
    const payload = construirViajePayload({
      datosViaje: { code: 'AR', nombreEspanol: 'Argentina', presupuesto: 'Lujo', vibe: ['Gastronómico'] },
      titulo: 'Mi viaje',
      banderas: ['https://flagcdn.com/ar.svg'],
      ciudades: 'Buenos Aires',
      foto: null,
      fotoCredito: null
    });

    expect(payload.presupuesto).toBe('Lujo');
    expect(payload.vibe).toEqual(['Gastronómico']);
  });

  it('obtiene paises visitados en ISO3 desde bitacora y paradas', () => {
    const paises = obtenerPaisesVisitados(
      [{ code: 'AR' }, { code: 'ES' }],
      [{ paisCodigo: 'FR' }, { paisCodigo: 'AR' }]
    );
    expect(paises).toEqual(expect.arrayContaining(['ARG', 'ESP', 'FRA']));
    expect(paises.length).toBe(3);
  });
});
