import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import type { Transaction } from '../services/transaction.service';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export const useTransactions = (limit?: number) => {
    return useQuery({
        queryKey: ['transactions', { limit }],
        queryFn: async () => {
            return transactionService.getTransactions({ limit });
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Transaction>) => transactionService.createTransaction(data),
        onMutate: async (newTransaction) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['transactions'] });

            // Snapshot the previous value
            const previousTransactions = queryClient.getQueryData(['transactions']);

            // Optimistically update to the new value
            queryClient.setQueryData(['transactions'], (old: any) => {
                const tempId = `temp-${Date.now()}`;
                const optimisticTransaction = {
                    ...newTransaction,
                    id: tempId,
                    date: new Date().toISOString(), // Default to now if not provided, or usage logic
                    status: 'pending', // Per user request
                };

                // Assuming 'transactions' is an array in the cache or inside a paginated object. 
                // Based on existing code, it seems to return an array directly or we adapt.
                // Safely add to beginning of list
                return Array.isArray(old) ? [optimisticTransaction, ...old] : [optimisticTransaction];
            });

            // Return a context object with the snapshotted value
            return { previousTransactions };
        },
        onError: (_err, _newTransaction, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            queryClient.setQueryData(['transactions'], context?.previousTransactions);
            toast.error('Failed to add transaction');
        },
        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onSuccess: () => {
            // Calculate center of window for confetti
            // Calculate center of window for confetti

            // Confetti explosion!
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            toast.success('Transaction added! 🎉');
        }
    });
};
