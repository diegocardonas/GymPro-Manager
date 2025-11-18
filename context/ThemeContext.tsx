import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { themes } from '../themes';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setThemeByName: (name: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme-name') || 'default';
    }
    return 'default';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
             (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const theme = themes.find(t => t.name === themeName) || themes[0];
    const palette = isDarkMode ? theme.dark : theme.light;

    root.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    root.style.setProperty('--primary', palette.primary);
    root.style.setProperty('--primary-foreground', palette['primary-foreground']);

    localStorage.setItem('theme-name', themeName);

  }, [themeName, isDarkMode]);

  const setThemeByName = useCallback((name: string) => {
    setThemeName(name);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const theme = useMemo(() => themes.find(t => t.name === themeName) || themes[0], [themeName]);

  const value = useMemo(() => ({
    theme,
    setThemeByName,
    isDarkMode,
    toggleDarkMode
  }), [theme, setThemeByName, isDarkMode, toggleDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
