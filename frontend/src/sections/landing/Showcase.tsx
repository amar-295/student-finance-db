import { ScrollSection } from '../../components/ui/scroll-section';
import { PieChart, Users } from 'lucide-react';
import dashboardMockup from '../../assets/dashboard_mockup.png';

export function Showcase() {
    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            <div className="container px-4 md:px-6">
                <ScrollSection animation="fade-up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Designed for the modern student</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            A high-fidelity interface that makes managing thousands of transactions feel like a breeze. Simple, powerful, and built for your speed.
                        </p>
                    </div>
                </ScrollSection>

                <ScrollSection animation="scale-up" delay={0.2}>
                    <div className="relative max-w-5xl mx-auto group">
                        {/* Ambient Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-accent/20 to-primary/20 rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />

                        {/* Mockup Container */}
                        <div className="relative rounded-[2rem] border border-primary/20 bg-background/50 backdrop-blur-xl p-2 md:p-4 shadow-2xl overflow-hidden transform group-hover:scale-[1.01] transition-transform duration-700">
                            <img
                                src={dashboardMockup}
                                alt="UniFlow Dashboard Mockup"
                                className="rounded-[1.5rem] w-full shadow-lg"
                            />

                            {/* Floating Feature Tags (Desktop only) */}
                            <div className="absolute top-[20%] -left-12 hidden lg:flex items-center gap-3 bg-card/80 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-xl animate-float">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <PieChart className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">AI Predictions</p>
                                    <p className="text-xs text-muted-foreground">Monthly forecast ready</p>
                                </div>
                            </div>

                            <div className="absolute bottom-[15%] -right-12 hidden lg:flex items-center gap-3 bg-card/80 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-xl animate-float-delayed">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Team Splits</p>
                                    <p className="text-xs text-muted-foreground">Roommate balances synced</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollSection>
            </div>
        </section>
    );
}
