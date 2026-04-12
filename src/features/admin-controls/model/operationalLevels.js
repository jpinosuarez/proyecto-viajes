export const OPERATIONAL_LEVELS = Object.freeze([
  {
    level: 0,
    nameKey: 'settings:operationalControls.levels.0.name',
    descriptionKey: 'settings:operationalControls.levels.0.description',
  },
  {
    level: 1,
    nameKey: 'settings:operationalControls.levels.1.name',
    descriptionKey: 'settings:operationalControls.levels.1.description',
  },
  {
    level: 2,
    nameKey: 'settings:operationalControls.levels.2.name',
    descriptionKey: 'settings:operationalControls.levels.2.description',
  },
  {
    level: 3,
    nameKey: 'settings:operationalControls.levels.3.name',
    descriptionKey: 'settings:operationalControls.levels.3.description',
  },
  {
    level: 4,
    nameKey: 'settings:operationalControls.levels.4.name',
    descriptionKey: 'settings:operationalControls.levels.4.description',
  },
]);

export const getOperationalLevelMetadata = (level) => {
  return OPERATIONAL_LEVELS.find((entry) => entry.level === level) || OPERATIONAL_LEVELS[0];
};
