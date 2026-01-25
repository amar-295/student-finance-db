import Fuse from 'fuse.js';
import { useMemo, useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { TransactionItem } from './TransactionItem';
import { motion, AnimatePresence } from 'framer-motion';

export const TransactionSearch = ({ transactions, onResultSelect }: any) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Configure fuzzy search
    const fuse = useMemo(() => {
        return new Fuse(transactions, {
            keys: ['merchant', 'description', 'category.name', 'amount'],
            threshold: 0.4, // 0 = perfect match, 1 = match anything
            includeScore: true,
            minMatchCharLength: 2
        });
    }, [transactions]);

    // Perform search
    const searchResults = useMemo(() => {
        if (!searchQuery) return transactions;

        // If query is very short, return all (or empty if you prefer strict start)
        if (searchQuery.length < 2) return transactions;

        const results = fuse.search(searchQuery);
        return results.map((result: any) => result.item);
    }, [searchQuery, fuse, transactions]);

    return (
        <div className="w-full space-y-4">
            {/* Search input with instant results */}
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transactions... (Try 'uber' or 'cofee')"
                    className="pl-10 pr-20 h-12 text-base shadow-sm border-2 focus-visible:ring-0 focus-visible:border-primary transition-all"
                />

                {/* Show result count or clear */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    {searchQuery && (
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            {searchResults.length}
                        </span>
                    )}
                </div>
            </div>

            {/* Results list - Only show list if searching, otherwise parent handles list? 
          Actually user snippet implies this controls the list. 
          But if I replace the main table, I should probably render valid results always?
          Let's assume this component REPLACES the standard table when used. 
      */}
            <div className="space-y-2">
                <AnimatePresence mode='popLayout'>
                    {searchResults.map((transaction: any) => (
                        <motion.div
                            key={transaction.id}
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TransactionItem transaction={transaction} onSelect={onResultSelect} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {searchResults.length === 0 && searchQuery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-muted-foreground"
                    >
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="font-medium">No results found for "{searchQuery}"</p>
                        <p className="text-sm">Try checking your spelling or search for something else.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
