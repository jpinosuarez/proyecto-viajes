import React, { useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import { getTravelerLevel, getNextLevel } from '../model/travelerLevel';
import { useWindowSize } from '@shared/lib/hooks/useWindowSize';
import AchievementsGrid from './AchievementsGrid';
import TravelStatsWidget from '@widgets/travelStats/ui/TravelStatsWidget';
import { styles } from './TravelerHub.styles';
import { COLORS } from '@shared/config';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@shared/lib/hooks/useDocumentTitle';
import { Globe, Calendar, MapPin, Image, Share } from 'lucide-react';
import { useToast } from '@app/providers';

/**
 * TravelerHub — the gamification hub with a Bento-style layout.
 * Shows traveler level hero card, achievement badges, and next goals.
 */
const TravelerHub = ({ paisesVisitados, bitacora, achievementsWithProgress, stats }) => {
  const { isMobile } = useWindowSize(768);
  const { t } = useTranslation('hub');
  const { t: tNav } = useTranslation('nav');
  useDocumentTitle(tNav('hub'));

  const countryCount = paisesVisitados.length;
  const level = getTravelerLevel(countryCount);
  const next = getNextLevel(countryCount);
  const { pushToast } = useToast();

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: tNav('hub'), url });
      } catch {}
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        pushToast(t('shareCopied'), 'success');
      } catch (e) {
        // fallback silently
      }
    }
  }, [pushToast, tNav, t]);

  // compute additional derived stats for hub
  const statsArray = [];
  statsArray.push({ value: countryCount, label: t('stats.countries'), icon: <Globe size={16} /> });
  statsArray.push({ value: bitacora.length, label: t('stats.trips'), icon: <Calendar size={16} /> });
  statsArray.push({ value: stats.continents, label: t('stats.continents'), icon: <MapPin size={16} /> });
  if (stats.longestTrip) statsArray.push({ value: stats.longestTrip, label: t('stats.longestTrip'), icon: <Calendar size={16} /> });
  if (stats.totalPhotos) statsArray.push({ value: stats.totalPhotos, label: t('stats.photos'), icon: <Image size={16} /> });

  return (
    <div style={styles.container(isMobile)}>
      <div style={styles.scrollArea} className="custom-scroll">
        {/* ── Hero Card ── */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={styles.heroCard(level.color)}
        >
          <div style={styles.heroRing(level.color)} />
          <div style={styles.heroRing2(level.color)} />

          <div style={styles.heroLeft}>
            <div style={styles.heroIcon}>{level.icon}</div>
            <h2 style={styles.heroLabel}>{level.label}</h2>
            <p style={styles.heroSublabel}>
              {next.level
                ? `${next.remaining} ${next.remaining !== 1 ? t('goals.units.countries_other') : t('goals.units.countries_one')} para ${next.level.label}`
                : t('progress.maxLevel')}
            </p>
            {next.level && (
              <div style={styles.heroProgressOuter}>
                <Motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(next.progress * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={styles.heroProgressInner(level.color)}
                />
              </div>
            )}
          </div>

          <div style={styles.heroRight}>
            {/* botón compartir perfil con micro‑animación */}
            <Motion.button
              type="button"
              onClick={handleShare}
              style={styles.shareBtn}
              aria-label={t('share')}
              title={t('share')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share size={20} />
            </Motion.button>
          </div>
        </Motion.div>

        {/* ── Global stats widget below hero (full variant) ── */}
        <div style={{ marginTop: '24px', padding: '0 16px' }}>
          <TravelStatsWidget stats={statsArray} ariaLabel={t('stats.overview')} variant="full" />
        </div>

        {/* ── Achievements (goals + unlocked + locked) ── */}
        <AchievementsGrid achievementsWithProgress={achievementsWithProgress} isMobile={isMobile} />
      </div>
    </div>
  );
};

export default TravelerHub;
