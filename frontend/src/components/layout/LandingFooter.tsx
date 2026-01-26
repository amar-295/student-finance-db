import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin } from 'lucide-react';

export function LandingFooter() {
    return (
        <footer className="py-12 md:py-20 border-t border-border/80 bg-background/95 relative z-10 transition-colors">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">U</div>
                            <span className="font-bold text-xl tracking-tight">UniFlow</span>
                        </Link>
                        <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed font-medium">
                            Engineered for financial command. UniFlow empowers students with institutional-grade insights to build a foundation for long-term wealth.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" aria-label="Twitter" className="p-2 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
                            <a href="#" aria-label="GitHub" className="p-2 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-primary"><Github className="h-5 w-5" /></a>
                            <a href="#" aria-label="LinkedIn" className="p-2 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Product</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
                            <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#security" className="hover:text-primary transition-colors">Security</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Resources</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Guide</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Student Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Legal</a></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
                        <p>© 2026 UniFlow Finance Inc. • Engineered for Students</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms</a>
                            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter text-muted-foreground border border-border/50">
                            v1.0.4-stable
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
