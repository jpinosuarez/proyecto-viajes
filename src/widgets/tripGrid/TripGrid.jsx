import React, { useMemo } from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogStats } from '@pages/dashboard/model/useLogStats';
import TravelStatsWidget from '@widgets/travelStats/ui/TravelStatsWidget';
import { Trash2, Edit3, Calendar, MapPin, LoaderCircle, Globe, Telescope, ArrowRight, Plus } from 'lucide-react';
import { useSearch, useUI } from '@app/providers/UIContext';
import { COLORS, SHADOWS } from '@shared/config';
import { styles } from './TripGrid.styles';
import './TripGrid.css';

const TripGrid = ({
  trips = [],
  tripData = {},
  handleDelete,
  isDeletingTrip = () => false
}) => {
  const { t } = useTranslation('gallery');
  const { t: tDashboard } = useTranslation('dashboard');
  const { busqueda, limpiarBusqueda } = useSearch();
  const { openBuscador } = useUI();
  const navigate = useNavigate();
  const searchTerm = busqueda.trim().toLowerCase();

  const filteredTrips = useMemo(() => {
    if (!searchTerm) return trips;
    return trips.filter((trip) => {
      const data = tripData[trip.id] || {};
      const fields = [
        data.titulo,
        trip.nameSpanish,
        data.cities,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return fields.includes(searchTerm);
    });
  }, [trips, tripData, searchTerm]);

  const sortedTrips = useMemo(() => {
    return [...filteredTrips].sort((a, b) => {
      const dateA = new Date(tripData[a.id]?.startDate || a.date).getTime();
      const dateB = new Date(tripData[b.id]?.startDate || b.date).getTime();
      return dateB - dateA;
    });
  }, [filteredTrips, tripData]);

  const logStats = useLogStats(filteredTrips, tripData);

  const statItems = useMemo(() => {
    if (logStats.tripCount === 0) return [];
    return [
      { value: logStats.tripCount, label: tDashboard('stats.tripsCompleted') },
      { value: logStats.totalDays, label: tDashboard('stats.totalDays') },
      { value: logStats.totalCities, label: tDashboard('stats.registeredCities') },
      { value: logStats.continents, label: tDashboard('stats.continents') },
      { value: logStats.longestTrip, label: tDashboard('stats.longestTrip') },
      { value: logStats.totalPhotos, label: tDashboard('stats.photos') },
      ...(logStats.averageRating
        ? [{ value: `${logStats.averageRating}\u2605`, label: tDashboard('stats.averageRating'), accent: true }]
        : []),
    ];
  }, [logStats, tDashboard]);

  const hasNoTrips = trips.length === 0;
  const hasNoSearchResults = !hasNoTrips && searchTerm && sortedTrips.length === 0;

  return (
    <div style={styles.gridWrapper}>
      <TravelStatsWidget stats={statItems} ariaLabel={tDashboard('stats.tripSummary', 'Resumen de viajes')} variant="compact" />
      {searchTerm && !hasNoTrips && (
        <div style={styles.searchMeta}>
          <span>
            {t('bentogrid.searchResults', { count: sortedTrips.length, total: trips.length })}
          </span>
          <button type="button" onClick={limpiarBusqueda} style={styles.clearSearchButton}>
            {t('bentogrid.clearSearch')}
          </button>
        </div>
      )}

      <div className="trip-masonry">
        {hasNoTrips ? (
          <div style={styles.emptyStatePrimary}>
            <div style={styles.emptyIconContainer('primary')}>
              <Globe size={56} color={COLORS.atomicTangerine} />
            </div>
            <h2 style={{ fontWeight: 900, fontSize: '2rem', color: COLORS.charcoalBlue, marginBottom: 12 }}>
              {t('emptyState.title', '¡Tu bitácora espera aventuras!')}
            </h2>
            <p style={{ color: COLORS.textSecondary, fontSize: '1rem', marginBottom: 24 }}>
              {t('emptyState.subtitle', 'Registra tu primer viaje y comienza a coleccionar recuerdos, sellos y logros.')}
            </p>
            <Motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: COLORS.atomicTangerine,
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                minWidth: '44px',
                minHeight: '44px',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: SHADOWS.md,
                padding: '12px 32px',
                marginTop: 8,
                cursor: 'pointer',
              }}
              onClick={openBuscador}
              aria-label={t('bentogrid.emptyState.cta', 'Registrar aventura')}
            >
              <Plus size={20} style={{ marginRight: 8 }} />
              {t('bentogrid.emptyState.cta', 'Registrar aventura')}
            </Motion.button>
          </div>
        ) : (
          sortedTrips.map((trip) => {
            const data = tripData[trip.id] || trip || {};
            if (!data.nameSpanish && !data.titulo) return null;
            // trips may store cover photo under "foto" either on data or the trip object
            const coverUrl = data.foto || trip.foto || '';
            const hasPhoto = !!(coverUrl && typeof coverUrl === 'string' && coverUrl.startsWith('http'));
            const flags = data.flags && data.flags.length > 0 ? data.flags : trip.flag ? [trip.flag] : [];
            return (
              <Motion.div
                key={trip.id}
                data-testid={`trip-card-${trip.id}`}
                className="tap-scale"
                style={{
                  ...styles.masonryItem,
                  ...(hasPhoto
                    ? {
                        backgroundImage: `url('${coverUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : {}),
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/trips/' + trip.id)}
              >
                <div style={styles.topGradient}>
                  <div style={styles.flagsRow}>
                    {flags.slice(0, 3).map((flag, i) => (
                      <img
                        key={i}
                        src={flag}
                        alt={
                          i === 0
                            ? `Bandera de ${data.nombreEspanol || data.titulo || 'destino visitado'}`
                            : 'Bandera de destino visitado'
                        }
                        loading="lazy"
                        style={styles.flagImage}
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    ))}
                    {flags.length > 3 && <span style={styles.flagOverflow}>+{flags.length - 3}</span>}
                  </div>
                  {/* quick action buttons */}
                  {handleDelete && (
                    <div style={styles.cardActions}>
                      <button
                        className="tap-icon"
                        style={styles.actionBtn}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.35)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(trip.id);
                        }}
                        aria-label={t('bentogrid.deleteTrip')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div style={styles.bottomGradient}>
                  <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', marginBottom: 4, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    {data.titulo || data.nameSpanish}
                  </h3>
                  <div style={{ color: '#fff', fontSize: '0.9rem', opacity: 0.85 }}>
                    {data.startDate ? t('card.date', { date: data.startDate }) : ''}
                  </div>
                </div>
              </Motion.div>
            );
          })
        )}
      </div>


      {hasNoSearchResults && (
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={styles.emptyState}
          className="trip-empty"
        >
          <div style={styles.emptyIconContainer('secondary')}>
            <Telescope size={28} color={COLORS.charcoalBlue} strokeWidth={1.5} />
          </div>
          <h3 style={styles.emptyTitle}>{t('bentogrid.noResultsTitle')}</h3>
          <p style={styles.emptyText}>{t('bentogrid.noResultsDescription')}</p>
          <button type="button" onClick={limpiarBusqueda} style={styles.emptyAction}>
            {t('bentogrid.clearFilter')}
          </button>
        </Motion.div>
      )}

      {/* Outlet para rutas anidadas /trips/:id */}
      <Outlet />
    </div>
  );
};

export default TripGrid;