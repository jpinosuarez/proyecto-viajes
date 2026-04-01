/**
 * Sets the language of Mapbox GL JS label layers to match the app locale.
 * Works with Mapbox styles that have `name_XX` properties (e.g. light-v11).
 *
 * @param {import('mapbox-gl').Map} map - Mapbox GL map instance
 * @param {string} lang - Language code ('es' | 'en')
 */
const MAPBOX_SUPPORTED_LANGS = new Set(['en', 'es']);

function resolveMapInstance(map) {
  if (!map) return null;
  return typeof map.getMap === 'function' ? map.getMap() : map;
}

/**
 * Normalizes any locale-like input to a Mapbox-compatible base language.
 * Examples: es-AR -> es, EN_us -> en, null -> en.
 *
 * @param {string} lang
 * @returns {'en' | 'es'}
 */
export function normalizeMapboxLanguage(lang) {
  if (typeof lang !== 'string' || !lang.trim()) return 'en';

  const baseLang = lang
    .replace('_', '-')
    .split('-')[0]
    .trim()
    .toLowerCase();

  if (MAPBOX_SUPPORTED_LANGS.has(baseLang)) {
    return baseLang;
  }

  return 'en';
}

export function setMapLanguage(map, lang) {
  if (!map) return;
  const mapInstance = resolveMapInstance(map);
  if (!mapInstance) return;
  const normalizedLang = normalizeMapboxLanguage(lang);
  const field = `name_${normalizedLang}`;
  const style = mapInstance.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    if (layer.type !== 'symbol') continue;
    const textField = layer.layout?.['text-field'];
    if (!textField) continue;
    // Only change layers that reference a name* property
    const serialized = JSON.stringify(textField);
    if (serialized.includes('name')) {
      mapInstance.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', field], ['get', 'name']]);
    }
  }
}

export function isMapStyleLoaded(map) {
  const mapInstance = resolveMapInstance(map);
  if (!mapInstance || typeof mapInstance.isStyleLoaded !== 'function') return false;
  return mapInstance.isStyleLoaded();
}
