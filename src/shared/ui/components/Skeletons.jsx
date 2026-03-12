import React from 'react';

/**
 * Skeleton placeholder card for trip loading states.
 * Uses CSS classes from mobile-polish.css (skeleton, skeleton-text).
 */

/** Skeleton for DashboardHome recent trip cards */
export function TripCardSkeleton() {
  return (
    <div
      className="skeleton skeleton-poster"
      style={{
        aspectRatio: '4/5',
        minWidth: '180px',
        maxWidth: '320px',
        flex: '1 1 220px',
        borderRadius: '24px',
        /* keep gradient overlay to hint at image area */
        background: 'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
        boxShadow: '0 10px 24px rgba(44,62,80,0.06)',
        marginBottom: '16px',
      }}
    />
  );
}

/** Skeleton for BentoGrid masonry items */
export function BentoCardSkeleton() {
  return (
    <div
      className="skeleton"
      style={{
        minHeight: '200px',
      }}
    />
  );
}

/** Renders n skeleton cards */
export function SkeletonList({ count = 3, Component = TripCardSkeleton }) {
  return Array.from({ length: count }, (_, i) => React.createElement(Component, { key: i }));
}
