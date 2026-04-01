import React from 'react';

const VisorStorySection = ({ stops, text, styles }) => {
  const hasPerStopStory = stops.some((stop) => stop.story && stop.story.trim());
  if (hasPerStopStory) return null;

  return (
    <>
      <h3 style={styles.sectionTitle}>Historia</h3>
      <p style={styles.readText}>{text || 'Sin relato aun...'}</p>
    </>
  );
};

export default VisorStorySection;
