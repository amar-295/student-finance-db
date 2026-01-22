import { useQuery } from '@tanstack/react-query';
import { aiService } from '../services/ai.service';
import Skeleton from '../components/common/Skeleton';
import { formatCurrency } from '../utils/format';

export default function InsightsPage() {
    const { data: scoreData, isLoading: isScoreLoading } = useQuery({
        queryKey: ['ai-score'],
        queryFn: aiService.getInsights
    });

    const { data: subscriptions, isLoading: isSubsLoading } = useQuery({
        queryKey: ['ai-subs'],
        queryFn: aiService.getSubscriptions
    });

    const { data: recommendations, isLoading: isRecsLoading } = useQuery({
        queryKey: ['ai-recs'],
        queryFn: aiService.getRecommendations
    });

    const { data: patterns, isLoading: isPatternsLoading } = useQuery({
        queryKey: ['ai-patterns'],
        queryFn: aiService.getPatterns
    });

    const isLoading = isScoreLoading || isSubsLoading || isRecsLoading || isPatternsLoading;

    if (isLoading) {
        return (
            <div className="p-8 space-y-8 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
                <Skeleton variant="rect" height={200} className="rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton variant="rect" height={300} className="rounded-2xl" />
                    <Skeleton variant="rect" height={300} className="rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 font-display bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen pb-24">
            <h1 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">AI Insights</h1>

            {/* Health Score Hero */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <span className="material-symbols-outlined text-9xl">health_and_safety</span>
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold mb-4">
                            <span className="material-symbols-outlined text-base">psychology</span>
                            AI Analysis
                        </div>
                        <h2 className="text-4xl font-black mb-2">Financial Health Score</h2>
                        <p className="text-white/80 text-lg mb-6">{scoreData?.message}</p>

                        <div className="flex items-end gap-3">
                            <span className="text-7xl font-black">{scoreData?.total}</span>
                            <span className="text-2xl font-bold opacity-60 mb-2">/100</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <ScoreCard label="Budgeting" score={scoreData?.breakdown.budgeting} icon="account_balance_wallet" />
                        <ScoreCard label="Savings" score={scoreData?.breakdown.savings} icon="savings" />
                        <ScoreCard label="Spending" score={scoreData?.breakdown.spending} icon="credit_card" />
                        <ScoreCard label="Management" score={scoreData?.breakdown.management} icon="receipt_long" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Recommendations */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-[#1e293b] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-500">lightbulb</span>
                        Smart Recommendations
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations?.map((rec, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className={`absolute top-0 left-0 w-1 h-full ${rec.type === 'quick-win' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${rec.type === 'quick-win' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {rec.type.replace('-', ' ')}
                                    </div>
                                    <span className="font-bold text-[#1e293b] dark:text-white">{rec.impact}</span>
                                </div>
                                <h4 className="font-bold text-lg text-[#1e293b] dark:text-white mb-2">{rec.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">{rec.description}</p>
                                <button className="w-full py-2 rounded-xl bg-gray-50 dark:bg-white/5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                    Take Action
                                </button>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-xl font-bold text-[#1e293b] dark:text-white flex items-center gap-2 mt-8">
                        <span className="material-symbols-outlined text-purple-500">subscriptions</span>
                        Subscription Manager
                    </h3>
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        {subscriptions && subscriptions.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {subscriptions.map((sub, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                                                {sub.merchant.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1e293b] dark:text-white">{sub.merchant}</p>
                                                <p className="text-xs text-gray-500">Est. next: {new Date(sub.estimatedNext).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[#1e293b] dark:text-white">{formatCurrency(sub.amount)}</p>
                                            <p className="text-xs text-gray-400">{sub.frequency}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                No recurring subscriptions detected yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Col: Patterns */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-bold text-[#1e293b] dark:text-white mb-6">Spending Patterns</h3>

                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Peak Spending Day</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                        <span className="material-symbols-outlined">calendar_today</span>
                                    </div>
                                    <p className="text-xl font-black text-[#1e293b] dark:text-white">{patterns?.peakDay || 'N/A'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Most Expensive Category</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                                        <span className="material-symbols-outlined">category</span>
                                    </div>
                                    <p className="text-xl font-black text-[#1e293b] dark:text-white">{patterns?.peakCategory || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
                                    <span className="material-symbols-outlined text-sm">analytics</span>
                                    <span className="text-xs font-bold uppercase tracking-wider">Weekend vs Weekday</span>
                                </div>
                                <p className="text-sm text-[#1e293b] dark:text-white">
                                    You spend <span className="font-bold text-red-500">+{patterns?.weekendSpendIncrease}%</span> more on weekends on average.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ScoreCard({ label, score, icon }: any) {
    const getColor = (s: number) => {
        if (s >= 80) return 'bg-green-400';
        if (s >= 60) return 'bg-yellow-400';
        return 'bg-red-400';
    };

    return (
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 opacity-80">
                <span className="material-symbols-outlined text-sm">{icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-black">{score}%</span>
                <div className={`h-1.5 w-12 rounded-full overflow-hidden bg-black/20`}>
                    <div className={`h-full ${getColor(score)}`} style={{ width: `${score}%` }} />
                </div>
            </div>
        </div>
    );
}
