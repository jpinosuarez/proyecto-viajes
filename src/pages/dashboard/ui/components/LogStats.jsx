import React, { memo } from 'react';
import { COLORS } from '@shared/config';

const LogStats = ({ stats = [], ariaLabel }) => {
  if (stats.length === 0) return null;

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: '12px',
        flexWrap: 'wrap',
        rowGap: '12px',
        paddingBottom: '4px',
        marginBottom: '8px',
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '44px',
            minWidth: '112px',
            padding: '10px 16px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(44,62,80,0.08)',
            boxShadow: '0 10px 24px rgba(44,62,80,0.06)',
          }}
        >
          <span style={{
            fontSize: '1.6rem',
            fontWeight: '900',
            color: stat.accent ? COLORS.atomicTangerine : COLORS.charcoalBlue,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            {stat.value}
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            color: COLORS.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginTop: '5px',
          }}>
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default memo(LogStats);
