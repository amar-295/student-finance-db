import { ScrollSection } from '../../components/ui/scroll-section';
import { Shield, Smartphone, Github } from 'lucide-react';

export function Security() {
    return (
        <section className="py-24 md:py-32 bg-card/30 relative">
            <div className="absolute top-0 left-0 w-full">
                <div className="divider-glow opacity-30" />
            </div>
            <div className="container px-4 md:px-6">
                <ScrollSection animation="fade-up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 uppercase">Institutional Trust</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">We believe your financial data is a human right. No ads, no data harvesting, and zero-compromise encryption come standard.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-background/50 border border-border/40 shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-background/80 hover:shadow-md hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 transition-transform duration-300 group-hover:scale-110">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Local-First Encryption</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed font-medium">Your data is secured with AES-256 bit encryption. Keys are stored locally, meaning not even we can see your numbers.</p>
                        </div>
                        <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-background/50 border border-border/40 shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-background/80 hover:shadow-md hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 transition-transform duration-300 group-hover:scale-110">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Zero Surveillance</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed font-medium">We don't sell data to advertisers. Our business model is transparency, not your personal spending habits.</p>
                        </div>
                        <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-background/50 border border-border/40 shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-background/80 hover:shadow-md hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 transition-transform duration-300 group-hover:scale-110">
                                <Github className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Open Core Protocol</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed font-medium">Our calculation logic is open-source. Verify the math and the security protocols yourself on GitHub.</p>
                        </div>
                    </div>
                </ScrollSection>
            </div>
        </section>
    );
}
