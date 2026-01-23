import React, { createContext, useContext, useEffect, useState } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';

interface SettingsState {
    currency: Currency;
    dateFormat: DateFormat;
}

interface SettingsContextType extends SettingsState {
    updateSettings: (settings: Partial<SettingsState>) => void;
}

const defaultSettings: SettingsState = {
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SettingsState>(() => {
        const saved = localStorage.getItem('uniflow-settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('uniflow-settings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings: Partial<SettingsState>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <SettingsContext.Provider value={{ ...settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
