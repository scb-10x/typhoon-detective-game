'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    currentTheme: 'light' | 'dark'; // The actual applied theme after system preference
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Initialize theme from localStorage or default to system
    const [theme, setThemeState] = useState<Theme>('system');
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

    // Set the theme in both state and localStorage
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // On mount, load saved theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            setThemeState(savedTheme);
        }
    }, []);

    // Update the document with the current theme
    useEffect(() => {
        // Determine if we should use dark mode
        let isDark = false;

        if (theme === 'dark') {
            isDark = true;
        } else if (theme === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        // Update the document and state with the current theme
        if (isDark) {
            document.documentElement.classList.add('dark');
            setCurrentTheme('dark');
        } else {
            document.documentElement.classList.remove('dark');
            setCurrentTheme('light');
        }
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            if (mediaQuery.matches) {
                document.documentElement.classList.add('dark');
                setCurrentTheme('dark');
            } else {
                document.documentElement.classList.remove('dark');
                setCurrentTheme('light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, currentTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
} 