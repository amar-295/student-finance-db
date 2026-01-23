import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const transactionSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    amount: z.string().min(1, 'Amount is required').refine((val) => Number(val) > 0, 'Amount must be greater than 0'),
    date: z.string().min(1, 'Date is required'),
    accountId: z.string().min(1, 'Account is required'),
    category: z.string().optional(),
    type: z.enum(['INCOME', 'EXPENSE']),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface Account {
    id: number;
    name: string;
    type: string;
}

interface TransactionFormProps {
    onSubmit: (data: any) => void;
    accounts: Account[];
    initialData?: any;
    isLoading?: boolean;
}

export default function TransactionForm({ onSubmit, accounts, initialData, isLoading }: TransactionFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        mode: 'onBlur',
        defaultValues: {
            description: '',
            amount: '',
            date: '',
            accountId: String(accounts[0]?.id || ''),
            category: '',
            type: 'EXPENSE',
        },
    });

    useEffect(() => {
        if (initialData) {
            const data = {
                description: initialData.description || '',
                amount: initialData.amount?.toString() || '',
                date: initialData.date || '',
                accountId: String(initialData.accountId || ''),
                category: initialData.category || '',
                type: initialData.type || 'EXPENSE',
            };
            reset(data);
        }
    }, [initialData, reset]);

    const handleFormSubmit: SubmitHandler<TransactionFormData> = (data) => {
        const submissionData: any = {
            description: data.description,
            amount: Number(data.amount),
            date: data.date,
            accountId: Number(data.accountId),
            type: data.type,
        };

        if (data.category) {
            submissionData.category = data.category;
        }

        onSubmit(submissionData);
    };

    return (
        <form className="flex flex-col gap-5 p-2" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-main dark:text-dark-text-secondary" htmlFor="type-expense">Type</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            {...register('type')}
                            type="radio"
                            value="EXPENSE"
                            id="type-expense"
                            className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium dark:text-dark-text-primary">Expense</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            {...register('type')}
                            type="radio"
                            value="INCOME"
                            id="type-income"
                            className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium dark:text-dark-text-primary">Income</span>
                    </label>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-main dark:text-dark-text-secondary" htmlFor="description">Description</label>
                <input
                    {...register('description')}
                    id="description"
                    placeholder="What was this for?"
                    className={`w-full h-11 px-4 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-200 dark:border-dark-border-primary'
                        } bg-white dark:bg-dark-bg-tertiary text-text-main dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                    disabled={isLoading}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-main dark:text-dark-text-secondary" htmlFor="amount">Amount</label>
                <input
                    {...register('amount')}
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={`w-full h-11 px-4 rounded-xl border ${errors.amount ? 'border-red-500' : 'border-gray-200 dark:border-dark-border-primary'
                        } bg-white dark:bg-dark-bg-tertiary text-text-main dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                    disabled={isLoading}
                />
                {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-main dark:text-dark-text-secondary" htmlFor="date">Date</label>
                <input
                    {...register('date')}
                    id="date"
                    type="date"
                    className={`w-full h-11 px-4 rounded-xl border ${errors.date ? 'border-red-500' : 'border-gray-200 dark:border-dark-border-primary'
                        } bg-white dark:bg-dark-bg-tertiary text-text-main dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                    disabled={isLoading}
                />
                {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-main dark:text-dark-text-secondary" htmlFor="account">Account</label>
                <select
                    {...register('accountId')}
                    id="account"
                    className={`w-full h-11 px-4 rounded-xl border ${errors.accountId ? 'border-red-500' : 'border-gray-200 dark:border-dark-border-primary'
                        } bg-white dark:bg-dark-bg-tertiary text-text-main dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                    disabled={isLoading}
                >
                    {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                </select>
                {errors.accountId && <p className="text-xs text-red-500">{errors.accountId.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-main dark:text-dark-text-secondary" htmlFor="category">Category</label>
                <input
                    {...register('category')}
                    id="category"
                    placeholder="e.g. Food, Transport"
                    className={`w-full h-11 px-4 rounded-xl border ${errors.category ? 'border-red-500' : 'border-gray-200 dark:border-dark-border-primary'
                        } bg-white dark:bg-dark-bg-tertiary text-text-main dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                    disabled={isLoading}
                />
                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <button
                type="submit"
                className="mt-4 w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                disabled={isLoading}
            >
                Save Transaction
            </button>
        </form>
    );
}
