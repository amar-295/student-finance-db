import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { budgetService } from '../services/budget.service';

import { formatCurrency } from '../utils/format';
import ConfirmationModal from '../components/common/ConfirmationModal';
import CreateBudgetModal from '../components/budgets/CreateBudgetModal';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    XAxis,
    YAxis,
    CartesianGrid,
    AreaChart,
    Area
} from 'recharts';

export default function BudgetDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Fetch Analytics data
    const {
        data: analytics,
        isLoading,
        error
    } = useQuery({
        queryKey: ['budget-analytics', id],
        queryFn: () => budgetService.getBudgetAnalytics(id!)
    });

    // Fetch Transactions
    const {
        data: transactions
    } = useQuery({
        queryKey: ['budget-transactions', id],
        queryFn: () => budgetService.getBudgetTransactions(id!, { limit: 20 })
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-[#64748b]">
                <span className="material-symbols-outlined text-6xl mb-4">error</span>
                <h2 className="text-2xl font-bold mb-2">Failed to load budget details</h2>
                <button onClick={() => navigate('/budgets')} className="text-[#10b981] font-bold hover:underline">
                    Back to Budgets
                </button>
            </div>
        );
    }

    const { budget, stats, trend, breakdown } = analytics;
    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    const handleDelete = async () => {
        try {
            await budgetService.deleteBudget(budget.id);
            navigate('/budgets');
        } catch (error) {
            console.error('Failed to delete budget', error);
        }
    };

    return (
        <div className="p-8 space-y-8 font-display bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <button onClick={() => navigate('/budgets')} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-opacity-10 text-[${budget.category?.color}]`} style={{ backgroundColor: `${budget.category?.color}20`, color: budget.category?.color }}>
                            {budget.category?.name}
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">{budget.name || budget.category?.name}</h1>
                    <p className="text-[#64748b] dark:text-[#94a3b8] font-medium mt-1">
                        {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                        <span className="mx-2">•</span>
                        {budget.daysRemaining} days remaining
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 bg-white dark:bg-[#1e293b] text-[#1e293b] dark:text-white font-bold rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">edit</span> Edit
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 font-bold rounded-xl border border-red-100 dark:border-red-900/10 shadow-sm hover:bg-red-100 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span> Delete
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-sm text-gray-500 font-bold mb-1">Total Allocated</div>
                    <div className="text-2xl font-black text-[#1e293b] dark:text-white">{formatCurrency(budget.amount)}</div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-sm text-gray-500 font-bold mb-1">Total Spent</div>
                    <div className="text-2xl font-black text-[#1e293b] dark:text-white">{formatCurrency(budget.totalSpent)}</div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-sm text-gray-500 font-bold mb-1">Remaining</div>
                    <div className={`text-2xl font-black ${budget.remaining < 0 ? 'text-red-500' : 'text-[#10b981]'}`}>{formatCurrency(budget.remaining)}</div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-sm text-gray-500 font-bold mb-1">Avg Daily Spend</div>
                    <div className="text-2xl font-black text-[#1e293b] dark:text-white">{formatCurrency(stats.avgDailySpend)}</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Spending Trend */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1e293b] dark:text-white mb-6">Spending Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trend}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Spending by Merchant */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1e293b] dark:text-white mb-6">Top Merchants</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={breakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {breakdown.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AI Insights & Projections */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
                    <span className="material-symbols-outlined text-9xl">auto_awesome</span>
                </div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">lightbulb</span> AI Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div>
                        <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wider mb-1">Projection</p>
                        <p className="text-lg font-medium">
                            At your current rate, you will spend <span className="font-bold text-white">{formatCurrency(stats.projectedSpend)}</span> by the end of the period.
                        </p>
                        {stats.projectedSpend > budget.amount && (
                            <div className="mt-2 inline-flex items-center gap-1 bg-red-500/20 px-3 py-1 rounded-full text-sm font-bold border border-red-500/30">
                                <span className="material-symbols-outlined text-sm">warning</span>
                                Projected to exceed budget by {formatCurrency(stats.projectedSpend - budget.amount)}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wider mb-1">Spending Habits</p>
                        <p className="text-lg font-medium">
                            Your average transaction is <span className="font-bold">{formatCurrency(stats.avgTransaction)}</span>.
                            You have made {stats.transactionCount} transactions this period.
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[#1e293b] dark:text-white">Recent Transactions</h3>
                    <button className="text-sm font-bold text-[#10b981] hover:underline">View All</button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {transactions?.map((transaction: any) => (
                        <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">
                                    <span className="material-symbols-outlined text-gray-500">receipt_long</span>
                                </div>
                                <div>
                                    <p className="font-bold text-[#1e293b] dark:text-white">{transaction.merchant}</p>
                                    <p className="text-xs text-gray-500">{new Date(transaction.transactionDate).toLocaleDateString()} • {transaction.account?.name}</p>
                                </div>
                            </div>
                            <span className="font-bold text-[#1e293b] dark:text-white">
                                -{formatCurrency(Number(transaction.amount))}
                            </span>
                        </div>
                    ))}
                    {(!transactions || transactions.length === 0) && (
                        <div className="p-8 text-center text-gray-500">
                            No transactions found for this budget period.
                        </div>
                    )}
                </div>
            </div>

            <CreateBudgetModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                budgetToEdit={budget}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Budget"
                message="Are you sure you want to delete this budget? This action cannot be undone."
                confirmLabel="Delete Budget"
                variant="danger"
            />
        </div>
    );
}
