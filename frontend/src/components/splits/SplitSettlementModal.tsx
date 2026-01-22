import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { billSplitService } from '../../services/billSplit.service';

interface SplitSettlementModalProps {
    isOpen: boolean;
    onClose: () => void;
    splitId: string;
    participantId: string;
    amount: number;
    participantName: string;
}

export default function SplitSettlementModal({
    isOpen,
    onClose,
    splitId,
    participantId,
    amount,
    participantName
}: SplitSettlementModalProps) {
    const queryClient = useQueryClient();
    const [note, setNote] = useState('');

    const settleMutation = useMutation({
        mutationFn: () => billSplitService.settleShare(splitId, participantId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bill-split', splitId] });
            queryClient.invalidateQueries({ queryKey: ['bill-splits'] });
            onClose();
        }
    });

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1e293b] p-6 text-left align-middle shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                                <div className="text-center mb-6">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-[#10b981] text-3xl">payments</span>
                                    </div>
                                    <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-[#1e293b] dark:text-white">
                                        Settle Payment
                                    </Dialog.Title>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Mark <b>{participantName}</b>'s share as paid?
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 text-center mb-6 border border-gray-100 dark:border-white/5">
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Amount to Settle</p>
                                    <p className="text-3xl font-black text-[#1e293b] dark:text-white">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs text-center text-gray-400">
                                        This action will mark the status as "Paid" and cannot be easily undone.
                                    </p>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Optional Note</label>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="e.g. Paid via Venmo"
                                            className="w-full bg-gray-50 dark:bg-black/20 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#10b981] dark:text-white resize-none h-20"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => settleMutation.mutate()}
                                        disabled={settleMutation.isPending}
                                        className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-[#10b981] hover:opacity-90 transition-opacity shadow-lg shadow-[#10b981]/20 flex items-center justify-center gap-2"
                                    >
                                        {settleMutation.isPending ? 'Processing...' : 'Confirm Paid'}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
