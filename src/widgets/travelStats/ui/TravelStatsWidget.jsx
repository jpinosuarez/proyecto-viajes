import React, { memo, useEffect } from 'react';
import { motion as Motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { styles } from './TravelStatsWidget.styles';
const TravelStatsWidget = ({ heroMetric = null, stats = [], ariaLabel, variant = 'full', isMobile = false }) => {
  if (stats.length === 0) return null;

  // For 'home' variant (desktop horizontal): hero left + secondary stats right
  if (variant === 'home') {
    const displayed = stats.slice(0, 3);
    if (!heroMetric) return null;
    return (
      <section role="region" aria-label={ariaLabel} className="travel-stats-home" style={styles.homeShell(isMobile)}>
        <Motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6 }} style={styles.homeHeroContainer}>
          <span style={styles.homeHeroLabel}>{heroMetric.label}</span>
          <AnimatedValue value={heroMetric.value} style={styles.homeHeroValue} />
        </Motion.div>
        {!isMobile && (
          <div className="travel-stats-home-secondary" style={styles.homeSecondaryGrid}>
            {displayed.map((stat, idx) => (
              <Motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.05, duration: 0.5 }} style={styles.homeSecondaryStat}>
                <StatDisplay stat={stat} />
              </Motion.div>
            ))}
          </div>
        )}
      </section>
    );
  }

  // For 'trips' variant (compact command bar header)
  if (variant === 'trips') {
    const displayed = stats.slice(0, 3);
    if (!heroMetric) return null;
    return (
      <section role="region" aria-label={ariaLabel} className="travel-stats-trips" style={styles.tripsShell}>
        <Motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }} style={styles.tripsHeroContainer}>
          <span style={styles.tripsHeroLabel}>{heroMetric.label}</span>
          <AnimatedValue value={heroMetric.value} style={styles.tripsHeroValue} />
        </Motion.div>
        <div className="travel-stats-trips-secondary" style={styles.tripsSecondaryGrid}>
          {displayed.map((stat, idx) => (
            <Motion.div key={stat.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.04, duration: 0.45 }} style={styles.tripsSecondaryStat}>
              <StatDisplay stat={stat} variant="trips" />
            </Motion.div>
          ))}
        </div>
      </section>
    );
  }

  // Default 'full' variant (vertical, original)
  const displayed = variant === 'compact' ? stats.slice(0, 2) : stats.slice(0, 4);
  if (variant === 'compact' || !heroMetric) {
    return (
      <div role="region" aria-label={ariaLabel} className="travel-stats-grid travel-stats-grid-compact" style={styles.compactContainer}>
        {displayed.map((stat) => (<StatDisplay key={stat.label} stat={stat} />))}
      </div>
    );
  }
  return (
    <section role="region" aria-label={ariaLabel} className="travel-stats-shell" style={styles.shell}>
      <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} style={styles.heroContainer}>
        <span style={styles.heroLabel}>{heroMetric.label}</span>
        <AnimatedValue value={heroMetric.value} style={styles.heroValue} />
      </Motion.div>
      <div className="travel-stats-grid travel-stats-secondary" style={styles.secondaryGrid}>
        {displayed.map((stat, idx) => (
          <Motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.05, duration: 0.5 }} style={styles.secondaryStat}>
            <StatDisplay stat={stat} />
          </Motion.div>
        ))}
      </div>
    </section>
  );
};
const StatDisplay = memo(({ stat, variant = 'default' }) => {
  const numericValue = typeof stat.value === 'number' ? stat.value : Number.parseFloat(stat.value) || 0;
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
  const valueStyle = variant === 'trips' ? styles.tripsValue : styles.value;
  const labelStyle = variant === 'trips' ? styles.tripsLabel : styles.label;
  return (
    <>
      <Motion.span style={valueStyle}>{typeof stat.value === 'number' ? rounded : stat.value}</Motion.span>
      <span style={labelStyle}>{stat.label}</span>
    </>
  );
});
StatDisplay.displayName = 'StatDisplay';
const AnimatedValue = memo(({ value, style }) => {
  const numericValue = typeof value === 'number' ? value : Number.parseFloat(value) || 0;
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
  return (<Motion.span style={style}>{typeof value === 'number' ? rounded : value}</Motion.span>);
});
AnimatedValue.displayName = 'AnimatedValue';
export default memo(TravelStatsWidget);