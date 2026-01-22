export default function PreferencesSettings() {
    return (
        <div className="max-w-xl animate-fade-in">
            <h2 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-6">Preferences</h2>

            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-bold text-[#1e293b] dark:text-white mb-4">Appearance</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {['light', 'dark', 'system'].map((theme) => (
                            <button
                                key={theme}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'system'
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20'
                                    }`}
                            >
                                <span className="material-symbols-outlined">
                                    {theme === 'light' ? 'light_mode' : theme === 'dark' ? 'dark_mode' : 'computer'}
                                </span>
                                <span className="capitalize font-medium">{theme}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-[#1e293b] dark:text-white mb-4">Regional</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                            <div>
                                <p className="font-bold">Currency</p>
                                <p className="text-sm text-gray-500">Default currency for all accounts</p>
                            </div>
                            <select className="bg-transparent font-bold text-primary outline-none">
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="INR">INR (₹)</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                            <div>
                                <p className="font-bold">Date Format</p>
                                <p className="text-sm text-gray-500">How dates are displayed</p>
                            </div>
                            <select className="bg-transparent font-bold text-primary outline-none">
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
