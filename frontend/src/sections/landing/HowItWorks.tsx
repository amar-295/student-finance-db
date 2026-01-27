import { ScrollSection } from '../../components/ui/scroll-section';
import { Target, ShieldCheck, Sparkles } from 'lucide-react';

const steps = [
    {
        step: "01",
        title: "Secure Connection",
        desc: "Securely sync your university accounts with read-only access. We use institutional-grade encryption to keep your data invisible to everyone but you.",
        icon: ShieldCheck
    },
    {
        step: "02",
        title: "Intelligent Clarity",
        desc: "Our AI automatically categorizes every transaction. See exactly where your money goes in real-time, from rent to rapid-fire coffee runs.",
        icon: Sparkles
    },
    {
        step: "03",
        title: "Strategic Growth",
        desc: "Set visual goals and receive predictive alerts before you overspend. Build a financial foundation that lasts long after graduation.",
        icon: Target
    }
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 md:py-48 relative overflow-hidden bg-muted/10">
            <div className="absolute top-0 left-0 w-full">
                <div className="divider-glow opacity-30" />
            </div>
            <div className="container px-4">
                <ScrollSection animation="fade-up">
                    <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 uppercase">Modern Onboarding</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">Financial mastery shouldn't be a full-time job. Our streamlined process gets you set up and saving in under two minutes.</p>
                    </div>
                </ScrollSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative max-w-6xl mx-auto">
                    {/* Visual Path (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent z-0" />

                    {steps.map((item, i) => (
                        <ScrollSection key={i} animation="scale-up" delay={i * 0.2} className="relative z-10 group">
                            <div className="flex flex-col items-center text-center px-4">
                                <div className="relative mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-background border border-border/50 flex items-center justify-center text-primary shadow-sm group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-500 group-hover:-translate-y-1">
                                        <item.icon className="w-8 h-8" />
                                    </div>
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center border-4 border-background shadow-sm">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight mb-4 text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-medium">
                                    {item.desc}
                                </p>
                            </div>
                        </ScrollSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
