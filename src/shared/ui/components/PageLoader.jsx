import React from 'react';

/**
 * PageLoader — Minimal in-app navigation loader.
 *
 * 2026 UX Practice: No full-screen dark overlays for secondary route loads.
 * A small centered spinner on a transparent background keeps the user
 * contextually aware they're inside the app — not facing a crash or block.
 *
 * Used by: TripsRoute, MapRoute, ExplorerRoute, SettingsRoute, InvitationsRoute
 * (all protected routes during in-app lazy-chunk loading via React Suspense).
 *
 * NOT used during initial cold-boot: the native #keeptrip-splash covers that.
 */
export default function PageLoader() {
  return (
    <div
      aria-label="Cargando..."
      role="status"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        zIndex: 100,
      }}
    >
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '3px solid #E2E8F0',
        borderTopColor: '#FF6B35',
        animation: 'keeptrip-spin 0.65s linear infinite',
        flexShrink: 0,
      }} />
      {/* Scoped keyframes — no global CSS dependency */}
      <style>{`
        @keyframes keeptrip-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
