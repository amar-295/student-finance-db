import { ScrollSection } from '../../components/ui/scroll-section';

const steps = [
    { step: "01", title: "Connect", desc: "Securely link your university accounts or add transactions manually in seconds." },
    { step: "02", title: "Track", desc: "See exactly where your money goes with AI-powered, real-time categorization." },
    { step: "03", title: "Save", desc: "Get smart alerts and visual goals that help you reach your savings targets faster." }
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 md:py-48 relative overflow-hidden bg-muted/30">
            <div className="container px-4">
                <ScrollSection animation="fade-up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Start your journey in minutes</h2>
                        <p className="text-xl text-muted-foreground">Mastering your finances shouldn't be a second full-time job. Here's our simple 3-step process.</p>
                    </div>
                </ScrollSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2rem] left-0 w-full h-px bg-border/30 z-0" />

                    {steps.map((item, i) => (
                        <ScrollSection key={i} animation="scale-up" delay={i * 0.2} className="relative z-10">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-black mb-4 shadow-xl shadow-primary/20">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        </ScrollSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
