import React, { useMemo } from 'react';
import { motion as Motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LogStats from '@pages/dashboard/ui/components/LogStats';
import { Trash2, Edit3, Calendar, MapPin, Search, LoaderCircle, Map } from 'lucide-react';
import { useSearch, useUI } from '@app/providers/UIContext';
import { COLORS } from '@shared/config';
import { styles } from './TripGrid.styles';
import './TripGrid.css';

const TripGrid = ({
  trips = [],
  tripData = {},
  handleDelete,
  isDeletingTrip = () => false
}) => {
  const { t } = useTranslation('gallery');
  const { busqueda, limpiarBusqueda } = useSearch();
  const { abrirEditor, abrirVisor, openBuscador } = useUI();
  const searchTerm = busqueda.trim().toLowerCase();

  const filteredTrips = useMemo(() => {
    if (!searchTerm) return trips;
    return trips.filter((trip) => {
      const data = tripData[trip.id] || {};
      const fields = [
        data.titulo,
        trip.nameSpanish,
        data.cities
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

  const hasNoTrips = trips.length === 0;
  const hasNoSearchResults = !hasNoTrips && searchTerm && sortedTrips.length === 0;

  return (
    <div style={{ width: '100%', paddingBottom: '50px' }}>
      <LogStats log={filteredTrips} logData={tripData} />
      {searchTerm && !hasNoTrips && (
        <div style={styles.searchMeta}>
          <span>
            {t('bentogrid.searchResults', { count: sortedTrips.length, total: trips.length })}
          </span>
          <button type="button" onClick={clearSearch} style={styles.clearSearchButton}>
            {t('bentogrid.clearSearch')}
          </button>
        </div>
      )}

      <div className="trip-masonry">
        {sortedTrips.map((trip) => {
          const data = tripData[trip.id] || trip || {};

          if (!data.nameSpanish && !data.titulo) return null;

          const hasPhoto = !!(data.photo && typeof data.photo === 'string' && data.photo.startsWith('http'));
          const flags = data.flags && data.flags.length > 0 ? data.flags : (trip.flag ? [trip.flag] : []);

          return (
            <div
              key={trip.id}
              data-testid={`trip-card-${trip.id}`}
              className="tap-scale"
              style={{
                ...styles.masonryItem,
                ...(hasPhoto ? {
                  backgroundImage: `url('${data.photo}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {})
              }}
              onClick={() => abrirVisor(trip.id)}
            >
              <div style={styles.topGradient}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {flags.slice(0, 3).map((flag, i) => (
                    <img key={i} src={flag} alt="flag" loading="lazy" style={{ width: '28px', height: '20px', borderRadius: '3px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.3)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} onError={(e) => e.target.style.display = 'none'} />
                  ))}
                  {flags.length > 3 && <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>+{flags.length - 3}</span>}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="tap-icon" onClick={(e) => { e.stopPropagation(); abrirEditor(trip.id); }} style={styles.miniBtn}><Edit3 size={14} /></button>
                  <button
                    className="tap-icon"
                    onClick={(e) => { e.stopPropagation(); handleDelete(trip.id); }}
                    style={styles.miniBtn}
                    disabled={isDeletingTrip(trip.id)}
                    title={isDeletingTrip(trip.id) ? t('bentogrid.deleting') : t('bentogrid.deleteTrip')}
                  >
                    {isDeletingTrip(trip.id) ? <LoaderCircle size={14} className="spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>

              <div style={hasPhoto ? styles.bottomContentGlass : styles.bottomContentSolid(COLORS.mutedTeal)}>
                <h3 data-testid={`trip-card-title-${trip.id}`} style={{ margin: '4px 0 8px', color: hasPhoto ? 'white' : COLORS.charcoalBlue, fontSize: '1.1rem', fontWeight: '800', lineHeight: 1.2 }}>
                  {data.titulo || trip.nameSpanish}
                </h3>
                <div style={styles.metaRow(hasPhoto)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> <span>{data.startDate?.split('-')[0]}</span>
                  </div>
                  {data.cities && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> <span>{data.cities.split(',').length} {t('bentogrid.stops')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {hasNoTrips && (
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={styles.emptyStatePrimary}
            className="trip-empty"
          >
            <div style={styles.emptyIconPrimary}>
              <Map size={36} />
            </div>
            <h3 style={styles.emptyTitlePrimary}>{t('bentogrid.emptyTitle')}</h3>
            <p style={styles.emptyTextPrimary}>
              {t('bentogrid.emptyDescription')}
            </p>
            <button type="button" className="tap-btn" onClick={openBuscador} style={styles.emptyActionPrimary}>
              {t('bentogrid.registerFirstStop')}
            </button>
          </Motion.div>
        )}

        {hasNoSearchResults && (
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={styles.emptyState}
            className="trip-empty"
          >
            <div style={styles.emptyIcon}>
              <Search size={28} />
            </div>
            <h3 style={styles.emptyTitle}>{t('bentogrid.noResultsTitle')}</h3>
            <p style={styles.emptyText}>
              {t('bentogrid.noResultsDescription')}
            </p>
            <button type="button" onClick={limpiarBusqueda} style={styles.emptyAction}>
              {t('bentogrid.clearFilter')}
            </button>
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default TripGrid;