/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import TravelStatsWidget from './ui/TravelStatsWidget';

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key) => {
        const translations = {
          'stats.worldExploredPercentage': 'World explored',
          'stats.worldExploredPercentageHint': 'Percentage of the world covered',
          'stats.uniqueCountries': 'Countries',
          'stats.uniqueCountriesHint': 'Unique countries visited',
          'stats.completedTrips': 'Trips',
          'stats.completedTripsHint': 'Trips completed',
          'stats.totalDays': 'Days',
          'stats.totalDaysHint': 'Days across all trips',
          'stats.totalStops': 'Stops',
          'stats.totalStopsHint': 'Stops recorded',
          'stats.emptyStateHint': 'Your next journey awaits',
          'stats.emptyStateMessage': 'Start your first adventure to see your travel story unfold',
        };
        return translations[key] || key;
      },
    }),
  };
});

describe('TravelStatsWidget', () => {
  afterEach(() => cleanup());

  const mockLogStats = {
    worldExploredPercentage: '2.1',
    uniqueCountries: 4,
    completedTrips: 3,
    totalDays: 9,
    totalStops: 12,
  };

  it('renders the five storytelling metrics in bento layout', () => {
    render(<TravelStatsWidget logStats={mockLogStats} ariaLabel="test" />);

    expect(screen.getByRole('region', { name: 'test' })).toBeInTheDocument();
    expect(screen.getByText('World explored')).toBeInTheDocument();
    expect(screen.getByText('Countries')).toBeInTheDocument();
    expect(screen.getByText('Trips')).toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Stops')).toBeInTheDocument();
  });

  it('renders empty state when there are no completed trips', () => {
    render(<TravelStatsWidget logStats={{ ...mockLogStats, completedTrips: 0 }} ariaLabel="test" />);

    expect(screen.getByText('Your next journey awaits')).toBeInTheDocument();
  });
});