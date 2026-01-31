export const COLORS = {
  // Paleta Principal
  linen: '#F4EDE4',          // Fondo cálido/papel
  atomicTangerine: '#FF6B35', // Acento principal
  charcoalBlue: '#2C3E50',    // Textos y fondos oscuros
  mutedTeal: '#45B0A8',       // Acento secundario/éxito
  
  // Neutrales UI
  background: '#F8FAFC',      // Fondo general app (Slate 50)
  surface: '#FFFFFF',         // Tarjetas
  textPrimary: '#1E293B',     // Slate 800
  textSecondary: '#64748B',   // Slate 500
  border: '#E2E8F0',          // Slate 200
  
  // Estados
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B'
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  float: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: `0 0 15px ${COLORS.atomicTangerine}40`
};

export const RADIUS = {
  sm: '8px',
  md: '16px',
  lg: '24px',
  full: '9999px'
};

export const FONTS = {
  heading: '"Plus Jakarta Sans", sans-serif',
  body: '"Inter", sans-serif'
};