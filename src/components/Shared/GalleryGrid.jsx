import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { COLORS, RADIUS, SHADOWS } from '../../theme';

/**
 * Hook para lazy loading de imágenes con Intersection Observer
 */
function useLazyLoad() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

/**
 * Componente de imagen con lazy loading
 */
function LazyImage({ src, alt, onClick, isPortada }) {
  const [ref, isVisible] = useLazyLoad();
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={ref} style={styles.imageContainer(isPortada)} onClick={onClick}>
      {isVisible ? (
        <>
          {!isLoaded && <div style={styles.imagePlaceholder} />}
          <img
            src={src}
            alt={alt}
            style={{ ...styles.image, opacity: isLoaded ? 1 : 0 }}
            onLoad={() => setIsLoaded(true)}
          />
          {isPortada && (
            <div style={styles.portadaBadge}>
              <Star size={12} fill="white" color="white" />
              <span>Portada</span>
            </div>
          )}
        </>
      ) : (
        <div style={styles.imagePlaceholder} />
      )}
    </div>
  );
}

/**
 * Lightbox/Modal para ver foto en fullscreen
 */
function Lightbox({ foto, onClose, onPrev, onNext, hasNext, hasPrev, totalFotos, currentIndex }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasNext, hasPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.lightboxOverlay}
      onClick={onClose}
    >
      {/* Botón cerrar */}
      <button style={styles.closeBtn} onClick={onClose}>
        <X size={24} />
      </button>

      {/* Contador */}
      <div style={styles.counter}>
        {currentIndex + 1} / {totalFotos}
      </div>

      {/* Navegación previa */}
      {hasPrev && (
        <button
          style={{ ...styles.navBtn, left: '20px' }}
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Navegación siguiente */}
      {hasNext && (
        <button
          style={{ ...styles.navBtn, right: '20px' }}
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Imagen */}
      <motion.div
        key={foto.id}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={styles.lightboxContent}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={foto.url} alt={foto.caption || 'Foto'} style={styles.lightboxImage} />
        
        {foto.caption && (
          <div style={styles.captionBox}>
            <p style={styles.captionText}>{foto.caption}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * Grid de galería de fotos con lazy loading y lightbox
 * 
 * @param {Object} props
 * @param {Array} props.fotos - Array de objetos foto {id, url, caption, esPortada}
 * @param {boolean} props.isMobile - Si es vista móvil
 */
export function GalleryGrid({ fotos = [], isMobile = false }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleOpenLightbox = (index) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < fotos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  if (fotos.length === 0) {
    return (
      <div style={styles.emptyState}>
        <Star size={48} color={COLORS.textSecondary} />
        <p style={styles.emptyText}>No hay fotos en la galería</p>
      </div>
    );
  }

  return (
    <>
      <div style={styles.grid(isMobile)}>
        {fotos.map((foto, index) => (
          <LazyImage
            key={foto.id}
            src={foto.url}
            alt={foto.caption || `Foto ${index + 1}`}
            isPortada={foto.esPortada}
            onClick={() => handleOpenLightbox(index)}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            foto={fotos[selectedIndex]}
            onClose={handleClose}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={selectedIndex > 0}
            hasNext={selectedIndex < fotos.length - 1}
            totalFotos={fotos.length}
            currentIndex={selectedIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}

const styles = {
  grid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile 
      ? 'repeat(auto-fill, minmax(100px, 1fr))' 
      : 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: isMobile ? '8px' : '16px',
    width: '100%',
  }),
  imageContainer: (isPortada) => ({
    position: 'relative',
    width: '100%',
    paddingBottom: '100%', // Aspecto cuadrado
    overflow: 'hidden',
    borderRadius: RADIUS.sm,
    cursor: 'pointer',
    border: isPortada ? `3px solid ${COLORS.atomicTangerine}` : 'none',
    boxShadow: isPortada ? SHADOWS.md : SHADOWS.sm,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: SHADOWS.lg,
    },
  }),
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  portadaBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: COLORS.atomicTangerine,
    color: 'white',
    padding: '4px 8px',
    borderRadius: RADIUS.full,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: SHADOWS.sm,
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: '16px',
    marginTop: '16px',
  },
  
  // Lightbox styles
  lightboxOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  lightboxContent: {
    maxWidth: '90vw',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  lightboxImage: {
    maxWidth: '100%',
    maxHeight: '80vh',
    objectFit: 'contain',
    borderRadius: RADIUS.md,
  },
  captionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '16px 24px',
    borderRadius: RADIUS.md,
    maxWidth: '600px',
  },
  captionText: {
    fontSize: '16px',
    color: COLORS.textPrimary,
    margin: 0,
    lineHeight: '1.6',
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '48px',
    height: '48px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    zIndex: 10001,
  },
  counter: {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: RADIUS.full,
    fontSize: '14px',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
    zIndex: 10001,
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '56px',
    height: '56px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    zIndex: 10001,
  },
};

// Animación de pulse para placeholders
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    [style*="imageContainer"]:hover {
      transform: scale(1.05) !important;
      box-shadow: ${SHADOWS.lg} !important;
    }
  `;
  document.head.appendChild(style);
}
