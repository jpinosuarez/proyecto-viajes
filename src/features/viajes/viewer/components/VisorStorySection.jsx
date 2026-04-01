import React from 'react';
import { useTranslation } from 'react-i18next';

const VisorStorySection = ({ stops, text, styles }) => {
  const { t } = useTranslation();
  const hasPerStopStory = stops.some((stop) => stop.story && stop.story.trim());
  if (hasPerStopStory) return null;

  return (
    <>
      <h3 style={styles.sectionTitle}>{t('visor.story.title', 'Historia')}</h3>
      <p style={styles.readText}>{text || t('visor.story.empty', 'Sin relato aun...')}</p>
    </>
  );
};

export default VisorStorySection;
