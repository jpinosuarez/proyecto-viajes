import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { COLORS } from '@shared/config';
import CityManager from '@shared/ui/components/CityManager';

const EdicionParadasSection = ({ styles, t, paradas, setParadas, fechaRangoDisplay, sinParadas }) => {
  return (
    <div style={styles.section}>
      <label style={styles.label}>
        <Calendar size={14} /> {t('labels.paradas')}
      </label>
      {fechaRangoDisplay && (
        <span style={{ fontSize: '0.82rem', color: COLORS.textSecondary, marginBottom: 6, display: 'block' }}>
          {`📅 ${fechaRangoDisplay}`}
        </span>
      )}
      <CityManager t={t} paradas={paradas} setParadas={setParadas} />
      {sinParadas && (
        <div
          style={{
            marginTop: 8,
            padding: '14px 16px',
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.surface,
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
          role="status"
          aria-live="polite"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.charcoalBlue, fontWeight: 700 }}>
            <MapPin size={14} color={COLORS.atomicTangerine} />
            {t('labels.emptyStopsTitle', 'Tu ruta esta vacia')}
          </div>
          <span style={{ fontSize: '0.86rem', color: COLORS.textSecondary, lineHeight: 1.4 }}>
            {t('labels.emptyStopsDescription', 'Agrega tu primer destino para continuar.')}
          </span>
        </div>
      )}
    </div>
  );
};

export default EdicionParadasSection;
