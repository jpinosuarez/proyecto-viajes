import React from 'react';
import { LoaderCircle } from 'lucide-react';

/**
 * PREMIUM HEADER SECTION: Two distinct visual blocks for 2026 aesthetic
 * Block 1 (Hero): Background cover photo with camera button overlay
 * Block 2 (Content): Flag + Title + Auto-mode badge (separate, no overlap)
 * 
 * UNIFIED IMAGE ARCHITECTURE (Single Source of Truth):
 * - Camera button abre BottomSheet para SELECCIONAR portada desde galería
 * - No hay subida de archivos aquí (solo en EdicionGallerySection)
 */
const EdicionHeaderSection = ({
  styles,
  t,
  formData,
  isMobile,
  isBusy,
  esBorrador,
  isTituloAuto,
  titlePulse,
  isProcessingImage,
  onTituloChange,
  onToggleTituloAuto,
  onPortadaChange, // NUEVO: función para cambiar la portada
}) => {

  const heroHeight = isMobile ? '200px' : '240px';

  // BLOCK 1: HERO SECTION (Fixed height, background image, camera button)
  const heroStyle = {
    position: 'relative',
    height: heroHeight,
    backgroundImage: formData.portadaUrl ? `url(${formData.portadaUrl})` : 'none',
    backgroundColor: formData.portadaUrl ? 'transparent' : '#2C3E50',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    overflow: 'hidden',
    flexShrink: 0,
  };

  const heroOverlay = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
    pointerEvents: 'none',
  };

  const processingBadgeStyle = {
    position: 'absolute',
    top: isMobile ? '14px' : '18px',
    right: isMobile ? '60px' : '76px',
    zIndex: 10,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    borderRadius: '50px',
    padding: '8px 14px',
    fontSize: '0.75rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1.5px solid rgba(255,255,255,0.2)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };

  const contentBlockStyle = {
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#FFFFFF',
    padding: isMobile ? '20px 16px' : '28px 24px',
    borderBottom: '1px solid #E0E7FF',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexShrink: 0,
  };

  const flagContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const flagImgStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '10px',
    objectFit: 'cover',
    border: '2px solid #E0E7FF',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    flexShrink: 0,
  };

  const titleInputStyle = {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: isMobile ? '1.5rem' : '1.75rem',
    fontWeight: '800',
    color: '#1A1A2E',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '0',
    margin: '0',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    transition: 'all 0.2s ease-out',
    width: '100%',
  };

  const titleInputAutoPulseStyle = {
    ...titleInputStyle,
    boxShadow: '0 0 12px rgba(255, 107, 53, 0.2)',
  };

  const autoModeRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  };

  const autoBadgeStyle = {
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    padding: '6px 12px',
    borderRadius: '50px',
    border: isTituloAuto ? '2px solid #FF6B35' : '1.5px solid #E0E7FF',
    background: isTituloAuto ? 'rgba(255, 107, 53, 0.08)' : 'transparent',
    color: isTituloAuto ? '#FF6B35' : '#7C8BA8',
    cursor: isBusy ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-out',
    whiteSpace: 'nowrap',
    opacity: isBusy ? 0.6 : 1,
  };

  return (
    <>
      {/* BLOCK 1: HERO SECTION - Only render if portada exists */}
      {formData.portadaUrl && (
        <div style={heroStyle}>
          <div style={heroOverlay} />

          {/* Processing Badge */}
          {isProcessingImage && (
            <div style={processingBadgeStyle}>
              <LoaderCircle size={14} className="spin" />
              <span>{t('optimizing') || 'Optimizing...'}</span>
            </div>
          )}
        </div>
      )}

      {/* BLOCK 2: CONTENT SECTION (Flag + Title + Auto-badge) */}
      <div style={contentBlockStyle}>
        {/* Flag & Title Container */}
        <div style={flagContainerStyle}>
          {formData.flag ? (
            <img
              src={formData.flag}
              alt=""
              style={flagImgStyle}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div
              style={{
                ...flagImgStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              🌍
            </div>
          )}

          {/* Title Input - Clean, Editorial, NO Overlaps */}
          <input
            type="text"
            name="titulo"
            value={formData.titulo || ''}
            onChange={(e) => onTituloChange(e.target.value)}
            style={titlePulse ? titleInputAutoPulseStyle : titleInputStyle}
            placeholder={t('tripTitlePlaceholder') || 'Trip title...'}
            maxLength={80}
            disabled={isBusy}
          />
        </div>

        {/* Auto-Mode Badge (if draft) */}
        {esBorrador && (
          <div style={autoModeRowStyle}>
            <button
              type="button"
              style={autoBadgeStyle}
              onClick={onToggleTituloAuto}
              disabled={isBusy}
              title={
                isTituloAuto ? t('tooltip.autoUpdate') || 'Auto mode' : t('tooltip.manualMode') || 'Manual mode'
              }
            >
              {isTituloAuto ? t('autoTitle') || 'AUTO' : t('manualTitle') || 'MANUAL'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EdicionHeaderSection;
