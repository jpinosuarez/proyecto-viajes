import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { styles } from './ConfirmModal.styles';

const ConfirmModal = ({
  isOpen,
  title = 'Confirmar accion',
  message = 'Esta accion no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
  isLoading = false
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !isLoading) onClose?.();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isLoading, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={styles.overlay}
          onClick={() => !isLoading && onClose?.()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            style={styles.modal}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div style={styles.body}>
              <div style={styles.iconWrap}>
                <AlertTriangle size={22} />
              </div>
              <h3 style={styles.title}>{title}</h3>
              <p style={styles.message}>{message}</p>
            </div>

            <div style={styles.footer}>
              <button type="button" onClick={() => onClose?.()} style={styles.cancelBtn(isLoading)} disabled={isLoading}>
                {cancelText}
              </button>
              <button type="button" onClick={() => onConfirm?.()} style={styles.confirmBtn(isLoading)} disabled={isLoading}>
                {isLoading ? <LoaderCircle size={16} className="spin" /> : <AlertTriangle size={16} />}
                {isLoading ? 'Eliminando...' : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmModal;
