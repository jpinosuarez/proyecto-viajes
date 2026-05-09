/**
 * TravelStatsWidget — Consolidated Bar (Ultra-Compact)
 * - Replaces the grid hero with a single compact stats bar.
 * - Mobile-first: uses `flex-wrap` and `overflow-x-auto no-scrollbar` for graceful degradation.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Compass, Calendar, MapPin } from 'lucide-react';

const formatNumber = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US').format(Math.round(value));
};

const TravelStatsWidget = ({ logStats = null, ariaLabel, variant = 'compact', containerClassName = 'w-full' }) => {
  const { t } = useTranslation('dashboard');
  const isCompact = variant === 'compact';

  const safeValue = (v) => (typeof v === 'number' && !Number.isNaN(v) ? v : 0);

  if (!logStats || safeValue(logStats.completedTrips) === 0) {
    return (
      <section role="region" aria-label={ariaLabel} className="w-full h-full">
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/60 border border-dashed border-border text-center items-center">
          <span className="text-sm font-bold text-charcoalBlue">{t('stats.emptyStateHint')}</span>
          <span className="text-xs text-text-secondary">{t('stats.emptyStateMessage')}</span>
        </div>
      </section>
    );
  }

  const worldPct = Math.max(0, Math.min(100, Number.parseFloat(logStats.worldExploredPercentage || '0') || 0));

  const items = [
    {
      key: 'uniqueCountries',
      icon: <Globe size={18} className="text-atomicTangerine" />, 
      value: `${formatNumber(safeValue(logStats.uniqueCountries))}`,
      label: t('stats.uniqueCountries'),
    },
    {
      key: 'completedTrips',
      icon: <Compass size={18} className="text-atomicTangerine" />, 
      value: `${formatNumber(safeValue(logStats.completedTrips))}`,
      label: t('stats.completedTrips'),
    },
    {
      key: 'totalDays',
      icon: <Calendar size={18} className="text-atomicTangerine" />, 
      value: `${formatNumber(safeValue(logStats.totalDays))}`,
      label: t('stats.totalDays'),
    },
    {
      key: 'totalStops',
      icon: <MapPin size={18} className="text-atomicTangerine" />, 
      value: `${formatNumber(safeValue(logStats.totalStops))}`,
      label: t('stats.totalStops'),
    },
  ];

  return (
    <section role="region" aria-label={ariaLabel} className={containerClassName}>
      <div className="w-full bg-gradient-to-r from-white/8 to-white/4 backdrop-blur-md shadow-lg border border-white/10 rounded-2xl p-4 md:p-5">
        {/* Progress Bar Section */}
        <div className="mb-4 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-text-secondary tracking-wider">{t('stats.worldExploredPercentage')}</span>
            <span className="text-lg font-black text-atomicTangerine">{Math.round(worldPct)}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-atomicTangerine to-mutedTeal transition-all duration-500" 
              style={{ width: `${worldPct}%` }} 
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((it) => (
            <div key={it.key} className="flex flex-col items-start justify-start">
              <div className="flex items-center gap-2 mb-1">
                {it.icon}
                <span className="text-xs font-bold uppercase text-text-secondary tracking-wide">{it.label}</span>
              </div>
              <span className="text-xl md:text-2xl font-black text-atomicTangerine drop-shadow-lg">{it.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelStatsWidget;