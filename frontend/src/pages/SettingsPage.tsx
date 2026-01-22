import { useState } from 'react';
import {
    ProfileSettings,
    PreferencesSettings,
    CategorySettings
} from '../components/settings';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: 'person' },
        { id: 'preferences', label: 'Preferences', icon: 'settings' },
        { id: 'categories', label: 'Categories', icon: 'category' },
        { id: 'security', label: 'Security', icon: 'security' },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <h1 className="text-3xl font-bold text-[#1e293b] dark:text-white">Settings</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 shrink-0 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Content Area */}
                <main className="flex-grow bg-white dark:bg-[#1e293b] rounded-2xl p-8 border border-gray-100 dark:border-white/10 shadow-sm min-h-[600px]">
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'preferences' && <PreferencesSettings />}
                    {activeTab === 'categories' && <CategorySettings />}
                    {activeTab === 'security' && (
                        <div className="text-center py-12 text-gray-500">
                            <span className="material-symbols-outlined text-4xl mb-2">lock</span>
                            <p>Security settings coming soon.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
