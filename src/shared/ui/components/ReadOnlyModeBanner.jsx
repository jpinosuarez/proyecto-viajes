import React from 'react';
import { useTranslation } from 'react-i18next';
import { COLORS, RADIUS, SHADOWS } from '@shared/config';
import { useOperationalFlags } from '@shared/lib/hooks/useOperationalFlags';

const ReadOnlyModeBanner = () => {
  const { t } = useTranslation('common');
  const {
    flags: { level, appReadonlyMode, appMaintenanceMode },
  } = useOperationalFlags();

  const isReadOnlyMode = Boolean(appReadonlyMode) || Number(level || 0) >= 3;
  const isMaintenanceMode = Boolean(appMaintenanceMode) || Number(level || 0) >= 4;

  if (!isReadOnlyMode || isMaintenanceMode) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        width: 'min(92vw, 720px)',
        borderRadius: RADIUS.full,
        border: `1px solid ${COLORS.border}`,
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: SHADOWS.sm,
        color: COLORS.charcoalBlue,
        fontSize: '0.84rem',
        fontWeight: 700,
        lineHeight: 1.35,
        textAlign: 'center',
        padding: '8px 14px',
        pointerEvents: 'none',
      }}
    >
      {t(
        'operational.readOnlyBanner',
        'Keeptrip is in Read-Only mode. Your data is safe, but edits are paused.'
      )}
    </div>
  );
};

export default ReadOnlyModeBanner;
