import { COLORS } from '../../theme';

export const styles = {
  landingContainer: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: COLORS.linen,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    overflowX: 'hidden'
  },
  nav: {
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(244, 237, 228, 0.9)',
    backdropFilter: 'blur(10px)',
    zIndex: 100
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: COLORS.charcoalBlue,
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  loginBtn: {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    border: `2px solid ${COLORS.charcoalBlue}`,
    borderRadius: '12px',
    color: COLORS.charcoalBlue,
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  heroSection: {
    padding: '60px 20px',
    textAlign: 'center',
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px'
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '900',
    color: COLORS.charcoalBlue,
    lineHeight: '1.1',
    letterSpacing: '-2px',
    margin: 0
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: '#64748b',
    maxWidth: '600px',
    lineHeight: '1.6'
  },
  ctaButton: {
    padding: '16px 32px',
    backgroundColor: COLORS.atomicTangerine,
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 10px 25px -5px rgba(255, 107, 53, 0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'transform 0.2s ease'
  },
  googleHint: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  demoSection: {
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '40px 40px 0 0',
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '80px'
  },
  featureBlock: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center'
  },
  featureText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  featureTag: {
    color: COLORS.atomicTangerine,
    fontWeight: '800',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    letterSpacing: '2px'
  },
  featureTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: COLORS.charcoalBlue,
    margin: 0
  },
  featureDesc: {
    fontSize: '1.1rem',
    color: '#64748b',
    lineHeight: '1.6'
  },
  visualCard: {
    backgroundColor: COLORS.linen,
    borderRadius: '24px',
    padding: '30px',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden'
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    marginTop: '20px',
    flexWrap: 'wrap'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: COLORS.charcoalBlue
  },
  statLabel: {
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: '0.8rem'
  },
  footer: {
    padding: '40px 20px',
    textAlign: 'center',
    borderTop: '1px solid #f1f5f9',
    color: '#94a3b8',
    fontSize: '0.9rem'
  }
};