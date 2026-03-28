import React from 'react';
import { useTranslation } from 'react-i18next';
import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS, RADIUS } from '@shared/config';
import { setMapLanguage } from '@shared/lib/geo';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const HomeMap = ({ paisesVisitados = [], isMobile = false }) => {
  const { i18n } = useTranslation('dashboard');

  // Asegurar que la lista no esté vacía para la expresión de Mapbox
  const listaPaises = paisesVisitados.length > 0 ? paisesVisitados : ['EMPTY_LIST'];

  return (
    <div style={{ width: '100%', minWidth: 0, height: '100%', position: 'relative', background: COLORS.background, borderRadius: RADIUS.xl, overflow: 'hidden', pointerEvents: 'none' }}>
      <Map
        style={{ width: '100%', minWidth: 0, height: '100%' }}
        initialViewState={{
          longitude: 0,
          latitude: isMobile ? 18 : 16,
          zoom: isMobile ? 0.45 : 0.72,
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        projection="mercator"
        reuseMaps
        interactive={false}
        renderWorldCopies={false}
        minZoom={0.35}
        maxBounds={[[-180, -70], [180, 85]]}
        boxZoom={false}
        keyboard={false}
        scrollZoom={false}
        dragPan={false}
        dragRotate={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        touchPitch={false}
        pitchWithRotate={false}
        onLoad={(e) => setMapLanguage(e.target, i18n.language)}
        attributionControl={false}
      >
        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          
          {/* Capa de Relleno: Solo pinta si el ISO3 está en la lista */}
          <Layer
            id="country-fills"
            type="fill"
            source-layer="country_boundaries"
            paint={{
              'fill-color': COLORS.atomicTangerine,
              'fill-opacity': [
                'match',
                ['get', 'iso_3166_1_alpha_3'], // Campo del vector tile
                listaPaises,                   // Lista de mis países
                0.8,                           // Opacidad si coincide
                0                              // Opacidad si no coincide
              ]
            }}
          />

          {/* Fronteras */}
          <Layer
            id="borders"
            type="line"
            source-layer="country_boundaries"
            paint={{
              'line-color': '#cbd5e1',
              'line-width': 0.5,
              'line-opacity': 0.6
            }}
          />
        </Source>
      </Map>
    </div>
  );
};

export default HomeMap;