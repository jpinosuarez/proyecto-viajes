import React, { useState, useRef } from 'react';
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS } from '../../theme';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

function MapaViajes({ paises, destino, paradas = [] }) {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({ longitude: 15, latitude: 30, zoom: 1.5 });

  // GeoJSON para Paradas (Todo plano para clustering)
  const paradasGeoJSON = {
    type: 'FeatureCollection',
    features: paradas.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: p.coordenadas },
      properties: { name: p.nombre, id: p.id }
    }))
  };

  const onClusterClick = (e) => {
    const feature = e.features[0];
    const clusterId = feature.properties.cluster_id;
    const mapboxSource = mapRef.current.getSource('paradas-source');

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;
      mapRef.current.easeTo({
        center: feature.geometry.coordinates,
        zoom: zoom,
        duration: 500
      });
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#F4EDE4' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        projection="globe" 
      >
        <Layer id="sky" type="sky" paint={{ 'sky-type': 'atmosphere', 'sky-atmosphere-sun': [0.0, 0.0], 'sky-atmosphere-sun-intensity': 5 }} />

        {/* Capa de Países Coloreados */}
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

        {/* Fuente con CLUSTERING activado */}
        <Source 
          id="paradas-source" 
          type="geojson" 
          data={paradasGeoJSON} 
          cluster={true} 
          clusterMaxZoom={14} 
          clusterRadius={50}
        >
          {/* Círculos de Cluster (Agrupados) */}
          <Layer
            id="clusters"
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': COLORS.charcoalBlue,
              'circle-radius': ['step', ['get', 'point_count'], 15, 10, 20, 30, 25],
              'circle-stroke-width': 2,
              'circle-stroke-color': 'white'
            }}
            onClick={onClusterClick}
          />

          {/* Número dentro del Cluster */}
          <Layer
            id="cluster-count"
            type="symbol"
            filter={['has', 'point_count']}
            layout={{
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12
            }}
            paint={{
              'text-color': '#ffffff'
            }}
          />

          {/* Puntos Individuales (Sin agrupar) */}
          <Layer
            id="unclustered-point"
            type="circle"
            filter={['!', ['has', 'point_count']]}
            paint={{
              'circle-color': COLORS.atomicTangerine,
              'circle-radius': 6,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff'
            }}
          />
        </Source>

        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" style={{ marginTop: '40px' }} />
      </Map>
    </div>
  );
}

export default MapaViajes;