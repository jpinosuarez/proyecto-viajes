// Diccionario simple para mapear Alpha-2 (Mapbox Search) a Alpha-3 (Mapbox Boundaries)
// y generar banderas. Se puede expandir.
export const getCountryISO3 = (code2) => {
  if (!code2) return null;
  const map = {
    'AR': 'ARG', 'ES': 'ESP', 'FR': 'FRA', 'IT': 'ITA', 'DE': 'DEU', 'US': 'USA', 
    'JP': 'JPN', 'CN': 'CHN', 'BR': 'BRA', 'MX': 'MEX', 'GB': 'GBR', 'CA': 'CAN',
    'AU': 'AUS', 'NZ': 'NZL', 'CL': 'CHL', 'CO': 'COL', 'PE': 'PER', 'UY': 'URY'
    // ... se pueden agregar más o usar una librería como 'country-iso-3-to-2' si crece mucho
  };
  return map[code2.toUpperCase()] || code2.toUpperCase(); // Fallback
};

export const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '🏳️';
  // Convierte código ISO (ej: 'US') a Flag Emoji
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};