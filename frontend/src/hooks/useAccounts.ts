import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export const useAccounts = () => {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getMockAccounts(), // Using mock for now as per plan
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
