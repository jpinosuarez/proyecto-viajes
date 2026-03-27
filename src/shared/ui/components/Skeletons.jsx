import React from 'react';
import { COLORS, RADIUS, SHADOWS } from '@shared/config';

/**
 * Skeleton placeholder card for trip loading states.
 * Uses CSS classes from mobile-polish.css (skeleton, skeleton-text).
 */

/** Skeleton for DashboardHome recent trip cards */
export function TripCardSkeleton() {
  return (
    <div
      className="skeleton skeleton-poster"
      aria-hidden="true"
      style={{
        aspectRatio: '4/5',
        minWidth: '180px',
        maxWidth: '320px',
        flex: '1 1 220px',
        borderRadius: RADIUS.xl,
        background: 'linear-gradient(140deg, rgba(255,107,53,0.12) 0%, rgba(69,176,168,0.08) 40%, rgba(248,250,252,0.95) 100%)',
        border: `1px solid ${COLORS.border}`,
        boxShadow: SHADOWS.sm,
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
      aria-hidden="true"
      style={{
        minHeight: '200px',
        borderRadius: RADIUS.lg,
        border: `1px solid ${COLORS.border}`,
        background: 'linear-gradient(145deg, rgba(248,250,252,0.94) 0%, rgba(226,232,240,0.72) 100%)',
      }}
    />
  );
}

/** Renders n skeleton cards */
export function SkeletonList({ count = 3, Component = TripCardSkeleton }) {
  return Array.from({ length: count }, (_, i) => React.createElement(Component, { key: i }));
}
