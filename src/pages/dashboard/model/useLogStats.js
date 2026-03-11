import { useMemo } from 'react';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const EMPTY_TRIPS = [];
const EMPTY_TRIP_DATA = {};

const getTripDuration = (tripDetails) => {
  if (!tripDetails?.startDate || !tripDetails?.endDate) {
    return 1;
  }

  const startDate = new Date(tripDetails.startDate);
  const endDate = new Date(tripDetails.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 1;
  }

  const diffInDays = Math.ceil((endDate - startDate) / DAY_IN_MS) + 1;
  return diffInDays > 0 ? diffInDays : 1;
};

const countTripCities = (tripDetails) => {
  if (!tripDetails?.cities) {
    return 0;
  }

  return tripDetails.cities
    .split(',')
    .map((city) => city.trim())
    .filter(Boolean)
    .length;
};

export const useLogStats = (trips = [], tripData = {}) => {
  const safeTrips = Array.isArray(trips) ? trips : EMPTY_TRIPS;
  const safeTripData = tripData && typeof tripData === 'object' ? tripData : EMPTY_TRIP_DATA;

  return useMemo(() => {
    if (safeTrips.length === 0) {
      return {
        tripCount: 0,
        totalDays: 0,
        totalCities: 0,
        averageRating: null,
      };
    }

    let totalDays = 0;
    let totalCities = 0;
    let ratingSum = 0;
    let ratedTripCount = 0;

    safeTrips.forEach((trip) => {
      const tripDetails = safeTripData[trip.id];

      totalDays += getTripDuration(tripDetails);
      totalCities += countTripCities(tripDetails);

      const rating = Number(tripDetails?.rating);
      if (!Number.isNaN(rating) && rating > 0) {
        ratingSum += rating;
        ratedTripCount += 1;
      }
    });

    const averageRating = ratedTripCount > 0 ? ratingSum / ratedTripCount : 0;

    return {
      tripCount: safeTrips.length,
      totalDays,
      totalCities,
      averageRating: averageRating > 0 ? averageRating.toFixed(1) : null,
    };
  }, [safeTrips, safeTripData]);
};

export default useLogStats;