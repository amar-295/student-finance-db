import { motion } from 'framer-motion';
// import Lottie from 'lottie-react'; // Uncomment when JSON available
import { Wallet, Rocket, Bot, LineChart, Target, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyTransactionsProps {
    onAddTransaction: () => void;
}

export const EmptyTransactions = ({ onAddTransaction }: EmptyTransactionsProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            {/* Illustration (Fallback to Lucide until Lottie JSON is present) */}
            <div className="relative mb-8">
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary"
                >
                    <Wallet className="w-16 h-16" />
                </motion.div>
                <motion.div
                    className="absolute -right-2 -top-2 bg-yellow-400 rounded-full p-2 text-white shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Rocket className="w-6 h-6" />
                </motion.div>
            </div>

            {/* Encouraging message */}
            <h3 className="text-2xl font-bold text-foreground mb-4">
                Your financial journey starts here! 🚀
            </h3>

            <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
                Add your first transaction to start tracking your spending,
                get AI-powered insights, and reach your financial goals.
            </p>

            {/* Clear call-to-action */}
            <Button
                onClick={onAddTransaction}
                size="lg"
                className="h-14 px-8 text-lg rounded-full shadow-glow hover:scale-105 transition-transform bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
            >
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Transaction
            </Button>

            {/* Quick tips */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl w-full">
                <div className="flex flex-col items-center gap-2">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
                        <Bot className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Auto-categorized AI</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-2xl text-purple-600 dark:text-purple-400">
                        <LineChart className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Real-time insights</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-2xl text-amber-600 dark:text-amber-400">
                        <Target className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Smart budgeting</p>
                </div>
            </div>
        </motion.div>
    );
};
