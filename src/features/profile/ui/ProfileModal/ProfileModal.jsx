import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@app/providers/AuthContext';
import { useWindowSize } from '@shared/lib/hooks/useWindowSize';
import styles from './ProfileModal.styles.js';
import BottomSheet from '@shared/ui/components/BottomSheet';

function getInitials(name) {
  if (!name) return '';
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

const ProfileModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common');
  const { user, updateUserProfile } = useAuth();
  const { isMobile } = useWindowSize(768);
  const [name, setName] = useState(user?.displayName || '');
  const [photo, setPhoto] = useState(user?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateUserProfile(name, photo);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  const avatarFallback = (
    <div style={styles.avatarSkeleton}>
      {getInitials(name) || t('profile.avatarFallback')}
    </div>
  );

  const formContent = (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.avatarPreview}>
        {!photo || !imgLoaded ? avatarFallback : null}
        {photo && (
          <img
            src={photo}
            alt={t('profile.avatarAlt')}
            style={styles.avatarImg}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(false)}
          />
        )}
      </div>
      <label style={styles.label}>{t('profile.nameLabel')}</label>
      <input
        style={styles.input}
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={t('profile.namePlaceholder')}
      />
      <label style={styles.label}>{t('profile.photoLabel')}</label>
      <input
        style={styles.input}
        value={photo}
        onChange={e => setPhoto(e.target.value)}
        placeholder={t('profile.photoPlaceholder')}
      />
      <button type="submit" style={styles.saveBtn} disabled={loading}>
        <Save size={18} /> {loading ? t('profile.saving') : t('profile.save')}
      </button>
    </form>
  );

  // Mobile: BottomSheet
  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} zIndex={11000} disableClose={loading}>
        <div style={{ padding: '4px 20px 8px' }}>
          <h3 style={{ color: '#2C3E50', fontWeight: 800, margin: '0 0 16px' }}>{t('profile.editTitle')}</h3>
          {formContent}
        </div>
      </BottomSheet>
    );
  }

  // Desktop: modal centrado
  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={styles.overlay} onClick={onClose}
      >
        <Motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          style={styles.content} onClick={e => e.stopPropagation()}
        >
          <div style={styles.header}>
            <h3>{t('profile.editTitle')}</h3>
            <button onClick={onClose} style={styles.closeBtn} aria-label={t('profile.close')}> <X size={20}/> </button>
          </div>
          {formContent}
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;
