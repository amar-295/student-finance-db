import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billSplitService } from '../services/billSplit.service';
import type { BillSplit } from '../services/billSplit.service';
import CreateSplitModal from '../components/splits/CreateSplitModal';
import { formatCurrency } from '../utils/format';
import { useAuthStore } from '../store/authStore';
import Skeleton from '../components/common/Skeleton';

export default function BillSplitsPage() {
    const user = useAuthStore(state => state.user);
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'owed' | 'owing'>('all');

    const { data: splits = [], isLoading } = useQuery<BillSplit[]>({
        queryKey: ['bill-splits'],
        queryFn: billSplitService.getAllSplits
    });

    const settleMutation = useMutation({
        mutationFn: ({ splitId, participantId }: { splitId: string; participantId: string }) =>
            billSplitService.settleShare(splitId, participantId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bill-splits'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: billSplitService.deleteSplit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bill-splits'] });
        }
    });

    // Calculate totals
    const totalOwed = splits.reduce((sum, split) => {
        if (split.createdBy === user?.id) {
            return sum + split.participants
                .filter(p => p.status !== 'paid' && p.userId !== user?.id)
                .reduce((pSum, p) => pSum + Number(p.amountOwed), 0);
        }
        return sum;
    }, 0);

    const totalYouOwe = splits.reduce((sum, split) => {
        const myParticipation = split.participants.find(p => p.userId === user?.id);
        if (myParticipation && myParticipation.status !== 'paid' && split.createdBy !== user?.id) {
            return sum + Number(myParticipation.amountOwed);
        }
        return sum;
    }, 0);

    const netBalance = totalOwed - totalYouOwe;

    const filteredSplits = splits.filter(split => {
        if (filter === 'all') return true;
        const amICreator = split.createdBy === user?.id;
        const myParticipation = split.participants.find(p => p.userId === user?.id);
        const iOwe = myParticipation && myParticipation.status !== 'paid' && !amICreator;
        const theyOwe = amICreator && split.status !== 'settled';

        if (filter === 'owed') return theyOwe;
        if (filter === 'owing') return iOwe;
        return true;
    });

    const handleSettle = (splitId: string, participantId: string) => {
        if (confirm('Mark this share as settled?')) {
            settleMutation.mutate({ splitId, participantId });
        }
    };

    return (
        <div className="p-8 space-y-8 font-display bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">Bill Splits</h1>
                    <p className="text-[#64748b] dark:text-[#94a3b8] font-medium mt-1">Manage shared expenses with roommates and friends.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#1e293b] dark:bg-white text-white dark:text-[#1e293b] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-black/5"
                >
                    <span className="material-symbols-outlined">add</span>
                    New Split
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-sm text-gray-500 font-bold mb-1">You are owed</div>
                    <div className="text-2xl font-black text-[#10b981]">{formatCurrency(totalOwed)}</div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-sm text-gray-500 font-bold mb-1">You owe</div>
                    <div className="text-2xl font-black text-red-500">{formatCurrency(totalYouOwe)}</div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-sm text-gray-500 font-bold mb-1">Net Balance</div>
                    <div className={`text-2xl font-black ${netBalance >= 0 ? 'text-[#10b981]' : 'text-red-500'}`}>
                        {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'owed', 'owing'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${filter === f
                            ? 'bg-[#1e293b] text-white dark:bg-white dark:text-[#1e293b]'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                    >
                        {f === 'all' ? 'All Splits' : f === 'owed' ? 'Owed to Me' : 'I Owe'}
                    </button>
                ))}
            </div>

            {/* Splits List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl h-[200px]">
                            <Skeleton variant="text" width="60%" className="h-6 mb-4" />
                            <Skeleton variant="rect" height={100} className="rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : filteredSplits.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <span className="material-symbols-outlined text-6xl mb-4">receipt_long</span>
                    <p className="text-lg font-bold">No splits found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSplits.map(split => {
                        const amICreator = split.createdBy === user?.id;
                        return (
                            <div key={split.id} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-[#1e293b] dark:text-white">{split.description}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{new Date(split.billDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-xl text-[#1e293b] dark:text-white">{formatCurrency(Number(split.totalAmount))}</div>
                                        <div className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md inline-block font-bold uppercase tracking-wider text-gray-500 mt-1">
                                            {split.splitType}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {split.participants.map(p => {
                                        const isMe = p.userId === user?.id;
                                        if (p.userId === split.createdBy) return null; // Don't show creator in owing list usually

                                        return (
                                            <div key={p.id} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                        {p.user.name.charAt(0)}
                                                    </div>
                                                    <span className={`${isMe ? 'font-bold' : 'text-gray-600 dark:text-gray-300'}`}>
                                                        {isMe ? 'You' : p.user.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`${p.status === 'paid' ? 'text-gray-400 line-through' : 'text-[#1e293b] dark:text-white font-bold'}`}>
                                                        {formatCurrency(Number(p.amountOwed))}
                                                    </span>
                                                    {amICreator && p.status !== 'paid' && (
                                                        <button
                                                            onClick={() => handleSettle(split.id, p.userId)}
                                                            className="text-xs bg-[#10b981] text-white px-2 py-1 rounded-md font-bold hover:bg-[#059669]"
                                                        >
                                                            Settle
                                                        </button>
                                                    )}
                                                    {p.status === 'paid' && (
                                                        <span className="material-symbols-outlined text-sm text-[#10b981]">check_circle</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {amICreator && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this split?')) deleteMutation.mutate(split.id);
                                            }}
                                            className="text-red-500 text-sm font-bold hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <CreateSplitModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
