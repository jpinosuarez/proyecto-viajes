import React, { useRef, useState } from 'react';
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS } from '../../theme';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

function MapaView({ paises, paradas = [] }) {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({ longitude: 20, latitude: 20, zoom: 1.5 });

  // GeoJSON para Clustering
  const paradasGeoJSON = {
    type: 'FeatureCollection',
    features: paradas.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: p.coordenadas },
      properties: { 
        id: p.id, 
        name: p.nombre,
        viajeId: p.viajeId // Para linkear si quisiéramos
      }
    }))
  };

  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', background: '#0F172A' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        projection="globe" 
        reuseMaps
      >
        {/* Atmósfera */}
        <Layer 
            id="sky" type="sky" 
            paint={{ 
                'sky-type': 'atmosphere', 
                'sky-atmosphere-sun': [0.0, 0.0], 
                'sky-atmosphere-sun-intensity': 15 
            }} 
        />

        {/* Países Coloreados */}
        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer
            id="country-fills"
            type="fill"
            source-layer="country_boundaries"
            paint={{
              'fill-color': COLORS.atomicTangerine,
              'fill-opacity': ['match', ['get', 'iso_3166_1_alpha_3'], paises.length > 0 ? paises : [''], 0.6, 0]
            }}
          />
        </Source>

        {/* CLUSTERING DE CIUDADES */}
        <Source 
            id="paradas" 
            type="geojson" 
            data={paradasGeoJSON} 
            cluster={true} 
            clusterMaxZoom={14} 
            clusterRadius={50}
        >
            {/* Círculos Agrupados */}
            <Layer
                id="clusters"
                type="circle"
                filter={['has', 'point_count']}
                paint={{
                    'circle-color': COLORS.mutedTeal,
                    'circle-radius': ['step', ['get', 'point_count'], 15, 5, 20, 10, 30],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff'
                }}
            />
            {/* Contador */}
            <Layer
                id="cluster-count"
                type="symbol"
                filter={['has', 'point_count']}
                layout={{
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                }}
                paint={{ 'text-color': '#ffffff' }}
            />
            {/* Puntos Individuales */}
            <Layer
                id="unclustered-point"
                type="circle"
                filter={['!', ['has', 'point_count']]}
                paint={{
                    'circle-color': COLORS.linen,
                    'circle-radius': 6,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': COLORS.charcoalBlue
                }}
            />
        </Source>

        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}

export default MapaView;