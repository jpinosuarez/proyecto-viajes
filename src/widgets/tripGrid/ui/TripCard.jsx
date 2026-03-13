import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Compass, Calendar, MapPin, Trash2 } from 'lucide-react';
import { tripStyles as styles } from './TripCard.styles';

/**
 * TripCard - Standard card for trips in the app.
 * Reusable across Dashboard's recents list and TripGrid masonry.
 */
const TripCard = ({ trip, onClick, onDelete, isMobile = false, variant = 'list' }) => {
  const flags = trip.banderas || trip.flags || (trip.flag ? [trip.flag] : []);
  const coverUrl = trip.foto || '';

  return (
    <Motion.div
      role="button"
      tabIndex={0}
      aria-label={trip.titulo || trip.nombreEspanol || 'Ver viaje'}
      style={styles.cardBase(isMobile, variant)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
    >
      <div style={styles.bgImage(coverUrl)} />
      
      <div style={styles.flagsRow}>
        {flags.length > 0 ? (
          flags.slice(0, 3).map((flag, idx) => (
            <img key={idx} src={flag} alt="Bandera" style={styles.flagImg} loading="lazy" />
          ))
        ) : (
          <Compass size={18} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
        )}
        
        {onDelete && (
          <button
            className="tap-icon"
            style={styles.actionBtn}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(trip.id);
            }}
            aria-label="Eliminar Viaje"
          >
            <Trash2 size={14} color="white" />
          </button>
        )}
      </div>

      <div style={styles.glassShelf}>
        <h4 style={styles.title}>{trip.titulo || trip.nombreEspanol || trip.nameSpanish}</h4>
        <div style={styles.metaRow}>
          {(trip.fechaInicio || trip.startDate) && (
            <span style={styles.metaItem}>
              <Calendar size={12} /> {trip.fechaInicio || trip.startDate}
            </span>
          )}
          {trip.ciudades && (
            <span style={styles.metaItem}>
              <MapPin size={12} /> {trip.ciudades.split(',')[0]}
            </span>
          )}
        </div>
      </div>
    </Motion.div>
  );
};

export default TripCard;
