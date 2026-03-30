import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { ENABLE_IMMERSIVE_VIEWER } from '@shared/config';
import { welcomeStyles as styles } from './WelcomeBento.styles';
import TravelStatsWidget from '@widgets/travelStats/ui/TravelStatsWidget';

const WelcomeBento = ({ name, level, nextLevel, logStatsDashboard, isMobile, isNewTraveler, onNewTrip }) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const handleLevelClick = () => { navigate('/explorer'); };

  return (
    <div style={styles.pageHeader(isMobile)}>
      <div style={styles.decorLayer} aria-hidden="true">
        <span style={styles.decorOrbA} />
        <span style={styles.decorOrbB} />
      </div>
      <div style={styles.headerContent}>
        <div>
          <h1 style={styles.title}>{t('greeting', { name })}</h1>
          {isNewTraveler ? (
            /* ── Aspirational Empty State: Premium editorial magazine feel ── */
            <Motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={styles.aspirationalBlock}
            >
              <p style={styles.aspirationalText}>
                {t('welcome.aspirationalMessage')}
              </p>
              <Motion.button
                type="button"
                onClick={onNewTrip}
                style={styles.aspirationalCta}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Compass size={16} />
                {t('welcome.aspirationalCtaLabel')}
              </Motion.button>
            </Motion.div>
          ) : (
            /* ── Returning Traveler: Subtitle + Level Badge ── */
            <>
              <p style={styles.subtitle}>{t('welcomeSubtitle')}</p>
              <div style={styles.badgeRow}>
                {ENABLE_IMMERSIVE_VIEWER ? (
                  <button type="button" onClick={handleLevelClick} style={styles.badgeLevelButton}>
                    <span style={styles.badgeLevel}>{level.icon} {level.label}</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <span style={styles.badgeLevel}>{level.icon} {level.label}</span>
                )}
                {nextLevel.level && (
                  <span style={styles.badgeProgress}>
                    {t('nextLevelProgress', {
                      remaining: nextLevel.remaining,
                      countryWord: nextLevel.remaining !== 1 ? t('stats.countriesPlural') : t('stats.countrySingular'),
                      level: nextLevel.level.label,
                    })}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats only render for returning travelers */}
      {!isNewTraveler && (
        <div style={styles.statsSection}>
          <TravelStatsWidget
            logStats={logStatsDashboard}
            ariaLabel={t('stats.tripSummary')}
            variant="home"
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
};

export default WelcomeBento;