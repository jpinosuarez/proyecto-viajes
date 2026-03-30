/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Globe } from 'lucide-react';

// mock toast so that useToast works in tests
const mockPushToast = vi.fn();
vi.mock('@app/providers/ToastContext', () => ({ useToast: () => ({ pushToast: mockPushToast }) }));

// stub out heavy subcomponents to avoid rendering logic in unit test
vi.mock('../AchievementsGrid', () => ({ default: () => <div data-testid="achievements" /> }));

// stub window size hook
vi.mock('@shared/lib/hooks/useWindowSize', () => ({ useWindowSize: () => ({ isMobile: false }) }));

import TravelerHub from '../TravelerHub';


describe('TravelerHub', () => {
  const baseStats = [
    { value: 2, label: 'Countries', icon: <Globe /> },
  ];

  const defaultProps = {
    paisesVisitados: [],
    bitacora: [],
    achievementsWithProgress: [],
    stats: baseStats,
  };

  it('renders without crashing and shows share button', () => {
    render(<TravelerHub {...defaultProps} />);
    // the share button should be present (label is key because of mocked i18n)
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('copy link to clipboard when share clicked and navigator.share not available', async () => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue() },
      configurable: true,
    });

    render(<TravelerHub {...defaultProps} />);
    const btn = screen.getAllByRole('button', { name: /share/i })[0];
    await btn.click();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
