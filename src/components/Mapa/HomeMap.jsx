import React, { useState, useCallback } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS } from '../../theme';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const HomeMap = ({ paisesVisitados = [] }) => {
  const [hoverInfo, setHoverInfo] = useState(null);

  const onHover = useCallback(event => {
    const {
      features,
      point: { x, y }
    } = event;
    
    const hoveredFeature = features && features[0];
    
    setHoverInfo(
      hoveredFeature
        ? {
            feature: hoveredFeature,
            x,
            y
          }
        : null
    );
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#F8FAFC', borderRadius: '24px', overflow: 'hidden' }}>
      <Map
        initialViewState={{
          longitude: 0,
          latitude: 15,
          zoom: 0.6, // Zoom ajustado para ver el mundo completo
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        projection="mercator"
        
        // Desactivar navegación para que sea fijo/estático
        scrollZoom={false}
        boxZoom={false}
        dragRotate={false}
        dragPan={false}
        keyboard={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        
        // Habilitar hover
        onMouseMove={onHover}
        interactiveLayerIds={['country-fills', 'world-fills']} // Detectar hover en países
        attributionControl={false}
      >
        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          
          {/* Capa Base Transparente (para detectar hover en países no visitados también) */}
          <Layer
            id="world-fills"
            type="fill"
            source-layer="country_boundaries"
            paint={{
              'fill-color': 'transparent'
            }}
          />

          {/* Países Visitados Coloreados */}
          <Layer
            id="country-fills"
            type="fill"
            source-layer="country_boundaries"
            paint={{
              'fill-color': COLORS.atomicTangerine,
              'fill-opacity': [
                'match',
                ['get', 'iso_3166_1_alpha_3'],
                paisesVisitados.length > 0 ? paisesVisitados : [''], 
                0.8, 
                0
              ]
            }}
          />

          {/* Fronteras Limpias */}
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

        {/* Tooltip Personalizado */}
        {hoverInfo && (
          <div style={{
            position: 'absolute',
            zIndex: 10,
            pointerEvents: 'none',
            left: hoverInfo.x,
            top: hoverInfo.y,
            transform: 'translate(-50%, -120%)', // Centrado arriba del mouse
            background: 'rgba(30, 41, 59, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {/* Intentamos mostrar nombre en español si está disponible en las propiedades, o el nombre local */}
            {hoverInfo.feature.properties.name_es || hoverInfo.feature.properties.name_en || "País"}
          </div>
        )}
      </Map>
    </div>
  );
};

export default HomeMap;