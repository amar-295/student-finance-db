import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Trophy, TrendingUp, Target, Award } from 'lucide-react';
import { transactionService } from '../services/transaction.service';
import { budgetService } from '../services/budget.service';
import { useAuthStore } from '../store/authStore';

export const useAchievements = () => {
    // We need some stats to check achievements
    const { data: transactions } = useQuery({
        queryKey: ['transactions-all'],
        queryFn: () => transactionService.getTransactions({ limit: 1000 }), // Fetch enough to check history roughly
        staleTime: 5 * 60 * 1000
    });

    const { data: budgets } = useQuery({
        queryKey: ['budgets'],
        queryFn: () => budgetService.getBudgets(),
        staleTime: 5 * 60 * 1000
    });

    useEffect(() => {
        if (!transactions || !budgets) return;

        const checkAchievements = () => {
            const achievements = [
                {
                    id: 'first-transaction',
                    name: 'First Steps! 🚀',
                    description: 'Added your very first transaction.',
                    icon: Award,
                    color: 'text-blue-500',
                    condition: () => transactions.results?.length >= 1 || transactions.data?.length >= 1 // Handle diff API shapes
                },
                {
                    id: 'budget-setter',
                    name: 'Budget Conscious 🛡️',
                    description: 'Created your first budget.',
                    icon: Target,
                    color: 'text-emerald-500',
                    condition: () => budgets.length >= 1
                },
                {
                    id: 'saver-streak',
                    name: 'Savings Streak! 🔥',
                    description: 'Stayed under budget this month.',
                    icon: Trophy,
                    color: 'text-amber-500',
                    condition: () => {
                        // Simple check: are all active monthly budgets safe?
                        if (budgets.length === 0) return false;
                        const activeBudgets = budgets.filter((b: any) => b.periodType === 'monthly');
                        if (activeBudgets.length === 0) return false;
                        // Assuming budget objects have 'status' populated or calculation logic
                        // Here we simulate logic if status isn't directly available or use a basic check
                        return activeBudgets.every((b: any) => {
                            const spent = b.spent || 0;
                            return spent <= b.amount;
                        });
                    }
                }
            ];

            achievements.forEach(achievement => {
                const storageKey = `achievement-${achievement.id}`;
                const hasEarned = localStorage.getItem(storageKey);

                if (!hasEarned && achievement.condition()) {
                    // Mark as earned
                    localStorage.setItem(storageKey, 'true');

                    // 1. Confetti
                    confetti({
                        particleCount: 150,
                        spread: 80,
                        origin: { y: 0.6 },
                        colors: ['#10B981', '#F59E0B', '#3B82F6']
                    });

                    // 2. Toast
                    toast.custom((t) => (
                        <div className="bg-gradient-to-br from-card to-background border border-border p-6 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] animate-in slide-in-from-top-10 fade-in duration-500">
                            <div className={`p-3 bg-secondary/50 rounded-full ${achievement.color}`}>
                                <achievement.icon className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-foreground mb-1">Achievement Unlocked!</h3>
                                <div className="text-base font-semibold text-primary">{achievement.name}</div>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                            <button onClick={() => toast.dismiss(t)} className="text-muted-foreground hover:text-foreground">
                                ✕
                            </button>
                        </div>
                    ), { duration: 6000, position: 'top-center' });
                }
            });
        };

        // Small delay to ensure data is settled and not to overwhelm on immediate mount
        const timer = setTimeout(checkAchievements, 2000);
        return () => clearTimeout(timer);

    }, [transactions, budgets]);
};
