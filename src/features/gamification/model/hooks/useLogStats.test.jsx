/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLogStats } from './useLogStats';

describe('useLogStats', () => {
  it('returns an empty 5-stat summary when trips are empty', () => {
    const { result } = renderHook(() => useLogStats([], {}));

    expect(result.current).toEqual({
      worldExploredPercentage: '0.0',
      uniqueCountries: 0,
      completedTrips: 0,
      totalDays: 0,
      totalStops: 0,
    });
  });

  it('computes the 5 storytelling stats from trip data', () => {
    const trips = [{ id: 'trip-1' }, { id: 'trip-2' }];
    const tripData = {
      'trip-1': {
        fechaInicio: '2026-01-10',
        fechaFin: '2026-01-12',
        paradas: [{ paisCodigo: 'ES' }, { paisCodigo: 'PT' }],
        totalParadas: 2,
      },
      'trip-2': {
        fechaInicio: '2026-02-01',
        fechaFin: '2026-02-03',
        paradas: [{ paisCodigo: 'PT' }, { paisCodigo: 'FR' }, { paisCodigo: 'FR' }],
        totalParadas: 3,
      },
    };

    const { result } = renderHook(() => useLogStats(trips, tripData));

    expect(result.current).toEqual({
      worldExploredPercentage: '1.5',
      uniqueCountries: 3,
      completedTrips: 2,
      totalDays: 6,
      totalStops: 5,
    });
  });

  it('falls back to totalParadas when paradas are missing', () => {
    const trips = [{ id: 'trip-1' }];
    const tripData = {
      'trip-1': {
        fechaInicio: '2026-03-01',
        fechaFin: '2026-03-02',
        totalParadas: 4,
        paisCodigo: 'AR',
      },
    };

    const { result } = renderHook(() => useLogStats(trips, tripData));

    expect(result.current.totalStops).toBe(4);
    expect(result.current.uniqueCountries).toBe(1);
  });
});