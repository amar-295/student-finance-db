import { Calendar } from 'lucide-react';


export const TransactionItem = ({ transaction, onSelect }: any) => {
    return (
        <div
            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={() => onSelect && onSelect(transaction)}
        >
            {/* Icon */}
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${transaction.category?.color}20`, color: transaction.category?.color }}
            >
                {/* If using lucide icons mapped, we'd render it here. For now, first letter or emoji if available */}
                <span className="text-lg">
                    {/* Simple fallback for icon */}
                    {transaction.merchant?.[0] || '?'}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground truncate">{transaction.merchant}</h4>
                    {transaction.aiCategorized && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-medium">
                            AI
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="truncate">{transaction.category?.name}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Amount is NOT deleted here, just displayed */}
            <div className={`text-right font-bold whitespace-nowrap ${transaction.type === 'INCOME' ? 'text-emerald-500' : 'text-foreground'}`}>
                {transaction.type === 'INCOME' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
            </div>
        </div>
    );
};
