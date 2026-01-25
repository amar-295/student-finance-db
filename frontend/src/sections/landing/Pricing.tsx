import { ScrollSection } from '../../components/ui/scroll-section';
import { Button } from '../../components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Pricing() {
    return (
        <section id="pricing" className="py-32 md:py-48 relative overflow-hidden text-center">
            <div className="container px-4 md:px-6">
                <ScrollSection animation="fade-up">
                    <div className="max-w-3xl mx-auto mb-20 text-center flex flex-col items-center">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 uppercase">Build your future, not your debt</h2>
                        <p className="text-xl text-muted-foreground">Transparent pricing for every stage of your student journey.</p>
                    </div>
                </ScrollSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
                    {/* Free Tier */}
                    <ScrollSection animation="scale-up">
                        <div className="h-full rounded-[2.5rem] border border-border/50 bg-card/30 backdrop-blur-sm p-10 flex flex-col transition-all duration-300 hover:border-border hover:bg-card/40">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">Student Core</h3>
                                <p className="text-muted-foreground text-sm">Everything you need to stay on top.</p>
                            </div>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-5xl font-black text-foreground">$0</span>
                                <span className="text-muted-foreground text-sm">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-grow">
                                {[
                                    "Real-time expense tracking",
                                    "3 Smart budget categories",
                                    "Shared Bill Splits (up to 3 people)",
                                    "Bank-grade security",
                                    "Basic financial insights"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/90">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/signup">
                                <Button variant="outline" className="w-full">
                                    Start with Core
                                </Button>
                            </Link>
                        </div>
                    </ScrollSection>

                    {/* Pro Tier */}
                    <ScrollSection animation="scale-up" delay={0.2}>
                        <div className="relative h-full rounded-[2.5rem] border-2 border-primary/50 bg-card/50 backdrop-blur-md p-10 flex flex-col shadow-2xl shadow-primary/10 transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                            <div className="absolute top-0 right-0 py-2 px-6 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-bl-2xl">
                                Most Popular
                            </div>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2 text-primary">UniFlow Pro</h3>
                                <p className="text-muted-foreground text-sm">For the serious wealth builder.</p>
                            </div>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-5xl font-black text-foreground">$5</span>
                                <span className="text-muted-foreground text-sm">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-grow">
                                {[
                                    "Unlimited budget categories",
                                    "Unlimited roommates & bill splits",
                                    "AI Savings Projections",
                                    "Custom transaction labels",
                                    "Priority CSV/JSON exports",
                                    "Early access to new features"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/90">
                                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/signup">
                                <Button variant="glow" className="w-full group">
                                    Go Pro
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    </ScrollSection>
                </div>
            </div>
        </section>
    );
}
