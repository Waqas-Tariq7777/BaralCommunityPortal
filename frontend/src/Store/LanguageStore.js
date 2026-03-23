import { create } from "zustand";
import i18n from "../i18n"; // your i18n config

export const useLanguageStore = create((set) => ({
  language: localStorage.getItem("language") || "en", // initial language

  changeLanguage: (lang) =>
    set((state) => {
      i18n.changeLanguage(lang); // change language in i18n
      localStorage.setItem("language", lang); // persist choice
      return { language: lang };
    }),
}));