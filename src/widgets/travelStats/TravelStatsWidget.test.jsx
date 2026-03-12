/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TravelStatsWidget from './ui/TravelStatsWidget';
import { Globe } from 'lucide-react';

describe('TravelStatsWidget', () => {
  const stats = [
    { value: 5, label: 'Trips', icon: <Globe data-testid="icon" /> },
    { value: 10, label: 'Days' },
    { value: 3, label: 'Cities' },
  ];

  it('renders all stats in full variant', () => {
    render(<TravelStatsWidget stats={stats} ariaLabel="test" />);
    expect(screen.getByRole('region', { name: 'test' })).toBeInTheDocument();
    expect(screen.getByText(/Trips/i)).toBeInTheDocument();
    expect(screen.getByText(/Days/i)).toBeInTheDocument();
    expect(screen.getByText(/Cities/i)).toBeInTheDocument();
  });

  it('limits to two stats in compact variant', () => {
    render(<TravelStatsWidget stats={stats} ariaLabel="test" variant="compact" />);
    expect(screen.getByText(/Trips/i)).toBeInTheDocument();
    expect(screen.getByText(/Days/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cities/i)).not.toBeInTheDocument();
  });
});