import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './ErrorFallback.styles';

/**
 * ErrorFallback (Dumb Component)
 * Pure UI for error display, no business logic.
 */
const ErrorFallback = ({ error, errorInfo, onReset }) => {
  const { t } = useTranslation('common');
  const isDevelopment = import.meta.env.DEV;

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <AlertTriangle size={48} color={styles.colors.danger} />
        </div>
        <h1 style={styles.title}>{t('error.title')}</h1>
        <p style={styles.description}>{t('error.description')}</p>
        {isDevelopment && error && (
          <div style={styles.errorDetails}>
            <p style={styles.errorTitle}>{t('error.detailsTitle')}</p>
            <pre style={styles.errorMessage}>{error.toString()}</pre>
            {errorInfo?.componentStack && (
              <details style={styles.stackTrace}>
                <summary style={styles.stackSummary}>{t('error.stackTrace')}</summary>
                <pre style={styles.stackCode}>{errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        )}
        <div style={styles.actions}>
          <button
            onClick={onReset}
            style={styles.primaryButton}
            tabIndex={0}
            aria-label={t('error.retry')}
          >
            <RefreshCcw size={18} />
            {t('error.retry')}
          </button>
          <button
            onClick={handleGoHome}
            style={styles.secondaryButton}
            tabIndex={0}
            aria-label={t('error.goHome')}
          >
            <Home size={18} />
            {t('error.goHome')}
          </button>
        </div>
        {!isDevelopment && (
          <p style={styles.supportText}>{t('error.support')}</p>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
