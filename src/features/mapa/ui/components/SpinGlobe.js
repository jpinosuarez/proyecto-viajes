/**
 * SpinGlobe — Mapbox GL idle globe rotation engine.
 *
 * Pure utility (no React, no hooks).
 * Creates a self-cleaning auto-rotation loop via recursive `easeTo`.
 * Pauses on user interaction, resumes on idle. Stops at high zoom.
 *
 * @param {mapboxgl.Map} map - Mapbox GL JS map instance
 * @param {Object} options
 * @param {number} [options.secondsPerRevolution=120] - Duration for full 360° rotation
 * @param {number} [options.maxSpinZoom=5] - Zoom level above which rotation stops
 * @returns {{ start: Function, stop: Function, destroy: Function }}
 */
export function createSpinGlobe(map, { secondsPerRevolution = 120, maxSpinZoom = 5 } = {}) {
  let userInteracting = false;
  let spinEnabled = false;

  const distancePerSecond = 360 / secondsPerRevolution;

  function spin() {
    if (!spinEnabled || userInteracting) return;

    const zoom = map.getZoom();
    if (zoom > maxSpinZoom) return;

    const center = map.getCenter();
    center.lng -= distancePerSecond;

    map.easeTo({
      center,
      duration: 1000,
      easing: (n) => n, // Linear for seamless loop
    });
  }

  // ── Interaction awareness ─────────────────────────────────────────
  const onInteractionStart = () => {
    userInteracting = true;
  };

  const onInteractionEnd = () => {
    userInteracting = false;
    spin();
  };

  const onMoveEnd = () => {
    if (!userInteracting) spin();
  };

  // ── Wire up Mapbox events ─────────────────────────────────────────
  const INTERACTION_START_EVENTS = ['mousedown', 'touchstart', 'wheel'];
  const INTERACTION_END_EVENTS = ['mouseup', 'touchend'];

  function attachListeners() {
    INTERACTION_START_EVENTS.forEach((e) => map.on(e, onInteractionStart));
    INTERACTION_END_EVENTS.forEach((e) => map.on(e, onInteractionEnd));
    map.on('moveend', onMoveEnd);
    map.on('dragstart', onInteractionStart);
    map.on('dragend', onInteractionEnd);
  }

  function detachListeners() {
    INTERACTION_START_EVENTS.forEach((e) => map.off(e, onInteractionStart));
    INTERACTION_END_EVENTS.forEach((e) => map.off(e, onInteractionEnd));
    map.off('moveend', onMoveEnd);
    map.off('dragstart', onInteractionStart);
    map.off('dragend', onInteractionEnd);
  }

  attachListeners();

  return {
    /** Begin auto-rotation. */
    start() {
      spinEnabled = true;
      spin();
    },
    /** Pause auto-rotation (preserves listeners for resume). */
    stop() {
      spinEnabled = false;
    },
    /** Full teardown: stop rotation and remove all event listeners. */
    destroy() {
      spinEnabled = false;
      detachListeners();
    },
  };
}

export default createSpinGlobe;
