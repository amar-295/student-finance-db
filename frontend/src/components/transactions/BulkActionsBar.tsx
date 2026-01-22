import { useState } from 'react';

interface BulkActionsBarProps {
    selectedCount: number;
    onUpdateStatus: (status: 'pending' | 'cleared' | 'reconciled') => void;
    onDelete: () => void;
    onClearSelection: () => void;
}

export default function BulkActionsBar({ selectedCount, onUpdateStatus, onDelete, onClearSelection }: BulkActionsBarProps) {
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1e293b] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-40 border border-white/10 animate-fade-in-up">
            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                <span className="bg-primary px-2 py-0.5 rounded-md text-xs font-bold">{selectedCount}</span>
                <span className="font-medium text-sm">Selected</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative">
                    <button
                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Set Status
                    </button>

                    {isStatusOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-[#0f172a] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden text-gray-800 dark:text-gray-200">
                            {(['pending', 'cleared', 'reconciled'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        onUpdateStatus(status);
                                        setIsStatusOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 capitalize text-sm"
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={onDelete}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-medium"
                >
                    <span className="material-symbols-outlined text-lg">delete</span>
                    Delete
                </button>
            </div>

            <button onClick={onClearSelection} className="ml-2 hover:bg-white/10 p-1 rounded-full transition-colors">
                <span className="material-symbols-outlined text-gray-400">close</span>
            </button>
        </div>
    );
}
