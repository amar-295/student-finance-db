
export default function AccountsPage() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-text-main dark:text-white">My Accounts</h1>
                    <p className="text-text-muted text-sm font-medium flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live updates active • Last synced just now
                    </p>
                </div>
                <button className="group flex items-center justify-center gap-2 bg-text-main dark:bg-white text-white dark:text-text-main px-6 py-3 rounded-xl font-bold shadow-lg shadow-gray-200 dark:shadow-none hover:-translate-y-0.5 transition-all">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Link Account</span>
                </button>
            </div>

            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Asset Card */}
                <div className="bg-surface-light dark:bg-white/5 rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary">
                            <span className="material-symbols-outlined filled-icon">savings</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
                        </span>
                    </div>
                    <div>
                        <p className="text-text-muted text-sm font-medium mb-1">Total Assets</p>
                        <p className="text-3xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">$12,450.00</p>
                    </div>
                </div>

                {/* Liabilities Card */}
                <div className="bg-surface-light dark:bg-white/5 rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-rose/10 dark:bg-rose/20 rounded-xl text-rose">
                            <span className="material-symbols-outlined filled-icon">credit_card</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-rose/10 text-rose dark:bg-rose/20 dark:text-rose-300 text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">arrow_outward</span> 2%
                        </span>
                    </div>
                    <div>
                        <p className="text-text-muted text-sm font-medium mb-1">Total Liabilities</p>
                        <p className="text-3xl font-bold text-text-main dark:text-white group-hover:text-rose transition-colors">$3,200.00</p>
                    </div>
                </div>

                {/* Net Worth Card (Featured) */}
                <div className="relative overflow-hidden bg-text-main dark:bg-primary rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-800 dark:border-primary-dark transition-all duration-300 text-white group">
                    {/* Abstract Pattern Background */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 size-48 rounded-full bg-white/5 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 size-32 rounded-full bg-primary/20 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm text-primary dark:text-white">
                                <span className="material-symbols-outlined filled-icon">account_balance</span>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">verified</span> Healthy
                            </span>
                        </div>
                        <div>
                            <p className="text-white/60 text-sm font-medium mb-1">Net Worth</p>
                            <p className="text-3xl font-bold text-white tracking-tight">$9,250.00</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
                    <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl bg-text-main text-white text-sm font-semibold shadow-md transition-all">
                        <span className="material-symbols-outlined text-[18px]">grid_view</span>
                        All Accounts
                    </button>
                    <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-text-muted hover:text-text-main dark:hover:text-white text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-white/10">
                        <span className="material-symbols-outlined text-[18px]">account_balance</span>
                        Checking & Savings
                    </button>
                    <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-text-muted hover:text-text-main dark:hover:text-white text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-white/10">
                        <span className="material-symbols-outlined text-[18px]">credit_card</span>
                        Credit & Loans
                    </button>
                </div>
                <div className="relative w-full sm:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">search</span>
                    <input className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white shadow-sm placeholder-gray-400" placeholder="Search transactions..." type="text" />
                </div>
            </section>

            {/* Account List */}
            <section className="space-y-4">
                {/* Card 1: Checking */}
                <div className="group relative bg-surface-light dark:bg-white/5 rounded-2xl p-5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-center gap-6">
                    {/* Left: Icon */}
                    <div className="shrink-0 relative">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined filled-icon text-3xl">account_balance_wallet</span>
                        </div>
                    </div>
                    {/* Middle: Details */}
                    <div className="flex-grow text-center md:text-left space-y-1">
                        <h3 className="text-lg font-bold text-text-main dark:text-white">Chase Student Checking</h3>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-text-muted">
                            <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">•••• 4321</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>Debit</span>
                        </div>
                    </div>
                    {/* Right: Balance & Actions */}
                    <div className="flex flex-col items-center md:items-end gap-1 min-w-[140px]">
                        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Available</span>
                        <span className="text-2xl font-bold text-primary">$2,450.50</span>
                    </div>
                    <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6 flex items-center justify-center gap-3">
                        <button className="px-4 py-2 rounded-lg text-sm font-bold text-primary hover:bg-primary/10 transition-colors">
                            View Details
                        </button>
                        <button className="size-9 flex items-center justify-center rounded-lg text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                </div>

                {/* Card 2: Savings */}
                <div className="group relative bg-surface-light dark:bg-white/5 rounded-2xl p-5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-center gap-6">
                    {/* Left: Icon */}
                    <div className="shrink-0 relative">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <span className="material-symbols-outlined filled-icon text-3xl">savings</span>
                        </div>
                    </div>
                    {/* Middle: Details */}
                    <div className="flex-grow text-center md:text-left space-y-1">
                        <h3 className="text-lg font-bold text-text-main dark:text-white">High Yield Savings</h3>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-text-muted">
                            <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">•••• 9982</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>Savings • 4.5% APY</span>
                        </div>
                    </div>
                    {/* Right: Balance & Actions */}
                    <div className="flex flex-col items-center md:items-end gap-1 min-w-[140px]">
                        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Saved</span>
                        <span className="text-2xl font-bold text-primary">$10,000.00</span>
                    </div>
                    <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6 flex items-center justify-center gap-3">
                        <button className="px-4 py-2 rounded-lg text-sm font-bold text-primary hover:bg-primary/10 transition-colors">
                            View Details
                        </button>
                        <button className="size-9 flex items-center justify-center rounded-lg text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                </div>

                {/* Card 3: Credit Card (Debt) */}
                <div className="group relative bg-surface-light dark:bg-white/5 rounded-2xl p-5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-center gap-6">
                    {/* Left: Icon */}
                    <div className="shrink-0 relative">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 flex items-center justify-center text-rose">
                            <span className="material-symbols-outlined filled-icon text-3xl">credit_card</span>
                        </div>
                        {/* Overdue Badge */}
                        <div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></div>
                    </div>
                    {/* Middle: Details */}
                    <div className="flex-grow text-center md:text-left space-y-1">
                        <h3 className="text-lg font-bold text-text-main dark:text-white">Discover Student Chrome</h3>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-text-muted mb-2">
                            <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">•••• 1122</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>Credit • Due in 3 days</span>
                        </div>
                        {/* Progress Bar for Credit Limit */}
                        <div className="w-full max-w-xs mx-auto md:mx-0">
                            <div className="flex justify-between text-[10px] font-bold text-text-muted mb-1">
                                <span>$1,200 used</span>
                                <span>$2,000 limit</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-rose rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                    {/* Right: Balance & Actions */}
                    <div className="flex flex-col items-center md:items-end gap-1 min-w-[140px]">
                        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Current Balance</span>
                        <span className="text-2xl font-bold text-alert">-$1,200.00</span>
                    </div>
                    <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6 flex items-center justify-center gap-3">
                        <button className="px-4 py-2 rounded-lg text-sm font-bold text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            Pay Now
                        </button>
                        <button className="size-9 flex items-center justify-center rounded-lg text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                </div>

                {/* Card 4: Student Loan (Debt) */}
                <div className="group relative bg-surface-light dark:bg-white/5 rounded-2xl p-5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-center gap-6">
                    {/* Left: Icon */}
                    <div className="shrink-0 relative">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <span className="material-symbols-outlined filled-icon text-3xl">school</span>
                        </div>
                    </div>
                    {/* Middle: Details */}
                    <div className="flex-grow text-center md:text-left space-y-1">
                        <h3 className="text-lg font-bold text-text-main dark:text-white">Federal Student Loan</h3>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-text-muted">
                            <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">•••• 5678</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>Loan • Deferred</span>
                        </div>
                    </div>
                    {/* Right: Balance & Actions */}
                    <div className="flex flex-col items-center md:items-end gap-1 min-w-[140px]">
                        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Outstanding</span>
                        <span className="text-2xl font-bold text-alert">-$2,000.00</span>
                    </div>
                    <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6 flex items-center justify-center gap-3">
                        <button className="px-4 py-2 rounded-lg text-sm font-bold text-primary hover:bg-primary/10 transition-colors">
                            View Details
                        </button>
                        <button className="size-9 flex items-center justify-center rounded-lg text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Skeleton Loader Example */}
            <div className="opacity-50 pointer-events-none select-none border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">add</span>
                </div>
                <p className="text-sm font-medium text-text-muted">Add another account to track your wealth</p>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-text-muted">
                    <p>© 2026 UniFlow Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
