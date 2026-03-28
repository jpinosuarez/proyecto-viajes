const fs = require('fs');
const path = require('path');
const BASE = process.cwd();
const p = (filename) => path.join(BASE, filename);
console.log('🚀 UI/UX Transformation: Applying 9 Changes...\n');
fs.writeFileSync(p('src/widgets/travelStats/ui/TravelStatsWidget.styles.js'), `import { COLORS, RADIUS, SHADOWS, TRANSITIONS } from '@shared/config';

export const styles = {
  shell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    width: '100%',
  },
  heroContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'flex-start',
  },
  heroLabel: {
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    opacity: 0.7,
    margin: 0,
  },
  heroValue: {
    fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
    fontWeight: 900,
    color: COLORS.atomicTangerine,
    lineHeight: 0.9,
    letterSpacing: '-0.04em',
    margin: 0,
  },
  secondaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '32px 24px',
    width: '100%',
  },
  secondaryStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 'clamp(1.6rem, 2.2vw, 2rem)',
    fontWeight: 900,
    color: COLORS.charcoalBlue,
    lineHeight: 1,
    letterSpacing: '-0.02em',
    margin: 0,
  },
  label: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    margin: 0,
  },
  compactContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '24px',
    width: '100%',
  },
};`);
console.log('✓ Phase 1A');
fs.writeFileSync(p('src/widgets/travelStats/ui/TravelStatsWidget.jsx'), `import React, { memo, useEffect } from 'react';
import { motion as Motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { styles } from './TravelStatsWidget.styles';
const TravelStatsWidget = ({ heroMetric = null, stats = [], ariaLabel, variant = 'full' }) => {
  if (stats.length === 0) return null;
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
const StatDisplay = memo(({ stat }) => {
  const numericValue = typeof stat.value === 'number' ? stat.value : Number.parseFloat(stat.value) || 0;
  const count = useMotionValue(numericValue);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const prev = React.useRef(numericValue);
  useEffect(() => {
    if (prev.current !== numericValue) {
      animate(count, numericValue, { duration: 0.8 });
      prev.current = numericValue;
    }
  }, [numericValue]);
  return (
    <>
      <Motion.span style={styles.value}>{typeof stat.value === 'number' ? rounded : stat.value}</Motion.span>
      <span style={styles.label}>{stat.label}</span>
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
  }, [numericValue]);
  return (<Motion.span style={style}>{typeof value === 'number' ? rounded : value}</Motion.span>);
});
AnimatedValue.displayName = 'AnimatedValue';
export default memo(TravelStatsWidget);`);
console.log('✓ Phase 1B');
let dashStyles = fs.readFileSync(p('src/pages/dashboard/ui/DashboardPage.styles.js'), 'utf8');
const mapSectionStyles = `
mapSection: {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  minWidth: 0,
},
mapSectionTitle: {
  margin: 0,
  fontSize: '0.85rem',
  fontWeight: '800',
  color: COLORS.charcoalBlue,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
},`;
dashStyles = dashStyles.replace(/mainGrid:\s*\(isMobile\)\s*=>\s*\(\{[\s\S]*?\}\),/m, (match) => match + mapSectionStyles);
fs.writeFileSync(p('src/pages/dashboard/ui/DashboardPage.styles.js'), dashStyles);
console.log('✓ Phase 2');
let dashJsx = fs.readFileSync(p('src/pages/dashboard/ui/DashboardPage.jsx'), 'utf8');
const mapSectionReplace = `<div style={styles.mainGrid(isMobile)}>
  {/* Map Section with Real Title */}
  <div style={styles.mapSection}>
    <h3 style={styles.mapSectionTitle}>{t('explorationMap')}</h3>
    <div style={styles.mapCard(isMobile)}>
      <ErrorBoundary fallback={mapFallback}>
        <HomeMap key={mapRenderKey} paisesVisitados={countriesVisited} isMobile={isMobile} />
      </ErrorBoundary>
    </div>
  </div>
  {/* Recents Section */}
  <div style={styles.recentsContainer}>`;
dashJsx = dashJsx.replace(/<div style={styles\.mainGrid\(isMobile\)}>\s*<div style={styles\.mapCard\(isMobile\)}>\s*<ErrorBoundary[\s\S]*?<\/ErrorBoundary>\s*<\/div>\s*<div style={styles\.recentsContainer}>/m, mapSectionReplace);
fs.writeFileSync(p('src/pages/dashboard/ui/DashboardPage.jsx'), dashJsx);
console.log('✓ Phase 2B');
fs.writeFileSync(p('src/pages/dashboard/ui/components/WelcomeBento.jsx'), `import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ENABLE_IMMERSIVE_VIEWER } from '@shared/config';
import { welcomeStyles as styles } from './WelcomeBento.styles';
import TravelStatsWidget from '@widgets/travelStats/ui/TravelStatsWidget';
const WelcomeBento = ({ name, visitedCount, worldPercent, tripsCount, level, nextLevel, logStatsDashboard, isMobile }) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const handleLevelClick = () => { navigate('/explorer'); };
  return (
    <div style={styles.pageHeader(isMobile)}>
      <div style={styles.decorLayer} aria-hidden="true">
        <span style={styles.decorOrbA} />
        <span style={styles.decorOrbB} />
      </div>
      <div style={styles.headerContent}>
        <div>
          <h1 style={styles.title}>{t('greeting', { name })}</h1>
          <p style={styles.subtitle}>{visitedCount > 0 ? t('subtitleStats', { countries: visitedCount, percent: worldPercent, trips: tripsCount }) : t('welcome.emptyStateSubtitle')}</p>
          <div style={styles.badgeRow}>
            {ENABLE_IMMERSIVE_VIEWER ? (
              <button type="button" onClick={handleLevelClick} style={styles.badgeLevelButton}>
                <span style={styles.badgeLevel}>{level.icon} {level.label}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <span style={styles.badgeLevel}>{level.icon} {level.label}</span>
            )}
            {nextLevel.level && (
              <span style={styles.badgeProgress}>
                {t('nextLevelProgress', {
                  remaining: nextLevel.remaining,
                  countryWord: nextLevel.remaining !== 1 ? t('stats.countriesPlural') : t('stats.countrySingular'),
                  level: nextLevel.level.label,
                })}
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={styles.statsSection}>
        <TravelStatsWidget
          heroMetric={{ value: visitedCount, label: t('stats.countriesVisited') }}
          stats={[
            { value: logStatsDashboard.tripCount, label: t('stats.tripsCompleted') },
            { value: logStatsDashboard.totalDays, label: t('stats.totalDays') },
            { value: logStatsDashboard.totalCities, label: t('stats.registeredCities') },
            { value: logStatsDashboard.continents, label: t('stats.continents') },
            { value: logStatsDashboard.longestTrip, label: t('stats.longestTrip') },
            { value: logStatsDashboard.totalPhotos, label: t('stats.photos') },
          ]}
          ariaLabel={t('stats.tripSummary')}
        />
      </div>
    </div>
  );
};
export default WelcomeBento;`);
console.log('✓ Phase 3A');
fs.writeFileSync(p('src/pages/dashboard/ui/components/WelcomeBento.styles.js'), `import { COLORS, SHADOWS, RADIUS } from '@shared/config';
export const welcomeStyles = {
  pageHeader: (isMobile) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '24px' : '28px',
    padding: '0px',
    position: 'relative',
    backgroundColor: 'transparent',
    borderRadius: 0,
    border: 'none',
    boxShadow: 'none',
  }),
  decorLayer: { position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 },
  decorOrbA: { position: 'absolute', width: '140px', height: '140px', right: '-44px', top: '-56px', borderRadius: '999px', background: 'radial-gradient(circle, rgba(255,107,53,0.16) 0%, rgba(255,107,53,0) 72%)' },
  decorOrbB: { position: 'absolute', width: '120px', height: '120px', left: '-38px', bottom: '-60px', borderRadius: '999px', background: 'radial-gradient(circle, rgba(69,176,168,0.14) 0%, rgba(69,176,168,0) 74%)' },
  headerContent: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '12px' },
  title: { margin: 0, fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: '900', color: COLORS.charcoalBlue, lineHeight: 1.15, letterSpacing: '-0.02em' },
  subtitle: { margin: 0, marginTop: '4px', fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', fontWeight: '500', color: COLORS.textSecondary, lineHeight: 1.4 },
  badgeRow: { display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap', maxWidth: '100%' },
  badgeLevelButton: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '999px', border: \`1px solid \${COLORS.border}\`, background: COLORS.surface, cursor: 'pointer', color: COLORS.charcoalBlue, fontWeight: 800, fontSize: '0.8rem', minHeight: '32px', transition: 'all 200ms ease-out' },
  badgeLevel: { fontSize: '0.8rem', fontWeight: '800', color: COLORS.atomicTangerine, display: 'flex', alignItems: 'center', gap: '4px' },
  badgeProgress: { fontSize: '0.7rem', fontWeight: '600', color: COLORS.textSecondary, opacity: 0.85 },
  statsSection: { position: 'relative', zIndex: 1, width: '100%' },
};`);
console.log('✓ Phase 3B');
fs.writeFileSync(p('src/features/mapa/ui/HomeMap.jsx'), `import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS, RADIUS } from '@shared/config';
import { setMapLanguage } from '@shared/lib/geo';
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const HomeMap = ({ paisesVisitados = [], isMobile = false }) => {
  const { i18n, t } = useTranslation('dashboard');
  const [hoverInfo, setHoverInfo] = useState(null);
  const onHover = useCallback(event => {
    const { features, point: { x, y } } = event;
    const hoveredFeature = features && features[0];
    setHoverInfo(hoveredFeature ? { feature: hoveredFeature, x, y } : null);
  }, []);
  const listaPaises = paisesVisitados.length > 0 ? paisesVisitados : ['EMPTY_LIST'];
  return (
    <div style={{ width: '100%', minWidth: 0, height: '100%', position: 'relative', background: COLORS.background, borderRadius: RADIUS.xl, overflow: 'hidden' }}>
      <Map style={{ width: '100%', minHeight: 0, height: '100%' }} initialViewState={{ longitude: 0, latitude: isMobile ? 18 : 16, zoom: isMobile ? 0.45 : 0.72 }} mapStyle="mapbox://styles/mapbox/light-v11" mapboxAccessToken={MAPBOX_TOKEN} projection="mercator" reuseMaps interactive={true} renderWorldCopies={false} minZoom={0.35} maxBounds={[[-180, -70], [180, 85]]} boxZoom={false} keyboard={false} scrollZoom={false} dragPan={false} dragRotate={false} doubleClickZoom={false} touchZoomRotate={false} touchPitch={false} pitchWithRotate={false} onLoad={(e) => setMapLanguage(e.target, i18n.language)} onMouseMove={onHover} interactiveLayerIds={['country-fills']} attributionControl={false}>
        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer id="country-fills" type="fill" source-layer="country_boundaries" paint={{ 'fill-color': COLORS.atomicTangerine, 'fill-opacity': ['match', ['get', 'iso_3166_1_alpha_3'], listaPaises, 0.8, 0] }} />
          <Layer id="borders" type="line" source-layer="country_boundaries" paint={{ 'line-color': '#cbd5e1', 'line-width': 0.5, 'line-opacity': 0.6 }} />
        </Source>
        {hoverInfo && (
          <div style={{ position: 'absolute', zIndex: 10, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y, transform: 'translate(-50%, -120%)', background: 'rgba(30, 41, 59, 0.95)', color: 'white', padding: '6px 10px', borderRadius: RADIUS.xs, fontSize: '0.75rem', fontWeight: '600', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            {hoverInfo.feature.properties[\`name_\${i18n.language}\`] || hoverInfo.feature.properties.name_en || t('countryFallback')}
          </div>
        )}
      </Map>
    </div>
  );
};
export default HomeMap;`);
console.log('✓ Phase 4');
fs.writeFileSync(p('src/pages/trips/ui/components/TripCommandBar.jsx'), `import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, List } from 'lucide-react';
import { COLORS, RADIUS } from '@shared/config';
import { useToast } from '@app/providers';
const TripCommandBar = ({ activeFilter, onFilterChange }) => {
  const { t } = useTranslation('dashboard');
  const { pushToast } = useToast();
  const handleListToggle = () => { pushToast(t('toast.comingSoon'), 'info'); };
  const filterBtnStyle = (active) => ({
    padding: '7px 16px',
    borderRadius: RADIUS.full,
    border: \`1px solid \${active ? COLORS.atomicTangerine : COLORS.border}\`,
    background: active ? \`\${COLORS.atomicTangerine}12\` : 'transparent',
    color: active ? COLORS.atomicTangerine : COLORS.charcoalBlue,
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer.',
    transition: 'all 0.2s ease-out',
    whiteSpace: 'nowrap',
    minHeight: '40px',
  });
  const iconBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    color: COLORS.textSecondary,
    minHeight: '44px',
    minWidth: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease-out',
  };
  return (
    <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: \`1px solid \${COLORS.border}\` }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button style={filterBtnStyle(activeFilter === 'all')} onClick={() => onFilterChange('all')}>{t('filters.all')}</button>
        <button style={filterBtnStyle(activeFilter === 'year')} onClick={() => onFilterChange('year')}>{t('filters.year')}</button>
      </div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button style={{ ...iconBtnStyle, color: COLORS.atomicTangerine }} title={t('viewGrid')} aria-label={t('viewGrid')}><LayoutGrid size={20} /></button>
        <button style={iconBtnStyle} onClick={handleListToggle} title={t('viewList')} aria-label={t('viewList')}><List size={20} /></button>
      </div>
    </div>
  );
};
export default React.memo(TripCommandBar);`);
console.log('✓ Phase 5');
let esJson = JSON.parse(fs.readFileSync(p('src/i18n/locales/es/dashboard.json'), 'utf8'));
esJson.explorationMap = 'Tu Mundo';
fs.writeFileSync(p('src/i18n/locales/es/dashboard.json'), JSON.stringify(esJson, null, 2));
console.log('✓ Phase 6A');
let enJson = JSON.parse(fs.readFileSync(p('src/i18n/locales/en/dashboard.json'), 'utf8'));
enJson.explorationMap = 'Exploration Map';
fs.writeFileSync(p('src/i18n/locales/en/dashboard.json'), JSON.stringify(enJson, null, 2));
console.log('✓ Phase 6B');
console.log('\n✅ All 9 phases applied successfully!');
