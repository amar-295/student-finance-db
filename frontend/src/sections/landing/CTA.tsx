import { ScrollSection } from '../../components/ui/scroll-section';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

export function CTA() {
    return (
        <section className="py-32 md:py-48 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
            <div className="absolute top-0 left-0 w-full">
                <div className="divider-glow opacity-30" />
            </div>
            <div className="container px-4 text-center">
                <ScrollSection animation="scale-up">
                    <div className="max-w-4xl mx-auto bg-card/40 backdrop-blur-xl border border-primary/20 rounded-[2.5rem] p-12 md:p-24 shadow-2xl relative overflow-hidden group text-center flex flex-col items-center">
                        {/* Decorative ambient light */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-colors duration-500" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px] group-hover:bg-accent/20 transition-colors duration-500" />

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter leading-tight relative text-foreground">
                            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary/80 text-glow">take control?</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed relative">
                            Join thousands of students graduating debt-free and financially savvy. Your journey starts now.
                        </p>
                        <Link to="/signup" className="relative">
                            <Button variant="glow" size="xl" className="shadow-primary/30">
                                Create Free Account
                            </Button>
                        </Link>
                        <div className="mt-8 flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground/80 relative">
                            <span>No credit card required</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </ScrollSection>
            </div>
        </section>
    );
}
