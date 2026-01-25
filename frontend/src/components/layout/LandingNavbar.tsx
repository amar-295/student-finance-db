import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function LandingNavbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'About', href: '#about' },
    ];

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-3 shadow-lg shadow-black/5 dark:shadow-none light:border-border/80'
                    : 'bg-transparent py-4 md:py-6'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            U
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground">UniFlow</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="mr-2"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                        <Link to="/login">
                            <Button variant="ghost">Log in</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="glow">Get Started</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                        <button
                            className="text-foreground p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-background md:hidden flex flex-col animate-in fade-in slide-in-from-top-10 duration-300">
                    {/* Overlay Header (Spatial Clarity) */}
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between border-b border-border/50">
                        {/* Logo in Overlay */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-md">
                                U
                            </div>
                            <span className="font-bold tracking-tight">UniFlow</span>
                        </div>

                        {/* Actions in Overlay */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="opacity-70 hover:opacity-100 transition-opacity" // De-prioritized vs Close
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                            <button
                                className="text-foreground p-2 hover:bg-muted rounded-full transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X className="h-7 w-7" /> {/* visually dominant */}
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-3xl font-bold text-foreground hover:text-primary active:scale-95 transition-all" // Anchored & Responsive
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="flex flex-col gap-4 w-full px-8 max-w-sm mt-12">
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full h-12 text-lg font-semibold">Log in</Button>
                            </Link>
                            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button variant="glow" className="w-full">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
