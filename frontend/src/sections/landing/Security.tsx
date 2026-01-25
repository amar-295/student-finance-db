import { ScrollSection } from '../../components/ui/scroll-section';
import { Shield, Smartphone, Github } from 'lucide-react';

export function Security() {
    return (
        <section className="py-24 md:py-32 bg-card/50 border-y border-border/50">
            <div className="container px-4 md:px-6">
                <ScrollSection animation="fade-up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Financial Data, Safe & Sound</h2>
                        <p className="text-xl text-muted-foreground">We believe your financial data belongs to you. No ads, no selling data, just privacy.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-background/50 border border-border/50 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 transition-transform duration-300 group-hover:scale-110">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Bank-Grade Encryption</h3>
                            <p className="text-muted-foreground">Your data is encrypted with AES-256 standards locally and in transit.</p>
                        </div>
                        <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-background/50 border border-border/50 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 transition-transform duration-300 group-hover:scale-110">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No Ads, No Tracking</h3>
                            <p className="text-muted-foreground">We don't sell your data to advertisers. You are the customer, not the product.</p>
                        </div>
                        <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-background/50 border border-border/50 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 transition-transform duration-300 group-hover:scale-110">
                                <Github className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Open Source Core</h3>
                            <p className="text-muted-foreground">Our core logic is transparent. Verify how we handle numbers yourself.</p>
                        </div>
                    </div>
                </ScrollSection>
            </div>
        </section>
    );
}
