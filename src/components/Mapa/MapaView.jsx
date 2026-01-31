import React, { useState, useEffect, useRef } from 'react';
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS } from '../../theme';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

// Función para crear curvas de Bézier entre dos puntos (Efecto Vuelo)
function getCurvedRoute(start, end) {
    const numPoints = 100;
    const coordinates = [];
    const generator = (i) => {
        const t = i / numPoints;
        // Interpolación lineal simple para lat/lng
        const lat = start[1] + (end[1] - start[1]) * t;
        // Para longitud, manejamos el cruce de meridiano 180 si fuera necesario, 
        // pero para visualización simple:
        const lng = start[0] + (end[0] - start[0]) * t;
        
        // Añadir "altura" visual curvando la latitud un poco hacia el norte/sur simulando arco
        // Esto es un hack visual 2D para simular la curvatura 3D
        const arcHeight = Math.sin(t * Math.PI) * 5; // 5 grados de arco
        
        return [lng, lat + arcHeight];
    };

    for (let i = 0; i <= numPoints; i++) {
        coordinates.push(generator(i));
    }
    return coordinates;
}

function MapaViajes({ paises, setPaises, destino, paradas = [] }) {
  const mapRef = useRef(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  
  // Centrado inicial mejorado para pantallas desktop y mobile
  const [viewState, setViewState] = useState({
    longitude: 15, latitude: 30, zoom: 1.5, pitch: 0, bearing: 0
  });

  useEffect(() => {
    if (destino && mapRef.current) {
      mapRef.current.flyTo({
        center: [destino.longitude, destino.latitude],
        zoom: destino.zoom || 4,
        duration: 3000,
        essential: true,
        pitch: 30,
      });
    }
  }, [destino]);

  // GeoJSON para Paradas (Puntos)
  const paradasGeoJSON = {
    type: 'FeatureCollection',
    features: paradas.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: p.coordenadas },
      properties: { name: p.nombre }
    }))
  };

  // GeoJSON para Rutas Curvas
  const rutasGeoJSON = { type: 'FeatureCollection', features: [] };
  
  // Agrupar por viaje
  const paradasPorViaje = paradas.reduce((acc, p) => {
    if (!acc[p.viajeId]) acc[p.viajeId] = [];
    acc[p.viajeId].push(p);
    return acc;
  }, {});

  Object.values(paradasPorViaje).forEach(grupo => {
    // Ordenar (asumiendo orden de creación o fecha, aquí simple array order)
    if (grupo.length > 1) {
        for (let i = 0; i < grupo.length - 1; i++) {
            const start = grupo[i].coordenadas;
            const end = grupo[i+1].coordenadas;
            rutasGeoJSON.features.push({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: getCurvedRoute(start, end) // Usamos la curva
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
        // CAMBIO: Estilo Minimalista Light (Mapbox standard)
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
        {/* Atmósfera más suave para estilo light */}
        <Layer id="sky" type="sky" paint={{ 'sky-type': 'atmosphere', 'sky-atmosphere-sun': [0.0, 0.0], 'sky-atmosphere-sun-intensity': 5 }} />

        {/* Capa de Países (Polígonos) */}
        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer
            id="country-fills"
            type="fill"
            source-layer="country_boundaries"
            paint={{
              'fill-color': COLORS.mutedTeal,
              'fill-opacity': ['match', ['get', 'iso_3166_1_alpha_3'], paises.length > 0 ? paises : [''], 0.6, 0]
            }}
          />
        </Source>

        {/* Capa de Rutas (Curvas) */}
        <Source id="rutas" type="geojson" data={rutasGeoJSON}>
          <Layer 
            id="rutas-line" 
            type="line" 
            paint={{ 
                'line-color': COLORS.atomicTangerine, 
                'line-width': 2, 
                'line-dasharray': [1, 1], // Punteado fino
                'line-opacity': 0.8
            }} 
          />
        </Source>

        {/* Capa de Paradas (Puntos) */}
        <Source id="paradas" type="geojson" data={paradasGeoJSON}>
          <Layer
            id="paradas-points"
            type="circle"
            paint={{
              'circle-radius': 5,
              'circle-color': COLORS.charcoalBlue,
              'circle-stroke-width': 2,
              'circle-stroke-color': 'white'
            }}
          />
        </Source>

        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" style={{ marginTop: '40px' }} />

        {hoverInfo && (
          <div style={{ 
            position: 'absolute', left: hoverInfo.x + 15, top: hoverInfo.y + 15,
            backgroundColor: 'white', color: COLORS.charcoalBlue,
            padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold',
            pointerEvents: 'none', zIndex: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            {hoverInfo.name}
          </div>
        )}
      </Map>
    </div>
  );
}

export default MapaViajes;