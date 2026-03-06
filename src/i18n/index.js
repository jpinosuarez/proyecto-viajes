import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Diccionarios ES (fuente de verdad)
import commonES from './locales/es/common.json';
import dashboardES from './locales/es/dashboard.json';
import editorES from './locales/es/editor.json';
import visorES from './locales/es/visor.json';
import hubES from './locales/es/hub.json';
import settingsES from './locales/es/settings.json';
import landingES from './locales/es/landing.json';
import galleryES from './locales/es/gallery.json';
import shareES from './locales/es/share.json';
import navES from './locales/es/nav.json';

// Diccionarios EN (placeholder — traducir con i18n Ally)
import commonEN from './locales/en/common.json';
import dashboardEN from './locales/en/dashboard.json';
import editorEN from './locales/en/editor.json';
import visorEN from './locales/en/visor.json';
import hubEN from './locales/en/hub.json';
import settingsEN from './locales/en/settings.json';
import landingEN from './locales/en/landing.json';
import galleryEN from './locales/en/gallery.json';
import shareEN from './locales/en/share.json';
import navEN from './locales/en/nav.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        common: commonES,
        dashboard: dashboardES,
        editor: editorES,
        visor: visorES,
        hub: hubES,
        settings: settingsES,
        landing: landingES,
        gallery: galleryES,
        share: shareES,
        nav: navES,
      },
      en: {
        common: commonEN,
        dashboard: dashboardEN,
        editor: editorEN,
        visor: visorEN,
        hub: hubEN,
        settings: settingsEN,
        landing: landingEN,
        gallery: galleryEN,
        share: shareEN,
        nav: navEN,
      },
    },
    fallbackLng: 'es',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'keeptrip-lang',
    },
  });

export default i18n;
