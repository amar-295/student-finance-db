import { useState } from 'react';
import { useBudgets, useBudgetStatuses, useBudgetRecommendations } from '../hooks/useBudgets';
import Skeleton from '../components/common/Skeleton';
import { formatCurrency } from '../utils/format';
import CreateBudgetModal from '../components/budgets/CreateBudgetModal';

export default function BudgetsPage() {
    const { budgets, isLoading: budgetsLoading } = useBudgets({ isActive: true });
    const { data: statuses, isLoading: statusesLoading } = useBudgetStatuses();
    const { data: recommendations, isLoading: recsLoading } = useBudgetRecommendations();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const loading = budgetsLoading || statusesLoading || recsLoading;

    // Helper to find status for a budget
    const getStatus = (budgetId: string) => statuses?.find(s => s.budgetId === budgetId);

    return (
        <div className="p-8 space-y-8 font-display bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton variant="text" width="200px" className="h-9" />
                            <Skeleton variant="text" width="350px" className="h-5" />
                        </div>
                    ) : (
                        <>
                            <h2 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">Budgets</h2>
                            <p className="text-[#64748b] dark:text-[#94a3b8] font-medium">Track your spending limits and stay financially healthy.</p>
                        </>
                    )}
                </div>
                {!loading && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#1e293b] dark:bg-white text-white dark:text-[#1e293b] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-black/5"
                    >
                        <span className="material-symbols-outlined">add</span>
                        New Budget
                    </button>
                )}
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#334155] shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <Skeleton variant="circle" width={48} height={48} />
                                <Skeleton variant="rect" width={80} height={24} className="rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton variant="text" width="70%" className="h-6" />
                                <Skeleton variant="text" width="40%" className="h-4" />
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between">
                                    <Skeleton variant="text" width="60px" />
                                    <Skeleton variant="text" width="60px" />
                                </div>
                                <Skeleton variant="rect" height={10} className="rounded-full w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : budgets.length === 0 ? (
                <div className="bg-white dark:bg-[#1e293b] p-12 rounded-2xl border border-[#e2e8f0] dark:border-[#334155] text-center shadow-sm">
                    <span className="material-symbols-outlined text-6xl text-[#64748b] dark:text-[#94a3b8] mb-4">savings</span>
                    <p className="text-xl font-bold text-[#1e293b] dark:text-white">No budgets yet</p>
                    <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2 mb-6">Create a budget to start saving more.</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#10b981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-[#10b981]/20"
                    >
                        Create Budget
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map(budget => {
                        const status = getStatus(budget.id);
                        const percent = status ? Math.min(status.percentage, 100) : 0;
                        const statusColor = status?.status === 'exceeded' ? 'bg-red-500' : status?.status === 'warning' ? 'bg-yellow-500' : 'bg-[#10b981]';
                        const bgColor = status?.status === 'exceeded' ? 'bg-red-50' : status?.status === 'warning' ? 'bg-yellow-50' : 'bg-emerald-50';
                        const labelColor = status?.status === 'exceeded' ? 'text-red-700' : status?.status === 'warning' ? 'text-yellow-700' : 'text-emerald-700';

                        return (
                            <div key={budget.id} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#334155] shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${budget.category?.color ? '' : 'bg-gray-100 dark:bg-gray-800'}`} style={{ backgroundColor: budget.category?.color ? `${budget.category.color}20` : undefined, color: budget.category?.color }}>
                                        <span className="material-symbols-outlined">{budget.category?.icon || 'category'}</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${bgColor} dark:bg-opacity-10 ${labelColor}`}>
                                        {status?.status || 'Active'}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-[#1e293b] dark:text-white mb-1 group-hover:text-[#10b981] transition-colors">{budget.category?.name || 'Uncategorized'}</h3>
                                <p className="text-sm text-[#64748b] dark:text-[#94a3b8] font-medium mb-6 capitalize">{budget.periodType} Budget</p>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span className="text-[#64748b] dark:text-[#94a3b8]">Spent</span>
                                        <span className="text-[#1e293b] dark:text-white">
                                            {formatCurrency(status?.spent || 0)} <span className="text-[#94a3b8] font-normal">/ {formatCurrency(budget.amount)}</span>
                                        </span>
                                    </div>

                                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${statusColor}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs font-medium pt-1">
                                        <span className={`${status?.projectedSpending && status.projectedSpending > budget.amount ? 'text-red-500' : 'text-[#64748b] dark:text-[#94a3b8]'}`}>
                                            {status?.daysLeft} days left
                                        </span>
                                        <span className="text-[#64748b] dark:text-[#94a3b8]">
                                            {formatCurrency(status?.remaining || 0)} left
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Recommendations Section */}
            {recommendations && recommendations.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-xl font-bold text-[#1e293b] dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-500">lightbulb</span>
                        AI Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.map((rec: any, i: number) => (
                            <div key={i} className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-indigo-900 p-2 rounded-lg shadow-sm">
                                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">auto_awesome</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1e293b] dark:text-white text-sm mb-1">Budget Recommendation</h4>
                                        <p className="text-sm text-[#475569] dark:text-[#cbd5e1] leading-relaxed">
                                            Consider setting a budget of <span className="font-bold text-indigo-700 dark:text-indigo-300">{formatCurrency(rec.recommendedBudget)}</span> for <span className="font-semibold">{rec.category}</span>. {rec.reason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <CreateBudgetModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
