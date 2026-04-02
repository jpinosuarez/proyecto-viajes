import React from 'react';
import ContextCard from '../ContextCard';

const VisorDestinoLayout = ({ isMobile, styles, paradas, sections, MapRoutePreview }) => {
  return (
    <div style={styles.destinoBody(isMobile)}>
      {sections.context}

      {paradas.length === 1 && (
        <div style={{ marginBottom: '24px' }}>
          <ContextCard icon="📍" label="Ubicacion" style={{ gridColumn: 'span 2' }}>
            {MapRoutePreview ? <MapRoutePreview paradas={paradas} /> : null}
          </ContextCard>
        </div>
      )}

      {sections.bitacora}
      {sections.gallery}
    </div>
  );
};

export default VisorDestinoLayout;
