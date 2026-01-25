import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import MobileNavigation from './MobileNavigation';
import { CommandMenu } from '../ui/command-menu';
import { useHotkeys } from 'react-hotkeys-hook';
import { useState } from 'react';
import { ShortcutsHelp } from '../ui/shortcuts-help';
import { useSmartNotifications } from '../../hooks/useSmartNotifications';
import { useAchievements } from '../../hooks/useAchievements';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const [showShortcuts, setShowShortcuts] = useState(false);

    // Global Logic
    useSmartNotifications(); // Active on all dashboard pages
    useAchievements(); // Gamification System

    // Global Shortcuts
    useHotkeys('shift+?', () => setShowShortcuts(true)); // ? is shift+/ usually
    useHotkeys('g+d', () => navigate('/dashboard'));
    useHotkeys('g+t', () => navigate('/transactions'));
    useHotkeys('g+b', () => navigate('/budgets'));
    useHotkeys('g+r', () => navigate('/reports'));
    useHotkeys('g+s', () => navigate('/settings'));

    // Page specific shortcuts should be handled in pages, but Help is global

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
                    <Outlet />
                </main>
            </div>
            <MobileNavigation />
            <CommandMenu />
            <ShortcutsHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
        </div>
    );
}
