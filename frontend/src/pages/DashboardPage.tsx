import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TiltCard } from '../components/ui/tilt-card';
import { ScrollSection } from '../components/ui/scroll-section';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard } from 'lucide-react';
import { stagger, useAnimate, useReducedMotion } from 'framer-motion';
import type { CallBackProps } from 'react-joyride';
import Joyride, { STATUS } from 'react-joyride';
import confetti from 'canvas-confetti';
import { useTheme } from '../contexts/ThemeContext';
import { useBudgets } from '../hooks/useBudgets';
import { useTransactions } from '../hooks/useTransactions';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';

export default function DashboardPage() {
    const [scope, animate] = useAnimate();
    const shouldReduceMotion = useReducedMotion();
    const { theme } = useTheme();
    const [runTour, setRunTour] = useState(false);

    const { budgets, isLoading: budgetsLoading } = useBudgets();
    const { data: transactionsData, isLoading: transactionsLoading } = useTransactions(5);

    const isLoading = budgetsLoading || transactionsLoading;

    useEffect(() => {
        if (!isLoading && !shouldReduceMotion) {
            animate(
                '.dashboard-card',
                { opacity: [0, 1], y: [20, 0] },
                {
                    duration: 0.5,
                    delay: stagger(0.1),
                    ease: [0.22, 1, 0.36, 1]
                }
            );
        } else if (!isLoading) {
            animate('.dashboard-card', { opacity: 1, y: 0 }, { duration: 0 });
        }
    }, [isLoading, animate, shouldReduceMotion]);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenDashboardTour');
        if (!hasSeenTour && !isLoading) {
            setTimeout(() => setRunTour(true), 1500);
        }
    }, [isLoading]);

    const handleTourCallback = (data: CallBackProps) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
            setRunTour(false);
            localStorage.setItem('hasSeenDashboardTour', 'true');

            if (status === STATUS.FINISHED) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    };

    const tourSteps = [
        {
            target: '.total-balance-card',
            content: '👋 Welcome! This is your total balance across all accounts.',
            disableBeacon: true,
        },
        {
            target: '.add-transaction-button',
            content: '➕ Click here anytime to add a new transaction. Our AI will automatically categorize it!',
        },
        {
            target: '.recent-activity-card',
            content: '📝 See your latest transactions and spending history here.',
        },
        {
            target: '.quick-transfer-card',
            content: '💸 Quickly transfer money to friends or between accounts.',
        }
    ];

    const stats = [
        {
            title: 'Total Balance',
            value: '$12,450.80',
            icon: Wallet,
            trend: 'up',
            description: '+12% from last month',
            className: 'total-balance-card'
        },
        {
            title: 'Monthly Spending',
            value: '$3,240.20',
            icon: CreditCard,
            trend: 'down',
            description: '-5% from last month'
        },
        {
            title: 'Active Budgets',
            value: budgets.length.toString(),
            icon: DollarSign,
            trend: 'up',
            description: `${budgets.length} budgets active`
        }
    ];

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div ref={scope} className="space-y-12">
            <Joyride
                steps={tourSteps}
                run={runTour}
                continuous
                showProgress
                showSkipButton
                callback={handleTourCallback}
                styles={{
                    options: {
                        primaryColor: theme === 'dark' ? '#10B981' : '#0F172A',
                        zIndex: 1000,
                        arrowColor: theme === 'dark' ? '#1e293b' : '#fff',
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                        textColor: theme === 'dark' ? '#fff' : '#333',
                    }
                }}
            />

            <ScrollSection animation="fade-up">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Overview</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">Download Report</Button>
                        <Button className="shadow-glow add-transaction-button">Add Transaction</Button>
                    </div>
                </div>
            </ScrollSection>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <div key={index} className={`dashboard-card opacity-0 ${stat.className || ''}`}>
                        <TiltCard className="h-full">
                            <Card className="h-full border-l-4 border-l-primary hover:border-l-accent transition-all duration-300">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                                        {stat.trend === 'up' ? (
                                            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
                                        )}
                                        <span className={stat.trend === 'up' ? "text-emerald-500" : "text-rose-500"}>
                                            {stat.description}
                                        </span>
                                    </p>
                                </CardContent>
                            </Card>
                        </TiltCard>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 dashboard-card opacity-0 recent-activity-card">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            You made {transactionsData?.data?.length || 0} transactions recently.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center border-dashed border-2 rounded-md bg-muted/20">
                            <p className="text-muted-foreground">Chart Area (Coming Soon)</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 dashboard-card opacity-0 quick-transfer-card">
                    <CardHeader>
                        <CardTitle>Quick Transfer</CardTitle>
                        <CardDescription>
                            Send money to recent contacts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50" />
                                    <div>
                                        <p className="text-sm font-medium">Alice Smith</p>
                                        <p className="text-xs text-muted-foreground">Ends in 4211</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="secondary">Send</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
