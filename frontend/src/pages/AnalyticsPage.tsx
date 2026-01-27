import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { analyticsService } from '../services/analytics.service';
import { formatCurrency } from '../utils/format';
import { Skeleton } from '../components/ui/skeleton';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

    const { data: overview, isLoading: isOverviewLoading } = useQuery({
        queryKey: ['analytics-overview'],
        queryFn: analyticsService.getOverview
    });

    const { data: trends, isLoading: isTrendsLoading } = useQuery({
        queryKey: ['analytics-trends', period],
        queryFn: () => analyticsService.getTrends(period)
    });

    const { data: categories, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ['analytics-categories'],
        queryFn: analyticsService.getCategories
    });

    const { data: merchants, isLoading: isMerchantsLoading } = useQuery({
        queryKey: ['analytics-merchants'],
        queryFn: analyticsService.getMerchants
    });

    const { data: insights, isLoading: isInsightsLoading } = useQuery({
        queryKey: ['analytics-insights'],
        queryFn: analyticsService.getInsights
    });

    const isLoading = isOverviewLoading || isTrendsLoading || isCategoriesLoading || isMerchantsLoading || isInsightsLoading;

    if (isLoading) {
        return (
            <div className="p-8 space-y-8 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-[120px] w-full rounded-2xl" />
                    <Skeleton className="h-[120px] w-full rounded-2xl" />
                    <Skeleton className="h-[120px] w-full rounded-2xl" />
                </div>
                <Skeleton className="h-[300px] w-full rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-[300px] w-full rounded-2xl" />
                    <Skeleton className="h-[300px] w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 font-display bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">Financial Analytics</h1>
                    <p className="text-[#64748b] dark:text-[#94a3b8] font-medium mt-2">
                        Insights into your spending habits and financial health
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1e293b] p-1 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex">
                    {(['week', 'month', 'year'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${period === p
                                ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/20'
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <OverviewCard
                    title="Total Income"
                    amount={overview?.income.total || 0}
                    change={overview?.income.change || 0}
                    icon="trending_up"
                    color="text-[#10b981]"
                    bg="bg-[#10b981]/10"
                />
                <OverviewCard
                    title="Total Expenses"
                    amount={overview?.expenses.total || 0}
                    change={overview?.expenses.change || 0}
                    icon="trending_down"
                    color="text-red-500"
                    bg="bg-red-500/10"
                />
                <OverviewCard
                    title="Net Savings"
                    amount={overview?.savings.total || 0}
                    change={overview?.savings.change || 0}
                    icon="savings"
                    color="text-indigo-500"
                    bg="bg-indigo-500/10"
                />
            </div>

            {/* Main Trending Chart */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-[#1e293b] dark:text-white mb-6">Spending Trends</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trends}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ fill: '#10b981', strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                                name="Income"
                            />
                            <Line
                                type="monotone"
                                dataKey="expenses"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{ fill: '#ef4444', strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                                name="Expenses"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Breakdown */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1e293b] dark:text-white mb-6">Spending by Category</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categories}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categories?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Merchants */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1e293b] dark:text-white mb-6">Top Merchants</h3>
                    <div className="space-y-4">
                        {merchants?.map((merchant, i) => (
                            <div key={merchant.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-bold text-gray-500 text-xs">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#1e293b] dark:text-white">{merchant.name}</p>
                                        <p className="text-xs text-gray-400">{merchant.count} transactions</p>
                                    </div>
                                </div>
                                <p className="font-bold text-[#1e293b] dark:text-white">{formatCurrency(merchant.amount)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Insights Panel */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black">AI Financial Insights</h3>
                        <p className="text-white/80 text-sm">Smart analysis of your spending patterns</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights?.map((insight, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/20 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-sm">
                                    {insight.type === 'warning' ? 'warning' : insight.type === 'suggestion' ? 'lightbulb' : 'info'}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{insight.type}</span>
                            </div>
                            <h4 className="font-bold text-lg mb-1">{insight.title}</h4>
                            <p className="text-sm opacity-90 leading-relaxed">{insight.message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function OverviewCard({ title, amount, change, icon, color, bg }: any) {
    const isPositive = change >= 0;
    return (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <span className="material-symbols-outlined text-8xl text-current">{icon}</span>
            </div>

            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${bg} ${color}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <span className="material-symbols-outlined text-[14px]">{isPositive ? 'arrow_upward' : 'arrow_downward'}</span>
                    {Math.abs(change)}%
                </div>
            </div>

            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-black text-[#1e293b] dark:text-white">{formatCurrency(amount)}</h3>
        </div>
    );
}
