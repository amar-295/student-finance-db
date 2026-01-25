import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { budgetService } from '../services/budget.service';
import { analyticsService } from '../services/analytics.service';
import { AlertTriangle, TrendingUp } from 'lucide-react';

export const useSmartNotifications = () => {
    // 1. Fetch Budgets for Overspending Checks
    const { data: budgets } = useQuery({
        queryKey: ['budgets'],
        queryFn: () => budgetService.getBudgets(),
        staleTime: 5 * 60 * 1000 // Check every 5 mins or on invalidate
    });

    // 2. Fetch Analytics for Positive Reinforcement
    const { data: analytics } = useQuery({
        queryKey: ['analytics-overview'],
        queryFn: () => analyticsService.getOverview(),
        staleTime: 60 * 60 * 1000 // Check hourly
    });

    useEffect(() => {
        if (!budgets) return;

        budgets.forEach((budget: any) => {
            const spent = budget.spent || 0;
            const limit = budget.amount || budget.limit || 0; // Handle different naming if any
            if (limit === 0) return;

            const percentUsed = (spent / limit) * 100;
            const storageKey = `budget-warning-${budget.id}-${new Date().getMonth()}`; // Monthly reset

            // 80% Warning
            if (percentUsed >= 80 && percentUsed < 100) {
                const hasNotified = localStorage.getItem(storageKey);

                if (!hasNotified) {
                    toast.custom((t) => (
                        <div className= "bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-lg flex gap-3 max-w-sm" >
                        <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500 shrink-0" />
                    <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100" > Budget Alert: { budget.category.name } </h4>
                    < p className = "text-sm text-amber-700 dark:text-amber-300 mt-1" >
                    You've used {percentUsed.toFixed(0)}% of your budget. 
                                    ${(limit - spent).toFixed(2)} remaining.
                                </p>
                    < button
                onClick = {() => {
    localStorage.setItem(storageKey, 'true'); // Dismiss for this month
    toast.dismiss(t);
}}
className = "mt-2 text-xs font-semibold text-amber-800 dark:text-amber-200 hover:underline"
    >
    Dismiss
    </button>
    </div>
    </div>
                    ), { duration: Infinity }); // Persist until dismissed
                }
            }
            // 100% Exceeded (Optional, user didn't ask but good to have)
        });
    }, [budgets]);

useEffect(() => {
    if (!analytics) return;

    // "Positive reinforcement"
    // If savings increased compared to last month
    // analytics.savings.change is typically percentage or amount change?
    // Let's assume 'change' is percentage growth for now or amount difference.
    // User snippet: `thisMonth > lastMonth`.
    // My analytics interface has `change`. If change > 0, it's good.

    const storageKey = `savings-praise-${new Date().getMonth()}`;
    const hasNotified = localStorage.getItem(storageKey);

    if (analytics.savings?.change > 0 && !hasNotified) {
        toast.success(
            `Great job! Your savings are up ${analytics.savings.change}% this month! 🎉`,
            {
                icon: <TrendingUp className="h-5 w-5 text-green-600" />,
                    duration: 6000,
            }
        );
        localStorage.setItem(storageKey, 'true');
    }
}, [analytics]);
};
