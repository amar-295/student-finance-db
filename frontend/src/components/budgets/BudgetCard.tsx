import { formatCurrency } from '@/utils/format';

interface Budget {
    id: number;
    name: string;
    category: string;
    amount: number;
    spent: number;
    period: string;
    percentUsed: number;
    isExceeded: boolean;
}

interface BudgetCardProps {
    budget: Budget;
}

export default function BudgetCard({ budget }: BudgetCardProps) {
    const { name, category, amount, spent, percentUsed, isExceeded } = budget;
    const remaining = amount - spent;

    const getStatusColor = () => {
        if (percentUsed > 90) return 'bg-red-500';
        if (percentUsed >= 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-2xl border border-gray-100 dark:border-dark-border-primary shadow-sm space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-[#1e293b] dark:text-dark-text-primary text-lg">{name}</h3>
                    <p className="text-sm text-text-muted dark:text-dark-text-tertiary">{category}</p>
                </div>
                {isExceeded && (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Exceeded
                    </span>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="text-2xl font-black text-[#1e293b] dark:text-dark-text-primary tracking-tight">
                        {formatCurrency(spent)}
                        <span className="text-sm text-text-muted dark:text-dark-text-tertiary font-bold ml-1">
                            / {formatCurrency(amount)}
                        </span>
                    </div>
                    <div className="text-xs font-bold text-gray-500">{Math.round(percentUsed)}%</div>
                </div>

                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        role="progressbar"
                        aria-valuenow={percentUsed}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className={`h-full rounded-full transition-all duration-500 ${getStatusColor()}`}
                        style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    />
                </div>

                <div className="flex justify-between text-xs font-semibold pt-1 border-t border-gray-100 dark:border-gray-800 mt-4">
                    <span className="text-gray-500 capitalize">{budget.period.toLowerCase()}</span>
                    <span className="text-gray-500">
                        {formatCurrency(remaining)} remaining
                    </span>
                </div>
            </div>
        </div>
    );
}
