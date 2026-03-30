/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import TravelStatsWidget from './ui/TravelStatsWidget';

// Mock react-i18next
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key) => {
        const translations = {
          'stats.tripsCompleted': 'Trips completed',
          'stats.totalDays': 'Total days',
          'stats.totalDaysHint': 'Days across all trips',
          'stats.registeredCities': 'Registered cities',
          'stats.citiesHint': 'Unique cities visited',
          'stats.percentOfWorld': '% of World',
          'stats.percentHint': 'Of global 195 countries',
          'stats.continents': 'Continents',
          'stats.continentsHint': 'Continents explored',
          'stats.experience': 'Experience',
          'stats.exploration': 'Exploration',
          'stats.additionalMetrics': 'Additional travel metrics',
        };
        return translations[key] || key;
      }
    })
  };
});

describe('TravelStatsWidget', () => {
  afterEach(() => cleanup());

  const mockLogStats = {
    tripCount: 5,
    totalDays: 42,
    totalCities: 8,
    percentOfWorld: 4,
    continents: 3,
    averageRating: 4.5,
    longestTrip: 14,
    totalPhotos: 120,
  };

  it('renders all stats in home variant with biography layout', () => {
    render(
      <TravelStatsWidget logStats={mockLogStats} ariaLabel="test" variant="home" />
    );
    expect(screen.getByRole('region', { name: 'test' })).toBeInTheDocument();
    expect(screen.getByText(/% of World/i)).toBeInTheDocument();
    expect(screen.getByText(/Experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Exploration/i)).toBeInTheDocument();
  });

  it('renders compact layout in trips variant', () => {
    render(
      <TravelStatsWidget logStats={mockLogStats} ariaLabel="test" variant="trips" />
    );
    expect(screen.getByRole('region', { name: 'test' })).toBeInTheDocument();
    expect(screen.getByText(/% of World/i)).toBeInTheDocument();
  });
});