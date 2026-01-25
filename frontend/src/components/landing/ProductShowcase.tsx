import { motion } from 'framer-motion';
import { TiltCard } from '../ui/tilt-card';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { DollarSign, Wallet, TrendingUp, ArrowDownRight, CreditCard } from 'lucide-react';

export const ProductShowcase = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container px-4">
                {/* Visual Browser Window Wrapper */}
                <div className="relative mx-auto max-w-5xl rounded-xl border border-border/50 bg-background/50 shadow-2xl backdrop-blur-xl overflow-hidden">
                    {/* Browser Header */}
                    <div className="flex items-center gap-2 border-b border-border/50 bg-muted/20 px-4 py-3">
                        <div className="flex gap-1.5">
                            <div className="h-3 w-3 rounded-full bg-red-500/80" />
                            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <div className="mx-auto w-1/3 h-6 rounded-md bg-muted/40 text-[10px] flex items-center justify-center text-muted-foreground font-mono">
                            uniflow.app/dashboard
                        </div>
                    </div>

                    {/* Fake Dashboard Content */}
                    <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        {/* Background Decoration */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

                        {/* Card 1: Balance (Big) */}
                        <div className="md:col-span-2">
                            <TiltCard className="h-full">
                                <Card className="h-full border-primary/10 bg-gradient-to-br from-background to-secondary/30">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                                        <DollarSign className="h-4 w-4 text-primary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold">$12,450.00</div>
                                        <p className="text-sm text-emerald-500 flex items-center mt-1">
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            +15% this month
                                        </p>
                                        {/* Fake Chart Line */}
                                        <div className="mt-6 h-16 w-full flex items-end gap-1">
                                            {[40, 60, 45, 70, 80, 65, 85, 90].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    whileInView={{ height: `${h}%` }}
                                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                                    className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-sm transition-colors"
                                                />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TiltCard>
                        </div>

                        {/* Card 2: Recent Activity (Small) */}
                        <div className="md:col-span-1 space-y-4">
                            <TiltCard>
                                <Card className="border-border/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-red-500/10 rounded-full text-red-500"><Wallet className="h-4 w-4" /></div>
                                                <div className="text-sm font-medium">Rent</div>
                                            </div>
                                            <span className="text-sm font-bold text-red-500">-$850</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500"><ArrowDownRight className="h-4 w-4" /></div>
                                                <div className="text-sm font-medium">Salary</div>
                                            </div>
                                            <span className="text-sm font-bold text-emerald-500">+$2,400</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-amber-500/10 rounded-full text-amber-500"><CreditCard className="h-4 w-4" /></div>
                                                <div className="text-sm font-medium">Grocery</div>
                                            </div>
                                            <span className="text-sm font-bold text-red-500">-$120</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TiltCard>

                            {/* Floating Pill */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg flex items-center justify-between"
                            >
                                <div className="text-sm font-bold">Budget Status</div>
                                <div className="text-xs bg-white/20 px-2 py-1 rounded">On Track</div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
