import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './button';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { setTheme, resolvedTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn("h-10 w-10 rounded-xl relative overflow-hidden group hover:bg-primary/10 transition-colors", className)}
            title={`Toggle theme (Current: ${resolvedTheme})`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {resolvedTheme === 'dark' ? (
                    <motion.div
                        key="sun"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="text-primary"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem]" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="text-primary"
                    >
                        <Moon className="h-[1.2rem] w-[1.2rem]" />
                    </motion.div>
                )}
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
