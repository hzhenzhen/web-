import React, { createContext, useContext, useState } from 'react';

type LanguageContextType = {
  currentLanguage: 'en' | 'zh';
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'zh'>('zh');

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    setCurrentLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
