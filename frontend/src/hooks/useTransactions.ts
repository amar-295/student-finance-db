import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';

export const useTransactions = (limit?: number) => {
    return useQuery({
        queryKey: ['transactions', { limit }],
        queryFn: async () => {
            return transactionService.getTransactions({ limit });
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};
