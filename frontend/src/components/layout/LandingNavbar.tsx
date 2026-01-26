import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

export function LandingNavbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    // Active Section Tracking
    useEffect(() => {
        const sections = navLinks.map(link => link.href.substring(1));
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

    }, []);

    // Body Scroll Lock
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Pricing', href: '#pricing' },
    ];

    return (
        <>
            <motion.nav
                className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={`mx-auto transition-all duration-500 ${isScrolled ? 'container border-glass rounded-full py-2 px-4 md:px-6 shadow-lg shadow-primary/5 bg-background/60 backdrop-blur-xl' : 'container bg-transparent py-4'}`}>
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                                U
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground">UniFlow</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1 bg-background/50 border border-border/40 rounded-full p-1 backdrop-blur-sm">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 ${activeSection === link.href.substring(1)
                                        ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            <ThemeToggle className="mr-2" />
                            <Button variant="ghost" size="sm" className="hidden lg:inline-flex" asChild>
                                <Link to="/login">Log in</Link>
                            </Button>
                            <Button variant="glow" size="sm" asChild>
                                <Link to="/signup">Get Started</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center gap-4">
                        <ThemeToggle />
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
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-[40] bg-background/95 backdrop-blur-3xl md:hidden flex flex-col pt-32"
                    >
                        {/* Navigation Links */}
                        <div className="flex-1 flex flex-col items-center justify-start space-y-8 px-4">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                    className={`text-3xl font-bold transition-all duration-300 ${activeSection === link.href.substring(1)
                                        ? 'text-primary scale-110'
                                        : 'text-foreground hover:text-primary active:scale-95'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </motion.a>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col gap-4 w-full max-w-sm mt-8"
                            >
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full h-14 text-lg font-semibold rounded-2xl border-border/50">Log in</Button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="glow" className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20">Get Started</Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
