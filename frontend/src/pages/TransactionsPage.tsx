import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useAutoAnimate } from '@formkit/auto-animate/react'; // New
import { useDebounce } from '../hooks/useDebounce';
import { transactionService, type TransactionFilters } from '../services/transaction.service';
import TransactionFiltersPanel from '../components/transactions/TransactionFilters';
import BulkActionsBar from '../components/transactions/BulkActionsBar';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import TransactionForm, { type TransactionSubmissionData } from '../components/transactions/TransactionForm';
import { TransactionRow } from '../components/transactions/TransactionRow';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollSection } from '../components/ui/scroll-section';
import { Search, Filter, Plus, AlertCircle } from 'lucide-react';
import { TransactionSearch } from '../components/transactions/TransactionSearch';
import { EmptyTransactions } from '../components/transactions/EmptyTransactions';

// Interface matching the backend response for display
interface TransactionDisplay {
    id: string;
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

    const [tableParent] = useAutoAnimate(); // AutoAnimate hook

    // Fetch transactions
    const { data, isLoading, isError, refetch } = useQuery({
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
        // Logic intentionally simple for now
    }, []);

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
        // 1. Snapshot and Optimistic Update
        const previousTransactions = queryClient.getQueryData(['transactions', page, filters, debouncedSearchQuery, sort]);

        queryClient.setQueryData(['transactions', page, filters, debouncedSearchQuery, sort], (old: any) => {
            if (!old) return old;
            return {
                ...old,
                data: old.data.filter((t: any) => t.id !== id)
            };
        });

        // 2. Defer API call
        const timeoutId = setTimeout(() => {
            deleteMutation.mutate(id);
        }, 4000);

        // 3. Show Toast with Undo
        toast('Transaction deleted', {
            description: 'This item has been removed.',
            action: {
                label: 'Undo',
                onClick: () => {
                    clearTimeout(timeoutId);
                    queryClient.setQueryData(['transactions', page, filters, debouncedSearchQuery, sort], previousTransactions);
                    toast.success('Restored transaction');
                },
            },
            duration: 4000,
        });
    }, [queryClient, deleteMutation, page, filters, debouncedSearchQuery, sort]);

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
        <div className="p-8 pb-32 space-y-6">
            <ScrollSection animation="fade-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Transactions</h2>
                        <p className="text-muted-foreground mt-1">Manage and categorize your spending</p>
                    </div>
                    <Button
                        onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
                        className="shadow-glow"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Transaction
                    </Button>
                </div>
            </ScrollSection>

            {/* Search & Filter Bar */}
            <ScrollSection animation="fade-up" delay={0.1}>
                <div className="flex gap-4 items-start">
                    <div className="relative flex-1 max-w-2xl z-10">
                        <TransactionSearch transactions={transactions} onResultSelect={(txn: any) => handleEdit(txn)} />
                    </div>
                    <Button
                        variant={Object.keys(filters).length > 0 ? "default" : "outline"}
                        onClick={() => setShowFilters(true)}
                        className="gap-2 h-12"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                </div>
            </ScrollSection>

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
            <ScrollSection animation="fade-up" delay={0.2}>
                <Card className="overflow-hidden border-border/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-semibold">
                                <tr>
                                    <th className="p-4 w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === (transactions?.length || 0) && (transactions?.length || 0) > 0}
                                            onChange={toggleSelectAll}
                                            className="rounded border-input bg-background text-primary focus:ring-primary"
                                        />
                                    </th>
                                    <th className="p-4 cursor-pointer hover:text-primary transition-colors" onClick={() => setSort({ by: 'date', order: sort.order === 'asc' ? 'desc' : 'asc' })}>
                                        Date
                                    </th>
                                    <th className="p-4">Merchant</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-right cursor-pointer hover:text-primary transition-colors" onClick={() => setSort({ by: 'amount', order: sort.order === 'asc' ? 'desc' : 'asc' })}>
                                        Amount
                                    </th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody ref={tableParent} className="divide-y divide-border/50">
                                {isLoading ? (
                                    <>
                                        {[...Array(5)].map((_, i) => (
                                            <tr key={i} className="border-b border-border/30">
                                                <td className="p-4"><Skeleton className="h-4 w-4 mx-auto" /></td>
                                                <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <Skeleton className="h-4 w-32" />
                                                        <Skeleton className="h-3 w-48" />
                                                    </div>
                                                </td>
                                                <td className="p-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                                                <td className="p-4 text-center"><Skeleton className="h-4 w-16 mx-auto" /></td>
                                                <td className="p-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                                                <td className="p-4"><Skeleton className="h-8 w-8 ml-auto" /></td>
                                            </tr>
                                        ))}
                                    </>
                                ) : isError ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-muted-foreground">
                                            <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-2" />
                                            <p className="font-medium text-destructive mb-2">Failed to load transactions</p>
                                            <Button variant="outline" onClick={() => refetch()}>Try Again</Button>
                                        </td>
                                    </tr>
                                ) : transactions.length > 0 ? (
                                    transactions.map((txn: any) => (
                                        <TransactionRow
                                            key={txn.id}
                                            txn={txn}
                                            isSelected={selectedIds.includes(txn.id)}
                                            onToggle={toggleSelection}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            formatDate={formatDate}
                                            className="opacity-100" // Removed animation mess for now, using tableParent
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-2">
                                            <EmptyTransactions onAddTransaction={() => {
                                                setEditingTransaction(null);
                                                setIsFormOpen(true);
                                            }} />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="p-4 border-t flex justify-center gap-2">
                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Previous
                            </Button>
                            <span className="px-4 py-2 text-sm font-medium self-center">
                                Page {page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={!pagination.hasMore}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </Card>
            </ScrollSection>

            {/* Transaction Form Modal */}
            <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="mx-auto max-w-xl w-full rounded-2xl bg-background p-8 shadow-2xl border">
                        <DialogTitle className="text-2xl font-bold mb-6">
                            {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
                        </DialogTitle>
                        <TransactionForm
                            onSubmit={handleFormSubmit}
                            accounts={[{ id: 1, name: 'Checking', type: 'CHECKING' }]}
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
