'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';

interface ThemeContextType {
    theme: 'dark';
    currentTheme: 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Force dark theme
    useEffect(() => {
        // Always apply dark mode
        document.documentElement.classList.add('dark');
    }, []);

    return (
        <ThemeContext.Provider value={{ theme: 'dark', currentTheme: 'dark' }}>
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