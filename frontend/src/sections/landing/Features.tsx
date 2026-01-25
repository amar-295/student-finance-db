import { ScrollSection } from '../../components/ui/scroll-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Shield, PieChart, Smartphone, Users } from 'lucide-react';

const features = [
    {
        title: "Smart Budgeting",
        description: "Set monthly limits and track expenses with AI-powered categorization.",
        icon: PieChart,
        colSpan: "col-span-1 md:col-span-2",
        bg: "bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
    },
    {
        title: "Bill Splitting",
        description: "Easily split rent, utilities, and groceries with roommates.",
        icon: Users,
        colSpan: "col-span-1",
        bg: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
    },
    {
        title: "Bank Encryption",
        description: "Your data is secured with AES-256 bit encryption standard.",
        icon: Shield,
        colSpan: "col-span-1",
        bg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10"
    },
    {
        title: "Mobile First",
        description: "Manage your finances on the go with our dedicated mobile experience.",
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
                        <ScrollSection key={i} className={feature.colSpan} animation="scale-up" delay={i * 0.1}>
                            <Card className={`h-full border border-border/40 relative overflow-hidden group transition-all duration-300 hover:border-primary/30 hover:shadow-md ${feature.bg}`}>
                                <div className="absolute inset-0 bg-background/50 transition-colors group-hover:bg-background/30" />
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
