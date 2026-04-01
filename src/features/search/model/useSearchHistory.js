import { useMemo } from 'react';
import { getLocalizedCountryName } from '@shared/lib/utils/countryI18n';

/**
 * Fuzzy search algorithm: Simple substring match with scoring.
 * Returns matched trips sorted by relevance.
 */
function fuzzySearch(trips, query, language, t) {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return trips
    .map((trip) => {
      const titulo = trip.titulo?.toLowerCase() || '';
      const countryCode = trip.paisCodigo || trip.code || trip.countryCode;
      const localizedCountry = getLocalizedCountryName(countryCode, language, t);
      const country = (localizedCountry || trip.nombreEspanol || '').toLowerCase();
      
      // Score: exact match > prefix match > substring match
      let score = 0;
      
      if (titulo === lowerQuery) score = 1000;
      else if (titulo.startsWith(lowerQuery)) score = 500;
      else if (titulo.includes(lowerQuery)) score = 100;
      
      if (country === lowerQuery) score = Math.max(score, 800);
      else if (country.startsWith(lowerQuery)) score = Math.max(score, 300);
      else if (country.includes(lowerQuery)) score = Math.max(score, 50);
      
      return { trip, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ trip }) => trip);
}

/**
 * Hook to search user's existing trips locally.
 * Accepts a search query and returns filtered trips with scoring.
 */
export function useSearchHistory(allTrips = [], searchQuery = '', language = 'es', t) {
  const localResults = useMemo(() => {
    return fuzzySearch(allTrips, searchQuery, language, t);
  }, [allTrips, searchQuery, language, t]);

  return {
    localResults,
  };
}
