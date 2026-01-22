import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../services/category.service';
import { accountService } from '../../services/account.service';

interface TransactionFiltersProps {
    filters: any;
    onChange: (newFilters: any) => void;
    onClose: () => void;
}

export default function TransactionFilters({ filters, onChange, onClose }: TransactionFiltersProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories
    });

    const { data: accounts } = useQuery({
        queryKey: ['accounts'],
        queryFn: accountService.getAccounts
    });

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleChange = (key: string, value: any) => {
        setLocalFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        onChange(localFilters);
        onClose();
    };

    const clearFilters = () => {
        const cleared = {
            startDate: '',
            endDate: '',
            minAmount: '',
            maxAmount: '',
            categoryId: '',
            accountId: '',
            merchant: ''
        };
        setLocalFilters(cleared);
        onChange(cleared);
    };

    return (
        <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-[#1e293b] shadow-2xl p-6 z-50 transform transition-transform overflow-y-auto border-l border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#1e293b] dark:text-white">Filters</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <div className="space-y-6">
                {/* Date Range */}
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="date"
                            value={localFilters.startDate || ''}
                            onChange={(e) => handleChange('startDate', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm"
                        />
                        <input
                            type="date"
                            value={localFilters.endDate || ''}
                            onChange={(e) => handleChange('endDate', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm"
                        />
                    </div>
                </div>

                {/* Amount Range */}
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Amount ($)</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={localFilters.minAmount || ''}
                            onChange={(e) => handleChange('minAmount', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={localFilters.maxAmount || ''}
                            onChange={(e) => handleChange('maxAmount', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Category</label>
                    <select
                        value={localFilters.categoryId || ''}
                        onChange={(e) => handleChange('categoryId', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm"
                    >
                        <option value="">All Categories</option>
                        {categories?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Accounts */}
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Account</label>
                    <select
                        value={localFilters.accountId || ''}
                        onChange={(e) => handleChange('accountId', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm"
                    >
                        <option value="">All Accounts</option>
                        {accounts?.map((acc: any) => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                    </select>
                </div>

                {/* Merchant Text */}
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Merchant</label>
                    <input
                        type="text"
                        placeholder="e.g. Starbucks"
                        value={localFilters.merchant || ''}
                        onChange={(e) => handleChange('merchant', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm"
                    />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                <button
                    onClick={clearFilters}
                    className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-white/10 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={applyFilters}
                    className="flex-1 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
