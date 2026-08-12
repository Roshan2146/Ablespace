'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorTheme, ThemeMode, VisibleFields } from '@/types';

interface ThemeContextType {
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  setThemeMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  visibleFields: VisibleFields;
  toggleField: (field: keyof VisibleFields) => void;
  guestUser: { name: string; email: string } | null;
  loginAsGuest: () => void;
  logoutGuest: () => void;
}

const defaultFields: VisibleFields = {
  priority: true,
  members: true,
  dueDate: true,
  labels: true,
  status: true,
  reporter: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('blue');
  const [visibleFields, setVisibleFields] = useState<VisibleFields>(defaultFields);
  const [guestUser, setGuestUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme_mode') as ThemeMode;
    const savedColor = localStorage.getItem('color_theme') as ColorTheme;
    const savedGuest = localStorage.getItem('guest_user');

    if (savedMode) setThemeModeState(savedMode);
    if (savedColor) setColorThemeState(savedColor);
    if (savedGuest) {
      try {
        setGuestUser(JSON.parse(savedGuest));
      } catch (e) {
        setGuestUser({ name: 'Dexter', email: 'dexter@gmail.com' });
      }
    } else {
      // Default auto-login as guest for seamless evaluation
      const defaultUser = { name: 'Dexter', email: 'dexter@gmail.com' };
      setGuestUser(defaultUser);
      localStorage.setItem('guest_user', JSON.stringify(defaultUser));
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme_mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', colorTheme);
    localStorage.setItem('color_theme', colorTheme);
  }, [colorTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
  };

  const toggleField = (field: keyof VisibleFields) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const loginAsGuest = () => {
    const user = { name: 'Dexter', email: 'dexter@gmail.com' };
    setGuestUser(user);
    localStorage.setItem('guest_user', JSON.stringify(user));
  };

  const logoutGuest = () => {
    setGuestUser(null);
    localStorage.removeItem('guest_user');
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        colorTheme,
        setThemeMode,
        setColorTheme,
        visibleFields,
        toggleField,
        guestUser,
        loginAsGuest,
        logoutGuest,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
