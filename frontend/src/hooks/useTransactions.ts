import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { transactionService, type TransactionFilters } from '../services/transaction.service';

export const useTransactions = (filters?: TransactionFilters) => {
    return useQuery({
        queryKey: ['transactions', filters],
        queryFn: async () => {
            return transactionService.getTransactions(filters);
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        placeholderData: keepPreviousData,
    });
};
