import React, { useState, useEffect, useRef } from 'react';
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS } from '../../theme';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

function MapaViajes({ paises, setPaises, destino, paradas = [] }) {
  const mapRef = useRef(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 10, latitude: 45, zoom: 1.5
  });

  // Animación Fly-to Cinemática cuando cambia el destino
  useEffect(() => {
    if (destino && mapRef.current) {
      mapRef.current.flyTo({
        center: [destino.longitude, destino.latitude],
        zoom: destino.zoom || 5,
        duration: 3500, // Vuelo lento y suave
        essential: true,
        pitch: 40, // Inclinación para efecto 3D
        bearing: 0
      });
    }
  }, [destino]);

  // Construcción GeoJSON para Líneas de Ruta (Conectando puntos del mismo viaje)
  const rutasGeoJSON = {
    type: 'FeatureCollection',
    features: []
  };

  // Agrupar paradas por viaje para trazar líneas
  const paradasPorViaje = paradas.reduce((acc, p) => {
    if (!acc[p.viajeId]) acc[p.viajeId] = [];
    acc[p.viajeId].push(p);
    return acc;
  }, {});

  Object.values(paradasPorViaje).forEach(grupo => {
    if (grupo.length > 1) {
      // Ordenar por fecha (si existiera hora seria mejor, usamos index de creación aprox)
      rutasGeoJSON.features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: grupo.map(p => p.coordenadas)
        }
      });
    }
  });

  // GeoJSON de Puntos (Ciudades)
  const paradasGeoJSON = {
    type: 'FeatureCollection',
    features: paradas.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: p.coordenadas },
      properties: { name: p.nombre, clima: p.clima?.desc }
    }))
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '24px', overflow: 'hidden' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11" // Estilo limpio
        mapboxAccessToken={MAPBOX_TOKEN}
        onMouseMove={e => {
          const feature = e.features && e.features[0];
          setHoverInfo(feature ? { name: feature.properties.name, x: e.point.x, y: e.point.y } : null);
        }}
        interactiveLayerIds={['country-fills', 'paradas-points']}
      >
        {/* CAPA 1: Países Pintados (Polígonos) */}
        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer
            id="country-fills"
            type="fill"
            source-layer="country_boundaries"
            paint={{
              'fill-color': COLORS.mutedTeal,
              'fill-opacity': ['match', ['get', 'iso_3166_1_alpha_3'], paises.length > 0 ? paises : [''], 0.5, 0] // Opacidad reducida para elegancia
            }}
          />
        </Source>

        {/* CAPA 2: Rutas de Viaje (Líneas Discontinuas) */}
        <Source id="rutas" type="geojson" data={rutasGeoJSON}>
          <Layer
            id="rutas-line"
            type="line"
            paint={{
              'line-color': COLORS.atomicTangerine,
              'line-width': 2,
              'line-dasharray': [2, 4], // Efecto punteado
              'line-opacity': 0.7
            }}
          />
        </Source>

        {/* CAPA 3: Paradas (Puntos de Luz) */}
        <Source id="paradas" type="geojson" data={paradasGeoJSON}>
          <Layer
            id="paradas-points"
            type="circle"
            paint={{
              'circle-radius': 6,
              'circle-color': COLORS.charcoalBlue,
              'circle-stroke-width': 2,
              'circle-stroke-color': 'white',
              'circle-opacity': 0.9
            }}
          />
        </Source>

        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" style={{ marginTop: '40px' }} />

        {hoverInfo && (
          <div style={{ 
            position: 'absolute', left: hoverInfo.x + 15, top: hoverInfo.y + 15,
            backgroundColor: 'rgba(23, 23, 23, 0.9)', color: 'white',
            padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600',
            pointerEvents: 'none', zIndex: 10, backdropFilter: 'blur(4px)'
          }}>
            {hoverInfo.name}
          </div>
        )}
      </Map>
    </div>
  );
}

export default MapaViajes;