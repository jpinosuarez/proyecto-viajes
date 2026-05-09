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

const TravelStatsWidget = ({ logStats = null, ariaLabel, variant = 'compact' }) => {
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
      icon: <Globe size={16} />, 
      value: `${formatNumber(safeValue(logStats.uniqueCountries))}`,
      label: t('stats.uniqueCountries'),
    },
    {
      key: 'completedTrips',
      icon: <Compass size={16} />, 
      value: `${formatNumber(safeValue(logStats.completedTrips))}`,
      label: t('stats.completedTrips'),
    },
    {
      key: 'totalDays',
      icon: <Calendar size={16} />, 
      value: `${formatNumber(safeValue(logStats.totalDays))}`,
      label: t('stats.totalDays'),
    },
    {
      key: 'totalStops',
      icon: <MapPin size={16} />, 
      value: `${formatNumber(safeValue(logStats.totalStops))}`,
      label: t('stats.totalStops'),
    },
  ];

  return (
    <section role="region" aria-label={ariaLabel} className="w-full h-full">
      <div className="w-full flex items-center justify-between px-3 py-2 gap-3 rounded-2xl bg-white/6 backdrop-blur-sm shadow-sm divide-x divide-white/10 flex-wrap overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 pr-3 min-w-0">
          <div className="min-w-[120px] mr-2">
            <div className="text-xs text-text-secondary">{t('stats.worldExploredPercentage')}</div>
            <div className="mt-1 h-2 rounded-full bg-slate-200/20 overflow-hidden">
              <div className="h-full rounded-full bg-atomicTangerine" style={{ width: `${worldPct}%` }} />
            </div>
            <div className="mt-1 text-sm font-extrabold text-charcoalBlue">{Math.round(worldPct)}%</div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {items.map((it) => (
              <div key={it.key} className="flex items-center gap-2 px-3 text-left min-w-[84px]">
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-charcoalBlue">{it.value}</span>
                  <span className="text-xs text-text-secondary">{it.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pl-3 flex items-center justify-end min-w-0">
          {/* optional small CTA or placeholder for future items - left empty intentionally */}
        </div>
      </div>
    </section>
  );
};

export default TravelStatsWidget;