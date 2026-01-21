import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, Category } from '../services/category.service';
import { toast } from 'sonner';

export const useCategories = () => {
    const queryClient = useQueryClient();

    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
    });

    const createCategoryMutation = useMutation({
        mutationFn: categoryService.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully');
        },
        onError: () => {
            toast.error('Failed to create category');
        }
    });

    return {
        categories: categoriesQuery.data || [],
        isLoading: categoriesQuery.isLoading,
        error: categoriesQuery.error,
        createCategory: createCategoryMutation.mutate,
    };
};
