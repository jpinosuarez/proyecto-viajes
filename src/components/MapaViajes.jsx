import React, { useState } from 'react';
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

function MapaViajes({ paises, setPaises }) {
  const [hoverInfo, setHoverInfo] = useState(null);
  const [modalInfo, setModalInfo] = useState(null);

  const onHover = (event) => {
    const { features, point: { x, y } } = event;
    const hoveredFeature = features && features[0];
    setHoverInfo(hoveredFeature ? { name: hoveredFeature.properties.name, x, y } : null);
  };

  const onMapClick = (event) => {
    const feature = event.features && event.features[0];
    if (feature) {
      const code = feature.properties.iso_3166_1_alpha_3;
      const yaVisitado = paises.includes(code);
      setModalInfo({
        name: feature.properties.name,
        code: code,
        yaVisitado: yaVisitado
      });
    }
  };

  const togglePais = () => {
    if (modalInfo.yaVisitado) {
      setPaises(paises.filter(c => c !== modalInfo.code));
    } else {
      setPaises([...paises, modalInfo.code]);
    }
    setModalInfo(null);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        initialViewState={{ longitude: 13.40, latitude: 52.52, zoom: 2 }}
        projection="mercator"
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMouseMove={onHover}
        onClick={onMapClick}
        interactiveLayerIds={['country-fills-data']}
      >
        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer
            id="country-fills-data"
            type="fill"
            source-layer="country_boundaries"
            paint={{
              'fill-color': '#3b82f6',
              'fill-opacity': [
                'match',
                ['get', 'iso_3166_1_alpha_3'],
                paises.length > 0 ? paises : [''], 
                0.5, 
                0    
              ]
            }}
          />
        </Source>

        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" style={{ marginTop: '40px' }} />

        {/* TOOLTIP DINÁMICO */}
        {hoverInfo && (
          <div style={{ position: 'absolute', left: hoverInfo.x + 15, top: hoverInfo.y + 15, backgroundColor: '#1e293b', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', pointerEvents: 'none', zIndex: 10 }}>
            {hoverInfo.name}
          </div>
        )}

        {/* MODAL PERSONALIZADO */}
        {modalInfo && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <h3 style={{ color: '#1e293b', marginTop: 0 }}>{modalInfo.yaVisitado ? '¿Quitar país?' : '¿País visitado?'}</h3>
              <p style={{ color: '#64748b' }}>
                {modalInfo.yaVisitado 
                  ? `¿Quieres eliminar ${modalInfo.name} de tu lista?` 
                  : `¿Quieres marcar ${modalInfo.name} en tu pasaporte?`}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button onClick={() => setModalInfo(null)} style={btnSecundario}>Cancelar</button>
                <button onClick={togglePais} style={{ ...btnPrincipal, backgroundColor: modalInfo.yaVisitado ? '#ef4444' : '#3b82f6' }}>
                  {modalInfo.yaVisitado ? 'Desmarcar' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Map>
    </div>
  );
}

const modalOverlayStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 };
const modalContentStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '16px', width: '300px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const btnPrincipal = { color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const btnSecundario = { backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' };

export default MapaViajes;