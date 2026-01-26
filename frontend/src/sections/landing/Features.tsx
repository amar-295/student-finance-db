import { ScrollSection } from '../../components/ui/scroll-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Shield, PieChart, Smartphone, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

const features = [
    {
        title: "Strategic Wealth",
        description: "Set intelligent limits and track expenses with AI-powered, student-first categorization.",
        icon: PieChart,
        colSpan: "col-span-1 md:col-span-2",
        bg: "bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
    },
    {
        title: "Team Settlement",
        description: "Zero-friction bill splitting. Manage rent, utilities, and groceries without the social stress.",
        icon: Users,
        colSpan: "col-span-1",
        bg: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
    },
    {
        title: "Protocol Security",
        description: "Institutional-grade AES-256 local encryption. Your data stays invisible to us.",
        icon: Shield,
        colSpan: "col-span-1",
        bg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10"
    },
    {
        title: "On-Campus Speed",
        description: "High-fidelity mobile experience designed for managing finances on the move.",
        icon: Smartphone,
        colSpan: "col-span-1 md:col-span-2",
        bg: "bg-gradient-to-br from-orange-500/10 to-red-500/10"
    }
];

export function Features() {
    return (
        <section id="features" className="py-32 md:py-48 relative">
            <div className="container px-4 md:px-6">
                <ScrollSection animation="fade-up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to master your money</h2>
                        <p className="text-xl text-muted-foreground">Detailed insights and powerful tools, wrapped in a beautiful interface.</p>
                    </div>
                </ScrollSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {features.map((feature, i) => (
                        <ScrollSection key={i} className={feature.colSpan} animation="mask-reveal" delay={i * 0.1}>
                            <Card className={cn("h-full relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 hover:bg-background/40 dark:hover:bg-primary/10 dark:hover:shadow-primary/20 border-glass", feature.bg)}>
                                <div className="absolute inset-0 bg-background/20 transition-colors group-hover:bg-background/10" />
                                <CardHeader className="relative z-10">
                                    <div className="w-12 h-12 rounded-lg bg-background border border-border/50 flex items-center justify-center mb-4 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <CardDescription className="text-base text-foreground/80 font-medium leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </ScrollSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
