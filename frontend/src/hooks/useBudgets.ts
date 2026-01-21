import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '../services/budget.service';
import type { CreateBudgetDto, UpdateBudgetDto, BudgetFilters } from '../services/budget.service';
import { toast } from 'sonner';

export const useBudgets = (filters: BudgetFilters = {}) => {
    const queryClient = useQueryClient();

    const budgetsQuery = useQuery({
        queryKey: ['budgets', filters],
        queryFn: () => budgetService.getBudgets(filters),
    });

    const createBudgetMutation = useMutation({
        mutationFn: (data: CreateBudgetDto) => budgetService.createBudget(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            toast.success('Budget created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create budget');
        }
    });

    const updateBudgetMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateBudgetDto }) =>
            budgetService.updateBudget(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            toast.success('Budget updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update budget');
        }
    });

    const deleteBudgetMutation = useMutation({
        mutationFn: (id: string) => budgetService.deleteBudget(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            toast.success('Budget deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete budget');
        }
    });

    return {
        budgets: budgetsQuery.data || [],
        isLoading: budgetsQuery.isLoading,
        error: budgetsQuery.error,
        createBudget: createBudgetMutation.mutate,
        updateBudget: updateBudgetMutation.mutate,
        deleteBudget: deleteBudgetMutation.mutate,
        isCreating: createBudgetMutation.isPending,
        isUpdating: updateBudgetMutation.isPending,
        isDeleting: deleteBudgetMutation.isPending,
    };
};

export const useBudgetStatus = (id: string) => {
    return useQuery({
        queryKey: ['budget', id, 'status'],
        queryFn: () => budgetService.getBudgetStatus(id),
        enabled: !!id,
    });
};

export const useBudgetStatuses = () => {
    return useQuery({
        queryKey: ['budgets', 'status'],
        queryFn: () => budgetService.getBudgetStatuses(),
    });
};

export const useBudgetRecommendations = () => {
    return useQuery({
        queryKey: ['budgets', 'recommendations'],
        queryFn: () => budgetService.getRecommendations(),
    });
};
