import { authService } from '../services/auth.service';
import Skeleton from '../components/common/Skeleton';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';

export default function DashboardPage() {
    const user = authService.getCurrentUser();
    const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
    const { data: transactions = [], isLoading: transactionsLoading } = useTransactions(5);

    const loading = accountsLoading || transactionsLoading;

    // Get first name or default
    const firstName = user?.name?.split(' ')[0] || 'Alex';

    return (
        <div className="p-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full font-display">
            {/* Page Heading */}
            <div className="flex flex-col gap-1">
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton variant="text" width="300px" className="h-9" />
                        <Skeleton variant="text" width="450px" className="h-5" />
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-black tracking-tight text-[#101919] dark:text-white">Good morning, {firstName} 👋</h2>
                        <p className="text-[#578e8d]">Your finances are looking healthy this semester. AI has categorized 12 new expenses.</p>
                    </>
                )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm hover:shadow-md transition-shadow group">
                        {loading ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <Skeleton variant="text" width="80px" />
                                    <Skeleton variant="rect" width={32} height={32} className="rounded-lg" />
                                </div>
                                <div className="flex items-end justify-between">
                                    <div className="space-y-2">
                                        <Skeleton variant="text" width="100px" className="h-8" />
                                        <Skeleton variant="text" width="60px" />
                                    </div>
                                    <Skeleton variant="rect" width={64} height={32} className="rounded" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-bold text-[#578e8d] uppercase tracking-wider">
                                        {i === 0 ? 'Total Balance' : i === 1 ? 'Monthly Income' : i === 2 ? 'Monthly Expenses' : 'Net Savings'}
                                    </span>
                                    <div className={`size-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-primary/10 text-primary' :
                                        i === 1 ? 'bg-emerald-100 text-emerald-600' :
                                            i === 2 ? 'bg-rose-100 text-rose-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        <span className="material-symbols-outlined text-[18px]">
                                            {i === 0 ? 'account_balance' : i === 1 ? 'arrow_downward' : i === 2 ? 'arrow_upward' : 'auto_awesome'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-2xl font-black">
                                            {i === 0 ? '$4,250.00' : i === 1 ? '$2,100.00' : i === 2 ? '$1,450.00' : '$650.00'}
                                        </p>
                                        <p className={`text-xs font-medium flex items-center gap-1 mt-1 ${i === 2 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            <span className="material-symbols-outlined text-xs">{i === 2 ? 'info' : 'trending_up'}</span>
                                            {i === 0 ? '+2.5%' : i === 1 ? '75% target' : i === 2 ? '85% of budget' : '+12.4%'}
                                        </p>
                                    </div>
                                    {i === 0 && (
                                        <div className="w-16 h-8 bg-[#f1f5f5] dark:bg-white/5 rounded flex items-end p-1 gap-1">
                                            <div className="w-1/4 bg-primary/40 rounded-t h-[40%]"></div>
                                            <div className="w-1/4 bg-primary/40 rounded-t h-[70%]"></div>
                                            <div className="w-1/4 bg-primary/40 rounded-t h-[55%]"></div>
                                            <div className="w-1/4 bg-primary rounded-t h-[90%]"></div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Mid Section Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Spending Breakdown (7 Columns) */}
                <div className="col-span-12 lg:col-span-7 bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold">Spending Breakdown</h3>
                        {!loading && (
                            <button className="text-xs font-bold text-primary flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-lg">
                                AI Insights <span className="material-symbols-outlined text-[14px]">bolt</span>
                            </button>
                        )}
                    </div>
                    {loading ? (
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <Skeleton variant="circle" width={192} height={192} />
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} variant="rect" height={60} className="rounded-xl" />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="relative size-48 flex items-center justify-center">
                                <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                                    <circle className="dark:stroke-white/5" cx="18" cy="18" fill="transparent" r="16" stroke="#f1f5f5" strokeWidth="4"></circle>
                                    <circle cx="18" cy="18" fill="transparent" r="16" stroke="#2eb8b5" strokeDasharray="40 100" strokeLinecap="round" strokeWidth="4"></circle>
                                    <circle cx="18" cy="18" fill="transparent" r="16" stroke="#fbbf24" strokeDasharray="25 100" strokeDashoffset="-40" strokeLinecap="round" strokeWidth="4"></circle>
                                    <circle cx="18" cy="18" fill="transparent" r="16" stroke="#6366f1" strokeDasharray="15 100" strokeDashoffset="-65" strokeLinecap="round" strokeWidth="4"></circle>
                                    <circle cx="18" cy="18" fill="transparent" r="16" stroke="#f43f5e" strokeDasharray="20 100" strokeDashoffset="-80" strokeLinecap="round" strokeWidth="4"></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <p className="text-[10px] font-bold text-[#578e8d] uppercase tracking-widest">Total</p>
                                    <p className="text-xl font-black">$1,450</p>
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-[#e9f1f1] dark:border-white/10">
                                    <div className="size-3 rounded-full bg-primary"></div>
                                    <div className="flex flex-col">
                                        <p className="text-xs font-bold">Food & Drink</p>
                                        <p className="text-[10px] text-[#578e8d]">$580.00 (40%)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-[#e9f1f1] dark:border-white/10">
                                    <div className="size-3 rounded-full bg-amber-400"></div>
                                    <div className="flex flex-col">
                                        <p className="text-xs font-bold">Academic</p>
                                        <p className="text-[10px] text-[#578e8d]">$362.50 (25%)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-[#e9f1f1] dark:border-white/10">
                                    <div className="size-3 rounded-full bg-indigo-500"></div>
                                    <div className="flex flex-col">
                                        <p className="text-xs font-bold">Housing</p>
                                        <p className="text-[10px] text-[#578e8d]">$217.50 (15%)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-[#e9f1f1] dark:border-white/10">
                                    <div className="size-3 rounded-full bg-rose-500"></div>
                                    <div className="flex flex-col">
                                        <p className="text-xs font-bold">Subscription</p>
                                        <p className="text-[10px] text-[#578e8d]">$290.00 (20%)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Account Snapshot (5 Columns) */}
                <div className="col-span-12 lg:col-span-5 bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">Accounts Snapshot</h3>
                        {!loading && (
                            <button className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[250px] custom-scrollbar pr-1">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <Skeleton key={i} variant="rect" height={72} className="rounded-xl w-full" />
                            ))
                        ) : accounts.length > 0 ? (
                            accounts.slice(0, 3).map(account => (
                                <div key={account.id} className="flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-white/5 border border-transparent hover:border-primary/30 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-lg flex items-center justify-center text-white font-bold text-xs ${account.accountType === 'checking' ? 'bg-blue-600' :
                                                account.accountType === 'savings' ? 'bg-emerald-600' :
                                                    account.accountType === 'credit' ? 'bg-rose-600' : 'bg-indigo-600'
                                            }`}>
                                            {account.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold">{account.name}</p>
                                            <p className="text-[10px] text-[#578e8d]">•••• {account.accountNumber}</p>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-black ${account.balance < 0 ? 'text-rose-500' : ''}`}>
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(account.balance)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-text-muted text-center py-4">No accounts found.</p>
                        )}
                    </div>
                    {loading ? (
                        <div className="mt-6 space-y-4">
                            <Skeleton variant="rect" height={44} className="rounded-xl w-full" />
                            <Skeleton variant="text" width="120px" className="mx-auto" />
                        </div>
                    ) : (
                        <>
                            <button className="mt-6 w-full py-3 rounded-xl border border-dashed border-[#d3e4e4] dark:border-white/10 text-xs font-bold text-[#578e8d] hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">add_link</span> Link New Account
                            </button>
                            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#578e8d]/60 font-medium">
                                <span className="material-symbols-outlined text-[12px]">lock</span>
                                Bank-grade Encryption
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#e9f1f1] dark:border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">Recent Transactions</h3>
                        <span className="bg-[#f1f5f5] dark:bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-[#578e8d]">LATEST 10</span>
                    </div>
                    {!loading && (
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded-lg border border-[#e9f1f1] dark:border-white/10 text-xs font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5">
                                <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
                            </button>
                            <button className="px-3 py-1.5 rounded-lg border border-[#e9f1f1] dark:border-white/10 text-xs font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5">
                                <span className="material-symbols-outlined text-[16px]">download</span> Export
                            </button>
                        </div>
                    )}
                </div>
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-white/5 last:border-0">
                                <div className="flex items-center gap-4 flex-1">
                                    <Skeleton variant="circle" width={32} height={32} />
                                    <div className="space-y-2 flex-grow">
                                        <Skeleton variant="text" width="200px" />
                                        <Skeleton variant="text" width="100px" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <Skeleton variant="text" width="80px" className="hidden md:block" />
                                    <Skeleton variant="text" width="60px" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-bold text-[#578e8d] uppercase tracking-wider bg-background-light/50 dark:bg-white/5">
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">AI Category</th>
                                        <th className="px-6 py-4">Account</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e9f1f1] dark:divide-white/10">
                                    {transactions.length > 0 ? (
                                        transactions.map(transaction => (
                                            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                                                <td className="px-6 py-4 text-xs font-medium">
                                                    {new Date(transaction.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-[18px]">
                                                                {transaction.category?.icon || 'payments'}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-bold">{transaction.description}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tighter ${transaction.amount > 0
                                                            ? 'bg-emerald-100 text-emerald-600 border-emerald-200'
                                                            : 'bg-primary/10 text-primary border-primary/20'
                                                        }`}>
                                                        {transaction.category?.name || 'General'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-[#578e8d]">Primary Account</td>
                                                <td className={`px-6 py-4 text-right text-sm font-black ${transaction.amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-text-muted text-sm">
                                                No recent transactions.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-background-light/30 dark:bg-white/5 flex justify-center">
                            <button className="text-xs font-bold text-[#578e8d] hover:text-primary transition-colors">View All Transactions</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
