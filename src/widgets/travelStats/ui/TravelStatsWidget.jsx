import React, { memo, useEffect } from 'react';
import { motion as Motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { COLORS } from '@shared/config';
import { styles, mediaQueries } from './TravelStatsWidget.styles';

/**
 * Flexible stats widget used across dashboard, hub, etc.
 * Props:
 *   stats: array of { value, label, icon? }
 *   ariaLabel: string
 *   variant: 'compact' | 'full'  // compact shows first two stats only
 */
const TravelStatsWidget = ({ stats = [], ariaLabel, variant = 'full' }) => {
  if (stats.length === 0) return null;

  const displayed = variant === 'compact' ? stats.slice(0, 2) : stats;

  return (
    <>
      <style>{mediaQueries}</style>
      <div
        role="region"
        aria-label={ariaLabel}
        className="travel-stats-grid"
        style={styles.container}
      >
        {displayed.map((stat) => (
          <StatPill key={stat.label} stat={stat} />
        ))}
      </div>
    </>
  );
};

const StatPill = memo(({ stat }) => {
  const numericValue = typeof stat.value === 'number' ? stat.value : Number.parseFloat(stat.value) || 0;
  // motion value for animated counter
  const count = useMotionValue(numericValue);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const prev = React.useRef(numericValue);

  useEffect(() => {
    if (prev.current !== numericValue) {
      animate(count, numericValue, { duration: 0.8 });
      prev.current = numericValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericValue]);

  return (
    <Motion.div
      className="travel-stats-pill"
      style={styles.pill}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div style={styles.iconWrap}>
        <div style={styles.iconCircle}>
          {stat.icon || null}
        </div>
      </div>
      <Motion.span className="travel-stats-value" style={styles.value}>
        {typeof stat.value === 'number' ? rounded : stat.value}
      </Motion.span>
      <span className="travel-stats-label" style={styles.label}>{stat.label}</span>
    </Motion.div>
  );
});

export default memo(TravelStatsWidget);
