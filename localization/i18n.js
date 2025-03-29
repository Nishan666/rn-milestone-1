import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';

// Import translation files
import en from './locales/en.json';
import fr from './locales/fr.json';

// Detect device language
const fallbackLanguage = 'en';
const supportedLanguages = ['en', 'fr'];
const deviceLanguage = Localization.getLocales()[0]?.languageCode || fallbackLanguage;

// Ensure language is within supported list
const initialLanguage = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : fallbackLanguage;

// Initialize i18n
i18n
  .use(initReactI18next) // Integrate with React
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: initialLanguage, // Set initial language
    fallbackLng: fallbackLanguage,
    interpolation: { escapeValue: false },
  });

export default i18n;
