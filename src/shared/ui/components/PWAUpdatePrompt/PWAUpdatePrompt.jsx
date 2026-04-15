import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRegisterSW } from 'virtual:pwa-register/react';
import styles from './PWAUpdatePrompt.styles';

const PWAUpdatePromptCore = () => {
  const { t } = useTranslation('common');
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div style={styles.toast} role="status" aria-live="polite">
      <span style={styles.text}>{t('pwaUpdate.updateAvailable')}</span>
      <div style={styles.actions}>
        <button
          onClick={() => updateServiceWorker(true)}
          style={styles.updateBtn}
          tabIndex={0}
          aria-label={t('pwaUpdate.update')}
        >
          {t('pwaUpdate.update')}
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          style={styles.dismissBtn}
          tabIndex={0}
          aria-label={t('pwaUpdate.later')}
        >
          {t('pwaUpdate.later')}
        </button>
      </div>
    </div>
  );
};

/**
 * PWAUpdatePrompt (Orchestrator)
 * Shows a floating toast when a new PWA version is available.
 * Defers SW registration until window.onload to prevent TBT/CLS.
 */
const PWAUpdatePrompt = () => {
  const [canRegister, setCanRegister] = useState(() => document.readyState === 'complete');

  useEffect(() => {
    if (canRegister) return;
    const handleLoad = () => setCanRegister(true);
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, [canRegister]);

  if (!canRegister) return null;
  return <PWAUpdatePromptCore />;
};

export default PWAUpdatePrompt;
