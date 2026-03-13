import { COLORS, FONTS, SHADOWS, RADIUS, TRANSITIONS } from '@shared/config';

export const styles = {
  container: {
    minHeight: '100vh',
    height: '100vh',
    overflowY: 'auto',
    overflowX: 'hidden', // Previene scroll horizontal indeseado con animaciones
    background: COLORS.background || '#FAFBFC',
    position: 'relative',
    fontFamily: FONTS.heading,
  },

  // Highlighted explicit background map
  backgroundMap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center 15%',
    opacity: 0.15, // Increased opacity to make it a purposeful design element (Iteration 2)
    zIndex: 1,
    pointerEvents: 'none',
    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 95%)',
    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 95%)',
  },

  nav: (isMobile) => ({
    padding: isMobile ? '20px 24px' : '28px 48px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    position: 'relative',
  }),

  logo: {
    fontSize: '1.6rem',
    fontWeight: '900',
    color: COLORS.charcoalBlue,
    letterSpacing: '-1.2px',
  },

  loginBtn: {
    padding: '12px 28px',
    borderRadius: RADIUS['2xl'] || '99px',
    border: `2px solid ${COLORS.atomicTangerine}`,
    background: 'transparent',
    color: COLORS.atomicTangerine,
    fontWeight: '800',
    cursor: 'pointer',
    minHeight: '48px',
    minWidth: '48px',
    fontFamily: FONTS.heading,
    fontSize: '0.95rem',
  },

  hero: (isMobile) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '40px 24px 20px' : '90px 48px 80px',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
    gap: isMobile ? '48px' : '72px',
    alignItems: 'center',
    zIndex: 10,
    position: 'relative',
  }),

  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '28px',
  },

  kicker: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    fontWeight: '800',
    color: COLORS.mutedTeal,
    textTransform: 'uppercase',
    letterSpacing: '1.8px',
    backgroundColor: `${COLORS.mutedTeal}15`,
    padding: '10px 20px',
    borderRadius: RADIUS.full,
    border: `1.5px solid ${COLORS.mutedTeal}30`,
  },

  title: (isMobile) => ({
    fontSize: isMobile ? '3.2rem' : '4.8rem',
    fontWeight: '900',
    color: COLORS.charcoalBlue,
    lineHeight: 1.05,
    margin: 0,
    letterSpacing: isMobile ? '-1px' : '-2.5px',
  }),

  highlight: {
    color: COLORS.atomicTangerine,
    display: 'inline-block',
  },

  subtitle: {
    fontSize: '1.15rem',
    color: COLORS.textSecondary,
    maxWidth: '520px',
    lineHeight: 1.7,
    margin: 0,
    fontFamily: FONTS.body,
    fontWeight: '400',
  },

  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '0 40px',
    fontSize: '1.1rem',
    fontWeight: '800',
    background: COLORS.atomicTangerine,
    color: 'white',
    border: 'none',
    borderRadius: RADIUS.full,
    cursor: 'pointer',
    boxShadow: `0 8px 24px ${COLORS.atomicTangerine}40`,
    minHeight: '56px', // Solid mobile-first touch target
    minWidth: '260px',
    fontFamily: FONTS.heading,
  },

  // ── Hero visual: Trip Cards Stack ───────────────────────
  heroVisual: {
    position: 'relative',
    width: '100%',
    height: '420px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${COLORS.atomicTangerine}30 0%, transparent 65%)`,
    pointerEvents: 'none',
    zIndex: 1,
  },

  tripCardsStack: {
    position: 'relative',
    width: '280px',
    height: '360px',
    zIndex: 2,
    perspective: '1000px', // Adds depth for simple 3d transforms if needed
  },

  tripCardMock: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: RADIUS['2xl'] || '20px',
    overflow: 'hidden',
    boxShadow: SHADOWS?.xl || '0 24px 48px rgba(0,0,0,0.15)',
    border: '4px solid white', // creates a polaroid/frame effect
    cursor: 'pointer',
    transformOrigin: 'bottom center', // rotaciones ancladas abajo
    backgroundColor: '#fff',
  },

  tripCardMockBack: {
    zIndex: 1,
  },

  tripCardMockFront: {
    zIndex: 2,
  },

  tripCardMockImage: (url) => ({
    width: '100%',
    height: '100%',
    backgroundImage: `url("${url}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }),

  tripCardMockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px',
  },

  tripCardMockPill: {
    alignSelf: 'flex-end',
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: RADIUS.full,
    fontSize: '0.75rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    border: '1px solid rgba(255, 255, 255, 0.4)'
  },

  tripCardMockContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  tripCardMockTitle: {
    color: '#ffffff',
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '900',
    lineHeight: 1.1,
    letterSpacing: '-0.5px'
  },

  tripCardMockDate: {
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
    fontSize: '0.85rem',
    fontWeight: '600',
  },

  // Carousel Controls — Lateral side buttons
  heroNavControls: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'calc(100% + 72px)', // extends beyond card edges for laterality
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none', // container is invisible, only buttons capture events
  },

  heroNavBtn: {
    width: '48px',
    height: '48px',
    borderRadius: RADIUS.full,
    border: '1px solid rgba(255,255,255,0.6)',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: COLORS.charcoalBlue,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.07)',
    pointerEvents: 'all', // re-enable events on actual buttons
    flexShrink: 0,
  },

  // ── Features: Bento Grid ──
  featuresSection: (isMobile) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '32px 24px 64px' : '40px 48px 100px',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, 1fr)',
    gridAutoRows: 'minmax(220px, auto)',
    gap: '24px',
    position: 'relative',
    zIndex: 10,
  }),

  // Feature Card dynamic bento styling (Option A SaaS Approach)
  featureCard: (isMobile, index) => {
    // 0 = 2/3 (span 8), 1 = 1/3 (span 4), 2 = full (span 12)
    let colSpan = 'span 12';
    if (!isMobile) {
      if (index === 0) colSpan = 'span 7';
      else if (index === 1) colSpan = 'span 5';
      else colSpan = 'span 12';
    }

    return {
      gridColumn: colSpan,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: RADIUS.xl,
      padding: isMobile ? '32px 24px' : '40px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      border: `1px solid rgba(255,255,255, 0.8)`,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      minHeight: '260px',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    };
  },

  featureCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  featureCardIconWrap: (color) => ({
    width: '48px', 
    height: '48px',
    borderRadius: RADIUS.lg,
    background: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),

  featureCardNum: (color) => ({
    fontSize: '0.8rem',
    fontWeight: '900',
    color: color,
    letterSpacing: '1.5px',
    opacity: 0.5,
    textTransform: 'uppercase',
  }),

  featureCardTitle: (isMobile, index) => ({
    fontSize: (!isMobile && index === 0) ? '1.8rem' : '1.3rem',
    fontWeight: '900',
    color: COLORS.charcoalBlue,
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
    marginTop: 'auto',
  }),

  featureDesc: (isMobile, index) => ({
    margin: 0,
    fontSize: (!isMobile && index === 0) ? '1.05rem' : '0.95rem',
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    fontFamily: FONTS.body,
    maxWidth: (!isMobile && index === 0) ? '80%' : '100%',
  }),

  // ── Dashboard Fragments (Option A) ───────────────────────

  // 1. Interactive Stats Fragment (Card 1)
  dashboardWidgetVisual: {
    background: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: '20px 24px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
    border: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px',
    position: 'relative', // so it sits behind the description
    zIndex: 1,
  },

  widgetHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  widgetSubTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    letterSpacing: '0.5px',
  },

  widgetStatsGrid: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '16px',
    alignItems: 'flex-end',
  },

  widgetStatItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  widgetStatNumber: (color = COLORS.charcoalBlue) => ({
    fontSize: '2rem',
    fontWeight: '900',
    color: color,
    lineHeight: 1,
    letterSpacing: '-1px',
  }),

  widgetStatLabel: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  // World Map Container (Card 1 visual)
  worldMapContainer: {
    position: 'relative',
    width: '100%',
    flex: 1,
    minHeight: '240px',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
    border: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  
  mapGlowDot: (color) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color,
    boxShadow: `0 0 20px ${color}80`,
    position: 'absolute',
  }),

  // 2. Timeline / Bitácora Fragment (Card 2)
  timelineVisual: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    margin: '20px 0',
    paddingLeft: '12px',
    flexGrow: 1,
  },

  timelineLine: {
    position: 'absolute',
    left: '16px', // 12 + 4 center of dot
    top: '10px',
    bottom: '-20px',
    width: '2px',
    background: `${COLORS.mutedTeal}30`,
    zIndex: 1,
  },

  timelineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    position: 'relative',
    zIndex: 2,
  },

  timelineDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    boxShadow: '0 0 0 3px rgba(255,255,255,1)',
    flexShrink: 0,
    marginTop: '4px',
  },

  timelineItemContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  timelineItemDate: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },

  timelineItemTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: COLORS.charcoalBlue,
    lineHeight: 1.2,
  },

  // 3. Masonry Gallery Mock (Card 3 full width)
  masonryVisualContainer: {
    display: 'flex',
    gap: '10px',
    flex: 1,
    margin: '16px 0 0',
    overflow: 'hidden',
  },

  masonryCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },

  masonryImg: (url, height) => ({
    width: '100%',
    height: height,
    backgroundImage: `url("${url}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: RADIUS.lg,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    position: 'relative',
    overflow: 'hidden',
  }),

  galleryContextPill: {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: RADIUS.full,
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
  },
  
  galleryContextLabel: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: COLORS.charcoalBlue,
    letterSpacing: '0.5px',
  },

  masonryOverlayCount: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: RADIUS.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: '800',
    gap: '4px',
  }

};