import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import enTranslations from "../translations/en.json";
import idTranslations from "../translations/id.json";

const LanguageContext = createContext();

const translations = {
  en: enTranslations,
  id: idTranslations,
};

export function LanguageProvider({ children }) {
  // Store user language preference in localStorage with key 'app_language', fallback to 'en'
  const [language, setLanguage] = useLocalStorage("app_language", "en");

  // Translation helper supporting dot notation (e.g. 'group.essentials')
  const t = (key, defaultValue = "") => {
    const langData = translations[language] || translations.en;
    const keys = key.split(".");
    
    let current = langData;
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        return defaultValue || key;
      }
    }
    
    return typeof current === "string" ? current : (defaultValue || key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
