import { useState, useMemo } from 'react';
import { formatCurrency } from '@/utils/format';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: string;
    category: string;
    type: 'INCOME' | 'EXPENSE';
}

interface TransactionListProps {
    transactions: Transaction[];
    onDelete?: (id: number) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filteredAndSortedTransactions = useMemo(() => {
        return transactions
            .filter((t) =>
                t.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
    }, [transactions, searchTerm, sortOrder]);

    const toggleSort = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    if (transactions.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>No transactions found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 dark:border-dark-border-primary dark:bg-dark-bg-tertiary focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
                <button
                    onClick={toggleSort}
                    className="px-4 py-2 bg-white dark:bg-dark-bg-tertiary border border-gray-200 dark:border-dark-border-primary rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    aria-label="Sort by date"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                    Sort by Date
                </button>
            </div>

            <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl border border-gray-100 dark:border-dark-border-primary overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse" role="table">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-dark-bg-tertiary/50 border-b border-gray-100 dark:border-dark-border-primary">
                            <th className="p-4 font-semibold text-text-muted dark:text-dark-text-tertiary text-sm">Date</th>
                            <th className="p-4 font-semibold text-text-muted dark:text-dark-text-tertiary text-sm">Description</th>
                            <th className="p-4 font-semibold text-text-muted dark:text-dark-text-tertiary text-sm">Category</th>
                            <th className="p-4 font-semibold text-text-muted dark:text-dark-text-tertiary text-sm text-right">Amount</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedTransactions.map((txn) => (
                            <tr key={txn.id} role="row" className="border-b border-gray-50 dark:border-dark-border-primary last:border-0 hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 text-sm text-text-main dark:text-dark-text-primary">
                                    {new Date(txn.date).toLocaleDateString()}
                                </td>
                                <td className="p-4 font-medium text-text-main dark:text-dark-text-primary">
                                    {txn.description}
                                </td>
                                <td className="p-4 text-sm text-text-muted dark:text-dark-text-secondary">
                                    {txn.category}
                                </td>
                                <td className={`p-4 text-right font-bold ${txn.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                    {txn.type === 'INCOME' ? '+' : '-'}{formatCurrency(Math.abs(txn.amount))}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => onDelete?.(txn.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        aria-label="Delete"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
