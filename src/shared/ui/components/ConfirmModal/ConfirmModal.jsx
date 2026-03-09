import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './ConfirmModal.styles.js';
import { useWindowSize } from '@shared/lib/hooks/useWindowSize';
import BottomSheet from '@shared/ui/components/BottomSheet';

function trapFocus(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const focusable = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    ref.current.addEventListener('keydown', handleKeyDown);
    return () => ref.current.removeEventListener('keydown', handleKeyDown);
  }, [ref]);
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
  isLoading = false,
}) => {
  const { t } = useTranslation('common');
  const { isMobile } = useWindowSize(768);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !isLoading) onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isLoading, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      trapFocus(modalRef);
    }
  }, [isOpen]);

  const content = (
    <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div style={styles.body}>
        <div style={styles.iconWrap}>
          <AlertTriangle size={22} />
        </div>
        <h3 id="confirm-modal-title" style={styles.title}>{title || t('confirm.defaultTitle')}</h3>
        <p style={styles.message}>{message || t('confirm.defaultMessage')}</p>
      </div>
      <div style={isMobile ? styles.footerMobile : styles.footer}>
        <button
          type="button"
          onClick={() => onConfirm?.()}
          style={styles.confirmBtn(isLoading)}
          disabled={isLoading}
          autoFocus={false}
        >
          {isLoading ? <LoaderCircle size={16} className="spin" /> : <AlertTriangle size={16} />}
          {isLoading ? t('confirm.deleting') : confirmText || t('confirm.delete')}
        </button>
        <button
          type="button"
          onClick={() => onClose?.()}
          style={styles.cancelBtn(isLoading)}
          disabled={isLoading}
          autoFocus={true}
        >
          {cancelText || t('cancel')}
        </button>
      </div>
    </div>
  );

  // Mobile: BottomSheet
  if (isMobile) {
    return createPortal(
      <BottomSheet isOpen={isOpen} onClose={() => !isLoading && onClose?.()} disableClose={isLoading}>
        {content}
      </BottomSheet>,
      document.body
    );
  }

  // Desktop: modal centrado
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          style={styles.overlay}
          onClick={() => !isLoading && onClose?.()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div
            style={styles.modal}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {content}
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmModal;
