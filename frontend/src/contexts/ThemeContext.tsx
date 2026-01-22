import React, { createContext, useContext, useEffect, useState } from 'react';

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

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

    // Detect system preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                const newTheme = e.matches ? 'dark' : 'light';
                setResolvedTheme(newTheme);
                updateDOM(newTheme);
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [theme]);

    // Update resolved theme when theme changes
    useEffect(() => {
        let newResolvedTheme: ResolvedTheme;

        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            newResolvedTheme = systemPrefersDark ? 'dark' : 'light';
        } else {
            newResolvedTheme = theme;
        }

        setResolvedTheme(newResolvedTheme);
        updateDOM(newResolvedTheme);
    }, [theme]);

    const updateDOM = (resolvedTheme: ResolvedTheme) => {
        const root = document.documentElement;

        // Add transition class
        root.classList.add('theme-transitioning');

        if (resolvedTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Remove transition class after animation
        setTimeout(() => {
            root.classList.remove('theme-transitioning');
        }, 300);
    };

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
