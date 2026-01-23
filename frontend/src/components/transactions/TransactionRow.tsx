import { memo } from 'react';
import { formatCurrency } from '../../utils/format';

interface TransactionRowProps {
    txn: any;
    isSelected: boolean;
    onToggle: (id: string) => void;
    onEdit: (txn: any) => void;
    onDelete: (id: string) => void;
    formatDate: (date: string) => string;
}

export const TransactionRow = memo(function TransactionRow({
    txn,
    isSelected,
    onToggle,
    onEdit,
    onDelete,
    formatDate
}: TransactionRowProps) {
    return (
        <tr className={`border-b border-gray-50 dark:border-dark-border-primary last:border-0 hover:bg-gray-50/50 dark:hover:bg-dark-bg-hover transition-colors ${isSelected ? 'bg-blue-50/50 dark:bg-blue-500/10' : ''}`}>
            <td className="p-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(txn.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                />
            </td>
            <td className="p-4 text-[#1e293b] dark:text-white font-medium">
                {formatDate(txn.transactionDate)}
            </td>
            <td className="p-4">
                <div className="flex flex-col">
                    <span className="text-text-main dark:text-dark-text-primary font-bold">{txn.merchant}</span>
                    <span className="text-xs text-text-muted dark:text-dark-text-tertiary">{txn.description}</span>
                </div>
            </td>
            <td className="p-4">
                <span
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                        backgroundColor: `${txn.category?.color}15`,
                        color: txn.category?.color || '#6B7280'
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
                    <span className="ml-2 text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded border border-indigo-100" title="AI Categorized">AI</span>
                )}
            </td>
            <td className="p-4 text-center">
                <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${txn.status === 'cleared' ? 'bg-green-100 text-green-700' :
                    txn.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                    {txn.status || 'cleared'}
                </span>
            </td>
            <td className={`p-4 text-right font-black ${Number(txn.amount) > 0 ? 'text-emerald-500' : 'text-text-main dark:text-dark-text-primary'}`}>
                {Number(txn.amount) > 0 ? '+' : ''}{formatCurrency(txn.amount)}
            </td>
            <td className="p-4 text-center">
                <div className="flex justify-center gap-1">
                    <button
                        onClick={() => onEdit(txn)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                        aria-label="Edit"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                        onClick={() => onDelete(txn.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
}, (prev, next) => {
    return (
        prev.txn === next.txn &&
        prev.isSelected === next.isSelected
    );
});
