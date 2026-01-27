import { motion } from 'framer-motion';

export const TransactionSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
        >
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50"
                >
                    {/* Checkbox and Icon skeleton */}
                    <div className="w-4 h-4 rounded-sm animate-shimmer bg-muted/50" />
                    <div className="w-10 h-10 rounded-lg animate-shimmer bg-muted/50" />

                    {/* Content skeleton */}
                    <div className="flex-1 space-y-2">
                        <div className="h-4 rounded-md animate-shimmer bg-muted/50 w-1/3" />
                        <div className="h-3 rounded-md animate-shimmer bg-muted/50 w-1/4" />
                    </div>

                    {/* Status Badge */}
                    <div className="w-20 h-6 rounded-full animate-shimmer bg-muted/50 hidden md:block" />

                    {/* Amount skeleton */}
                    <div className="h-6 rounded-md animate-shimmer bg-muted/50 w-24" />

                    {/* Actions placeholder */}
                    <div className="w-8 h-8 rounded-md animate-shimmer bg-muted/50" />
                </div>
            ))}
        </motion.div>
    );
};
