import React, { useEffect, useRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS } from '../../theme';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const MiniMapaRuta = ({ paradas }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (paradas.length > 0 && mapRef.current) {
      // Calcular Bounding Box para centrar el mapa
      const bounds = new mapboxgl.LngLatBounds();
      paradas.forEach(p => bounds.extend(p.coordenadas));
      
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000
      });
    }
  }, [paradas]);

  const paradasGeoJSON = {
    type: 'FeatureCollection',
    features: paradas.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: p.coordenadas },
      properties: { name: p.nombre }
    }))
  };

  const rutaGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: paradas.map(p => p.coordenadas)
    }
  };

  return (
    <div style={{ width: '100%', height: '300px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 0, latitude: 0, zoom: 1 }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactive={false} // Estático, solo visualización
        attributionControl={false}
      >
        {/* Línea de Ruta Curva o Directa (Aquí directa para claridad en zoom alto) */}
        {paradas.length > 1 && (
          <Source id="ruta" type="geojson" data={rutaGeoJSON}>
            <Layer
              id="ruta-line"
              type="line"
              paint={{
                'line-color': COLORS.atomicTangerine,
                'line-width': 3,
                'line-dasharray': [2, 1],
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}

        {/* Pines */}
        <Source id="puntos" type="geojson" data={paradasGeoJSON}>
          <Layer
            id="puntos-circle"
            type="circle"
            paint={{
              'circle-radius': 6,
              'circle-color': COLORS.charcoalBlue,
              'circle-stroke-width': 2,
              'circle-stroke-color': 'white'
            }}
          />
        </Source>
      </Map>
    </div>
  );
};

export default MiniMapaRuta;