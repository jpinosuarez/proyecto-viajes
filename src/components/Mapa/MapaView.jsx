import React, { useState } from 'react';
import Map, { Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS } from '../../theme';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianBpbm9zdWFyZXoiLCJhIjoiY21rdWJ1MnU0MXN4YzNlczk5OG91MG1naSJ9.HCnFsirOlTkQsWSDIFeGfw';

function MapaViajes({ paises, setPaises, destino }) {
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
      setModalInfo({ name: feature.properties.name, code: code, yaVisitado: yaVisitado });
    }
  };

  const confirmarAccion = () => {
    // Crear el nuevo array de paises
    let nuevosPaises;
    if (modalInfo.yaVisitado) {
      nuevosPaises = paises.filter(c => c !== modalInfo.code);
    } else {
      nuevosPaises = [...paises, modalInfo.code];
    }
    
    // Llamar a la función del padre (App.jsx) que maneja la lógica y el editor
    setPaises(nuevosPaises);
    setModalInfo(null);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '24px', overflow: 'hidden' }}>
      <Map
        initialViewState={{ longitude: 13.40, latitude: 52.52, zoom: 2 }}
        {...(destino || {})} // Si hay un destino (flyTo), lo usamos
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
              'fill-color': COLORS.mutedTeal,
              'fill-opacity': ['match', ['get', 'iso_3166_1_alpha_3'], paises.length > 0 ? paises : [''], 0.7, 0]
            }}
          />
        </Source>
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" style={{ marginTop: '40px' }} />

        {hoverInfo && (
          <div style={{ position: 'absolute', left: hoverInfo.x + 15, top: hoverInfo.y + 15, backgroundColor: COLORS.charcoalBlue, color: COLORS.linen, padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', pointerEvents: 'none', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {hoverInfo.name}
          </div>
        )}

        {modalInfo && (
          <div style={modalOverlayStyle}>
            <div style={{...modalContentStyle, backgroundColor: COLORS.linen}}>
              <h3 style={{ color: COLORS.charcoalBlue, marginTop: 0, fontWeight: '800' }}>
                {modalInfo.yaVisitado ? 'Quitar país' : '¿Nuevo destino?'}
              </h3>
              <p style={{ color: COLORS.charcoalBlue, opacity: 0.8, fontSize: '0.95rem' }}>
                {modalInfo.yaVisitado ? `¿Eliminar ${modalInfo.name} de tu bitácora?` : `¿Marcar ${modalInfo.name} como visitado?`}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                <button onClick={() => setModalInfo(null)} style={btnSecundario}>Cancelar</button>
                <button onClick={confirmarAccion} style={{ ...btnPrincipal, backgroundColor: modalInfo.yaVisitado ? '#e54b4b' : COLORS.atomicTangerine }}>
                  {modalInfo.yaVisitado ? 'Eliminar' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Map>
    </div>
  );
}

const modalOverlayStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(44, 62, 80, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 };
const modalContentStyle = { padding: '32px', borderRadius: '24px', width: '320px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' };
const btnPrincipal = { color: 'white', border: 'none', padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', transition: 'transform 0.1s ease' };
const btnSecundario = { backgroundColor: '#e2e8f0', color: '#475569', border: 'none', padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' };

export default MapaViajes;