import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
            {/* Light Mode Button */}
            <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-md transition-all ${theme === 'light'
                    ? 'bg-white dark:bg-slate-700 text-yellow-500 shadow-sm'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
                    }`}
                aria-label="Light mode"
                title="Light mode"
            >
                <Sun className="w-4 h-4" />
            </button>

            {/* System Mode Button */}
            <button
                onClick={() => setTheme('system')}
                className={`p-2 rounded-md transition-all ${theme === 'system'
                    ? 'bg-white dark:bg-slate-700 text-blue-500 shadow-sm'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
                    }`}
                aria-label="System mode"
                title="System mode"
            >
                <Monitor className="w-4 h-4" />
            </button>

            {/* Dark Mode Button */}
            <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-md transition-all ${theme === 'dark'
                    ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
                    }`}
                aria-label="Dark mode"
                title="Dark mode"
            >
                <Moon className="w-4 h-4" />
            </button>
        </div>
    );
}
