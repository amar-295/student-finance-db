import { ScrollSection } from '../../components/ui/scroll-section';
import { PieChart, Users } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import { useState } from 'react';
import dashboardMockup from '../../assets/dashboard_mockup.webp';

export function Showcase() {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            <div className="container px-4 md:px-6">
                <ScrollSection animation="fade-up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 uppercase">High-Fidelity Command</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                            Managing thousands of transactions shouldn't feel like a chore. Our interface is engineered for speed, clarity, and deep financial insight.
                        </p>
                    </div>
                </ScrollSection>

                <ScrollSection animation="scale-up" delay={0.2}>
                    <div className="relative max-w-5xl mx-auto group">
                        {/* Ambient Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-accent/20 to-primary/20 rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />

                        {/* Mockup Container */}
                        <div className="relative rounded-[2rem] p-2 md:p-4 shadow-2xl overflow-hidden shadow-primary/5 transition-transform duration-500 transform group-hover:scale-[1.01] border-glass">
                            {/* Skeleton Loader */}
                            {!isLoaded && (
                                <Skeleton className="absolute inset-0 z-10 rounded-[1.5rem] scale-[0.98]" />
                            )}

                            <img
                                src={dashboardMockup}
                                alt="UniFlow Dashboard Mockup"
                                width={1280}
                                height={832}
                                loading="lazy"
                                decoding="async"
                                onLoad={() => setIsLoaded(true)}
                                className={`rounded-[1.5rem] w-full shadow-lg transition-[opacity,transform] duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                    }`}
                            />

                            {/* Floating Feature Tags (Desktop only) - ROI Callouts */}
                            <div className="absolute top-[20%] -left-12 hidden lg:flex items-center gap-3 bg-card/90 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-xl animate-float">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <PieChart className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black">AI Forecast</p>
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase">Saves $45/mo avg</p>
                                </div>
                            </div>

                            <div className="absolute bottom-[15%] -right-12 hidden lg:flex items-center gap-3 bg-card/90 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-xl animate-float-delayed">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black">Team Splits</p>
                                    <p className="text-[10px] text-primary/80 font-black uppercase">Instant Settling</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollSection>
            </div>
        </section>
    );
}
