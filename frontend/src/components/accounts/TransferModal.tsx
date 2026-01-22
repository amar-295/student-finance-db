import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService, type Account } from '../../services/account.service';
import { toast } from 'sonner';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TransferModal({ isOpen, onClose }: TransferModalProps) {
    const queryClient = useQueryClient();
    const [fromId, setFromId] = useState('');
    const [toId, setToId] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const { data: accounts } = useQuery({
        queryKey: ['accounts'],
        queryFn: accountService.getAccounts
    });

    const transferMutation = useMutation({
        mutationFn: accountService.transferFunds,
        onSuccess: () => {
            toast.success('Transfer successful');
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            onClose();
            // Reset form
            setAmount('');
            setNote('');
        },
        onError: (err) => {
            toast.error('Transfer failed');
            console.error(err);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromId || !toId || !amount) return;

        transferMutation.mutate({
            fromId,
            toId,
            amount: parseFloat(amount),
            date,
            note
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#1e293b] dark:text-white">Transfer Funds</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors hidden md:block">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors md:hidden">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500">From</label>
                            <select
                                value={fromId}
                                onChange={(e) => setFromId(e.target.value)}
                                className="w-full px-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary"
                                required
                            >
                                <option value="">Select Account</option>
                                {accounts?.map((acc: Account) => (
                                    <option key={acc.id} value={acc.id} disabled={acc.id === toId}>
                                        {acc.name} (${acc.balance})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500">To</label>
                            <select
                                value={toId}
                                onChange={(e) => setToId(e.target.value)}
                                className="w-full px-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary"
                                required
                            >
                                <option value="">Select Account</option>
                                {accounts?.map((acc: Account) => (
                                    <option key={acc.id} value={acc.id} disabled={acc.id === fromId}>
                                        {acc.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary font-bold text-lg"
                                required
                                min="0.01"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Note</label>
                        <input
                            type="text"
                            placeholder="Reason for transfer"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={transferMutation.isPending}
                        className="w-full py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/20 transition-all mt-4 disabled:opacity-50"
                    >
                        {transferMutation.isPending ? 'Transferring...' : 'Confirm Transfer'}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-700 dark:hover:text-gray-200"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}
