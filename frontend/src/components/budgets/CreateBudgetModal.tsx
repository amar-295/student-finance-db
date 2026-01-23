
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../common/Modal';
import { useCategories } from '../../hooks/useCategories';
import { useBudgets } from '../../hooks/useBudgets';
import { useEffect } from 'react';
import type { Budget } from '../../services/budget.service';

const createBudgetSchema = z.object({
    name: z.string().min(1, 'Budget name is required'),
    categoryId: z.string().min(1, 'Category is required'),
    amount: z.number().min(0.01, 'Amount must be positive'),
    periodType: z.enum(['monthly', 'semester', 'yearly']),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    alertThreshold: z.number().min(0).max(100),
    rollover: z.boolean(),
});

type CreateBudgetForm = z.infer<typeof createBudgetSchema>;

interface CreateBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    budgetToEdit?: Budget | null;
}

export default function CreateBudgetModal({ isOpen, onClose, budgetToEdit }: CreateBudgetModalProps) {
    const { categories, isLoading: categoriesLoading } = useCategories();
    const { createBudget, updateBudget, isCreating, isUpdating } = useBudgets();

    const isEditing = !!budgetToEdit;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<CreateBudgetForm>({
        resolver: zodResolver(createBudgetSchema),
        defaultValues: {
            periodType: 'monthly',
            alertThreshold: 80,
            rollover: false,
        },
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const threshold = watch('alertThreshold');
    const selectedPeriodType = watch('periodType');

    useEffect(() => {
        if (isOpen) {
            if (budgetToEdit) {
                reset({
                    name: budgetToEdit.name,
                    categoryId: budgetToEdit.categoryId,
                    amount: budgetToEdit.amount,
                    periodType: budgetToEdit.periodType,
                    alertThreshold: budgetToEdit.alertThreshold,
                    rollover: budgetToEdit.rollover,
                });
            } else {
                reset({
                    name: '',
                    categoryId: '',
                    amount: undefined,
                    periodType: 'monthly',
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: undefined,
                    alertThreshold: 80,
                    rollover: false,
                });
            }
        }
    }, [isOpen, budgetToEdit, reset]);


    const handleFormSubmit = (data: CreateBudgetForm) => {
        if (isEditing && budgetToEdit) {
            updateBudget({
                id: budgetToEdit.id,
                data: data
            }, {
                onSuccess: () => {
                    onClose();
                    reset();
                }
            });
        } else {
            // If custom dates are provided, use them, otherwise calculate based on period
            // (Calculation logic is handled by backend if dates are omitted, but we can pass them if the user edits them)
            // For now, let's just pass what the form gives us plus the calculated ones if needed.

            // Re-using the logic to ensure we send something valid if they didn't pick custom dates but picked a period
            let startStr = data.startDate;
            let endStr = data.endDate;

            if (!startStr || !endStr) {
                const now = new Date();
                let start = new Date(now.getFullYear(), now.getMonth(), 1);
                let end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

                if (data.periodType === 'yearly') {
                    start = new Date(now.getFullYear(), 0, 1);
                    end = new Date(now.getFullYear(), 11, 31);
                } else if (data.periodType === 'semester') {
                    const month = now.getMonth();
                    if (month < 6) {
                        start = new Date(now.getFullYear(), 0, 1);
                        end = new Date(now.getFullYear(), 5, 30);
                    } else {
                        start = new Date(now.getFullYear(), 6, 1);
                        end = new Date(now.getFullYear(), 11, 31);
                    }
                }
                if (!startStr) startStr = start.toISOString();
                if (!endStr) endStr = end.toISOString();
            }

            createBudget({
                ...data,
                startDate: new Date(startStr!).toISOString(),
                endDate: new Date(endStr!).toISOString()
            }, {
                onSuccess: () => {
                    onClose();
                    reset();
                }
            });
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Budget" : "Create New Budget"}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">

                {/* Name Input */}
                <div className="space-y-2">
                    <label htmlFor="budgetName" className="text-sm font-bold text-[#1e293b] dark:text-white">Budget Name</label>
                    <input
                        id="budgetName"
                        type="text"
                        {...register('name')}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#10b981] outline-none transition-all text-[#1e293b] dark:text-white"
                        placeholder="e.g., Monthly Groceries"
                        autoFocus
                    />
                    {errors.name && <p className="text-red-500 text-xs font-bold">{errors.name.message}</p>}
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                    <label htmlFor="budgetAmount" className="text-sm font-bold text-[#1e293b] dark:text-white">Budget Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                        <input
                            id="budgetAmount"
                            type="number"
                            step="0.01"
                            {...register('amount', { valueAsNumber: true })}
                            className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#10b981] outline-none transition-all font-bold text-lg text-[#1e293b] dark:text-white"
                            placeholder="0.00"
                        />
                    </div>
                    {errors.amount && <p className="text-red-500 text-xs font-bold">{errors.amount.message}</p>}
                </div>

                {/* Category Select */}
                <div className="space-y-2">
                    <label htmlFor="budgetCategory" className="text-sm font-bold text-[#1e293b] dark:text-white">Category</label>
                    <div className="relative">
                        <select
                            id="budgetCategory"
                            {...register('categoryId')}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#10b981] outline-none appearance-none text-[#1e293b] dark:text-white disabled:opacity-50"
                            disabled={categoriesLoading || isEditing} // Disable category change on edit if desired, or keep enabled
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                    </div>
                    {errors.categoryId && <p className="text-red-500 text-xs font-bold">{errors.categoryId.message}</p>}
                </div>

                {/* Period Select - Disable on edit as changing period changes start/end dates complex logic */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1e293b] dark:text-white">Period</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['monthly', 'semester', 'yearly'].map((p) => (
                            <label key={p} className={`cursor-pointer border rounded-xl p-2 text-center text-sm font-semibold transition-all ${selectedPeriodType === p
                                ? 'bg-[#10b981]/10 border-[#10b981] text-[#10b981]'
                                : 'bg-white dark:bg-[#0f172a] border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-300'
                                } ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input
                                    type="radio"
                                    value={p}
                                    {...register('periodType')}
                                    className="hidden"
                                    disabled={isEditing}
                                />
                                <span className="capitalize">{p}</span>
                            </label>
                        ))}
                    </div>
                    {isEditing && <p className="text-xs text-gray-400 mt-1">Budget period cannot be changed.</p>}
                </div>

                {/* Alert Threshold */}
                <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-[#1e293b] dark:text-white">Alert Threshold</label>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${threshold >= 90 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                            }`}>
                            {threshold}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="50"
                        max="100"
                        step="5"
                        {...register('alertThreshold', { valueAsNumber: true })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                    />
                    <p className="text-xs text-gray-400">You'll be notified when spending exceeds {threshold}% of budget.</p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1e293b] dark:bg-white text-white dark:text-[#1e293b] py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                    {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Budget')}
                </button>
            </form>
        </Modal>
    );
}
