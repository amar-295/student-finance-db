import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { billSplitService } from '../../services/billSplit.service';

interface CreateSplitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Mock users for now (in real app, fetch from contacts/friends endpoint)
const MOCK_USERS = [
    { id: 'user-2', name: 'John Doe', email: 'john@example.com' },
    { id: 'user-3', name: 'Jane Smith', email: 'jane@example.com' },
];

export default function CreateSplitModal({ isOpen, onClose }: CreateSplitModalProps) {
    const queryClient = useQueryClient();

    // Form State
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [splitType, setSplitType] = useState<'equal' | 'percentage' | 'custom'>('equal');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const createMutation = useMutation({
        mutationFn: billSplitService.createSplit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bill-splits'] });
            handleClose();
        }
    });

    const handleClose = () => {
        setDescription('');
        setAmount('');
        setSplitType('equal');
        setSelectedUsers([]);
        onClose();
    };

    const handleSubmit = () => {
        const total = parseFloat(amount);
        if (!description || isNaN(total) || selectedUsers.length === 0) return;

        // Calculate shares
        const participants = selectedUsers.map(userId => {
            let share = 0;
            if (splitType === 'equal') {
                // Include self implicitly or explicitly? For simplicity, let's say selected users split it.
                // In a real app we'd likely include the creator. 
                // Assuming creator paid and splits cost among others:
                share = total / selectedUsers.length;
            }
            // For now simple equal split among selected
            return { userId, amountOwed: share };
        });

        createMutation.mutate({
            description,
            totalAmount: total,
            splitType,
            participants
        });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-[#1e293b] dark:text-white mb-4">
                                    New Bill Split
                                </Dialog.Title>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="e.g. Dinner, Rent"
                                            className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-[#0f172a] border-none focus:ring-2 focus:ring-[#10b981] dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Total Amount</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-[#0f172a] border-none focus:ring-2 focus:ring-[#10b981] dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Split With</label>
                                        <div className="space-y-2">
                                            {MOCK_USERS.map(u => (
                                                <label key={u.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(u.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedUsers([...selectedUsers, u.id]);
                                                            else setSelectedUsers(selectedUsers.filter(id => id !== u.id));
                                                        }}
                                                        className="rounded text-[#10b981] focus:ring-[#10b981]"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{u.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            onClick={handleClose}
                                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={createMutation.isPending || !description || !amount || selectedUsers.length === 0}
                                            className="px-6 py-2 bg-[#1e293b] dark:bg-white text-white dark:text-[#1e293b] rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50"
                                        >
                                            {createMutation.isPending ? 'Creating...' : 'Create Split'}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
