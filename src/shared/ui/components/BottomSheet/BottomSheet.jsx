import React, { useState, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { COLORS, SHADOWS, RADIUS, GLASS } from '@shared/config';
import BottomSheetHeader from './BottomSheetHeader.jsx';
import BottomSheetContent from './BottomSheetContent.jsx';
import useBottomSheetGestures from './useBottomSheetGestures.js';

/**
 * BottomSheet
 * Slide-up modal panel with swipe-to-dismiss and haptic feedback.
 *
 * Props:
 *   isOpen       {boolean}   - Controls visibility.
 *   onClose      {() => void} - Called when the sheet is dismissed.
 *   children     {ReactNode} - Content rendered inside the sheet.
 *   zIndex       {number}    - Base z-index (default 12000).
 *   disableClose {boolean}   - Prevents dismissal (e.g. during loading).
 */
const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const SHEET_VARIANTS = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 320,
      mass: 0.9,
    },
  },
  exit: {
    y: '100%',
    transition: {
      type: 'spring',
      damping: 32,
      stiffness: 360,
      mass: 0.7,
    },
  },
};

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  zIndex = 12000,
  disableClose = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleClose = useCallback(() => {
    if (!disableClose) onClose();
  }, [disableClose, onClose]);

  const { dragProps } = useBottomSheetGestures({
    onClose: handleClose,
    disabled: disableClose,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <Motion.div
            key="bs-overlay"
            variants={OVERLAY_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.22 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex,
              ...GLASS.overlay,
              cursor: disableClose ? 'default' : 'pointer',
            }}
          />

          {/* Sheet panel */}
          <Motion.div
            key="bs-sheet"
            variants={SHEET_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            {...dragProps}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              setIsDragging(false);
              dragProps.onDragEnd(e, info);
            }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: zIndex + 1,
              backgroundColor: COLORS.surface,
              borderRadius: `${RADIUS.xl} ${RADIUS.xl} 0 0`,
              boxShadow: isDragging
                ? SHADOWS.float.replace('0.1', '0.18')
                : SHADOWS.float,
              maxHeight: '92dvh',
              display: 'flex',
              flexDirection: 'column',
              willChange: 'transform',
            }}
          >
            <BottomSheetHeader isDragging={isDragging} />
            <BottomSheetContent>{children}</BottomSheetContent>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
