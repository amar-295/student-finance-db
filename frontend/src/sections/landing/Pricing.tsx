import { useState } from 'react';
import { ScrollSection } from '../../components/ui/scroll-section';
import { Button } from '../../components/ui/button';
import { Check, ArrowRight, Zap, Building2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Pricing() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <section id="pricing" className="py-32 md:py-48 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full">
                <div className="divider-glow opacity-30" />
            </div>
            <div className="container px-4 md:px-6">
                <ScrollSection animation="fade-up">
                    <div className="max-w-3xl mx-auto mb-16 text-center flex flex-col items-center">
                        <h2 className="text-3xl md:text-6xl font-black tracking-tight mb-6 uppercase">Flexible Pricing</h2>
                        <p className="text-xl text-muted-foreground mb-10">Choose the plan that fits your student journey. Upgrade, downgrade, or cancel anytime.</p>

                        {/* SaaS Billing Toggle */}
                        <div className="flex items-center gap-4 bg-muted/50 p-1.5 rounded-full border border-border/50 mb-4">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-bold transition-all",
                                    billingCycle === 'monthly' ? "bg-background shadow-lg text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-bold transition-all relative",
                                    billingCycle === 'yearly' ? "bg-background shadow-lg text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Yearly
                                <span className="absolute -top-3 -right-6 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                                    -20%
                                </span>
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                            {billingCycle === 'yearly' ? "Billed annually at $48/year" : "Billed monthly"}
                        </p>
                    </div>
                </ScrollSection>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
                    {/* Core Tier */}
                    <ScrollSection animation="scale-up" delay={0.1}>
                        <div className="relative h-full rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 hover:bg-background/40 dark:hover:bg-primary/10 dark:hover:shadow-primary/20 border-glass">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    Student Core
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">Essential tracking for the basics.</p>
                            </div>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-5xl font-black text-foreground">$0</span>
                                <span className="text-muted-foreground text-sm">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-grow">
                                {[
                                    "Real-time expense tracking",
                                    "3 Smart budget categories",
                                    "Basic Shared Bill Splits",
                                    "Bank-grade security",
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-foreground/80">
                                        <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/signup">
                                <Button variant="outline" className="w-full rounded-2xl h-12">
                                    Get Started
                                </Button>
                            </Link>
                            <p className="text-[10px] text-center text-muted-foreground mt-4 font-medium uppercase tracking-widest">No credit card required</p>
                        </div>
                    </ScrollSection>

                    {/* Pro Tier (Featured) */}
                    <ScrollSection animation="scale-up" delay={0.2}>
                        <div className="relative h-full rounded-[2.5rem] border-2 border-primary bg-background/40 backdrop-blur-xl p-8 flex flex-col shadow-2xl shadow-primary/10 transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                            <div className="absolute top-0 right-0 py-2 px-8 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-3xl shadow-lg z-10">
                                Recommended
                            </div>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2 text-primary flex items-center gap-2">
                                    <Zap className="w-5 h-5 fill-current" />
                                    UniFlow Pro
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">For students serious about wealth building.</p>
                            </div>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-5xl font-black text-foreground">
                                    ${billingCycle === 'monthly' ? '5' : '4'}
                                </span>
                                <span className="text-muted-foreground text-sm">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-grow">
                                {[
                                    "Unlimited budget categories",
                                    "Unlimited roommates & splits",
                                    "AI-POWERED Savings Forecasts",
                                    "Custom transaction labeling",
                                    "Priority Customer Support",
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-foreground">
                                        <Check className="w-5 h-5 text-primary shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/signup" className="block w-full">
                                <Button variant="glow" className="w-full rounded-2xl h-14 group text-lg">
                                    Upgrade to Pro
                                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                                <ShieldCheck className="w-3 h-3" />
                                Cancel anytime
                            </div>
                        </div>
                    </ScrollSection>

                    {/* University Tier */}
                    <ScrollSection animation="scale-up" delay={0.4}>
                        <div className="relative h-full rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 hover:bg-background/40 dark:hover:bg-primary/10 dark:hover:shadow-primary/20 border-glass">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-[50px] group-hover:bg-primary/10 transition-colors duration-500" />
                            <div className="mb-6 relative z-10">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-muted-foreground" />
                                    University
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">Bulk licenses for student organizations.</p>
                            </div>
                            <div className="mb-8">
                                <span className="text-3xl font-black text-foreground uppercase">Custom</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-grow">
                                {[
                                    "Management Dashboard",
                                    "Dedicated Success Manager",
                                    "Custom onboarding for students",
                                    "Advanced privacy controls",
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-foreground/80">
                                        <Check className="w-5 h-5 text-muted-foreground shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/contact">
                                <Button variant="outline" className="w-full rounded-2xl h-12">
                                    Contact Sales
                                </Button>
                            </Link>
                            <p className="text-[10px] text-center text-muted-foreground mt-4 font-medium uppercase tracking-widest text-balance">Verify with .edu domain</p>
                        </div>
                    </ScrollSection>
                </div>
            </div>
        </section>
    );
}
