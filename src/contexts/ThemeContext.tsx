'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the possible theme types
type Theme = 'dark';

// Define the shape of the theme context
interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

// Create the theme context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component that wraps app
export const ThemeProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    // Always set to dark mode
    const [theme, setTheme] = useState<Theme>('dark');

    // Effect to apply theme class to document on mount
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove all theme classes and add dark class
        root.classList.remove('light');
        root.classList.add('dark');

        // Set a data attribute for specific CSS targeting
        root.setAttribute('data-theme', 'dark');

        // Force dark color scheme for best readability
        const meta = document.querySelector('meta[name="color-scheme"]');
        if (meta) {
            meta.setAttribute('content', 'dark');
        } else {
            const newMeta = document.createElement('meta');
            newMeta.name = 'color-scheme';
            newMeta.content = 'dark';
            document.head.appendChild(newMeta);
        }

    }, []);

    const value = {
        theme,
        setTheme: () => { }, // Empty function as we're enforcing dark mode only
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 