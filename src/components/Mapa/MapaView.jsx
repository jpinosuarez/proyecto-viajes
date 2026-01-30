import React, { useState, useEffect, useRef } from 'react';
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS } from '../../theme';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

function MapaViajes({ paises, setPaises, destino, paradas = [] }) {
  const mapRef = useRef(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  // AJUSTE: Zoom inicial más lejano y centro en el Atlántico para ver América y Europa/África
  const [viewState, setViewState] = useState({
    longitude: -20, 
    latitude: 20, 
    zoom: 1.2, 
    pitch: 0, 
    bearing: 0
  });

  useEffect(() => {
    if (destino && mapRef.current) {
      mapRef.current.flyTo({
        center: [destino.longitude, destino.latitude],
        zoom: destino.zoom || 5,
        duration: 3500,
        essential: true,
        pitch: 45,
      });
    }
  }, [destino]);

  const paradasGeoJSON = {
    type: 'FeatureCollection',
    features: paradas.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: p.coordenadas },
      properties: { name: p.nombre }
    }))
  };

  // Rutas (Líneas)
  const rutasGeoJSON = { type: 'FeatureCollection', features: [] };
  const paradasPorViaje = paradas.reduce((acc, p) => {
    if (!acc[p.viajeId]) acc[p.viajeId] = [];
    acc[p.viajeId].push(p);
    return acc;
  }, {});
  Object.values(paradasPorViaje).forEach(grupo => {
    if (grupo.length > 1) {
      rutasGeoJSON.features.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: grupo.map(p => p.coordenadas) }
      });
    }
  });

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12" // Cambio a Satélite híbrido para más "wow" en globo
        mapboxAccessToken={MAPBOX_TOKEN}
        projection="globe" 
        onMouseMove={e => {
            const feature = e.features && e.features[0];
            setHoverInfo(feature ? { name: feature.properties.name, x: e.point.x, y: e.point.y } : null);
        }}
        interactiveLayerIds={['country-fills', 'paradas-points']}
      >
        <Layer id="sky" type="sky" paint={{ 'sky-type': 'atmosphere', 'sky-atmosphere-sun': [0.0, 0.0], 'sky-atmosphere-sun-intensity': 15 }} />

        {/* Polígonos Países */}
        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer
            id="country-fills"
            type="fill"
            source-layer="country_boundaries"
            paint={{
              'fill-color': COLORS.atomicTangerine, // Color más vibrante sobre satélite
              'fill-opacity': ['match', ['get', 'iso_3166_1_alpha_3'], paises.length > 0 ? paises : [''], 0.4, 0]
            }}
          />
        </Source>

        {/* Rutas */}
        <Source id="rutas" type="geojson" data={rutasGeoJSON}>
          <Layer id="rutas-line" type="line" paint={{ 'line-color': 'rgba(255,255,255,0.6)', 'line-width': 1.5, 'line-dasharray': [2, 2] }} />
        </Source>

        {/* Paradas */}
        <Source id="paradas" type="geojson" data={paradasGeoJSON}>
          <Layer
            id="paradas-points"
            type="circle"
            paint={{
              'circle-radius': 6,
              'circle-color': COLORS.linen,
              'circle-stroke-width': 2,
              'circle-stroke-color': COLORS.charcoalBlue
            }}
          />
        </Source>

        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" style={{ marginTop: '40px' }} />

        {hoverInfo && (
          <div style={{ 
            position: 'absolute', left: hoverInfo.x + 15, top: hoverInfo.y + 15,
            backgroundColor: 'rgba(0,0,0,0.8)', color: 'white',
            padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', pointerEvents: 'none', zIndex: 10
          }}>
            {hoverInfo.name}
          </div>
        )}
      </Map>
    </div>
  );
}

export default MapaViajes;