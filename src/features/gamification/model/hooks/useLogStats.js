import { useMemo } from 'react';
import { calculateTripDays } from '@shared/lib/utils/viajeUtils';

const EMPTY_TRIPS = [];
const EMPTY_TRIP_DATA = {};

const getTripStops = (trip, tripDetails) => {
  if (Array.isArray(tripDetails?.paradas)) return tripDetails.paradas;
  if (Array.isArray(trip?.paradas)) return trip.paradas;
  if (tripDetails?.paradas && typeof tripDetails.paradas === 'object') return Object.values(tripDetails.paradas);
  if (trip?.paradas && typeof trip.paradas === 'object') return Object.values(trip.paradas);
  return [];
};

export const useLogStats = (trips = [], tripData = {}) => {
  const safeTrips = Array.isArray(trips) ? trips : EMPTY_TRIPS;
  const safeTripData = tripData && typeof tripData === 'object' ? tripData : EMPTY_TRIP_DATA;

  return useMemo(() => {
    if (safeTrips.length === 0) {
      return {
        worldExploredPercentage: '0.0',
        uniqueCountries: 0,
        completedTrips: 0,
        totalDays: 0,
        totalStops: 0,
      };
    }

    let totalDays = 0;
    let totalStops = 0;
    const countryCodes = new Set();

    safeTrips.forEach((trip) => {
      const tripDetails = safeTripData[trip.id];
      const stops = getTripStops(trip, tripDetails);
      const stopsCount = Number(trip.totalParadas || tripDetails?.totalParadas || (Array.isArray(stops) ? stops.length : 0) || 0);
      const startDate = tripDetails?.fechaInicio || tripDetails?.startDate || trip.fechaInicio || trip.startDate;
      const endDate = tripDetails?.fechaFin || tripDetails?.endDate || trip.fechaFin || trip.endDate;

      totalDays += calculateTripDays(startDate, endDate);

      totalStops += stopsCount;

      stops.forEach((stop) => {
        const stopCountryCode = stop?.paisCodigo || stop?.countryCode || stop?.code;
        if (stopCountryCode) countryCodes.add(stopCountryCode);
      });

      const tripCountryCode = tripDetails?.paisCodigo || tripDetails?.countryCode || tripDetails?.code || trip?.paisCodigo || trip?.countryCode || trip?.code;
      if (tripCountryCode) countryCodes.add(tripCountryCode);
    });

    const uniqueCountries = countryCodes.size;
    const worldExploredPercentage = ((uniqueCountries / 195) * 100).toFixed(1);

    return {
      worldExploredPercentage,
      uniqueCountries,
      completedTrips: safeTrips.length,
      totalDays,
      totalStops,
    };
  }, [safeTrips, safeTripData]);
};

export default useLogStats;