import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./Locales/EN/translation.json";
import translationUR from "./Locales/UR/translation.json";

// the translations
const resources = {
  en: { translation: translationEN },
  ur: { translation: translationUR }
};

i18n
  .use(LanguageDetector) // detects browser language
  .use(initReactI18next) // passes i18n to react-i18next
  .init({
    resources,
    fallbackLng: "en", // fallback language
    interpolation: { escapeValue: false } // react already safes from xss
  });

export default i18n;