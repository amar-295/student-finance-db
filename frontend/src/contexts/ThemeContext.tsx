
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        // Get saved theme from localStorage
        const savedTheme = localStorage.getItem('uniflow-theme') as Theme;
        return savedTheme || 'system';
    });

    // Initial resolved theme based on current theme state
    const getInitialResolvedTheme = (currentTheme: Theme): ResolvedTheme => {
        if (currentTheme === 'system') {
            if (typeof window !== 'undefined' && window.matchMedia) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            return 'light'; // Default SSR/fallback
        }
        return currentTheme;
    };

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => getInitialResolvedTheme(theme));

    const updateDOM = useCallback((newResolvedTheme: ResolvedTheme) => {
        const root = document.documentElement;

        // Add transition class
        root.classList.add('theme-transitioning');

        if (newResolvedTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Remove transition class after animation
        setTimeout(() => {
            root.classList.remove('theme-transitioning');
        }, 150);
    }, []);

    // Effect to handle theme changes and system preference updates
    useEffect(() => {
        const handleThemeUpdate = () => {
            const newResolvedTheme = getInitialResolvedTheme(theme);
            setResolvedTheme(newResolvedTheme);
            updateDOM(newResolvedTheme);
        };

        handleThemeUpdate(); // Run immediately on theme change

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const listener = (e: MediaQueryListEvent) => {
                const newTheme = e.matches ? 'dark' : 'light';
                setResolvedTheme(newTheme);
                updateDOM(newTheme);
            };
            mediaQuery.addEventListener('change', listener);
            return () => mediaQuery.removeEventListener('change', listener);
        }
    }, [theme, updateDOM]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('uniflow-theme', newTheme);
    };

    const toggleTheme = () => {
        if (resolvedTheme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
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
