import { Button } from '../ui/button';
import { Edit, Trash } from 'lucide-react';

import { cn } from '../../lib/utils';

export function TransactionRow({ txn, isSelected, onToggle, onEdit, onDelete, formatDate, className }: any) {
    return (
        <tr className={cn("group hover:bg-muted/30 transition-colors", className)}>
            <td className="p-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(txn.id)}
                    className="rounded border-input text-primary focus:ring-primary"
                />
            </td>
            <td className="p-4 text-sm font-medium">{formatDate(txn.transactionDate)}</td>
            <td className="p-4 text-sm font-medium">{txn.merchant || txn.description}</td>
            <td className="p-4">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    {txn.category?.name || 'Uncategorized'}
                </span>
            </td>
            <td className="p-4 text-center">
                <span className="text-xs text-muted-foreground capitalize">{txn.status || 'pending'}</span>
            </td>
            <td className={`p-4 text-right font-bold ${txn.type === 'INCOME' ? 'text-emerald-500' : 'text-foreground'}`}>
                {txn.type === 'INCOME' ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
            </td>
            <td className="p-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(txn)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => onDelete(txn.id)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}
