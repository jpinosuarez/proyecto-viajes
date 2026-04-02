import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { COLORS, RADIUS } from '@shared/config';
import { setMapLanguage } from '@shared/lib/geo';

const WORLD_BOUNDS = [[-170, -56], [170, 72]];
const MAP_OCEAN_COLOR = '#e0e6ed';
const MIN_WORLD_ZOOM = -4;
const WORLD_VERTICAL_PADDING = 6;
const WORLD_TARGET_ASPECT = 0.82;

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const HomeMap = ({ paisesVisitados = [], isMobile = false }) => {
  const { i18n, t } = useTranslation('dashboard');
  const [hoverInfo, setHoverInfo] = useState(null);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const onHover = useCallback(event => {
    const { features, lngLat } = event;
    const hoveredFeature = features && features[0];
    setHoverInfo(hoveredFeature ? {
      feature: hoveredFeature,
      longitude: lngLat.lng,
      latitude: lngLat.lat
    } : null);
  }, []);

  const fitWorld = useCallback(map => {
    const container = map.getContainer();
    const width = container?.clientWidth || 0;
    const height = container?.clientHeight || 0;
    const targetInnerWidth = Math.min(width, Math.max(height * WORLD_TARGET_ASPECT, 1));
    const sidePadding = Math.max((width - targetInnerWidth) / 2, 0);

    map.fitBounds(WORLD_BOUNDS, {
      padding: {
        top: WORLD_VERTICAL_PADDING,
        right: sidePadding,
        bottom: WORLD_VERTICAL_PADDING,
        left: sidePadding,
      },
      duration: 0,
    });
  }, []);

  const handleMapLoad = useCallback(e => {
    const map = e.target;
    mapRef.current = map;
    map.setMinZoom(MIN_WORLD_ZOOM);
    setMapLanguage(map, i18n.language);

    // Keep the full Mercator world fully framed inside the available viewport.
    try {
      fitWorld(map);
    } catch (error) {
      console.error('fitBounds failed:', error);
      // Fallback to initialViewState if fitBounds fails
    }
  }, [fitWorld, i18n.language]);

  const handleMapResize = useCallback(e => {
    try {
      fitWorld(e.target);
    } catch (error) {
      console.error('fitBounds on resize failed:', error);
    }
  }, [fitWorld]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !mapContainerRef.current) return undefined;

    const observer = new ResizeObserver(() => {
      const map = mapRef.current;
      if (!map) return;

      map.resize();
      fitWorld(map);
    });

    observer.observe(mapContainerRef.current);

    return () => observer.disconnect();
  }, [fitWorld]);

  const listaPaises = paisesVisitados.length > 0 ? paisesVisitados : ['EMPTY_LIST'];
  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        minWidth: 0,
        height: '100%',
        minHeight: 0,
        position: 'relative',
        backgroundColor: MAP_OCEAN_COLOR,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}
    >
      <Map
        style={{ width: '100%', minWidth: 0, height: '100%', minHeight: 0 }}
        initialViewState={{ longitude: 0, latitude: 15, zoom: 1.5 }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        projection="mercator"
        reuseMaps
        preventStyleDiffing={true}
        interactive={true}
        renderWorldCopies={false}
        minZoom={MIN_WORLD_ZOOM}
        maxZoom={3}
        boxZoom={false}
        keyboard={false}
        scrollZoom={false}
        dragPan={false}
        dragRotate={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        touchPitch={false}
        pitchWithRotate={false}
        onLoad={handleMapLoad}
        onResize={handleMapResize}
        onMouseMove={onHover}
        interactiveLayerIds={['country-fills']}
        attributionControl={false}>
        <Source id="world" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer id="country-fills" type="fill" source-layer="country_boundaries" paint={{ 'fill-color': COLORS.atomicTangerine, 'fill-opacity': ['match', ['get', 'iso_3166_1_alpha_3'], listaPaises, 0.8, 0] }} />
          <Layer id="borders" type="line" source-layer="country_boundaries" paint={{ 'line-color': '#cbd5e1', 'line-width': 0.5, 'line-opacity': 0.6 }} />      
        </Source>
        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="top"
            offset={[0, -10]}
          >
            <div>
              {hoverInfo.feature.properties[`name_${i18n.language}`] || hoverInfo.feature.properties.name_en || t('countryFallback')}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default HomeMap;
