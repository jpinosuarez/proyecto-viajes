import React from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS } from '../../theme';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

const HomeMap = ({ paisesVisitados = [] }) => {
  // Configuración para ver el mundo completo sin cortes
  const initialViewState = {
    longitude: 0,
    latitude: 20,
    zoom: 0.8, // Zoom alejado para ver todo
    bearing: 0,
    pitch: 0
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#F8FAFC' }}>
      <Map
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        projection="mercator" // Plano
        interactive={false}   // Sin zoom/scroll
        attributionControl={false}
        logoPosition="bottom-right"
      >
        {/* Capa base de Países (Gris muy suave o blanco) */}
        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          
          {/* 1. Relleno de países NO visitados (opcional, para dar cuerpo) */}
          <Layer
            id="country-background"
            type="fill"
            source-layer="country_boundaries"
            paint={{
              'fill-color': '#e2e8f0',
              'fill-opacity': 0.3
            }}
          />

          {/* 2. Relleno de Países Visitados (Color destacado) */}
          <Layer
            id="country-visited"
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

          {/* 3. Fronteras limpias */}
          <Layer
            id="borders"
            type="line"
            source-layer="country_boundaries"
            paint={{
              'line-color': '#ffffff',
              'line-width': 0.5,
              'line-opacity': 0.5
            }}
          />
          
          {/* TRUCO: Ocultar etiquetas de texto de Mapbox */}
          {/* Como usamos estilo 'light-v11', tiene etiquetas. 
              La forma más limpia en código es no agregar capas de símbolo, 
              pero como vienen del estilo base, lo ideal sería un estilo custom vacío.
              Para este MVP, aceptamos que 'light' trae nombres sutiles, 
              o usamos un estilo 'blank' si tuvieramos uno configurado. */}
        </Source>
      </Map>
      
      {/* Overlay transparente para prevenir interacciones */}
      <div style={{position:'absolute', inset:0, zIndex:10}} />
    </div>
  );
};

export default HomeMap;