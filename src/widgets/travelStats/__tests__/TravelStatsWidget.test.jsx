/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import TravelStatsWidget from '../ui/TravelStatsWidget';

// Mock react-i18next
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key) => {
        const translations = {
          'stats.completedTrips': 'Trips',
          'stats.totalDays': 'Total days',
          'stats.totalDaysHint': 'Days across all trips',
          'stats.totalStops': 'Stops',
          'stats.totalStopsHint': 'Stops recorded',
          'stats.worldExploredPercentage': 'World explored',
          'stats.worldExploredPercentageHint': 'Of global 195 countries',
          'stats.uniqueCountries': 'Countries',
          'stats.uniqueCountriesHint': 'Unique countries visited',
          'stats.emptyStateHint': 'Your next journey awaits',
          'stats.emptyStateMessage': 'Start your first adventure to see your travel story unfold',
        };
        return translations[key] || key;
      }
    })
  };
});

describe('TravelStatsWidget', () => {
  afterEach(() => cleanup());

  const mockLogStats = {
    completedTrips: 5,
    totalDays: 42,
    totalStops: 8,
    worldExploredPercentage: '4',
    uniqueCountries: 3,
  };

  it('renders all stats in home variant with biography layout', () => {
    render(
      <TravelStatsWidget logStats={mockLogStats} ariaLabel="test" variant="home" />
    );
    expect(screen.getByRole('region', { name: 'test' })).toBeInTheDocument();
    expect(screen.getByText(/World explored/i)).toBeInTheDocument();
    expect(screen.getByText(/Trips/i)).toBeInTheDocument();
    expect(screen.getByText(/Stops/i)).toBeInTheDocument();
  });

  it('renders compact layout in trips variant', () => {
    render(
      <TravelStatsWidget logStats={mockLogStats} ariaLabel="test" variant="trips" />
    );
    expect(screen.getByRole('region', { name: 'test' })).toBeInTheDocument();
    expect(screen.getByText(/World explored/i)).toBeInTheDocument();
  });
});