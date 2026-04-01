import i18n from '../../../i18n';
import { normalizeCountryCode } from './countryUtils';

/**
 * Returns a localized country name from i18n namespace "countries".
 * Accepts alpha-2 or alpha-3 ISO codes and normalizes to alpha-2.
 *
 * @param {string} code - ISO 3166-1 alpha-2/alpha-3 country code (e.g. "AR" or "ARG")
 * @param {string} lang - Language code ('es' | 'en')
 * @param {(key: string, options?: object) => string} [t] - Optional translation function
 * @returns {string} Localized country name, or empty string if code is invalid
 */
export const getLocalizedCountryName = (code, lang = 'es', t) => {
  const normalizedCode = normalizeCountryCode(code);
  if (!normalizedCode) return '';

  const key = normalizedCode.toUpperCase();

  if (typeof t === 'function') {
    return t(`countries:${key}`, { defaultValue: key });
  }

  const translated = i18n.t(`countries:${key}`, {
    lng: lang,
    defaultValue: key,
  });

  return translated || key;
};

export const getCountryNameKey = (code) => {
  const normalizedCode = normalizeCountryCode(code);
  return normalizedCode ? `countries:${normalizedCode}` : '';
};
