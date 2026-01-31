import React, { useState, useEffect, useRef } from 'react';
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS } from '../../theme';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

// Curva Bézier Cuadrática (Más directa y limpia)
function getCurvedRoute(start, end) {
    const numPoints = 60;
    const coordinates = [];
    
    // Punto de control para la curva (ligeramente desplazado del punto medio)
    const midLat = (start[1] + end[1]) / 2;
    const midLng = (start[0] + end[0]) / 2;
    // Offset basado en la distancia para dar arco
    const dist = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
    const arcHeight = dist * 0.2; // Arco suave (20% de la distancia)
    
    // Simplificación: Curvamos hacia el norte si estamos en hemisferio norte
    const controlPoint = [midLng, midLat + arcHeight];

    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        // Fórmula Bézier Cuadrática: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const lat = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * controlPoint[1] + t * t * end[1];
        const lng = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * controlPoint[0] + t * t * end[0];
        coordinates.push([lng, lat]);
    }
    return coordinates;
}

function MapaViajes({ paises, setPaises, destino, paradas = [] }) {
  const mapRef = useRef(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [viewState, setViewState] = useState({ longitude: 15, latitude: 30, zoom: 1.5 });

  useEffect(() => {
    if (destino && mapRef.current) {
      mapRef.current.flyTo({
        center: [destino.longitude, destino.latitude],
        zoom: destino.zoom || 4,
        duration: 2500,
        essential: true,
        pitch: 0, // Vista plana (más limpia tipo papel)
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

  const rutasGeoJSON = { type: 'FeatureCollection', features: [] };
  
  const paradasPorViaje = paradas.reduce((acc, p) => {
    if (!acc[p.viajeId]) acc[p.viajeId] = [];
    acc[p.viajeId].push(p);
    return acc;
  }, {});

  Object.values(paradasPorViaje).forEach(grupo => {
    if (grupo.length > 1) {
        for (let i = 0; i < grupo.length - 1; i++) {
            rutasGeoJSON.features.push({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: getCurvedRoute(grupo[i].coordenadas, grupo[i+1].coordenadas)
                }
            });
        }
    }
  });

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#F4EDE4' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        projection="globe" 
        onMouseMove={e => {
            if (window.innerWidth > 768) {
                const feature = e.features && e.features[0];
                setHoverInfo(feature ? { name: feature.properties.name, x: e.point.x, y: e.point.y } : null);
            }
        }}
        interactiveLayerIds={['country-fills', 'paradas-points']}
      >
        <Layer id="sky" type="sky" paint={{ 'sky-type': 'atmosphere', 'sky-atmosphere-sun': [0.0, 0.0], 'sky-atmosphere-sun-intensity': 5 }} />

        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer
            id="country-fills"
            type="fill"
            source-layer="country_boundaries"
            paint={{
              'fill-color': COLORS.mutedTeal,
              'fill-opacity': ['match', ['get', 'iso_3166_1_alpha_3'], paises.length > 0 ? paises : [''], 0.5, 0]
            }}
          />
        </Source>

        <Source id="rutas" type="geojson" data={rutasGeoJSON}>
          <Layer 
            id="rutas-line" 
            type="line" 
            paint={{ 
                'line-color': COLORS.charcoalBlue, 
                'line-width': 1.5, 
                'line-dasharray': [2, 1], // Punteado muy fino y elegante
                'line-opacity': 0.6
            }} 
          />
        </Source>

        <Source id="paradas" type="geojson" data={paradasGeoJSON}>
          <Layer
            id="paradas-points"
            type="circle"
            paint={{
              'circle-radius': 4,
              'circle-color': 'white',
              'circle-stroke-width': 2,
              'circle-stroke-color': COLORS.atomicTangerine
            }}
          />
        </Source>

        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" style={{ marginTop: '40px' }} />

        {hoverInfo && (
          <div style={{ 
            position: 'absolute', left: hoverInfo.x + 15, top: hoverInfo.y + 15,
            backgroundColor: 'white', color: COLORS.charcoalBlue,
            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
            pointerEvents: 'none', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {hoverInfo.name}
          </div>
        )}
      </Map>
    </div>
  );
}

export default MapaViajes;