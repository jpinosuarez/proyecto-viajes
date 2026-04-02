import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ANIMATION_DELAYS } from '@shared/config';
import { styles } from './TravelStatsWidget.styles';

const formatNumber = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US').format(Math.round(value));
};

const StatCard = ({ stat, hero = false, style, index }) => (
  <Motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: ANIMATION_DELAYS.fast + index * 0.06, duration: 0.35 }}
    style={{ ...styles.card, ...(hero ? styles.heroCard : null), ...style }}
  >
    <div style={styles.cardBody}>
      <span style={{ ...styles.value, ...(hero ? styles.heroValue : null) }}>
        {stat.displayValue}
      </span>
      <span style={styles.label}>{stat.label}</span>
    </div>
    {stat.hint ? <span style={styles.hint}>{stat.hint}</span> : null}
  </Motion.div>
);

const TravelStatsWidget = ({ logStats = null, ariaLabel, isMobile = false }) => {
  const { t } = useTranslation('dashboard');

  const safeValue = (value) => (typeof value === 'number' && !Number.isNaN(value) ? value : 0);
  const isDesktopLayout = !isMobile && typeof window !== 'undefined' ? window.innerWidth >= 768 : !isMobile;

  const stats = React.useMemo(() => {
    if (!logStats) return null;

    const worldPercentage = Number.parseFloat(logStats.worldExploredPercentage || '0');

    return {
      worldExploredPercentage: {
        label: t('stats.worldExploredPercentage'),
        hint: t('stats.worldExploredPercentageHint'),
        displayValue: `${Number.isNaN(worldPercentage) ? 0 : worldPercentage.toFixed(1)}%`,
      },
      uniqueCountries: {
        label: t('stats.uniqueCountries'),
        hint: t('stats.uniqueCountriesHint'),
        displayValue: formatNumber(safeValue(logStats.uniqueCountries)),
      },
      completedTrips: {
        label: t('stats.completedTrips'),
        hint: t('stats.completedTripsHint'),
        displayValue: formatNumber(safeValue(logStats.completedTrips)),
      },
      totalDays: {
        label: t('stats.totalDays'),
        hint: t('stats.totalDaysHint'),
        displayValue: formatNumber(safeValue(logStats.totalDays)),
      },
      totalStops: {
        label: t('stats.totalStops'),
        hint: t('stats.totalStopsHint'),
        displayValue: formatNumber(safeValue(logStats.totalStops)),
      },
    };
  }, [logStats, t]);

  if (!stats || safeValue(logStats?.completedTrips) === 0) {
    return (
      <section role="region" aria-label={ariaLabel} style={styles.shell} data-density={isMobile ? 'mobile' : 'desktop'}>
        <div style={styles.emptyState}>
          <span style={styles.emptyStateTitle}>{t('stats.emptyStateHint')}</span>
          <span style={styles.emptyStateMessage}>{t('stats.emptyStateMessage')}</span>
        </div>
      </section>
    );
  }

  const cards = [
    {
      key: 'worldExploredPercentage',
      hero: true,
      mobilePosition: styles.heroPositionMobile,
      desktopPosition: styles.heroPositionDesktop,
      stat: stats.worldExploredPercentage,
    },
    {
      key: 'uniqueCountries',
      mobilePosition: styles.uniqueCountriesPositionMobile,
      desktopPosition: styles.uniqueCountriesPositionDesktop,
      stat: stats.uniqueCountries,
    },
    {
      key: 'completedTrips',
      mobilePosition: styles.completedTripsPositionMobile,
      desktopPosition: styles.completedTripsPositionDesktop,
      stat: stats.completedTrips,
    },
    {
      key: 'totalDays',
      mobilePosition: styles.totalDaysPositionMobile,
      desktopPosition: styles.totalDaysPositionDesktop,
      stat: stats.totalDays,
    },
    {
      key: 'totalStops',
      mobilePosition: styles.totalStopsPositionMobile,
      desktopPosition: styles.totalStopsPositionDesktop,
      stat: stats.totalStops,
    },
  ];

  return (
    <section role="region" aria-label={ariaLabel} style={styles.shell} data-density={isMobile ? 'mobile' : 'desktop'}>
      <div style={isDesktopLayout ? styles.gridDesktop : styles.gridMobile}>
        {cards.map((card, index) => (
          <StatCard
            key={card.key}
            stat={card.stat}
            hero={card.hero}
            style={isDesktopLayout ? card.desktopPosition : card.mobilePosition}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default TravelStatsWidget;