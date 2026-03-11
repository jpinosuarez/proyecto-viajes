/** @vitest-environment jsdom */
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { afterEach } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { mockNavigate, mockOpenBuscador, mockClearSearch } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockOpenBuscador: vi.fn(),
  mockClearSearch: vi.fn(),
}));

let mockSearchState = {
  busqueda: '',
  limpiarBusqueda: mockClearSearch,
};

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Outlet: () => null,
  };
});

vi.mock('@app/providers/UIContext', () => ({
  useSearch: () => mockSearchState,
  useUI: () => ({ openBuscador: mockOpenBuscador }),
}));

vi.mock('lucide-react', () => {
  const createIcon = () => function IconStub() {
    return null;
  };

  return {
    Trash2: createIcon(),
    Edit3: createIcon(),
    Calendar: createIcon(),
    MapPin: createIcon(),
    LoaderCircle: createIcon(),
    Globe: createIcon(),
    Telescope: createIcon(),
    ArrowRight: createIcon(),
  };
});

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

import TripGrid from './TripGrid';

afterEach(() => cleanup());

describe('TripGrid', () => {
  const trips = [
    { id: 'trip-1', nameSpanish: 'Spain', date: '2026-02-12' },
    { id: 'trip-2', nameSpanish: 'Italy', date: '2026-03-02' },
  ];

  const tripData = {
    'trip-1': {
      titulo: 'Madrid Escape',
      startDate: '2026-02-10',
      endDate: '2026-02-12',
      cities: 'Madrid, Toledo',
      rating: 4,
    },
    'trip-2': {
      titulo: 'Rome Weekend',
      startDate: '2026-03-01',
      endDate: '2026-03-02',
      cities: 'Rome',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchState = {
      busqueda: '',
      limpiarBusqueda: mockClearSearch,
    };
  });

  it('renders log stats from the visible trips', () => {
    render(
      <TripGrid
        trips={trips}
        tripData={tripData}
        handleDelete={vi.fn()}
      />
    );

    const statsRegion = screen.getByRole('region', { name: 'stats.tripSummary' });

    expect(statsRegion).toBeInTheDocument();
    expect(within(statsRegion).getByText('2')).toBeInTheDocument();
    expect(within(statsRegion).getByText('5')).toBeInTheDocument();
    expect(within(statsRegion).getByText('3')).toBeInTheDocument();
    expect(within(statsRegion).getByText('4.0★')).toBeInTheDocument();
    expect(within(statsRegion).getByText('stats.tripsCompleted')).toBeInTheDocument();
    expect(within(statsRegion).getByText('stats.totalDays')).toBeInTheDocument();
    expect(within(statsRegion).getByText('stats.registeredCities')).toBeInTheDocument();
    expect(within(statsRegion).getByText('stats.averageRating')).toBeInTheDocument();
  });

  it('updates log stats when the search filter changes visible trips', () => {
    const { rerender } = render(
      <TripGrid
        trips={trips}
        tripData={tripData}
        handleDelete={vi.fn()}
      />
    );

    mockSearchState = {
      busqueda: 'rome',
      limpiarBusqueda: mockClearSearch,
    };

    rerender(
      <TripGrid
        trips={trips}
        tripData={tripData}
        handleDelete={vi.fn()}
      />
    );

    const statsRegion = screen.getByRole('region', { name: 'stats.tripSummary' });
    const tripCountLabel = within(statsRegion).getByText('stats.tripsCompleted');
    const totalDaysLabel = within(statsRegion).getByText('stats.totalDays');
    const totalCitiesLabel = within(statsRegion).getByText('stats.registeredCities');

    expect(screen.getByText('bentogrid.searchResults')).toBeInTheDocument();
    expect(tripCountLabel).toBeInTheDocument();
    expect(totalDaysLabel).toBeInTheDocument();
    expect(totalCitiesLabel).toBeInTheDocument();
    expect(tripCountLabel.previousSibling).toHaveTextContent('1');
    expect(totalDaysLabel.previousSibling).toHaveTextContent('2');
    expect(totalCitiesLabel.previousSibling).toHaveTextContent('1');
    expect(within(statsRegion).queryByText('stats.averageRating')).not.toBeInTheDocument();
    expect(within(statsRegion).queryByText('4.0★')).not.toBeInTheDocument();
    expect(screen.getByTestId('trip-card-trip-2')).toBeInTheDocument();
    expect(screen.queryByTestId('trip-card-trip-1')).not.toBeInTheDocument();
  });

  it('calls clear search from the search meta action', async () => {
    mockSearchState = {
      busqueda: 'rome',
      limpiarBusqueda: mockClearSearch,
    };

    render(
      <TripGrid
        trips={trips}
        tripData={tripData}
        handleDelete={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'bentogrid.clearSearch' }));

    expect(mockClearSearch).toHaveBeenCalledTimes(1);
  });
});