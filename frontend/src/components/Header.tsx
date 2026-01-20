import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img src="/images/logo.svg" alt="UniFlow Logo" className="w-10 h-10 object-contain" />
                    <span className="text-xl font-display font-bold text-text-main dark:text-white tracking-tight">UniFlow</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <a className="text-sm font-semibold text-text-muted hover:text-primary transition-colors" href="#">Features</a>
                    <a className="text-sm font-semibold text-text-muted hover:text-primary transition-colors" href="#">Pricing</a>
                    <a className="text-sm font-semibold text-text-muted hover:text-primary transition-colors" href="#">Community</a>
                </nav>
                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Link to="/login" className="hidden sm:block text-sm font-bold text-text-main hover:text-primary dark:text-white transition-colors">Log In</Link>
                    <Link to="/signup" className="hidden sm:block bg-primary hover:bg-primary-dark text-white text-sm font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95">
                        Get Started
                    </Link>
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden flex items-center justify-center p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
                    <nav className="flex flex-col gap-4">
                        <a className="text-base font-semibold text-text-main dark:text-white hover:text-primary py-2" href="#" onClick={() => setIsMenuOpen(false)}>Features</a>
                        <a className="text-base font-semibold text-text-main dark:text-white hover:text-primary py-2" href="#" onClick={() => setIsMenuOpen(false)}>Pricing</a>
                        <a className="text-base font-semibold text-text-main dark:text-white hover:text-primary py-2" href="#" onClick={() => setIsMenuOpen(false)}>Community</a>
                    </nav>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                    <Link to="/login" className="text-base font-bold text-center text-text-main dark:text-white hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                    <Link to="/signup" className="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30 transition-all w-full text-center" onClick={() => setIsMenuOpen(false)}>
                        Get Started
                    </Link>
                </div>
            )}
        </header>
    )
}
