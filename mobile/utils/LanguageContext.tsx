import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'hi';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (en: string, hi: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem('appLanguage');
            if (saved === 'hi' || saved === 'en') {
                setLanguage(saved as Language);
            }
        })();
    }, []);

    const changeLanguage = async (lang: Language) => {
        setLanguage(lang);
        await AsyncStorage.setItem('appLanguage', lang);
    };

    const t = (en: string, hi: string) => (language === 'en' ? en : hi);

    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
