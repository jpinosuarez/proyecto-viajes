import React from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS } from '../../theme';

// Token de Mapbox
const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

function MapaViajes({ paises = [] }) {
  // Configuración de vista inicial centrada para mostrar bien el mapa Mercator
  const viewState = {
    longitude: 10,
    latitude: 20,
    zoom: 1.1, // Zoom ajustado para ver todo el mundo sin scroll
    bearing: 0,
    pitch: 0
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative', 
      borderRadius: '24px', 
      overflow: 'hidden', 
      backgroundColor: '#F8FAFC' // Color de fondo del océano (match con la app)
    }}>
      <Map
        initialViewState={viewState}
        // Estilo 'light' optimizado para visualización de datos limpia
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        projection="mercator" // Proyección plana solicitada
        interactive={false}   // Desactiva zoom y paneo (mapa estático)
        attributionControl={false} // Limpia el footer del mapa
        reuseMaps
      >
        {/* Fuente de datos: Polígonos de países */}
        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          
          {/* Capa 1: Relleno de países visitados */}
          <Layer
            id="country-fills"
            type="fill"
            source-layer="country_boundaries"
            paint={{
              'fill-color': COLORS.atomicTangerine, // Color de la marca
              'fill-opacity': [
                'match',
                ['get', 'iso_3166_1_alpha_3'], // Mapbox usa códigos de 3 letras (ej: ARG)
                paises.length > 0 ? paises : [''], // Lista de países visitados
                0.7, // Opacidad si es visitado
                0    // Opacidad 0 (invisible) si no es visitado
              ]
            }}
          />

          {/* Capa 2: Bordes sutiles para todo el mundo (da contexto) */}
          <Layer
            id="country-borders"
            type="line"
            source-layer="country_boundaries"
            paint={{
              'line-color': '#cbd5e1', // Gris suave
              'line-width': 0.5,
              'line-opacity': 0.5
            }}
          />
        </Source>
      </Map>
      
      {/* Overlay opcional para evitar clicks fantasma si queda algo interactivo */}
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} />
    </div>
  );
}

export default MapaViajes;