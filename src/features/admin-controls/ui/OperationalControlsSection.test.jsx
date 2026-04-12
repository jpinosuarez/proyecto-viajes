/* @vitest-environment jsdom */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import OperationalControlsSection from './OperationalControlsSection';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => {
      if (typeof params?.level === 'number' && key === 'settings:operationalControls.levelLabel') {
        return `Level ${params.level}: ${params.levelName}`;
      }
      if (key === 'settings:operationalControls.levelBadge') {
        return `Level ${params.level}: ${params.levelName}`;
      }
      if (params?.levelName && key === 'settings:operationalControls.toast.success') {
        return `Operational level updated to ${params.levelName}.`;
      }
      return key;
    },
  }),
}));

vi.mock('@shared/lib/hooks/useOperationalFlags', () => ({
  useOperationalFlags: () => ({
    flags: {
      level: 0,
      appReadonlyMode: false,
      appMaintenanceMode: false,
    },
    loading: false,
    error: null,
  }),
}));

vi.mock('../api/operationalFlagsRepository', () => ({
  updateOperationalFlagsLevel: vi.fn(),
}));

describe('OperationalControlsSection', () => {
  it('does not render panel for non-admin users', () => {
    render(
      <OperationalControlsSection
        canManageOperationalFlags={false}
        currentUser={{ uid: 'user-1' }}
        onNotify={vi.fn()}
      />
    );

    expect(screen.queryByText('settings:operationalControls.title')).not.toBeInTheDocument();
  });

  it('renders panel for admin users', () => {
    render(
      <OperationalControlsSection
        canManageOperationalFlags
        currentUser={{ uid: 'admin-1' }}
        onNotify={vi.fn()}
      />
    );

    expect(screen.getByText('settings:operationalControls.title')).toBeInTheDocument();
    expect(screen.getAllByText('Level 0: settings:operationalControls.levels.0.name').length).toBeGreaterThan(0);
  });
});
