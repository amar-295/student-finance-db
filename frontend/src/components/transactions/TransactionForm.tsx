import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '@headlessui/react'; // Or native select if preferred, using native for simplicity
import { transactionService } from '../../services/transaction.service';
import { toast } from 'sonner';
import { useDebounce } from '../../hooks/useDebounce';
import { Loader2, Sparkles } from 'lucide-react';

interface TransactionFormProps {
    onCancel: () => void;
    onSubmit: (data: any) => void;
    isLoading: boolean;
    initialData?: any;
    accounts: any[];
}

export default function TransactionForm({ onCancel, onSubmit, isLoading, initialData, accounts }: TransactionFormProps) {
    // Smart Defaults Logic
    const getDefaultType = () => {
        const day = new Date().getDay();
        return day === 5 ? 'INCOME' : 'EXPENSE'; // Friday is payday default!
    };

    const [formData, setFormData] = useState({
        merchant: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        accountId: accounts?.[0]?.id || '',
        type: getDefaultType(),
        description: '',
        ...initialData
    });

    const [isPredicting, setIsPredicting] = useState(false);

    // We'll track the merchant input for debouncing logic separately to avoid re-rendering form too much? 
    // Actually, useDebounce hook returns a value.
    const debouncedMerchant = useDebounce(formData.merchant, 500);

    // AI Categorization Effect
    useEffect(() => {
        const predict = async () => {
            if (debouncedMerchant && debouncedMerchant.length > 3 && !initialData) {
                // Only predict if no initial data is being edited (don't overwrite user's edit)
                setIsPredicting(true);
                try {
                    const predictedCategory = await transactionService.predictCategory(debouncedMerchant);
                    if (predictedCategory !== 'Uncategorized') {
                        setFormData(prev => {
                            // Only update if category is still empty or user hasn't manually selected one?
                            // For this demo, let's just update and notify.
                            if (prev.category !== predictedCategory) {
                                toast(`Auto-categorized as ${predictedCategory}`, {
                                    icon: '🤖',
                                    description: 'Based on merchant name'
                                });
                                return { ...prev, category: predictedCategory };
                            }
                            return prev;
                        });
                    }
                } finally {
                    setIsPredicting(false);
                }
            }
        };

        predict();
    }, [debouncedMerchant, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: Number(formData.amount) * (formData.type === 'EXPENSE' ? -1 : 1)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="merchant">Merchant / Description</Label>
                    <div className="relative">
                        <Input
                            id="merchant"
                            placeholder="e.g. Starbucks, Uber, Salary"
                            value={formData.merchant}
                            onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                            autoFocus
                            required
                        />
                        {isPredicting && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        {!isPredicting && formData.category && debouncedMerchant.length > 3 && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <select
                        id="type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    >
                        <option value="EXPENSE">Expense</option>
                        <option value="INCOME">Income</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        placeholder="e.g. Food, Transport"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                    />
                </div>

                <div className="space-y-2 col-span-2">
                    <Label htmlFor="account">Account</Label>
                    <select
                        id="account"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.accountId}
                        onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                        required
                    >
                        <option value="" disabled>Select Account</option>
                        {accounts.map((acc: any) => (
                            <option key={acc.id} value={acc.id}>{acc.name} ({acc.type})</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="shadow-glow">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {initialData ? 'Update Transaction' : 'Save Transaction'}
                </Button>
            </div>
        </form>
    );
}
export type TransactionSubmissionData = any;
