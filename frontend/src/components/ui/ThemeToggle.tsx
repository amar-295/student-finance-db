
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './button';

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            className="h-9 w-9 rounded-full relative transition-colors"
            title={`Current theme: ${theme} (Click to change)`}
        >
            {theme === 'system' ? (
                <Monitor className="h-[1.2rem] w-[1.2rem] text-foreground" />
            ) : resolvedTheme === 'dark' ? (
                <Moon className="h-[1.2rem] w-[1.2rem] text-foreground" />
            ) : (
                <Sun className="h-[1.2rem] w-[1.2rem] text-foreground" />
            )}
            {/* Small indicator dot for system mode */}
            {theme === 'system' && (
                <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
