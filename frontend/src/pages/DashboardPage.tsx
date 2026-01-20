import { authService } from '../services/auth.service';

export default function DashboardPage() {
    const user = authService.getCurrentUser();

    // Get first name or default
    const firstName = user?.name?.split(' ')[0] || 'Alex';

    return (
        <div className="p-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
            {/* Page Heading */}
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black tracking-tight text-[#101919] dark:text-white">Good morning, {firstName} 👋</h2>
                <p className="text-[#578e8d]">Your finances are looking healthy this semester. AI has categorized 12 new expenses.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-[#578e8d] uppercase tracking-wider">Total Balance</span>
                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">account_balance</span>
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-2xl font-black">$4,250.00</p>
                            <p className="text-xs font-medium text-emerald-500 flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-xs">trending_up</span> +2.5%
                            </p>
                        </div>
                        <div className="w-16 h-8 bg-[#f1f5f5] dark:bg-white/5 rounded flex items-end p-1 gap-1">
                            <div className="w-1/4 bg-primary/40 rounded-t h-[40%]"></div>
                            <div className="w-1/4 bg-primary/40 rounded-t h-[70%]"></div>
                            <div className="w-1/4 bg-primary/40 rounded-t h-[55%]"></div>
                            <div className="w-1/4 bg-primary rounded-t h-[90%]"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-[#578e8d] uppercase tracking-wider">Monthly Income</span>
                        <div className="size-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-2xl font-black">$2,100.00</p>
                        <div className="mt-4 h-1 w-full bg-[#f1f5f5] dark:bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[75%] rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-[#578e8d] uppercase tracking-wider">Monthly Expenses</span>
                        <div className="size-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-2xl font-black">$1,450.00</p>
                        <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-xs">info</span> 85% of budget
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-[#578e8d] uppercase tracking-wider">Net Savings</span>
                        <div className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-2xl font-black">$650.00</p>
                        <p className="text-xs font-medium text-emerald-500 flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-xs">trending_up</span> +12.4%
                        </p>
                    </div>
                </div>
            </div>

            {/* Mid Section Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Spending Breakdown (7 Columns) */}
                <div className="col-span-12 lg:col-span-7 bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold">Spending Breakdown</h3>
                        <button className="text-xs font-bold text-primary flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-lg">
                            AI Insights <span className="material-symbols-outlined text-[14px]">bolt</span>
                        </button>
                    </div>
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
                </div>

                {/* Account Snapshot (5 Columns) */}
                <div className="col-span-12 lg:col-span-5 bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">Accounts Snapshot</h3>
                        <button className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[250px] custom-scrollbar pr-1">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-white/5 border border-transparent hover:border-primary/30 transition-all cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">CH</div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold">Chase College Checking</p>
                                    <p className="text-[10px] text-[#578e8d]">•••• 4829</p>
                                </div>
                            </div>
                            <p className="text-sm font-black">$2,840.12</p>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-white/5 border border-transparent hover:border-primary/30 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">SV</div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold">Emergency Savings</p>
                                    <p className="text-[10px] text-[#578e8d]">•••• 1102</p>
                                </div>
                            </div>
                            <p className="text-sm font-black">$1,250.00</p>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-white/5 border border-transparent hover:border-primary/30 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">LN</div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold">Federal Student Loan</p>
                                    <p className="text-[10px] text-[#578e8d]">ID: 994021</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-rose-500">-$12,400.00</p>
                                <p className="text-[10px] font-bold text-rose-500/70 uppercase tracking-wider">Outstanding</p>
                            </div>
                        </div>
                    </div>
                    <button className="mt-6 w-full py-3 rounded-xl border border-dashed border-[#d3e4e4] dark:border-white/10 text-xs font-bold text-[#578e8d] hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">add_link</span> Link New Account
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#578e8d]/60 font-medium">
                        <span className="material-symbols-outlined text-[12px]">lock</span>
                        Bank-grade Encryption
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#e9f1f1] dark:border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">Recent Transactions</h3>
                        <span className="bg-[#f1f5f5] dark:bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-[#578e8d]">LATEST 10</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-[#e9f1f1] dark:border-white/10 text-xs font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5">
                            <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
                        </button>
                        <button className="px-3 py-1.5 rounded-lg border border-[#e9f1f1] dark:border-white/10 text-xs font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5">
                            <span className="material-symbols-outlined text-[16px]">download</span> Export
                        </button>
                    </div>
                </div>
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
                            <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="px-6 py-4 text-xs font-medium">Today, 2:45 PM</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px]">coffee</span>
                                        </div>
                                        <span className="text-sm font-bold">Starbucks Coffee</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-tighter">Dining</span>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-[#578e8d]">Chase College Checking</td>
                                <td className="px-6 py-4 text-right text-sm font-black text-rose-500">-$6.45</td>
                            </tr>
                            <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="px-6 py-4 text-xs font-medium">Today, 9:00 AM</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px]">work</span>
                                        </div>
                                        <span className="text-sm font-bold">University Payroll</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600 border border-emerald-200 uppercase tracking-tighter">Income</span>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-[#578e8d]">Chase College Checking</td>
                                <td className="px-6 py-4 text-right text-sm font-black text-emerald-500">+$450.00</td>
                            </tr>
                            <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="px-6 py-4 text-xs font-medium">Yesterday</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                                        </div>
                                        <span className="text-sm font-bold">University Bookstore</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-600 border border-amber-200 uppercase tracking-tighter">Academic</span>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-[#578e8d]">Emergency Savings</td>
                                <td className="px-6 py-4 text-right text-sm font-black text-rose-500">-$124.99</td>
                            </tr>
                            <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="px-6 py-4 text-xs font-medium">Oct 22, 2023</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px]">stream</span>
                                        </div>
                                        <span className="text-sm font-bold">Netflix Subscription</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600 border border-rose-200 uppercase tracking-tighter">Entertainment</span>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-[#578e8d]">Chase College Checking</td>
                                <td className="px-6 py-4 text-right text-sm font-black text-rose-500">-$15.99</td>
                            </tr>
                            <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="px-6 py-4 text-xs font-medium">Oct 20, 2023</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px]">restaurant</span>
                                        </div>
                                        <span className="text-sm font-bold">Chipotle Grill</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-tighter">Dining</span>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-[#578e8d]">Chase College Checking</td>
                                <td className="px-6 py-4 text-right text-sm font-black text-rose-500">-$14.50</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-background-light/30 dark:bg-white/5 flex justify-center">
                    <button className="text-xs font-bold text-[#578e8d] hover:text-primary transition-colors">View All Transactions</button>
                </div>
            </div>
        </div>
    );
}
