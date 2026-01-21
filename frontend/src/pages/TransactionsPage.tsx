import { useState, useEffect } from 'react';
import { transactionService, type Transaction } from '../services/transaction.service';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            // Using mock data for initial UI development
            // In production, swap with: await transactionService.getTransactions();
            const data = await transactionService.getMockTransactions();
            setTransactions(data);
        } catch (error) {
            console.error('Failed to load transactions', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter transactions based on search query
    const filteredTransactions = transactions.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Math.abs(amount));
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-text-main dark:text-white">Transactions</h2>
                    <p className="text-text-muted mt-1">Manage and categorize your spending</p>
                </div>
                <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined">add</span>
                    Add Transaction
                </button>
            </div>

            {/* Filters Area */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-main dark:text-white"
                    />
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-text-muted">
                        <span className="material-symbols-outlined animate-spin text-3xl mb-2">refresh</span>
                        <p>Loading transactions...</p>
                    </div>
                ) : filteredTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                                    <th className="p-4 font-semibold text-text-muted text-sm">Date</th>
                                    <th className="p-4 font-semibold text-text-muted text-sm">Merchant</th>
                                    <th className="p-4 font-semibold text-text-muted text-sm">Category</th>
                                    <th className="p-4 font-semibold text-text-muted text-sm text-right">Amount</th>
                                    <th className="p-4 font-semibold text-text-muted text-sm text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((txn) => (
                                    <tr key={txn.id} className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-text-main dark:text-white font-medium">
                                            {formatDate(txn.date)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-text-main dark:text-white font-bold">{txn.merchant || txn.description}</span>
                                                <span className="text-xs text-text-muted">{txn.description}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                                                style={{
                                                    backgroundColor: `${txn.category?.color}15`,
                                                    color: txn.category?.color || '#578e8d'
                                                }}
                                            >
                                                {txn.category?.icon && (
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        {txn.category.icon}
                                                    </span>
                                                )}
                                                {txn.category?.name || 'Uncategorized'}
                                            </span>
                                            {txn.aiCategorized && (
                                                <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20" title="AI Categorized">AI</span>
                                            )}
                                        </td>
                                        <td className={`p-4 text-right font-black ${txn.amount > 0 ? 'text-emerald-500' : 'text-text-main dark:text-white'}`}>
                                            {txn.amount > 0 ? '+' : ''}{formatAmount(txn.amount)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-text-muted">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">receipt_long</span>
                        <p>No transactions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
