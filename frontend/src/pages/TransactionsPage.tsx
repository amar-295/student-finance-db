import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import { transactionService, type TransactionFilters } from '../services/transaction.service';
import TransactionFiltersPanel from '../components/transactions/TransactionFilters';
import BulkActionsBar from '../components/transactions/BulkActionsBar';
import Skeleton from '../components/common/Skeleton';
import { toast } from 'sonner';
import TransactionForm, { type TransactionSubmissionData } from '../components/transactions/TransactionForm';
import { TransactionRow } from '../components/transactions/TransactionRow';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useMutation } from '@tanstack/react-query';

// Interface matching the backend response for display
// Extending the inferred type from the service or defining a compatible one
interface TransactionDisplay {
    id: string;
    // transactionDate property seems to be what the UI expects, but service returns 'date'
    // We need to clarify if we map it or if the service type is wrong.
    // Based on usage: formatDate(txn.transactionDate)
    transactionDate: string;
    merchant?: string;
    description: string;
    amount: number;
    status?: string;
    aiCategorized?: boolean;
    category?: {
        name: string;
        color: string;
        icon: string;
    };
    accountId?: number | string;
    type?: 'INCOME' | 'EXPENSE';

    [key: string]: any;
}

export default function TransactionsPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [filters, setFilters] = useState<TransactionFilters>({});
    const [showFilters, setShowFilters] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [sort, setSort] = useState<{ by: string; order: 'asc' | 'desc' }>({ by: 'date', order: 'desc' });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<TransactionDisplay | null>(null);


    // Fetch transactions
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['transactions', page, filters, debouncedSearchQuery, sort],
        queryFn: async () => {
            try {
                return await transactionService.getTransactions({
                    ...filters,
                    search: debouncedSearchQuery,
                    page,
                    limit: 20,
                    sortBy: sort.by as any,
                    sortOrder: sort.order
                });
            } catch (err) {
                // Graceful degradation / Error handling
                console.error("Failed to fetch transactions", err);
                throw err;
            }
        }
    });

    const transactions = useMemo(() => data?.data || [], [data]);
    const pagination = data?.pagination;

    const createMutation = useMutation({

        mutationFn: (data: any) => transactionService.createTransaction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            setIsFormOpen(false);
            toast.success('Transaction created');
        }
    });

    const updateMutation = useMutation({

        mutationFn: ({ id, data }: { id: string; data: any }) => transactionService.updateTransaction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            setIsFormOpen(false);
            setEditingTransaction(null);
            toast.success('Transaction updated');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => transactionService.deleteTransaction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            toast.success('Transaction deleted');
        }
    });

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, []);

    const toggleSelectAll = useCallback(() => {
        // Dependencies are key here. If we use transactions from closure, it updates when transactions change.
        // But transactions comes from useMemo.
        // Better to pass transactions length or id list? 
        // Logic: if all selected, unselect. Else select all.
        // We can access current selection state via ref or just let it re-create when selection changes?
        // Actually, toggleSelectAll is not passed to Row, so it doesn't break Row memoization.
        // But toggleSelection IS passed to Row.
    }, []); // Not using this one in Row for now.

    const handleBulkUpdate = async (status: 'pending' | 'cleared' | 'reconciled') => {
        try {
            await transactionService.bulkUpdate({
                transactionIds: selectedIds,
                status
            });
            toast.success(`Updated ${selectedIds.length} transactions`);
            setSelectedIds([]);
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        } catch {
            toast.error('Failed to update transactions');
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) return;

        try {
            await transactionService.bulkDelete(selectedIds);
            toast.success(`Deleted ${selectedIds.length} transactions`);
            setSelectedIds([]);
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        } catch {
            toast.error('Failed to delete transactions');
        }
    };

    const handleEdit = useCallback((txn: TransactionDisplay) => {
        setEditingTransaction(txn);
        setIsFormOpen(true);
    }, []);

    const handleDelete = useCallback((id: string) => {
        if (confirm('Delete this transaction?')) {
            deleteMutation.mutate(id);
        }
    }, [deleteMutation]);

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }, []);

    const handleFormSubmit = (data: TransactionSubmissionData) => {
        if (editingTransaction) {
            updateMutation.mutate({ id: editingTransaction.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <div className="p-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-text-main dark:text-dark-text-primary">Transactions</h2>
                    <p className="text-text-muted dark:text-dark-text-secondary mt-1">Manage and categorize your spending</p>
                </div>
                <button
                    onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add Transaction
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="mb-6 flex gap-4">
                <div className="relative flex-1 max-w-2xl">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Search by merchant, category, or try 'amount:>50'"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border-primary bg-white dark:bg-dark-bg-tertiary focus:ring-2 focus:ring-primary outline-none transition-all text-text-main dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-slate-500"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(true)}
                    className={`px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border-primary bg-white dark:bg-dark-bg-tertiary flex items-center gap-2 font-bold hover:bg-gray-50 dark:hover:bg-dark-bg-hover transition-colors ${Object.keys(filters).length > 0 ? 'text-primary border-primary' : 'text-text-muted dark:text-dark-text-tertiary'}`}
                >
                    <span className="material-symbols-outlined">filter_list</span>
                    Filters
                </button>
            </div>

            {/* Filters Sidebar */}
            {showFilters && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
                    <TransactionFiltersPanel
                        filters={filters}
                        onChange={setFilters}
                        onClose={() => setShowFilters(false)}
                    />
                </>
            )}

            {/* Data Table */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl border border-gray-100 dark:border-dark-border-primary shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-8 space-y-4">
                        <Skeleton variant="text" width="100%" height={50} />
                        <Skeleton variant="text" width="100%" height={50} />
                        <Skeleton variant="text" width="100%" height={50} />
                    </div>
                ) : isError ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="material-symbols-outlined text-4xl mb-2 text-red-500">error</span>
                        <p className="text-red-500 font-medium mb-2">Failed to load transactions</p>
                        <p className="text-sm mb-4">{(error as Error)?.message || 'An unexpected error occurred'}</p>
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-dark-bg-tertiary/50 border-b border-gray-100 dark:border-dark-border-primary">
                                    <th className="p-4 w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === transactions.length && transactions.length > 0}
                                            onChange={toggleSelectAll}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                    </th>
                                    <th className="p-4 font-semibold text-text-muted dark:text-dark-text-tertiary text-sm cursor-pointer hover:text-primary" onClick={() => setSort({ by: 'date', order: sort.order === 'asc' ? 'desc' : 'asc' })}>
                                        Date {sort.by === 'date' && (sort.order === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="p-4 font-semibold text-text-muted dark:text-dark-text-tertiary text-sm">Merchant</th>
                                    <th className="p-4 font-semibold text-text-muted dark:text-dark-text-tertiary text-sm">Category</th>
                                    <th className="p-4 font-semibold text-text-muted dark:text-dark-text-tertiary text-sm text-center">Status</th>
                                    <th className="p-4 font-semibold text-text-muted dark:text-dark-text-tertiary text-sm text-right cursor-pointer hover:text-primary" onClick={() => setSort({ by: 'amount', order: sort.order === 'asc' ? 'desc' : 'asc' })}>
                                        Amount {sort.by === 'amount' && (sort.order === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn) => (
                                    <TransactionRow
                                        key={txn.id}
                                        txn={txn}
                                        isSelected={selectedIds.includes(txn.id)}
                                        onToggle={toggleSelection}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                        <p>No transactions found matching your criteria.</p>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 dark:border-white/10 flex justify-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-sm font-bold text-gray-500 self-center">
                            Page {page} of {pagination.totalPages}
                        </span>
                        <button
                            disabled={!pagination.hasMore}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Transaction Form Modal */}
            <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="mx-auto max-w-xl w-full rounded-2xl bg-white dark:bg-dark-bg-secondary p-8 shadow-2xl">
                        <DialogTitle className="text-2xl font-black mb-6 dark:text-white">
                            {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
                        </DialogTitle>
                        <TransactionForm
                            onSubmit={handleFormSubmit}
                            accounts={[{ id: 1, name: 'Checking', type: 'CHECKING' }]} // Should ideally come from real accounts
                            initialData={editingTransaction ? {
                                ...editingTransaction,
                                date: editingTransaction.transactionDate?.split('T')[0],
                                category: editingTransaction.category?.name,
                                type: Number(editingTransaction.amount) > 0 ? 'INCOME' : 'EXPENSE',
                                amount: Math.abs(Number(editingTransaction.amount))
                            } : undefined}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </DialogPanel>
                </div>
            </Dialog>

            <BulkActionsBar
                selectedCount={selectedIds.length}
                onUpdateStatus={handleBulkUpdate}
                onDelete={handleBulkDelete}
                onClearSelection={() => setSelectedIds([])}
            />
        </div>
    );
}
