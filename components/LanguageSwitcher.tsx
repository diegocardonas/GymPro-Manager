
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 rounded-full p-1">
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors flex items-center gap-1 ${i18n.language.startsWith('en') ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}
                aria-label={t('components.languageSwitcher.english')}
            >
                <span className="text-base">🇺🇸</span>
                <span>EN</span>
            </button>
            <button
                onClick={() => changeLanguage('es')}
                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors flex items-center gap-1 ${i18n.language.startsWith('es') ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300'}`}
                aria-label={t('components.languageSwitcher.spanish')}
            >
                <span className="text-base">🇨🇴</span>
                <span>ES</span>
            </button>
        </div>
    );
};

export default LanguageSwitcher;
