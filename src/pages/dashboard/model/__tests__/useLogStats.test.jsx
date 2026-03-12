/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLogStats } from '../useLogStats';

describe('useLogStats', () => {
  it('returns an empty summary when trips are empty', () => {
    const { result } = renderHook(() => useLogStats([], {}));

    expect(result.current).toEqual({
      tripCount: 0,
      totalDays: 0,
      totalCities: 0,
      averageRating: null,
      continents: 0,
      longestTrip: 0,
      totalPhotos: 0,
    });
  });

  it('returns an empty summary when trips are null', () => {
    const { result } = renderHook(() => useLogStats(null, null));

    expect(result.current).toEqual({
      tripCount: 0,
      totalDays: 0,
      totalCities: 0,
      averageRating: null,
      continents: 0,
      longestTrip: 0,
      totalPhotos: 0,
    });
  });

  it('computes totals for multiple valid trips', () => {
    const trips = [{ id: 'trip-1' }, { id: 'trip-2' }];
    const tripData = {
      'trip-1': {
        startDate: '2026-01-10',
        endDate: '2026-01-12',
        cities: 'Madrid, Toledo',
        rating: 4,
      },
      'trip-2': {
        startDate: '2026-02-01',
        endDate: '2026-02-03',
        cities: 'Lisbon, Porto, Braga',
        rating: 5,
      },
    };

    const { result } = renderHook(() => useLogStats(trips, tripData));

    expect(result.current).toEqual({
      tripCount: 2,
      totalDays: 6,
      totalCities: 5,
      averageRating: '4.5',
      continents: 0, // no country codes provided
      longestTrip: 3,
      totalPhotos: 0,
    });
  });

  it('excludes missing ratings from the average calculation', () => {
    const trips = [{ id: 'trip-1' }, { id: 'trip-2' }, { id: 'trip-3' }];
    const tripData = {
      'trip-1': {
        startDate: '2026-03-01',
        endDate: '2026-03-02',
        cities: 'Seville',
        rating: 4,
      },
      'trip-2': {
        startDate: '2026-03-05',
        endDate: '2026-03-05',
        cities: 'Cordoba',
      },
      'trip-3': {
        startDate: '2026-03-08',
        endDate: '2026-03-09',
        cities: 'Granada',
        rating: 2,
      },
    };

    const { result } = renderHook(() => useLogStats(trips, tripData));

    expect(result.current.averageRating).toBe('3.0');
  });

  it('returns null average when no trip has a valid rating', () => {
    const trips = [{ id: 'trip-1' }, { id: 'trip-2' }];
    const tripData = {
      'trip-1': {
        startDate: '2026-04-01',
        endDate: '2026-04-01',
        cities: 'Valencia',
      },
      'trip-2': {
        startDate: '2026-04-02',
        endDate: '2026-04-02',
        cities: 'Bilbao',
        rating: 0,
      },
    };

    const { result } = renderHook(() => useLogStats(trips, tripData));

    expect(result.current.averageRating).toBeNull();
  });

  it('counts one-day and multi-day trips correctly', () => {
    const trips = [{ id: 'same-day' }, { id: 'multi-day' }];
    const tripData = {
      'same-day': {
        startDate: '2026-05-10',
        endDate: '2026-05-10',
        cities: 'Mexico City',
      },
      'multi-day': {
        startDate: '2026-05-11',
        endDate: '2026-05-15',
        cities: 'Oaxaca, Puebla',
      },
    };

    const { result } = renderHook(() => useLogStats(trips, tripData));

    expect(result.current.totalDays).toBe(6);
  });

  it('counts duplicate city entries across trips as registered cities', () => {
    const trips = [{ id: 'trip-1' }, { id: 'trip-2' }];
    const tripData = {
      'trip-1': {
        startDate: '2026-06-01',
        endDate: '2026-06-01',
        cities: 'Paris, Lyon',
      },
      'trip-2': {
        startDate: '2026-06-02',
        endDate: '2026-06-03',
        cities: 'Paris, Marseille',
      },
    };

    const { result } = renderHook(() => useLogStats(trips, tripData));

    expect(result.current.totalCities).toBe(4);
  });
});