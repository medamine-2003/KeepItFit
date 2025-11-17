import React, { createContext, useState, useContext, useEffect } from "react";
import { I18nManager } from "react-native";
import * as SecureStore from "expo-secure-store";
import { translations, Language, TranslationKey } from "../utils/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: TranslationKey) => key,
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Load saved language preference
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await SecureStore.getItemAsync("language");
      if (savedLanguage === "en" || savedLanguage === "ar") {
        setLanguageState(savedLanguage);
        setIsRTL(savedLanguage === "ar");
      }
    } catch (error) {
      console.error("Failed to load language preference:", error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await SecureStore.setItemAsync("language", lang);
      setLanguageState(lang);
      const rtl = lang === "ar";
      setIsRTL(rtl);
      
      // Update RTL layout
      if (I18nManager.isRTL !== rtl) {
        I18nManager.forceRTL(rtl);
        // Note: App needs to be restarted for RTL to take full effect
      }
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
