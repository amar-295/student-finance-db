import { useState } from 'react';
import { useBudgets, useBudgetStatuses } from '../hooks/useBudgets';
import { Skeleton } from '../components/ui/skeleton';
import { formatCurrency } from '../utils/format';
import CreateBudgetModal from '../components/budgets/CreateBudgetModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import type { Budget } from '../services/budget.service';
import { useNavigate } from 'react-router-dom';

// New Components
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ScrollSection } from '../components/ui/scroll-section';
import { TiltCard } from '../components/ui/tilt-card';
import { Plus, Search, MoreVertical, Edit, Trash, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

import { useDebounce } from '../hooks/useDebounce';

export default function BudgetsPage() {
    const navigate = useNavigate();
    const [filterPeriod, setFilterPeriod] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [sortBy, setSortBy] = useState<'name' | 'amount' | 'progress'>('progress');

    const { budgets, isLoading: budgetsLoading, deleteBudget, isDeleting } = useBudgets({ isActive: true });
    const { data: statuses, isLoading: statusesLoading } = useBudgetStatuses();

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

    const loading = budgetsLoading || statusesLoading;

    // Helper to find status for a budget
    const getStatus = (budgetId: string) => statuses?.find(s => s.budgetId === budgetId);

    // Derived State: Stats
    const totalBudgeted = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
    const totalSpent = statuses?.reduce((sum, s) => sum + s.spent, 0) || 0;
    const totalRemaining = totalBudgeted - totalSpent;
    const overallProgress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    // Filter & Sort Logic
    const filteredBudgets = budgets
        .filter(b => {
            const matchesPeriod = filterPeriod === 'all' || b.periodType === filterPeriod;
            const matchesSearch = b.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                b.category?.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
            return matchesPeriod && matchesSearch;
        })
        .sort((a, b) => {
            const statusA = getStatus(a.id);
            const statusB = getStatus(b.id);

            if (sortBy === 'amount') return Number(b.amount) - Number(a.amount);
            if (sortBy === 'progress') return (statusB?.percentage || 0) - (statusA?.percentage || 0);
            return (a.name || '').localeCompare(b.name || '');
        });

    const handleCreate = () => {
        setBudgetToEdit(null);
        setIsCreateModalOpen(true);
    };

    const handleEdit = (budget: Budget) => {
        setBudgetToEdit(budget);
        setIsCreateModalOpen(true);
    };

    const handleDeleteClick = (budget: Budget) => {
        setBudgetToDelete(budget);
    };

    const confirmDelete = () => {
        if (budgetToDelete) {
            deleteBudget(budgetToDelete.id, {
                onSuccess: () => {
                    setBudgetToDelete(null);
                }
            });
        }
    };

    return (
        <div className="p-8 space-y-12 font-sans pb-32">
            {/* Header & Stats */}
            <ScrollSection animation="fade-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Budgets</h2>
                        <p className="text-muted-foreground mt-1">Manage your spending limits.</p>
                    </div>

                    <Button onClick={handleCreate} className="shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" />
                        New Budget
                    </Button>
                </div>
            </ScrollSection>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {loading ? (
                    <>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="dashboard-card">
                                <Card>
                                    <CardContent className="p-6">
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-8 w-32" />
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <ScrollSection animation="scale-up" delay={0.1}>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Total Budgeted</div>
                                    <div className="text-2xl font-bold text-foreground">{formatCurrency(totalBudgeted)}</div>
                                </CardContent>
                            </Card>
                        </ScrollSection>

                        <ScrollSection animation="scale-up" delay={0.2}>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Total Spent</div>
                                    <div className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</div>
                                </CardContent>
                            </Card>
                        </ScrollSection>

                        <ScrollSection animation="scale-up" delay={0.3}>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Remaining</div>
                                    <div className={`text-2xl font-bold ${totalRemaining < 0 ? 'text-destructive' : 'text-emerald-500'}`}>
                                        {formatCurrency(totalRemaining)}
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollSection>

                        <ScrollSection animation="scale-up" delay={0.4}>
                            <Card>
                                <CardContent className="p-6 flex flex-col justify-center h-full">
                                    <div className="flex justify-between text-xs font-semibold mb-2 text-muted-foreground">
                                        <span>Overall Health</span>
                                        <span>{Math.round(overallProgress)}%</span>
                                    </div>
                                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(overallProgress, 100)}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className={`h-full rounded-full ${overallProgress > 100 ? 'bg-destructive' : overallProgress > 85 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollSection>
                    </>
                )}
            </div>

            {/* Controls Toolbar */}
            <ScrollSection animation="fade-up" delay={0.2}>
                <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search budgets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="bg-background px-4 py-2 rounded-md text-sm font-medium border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="all">All Periods</option>
                            <option value="monthly">Monthly</option>
                            <option value="semester">Semester</option>
                            <option value="yearly">Yearly</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-background px-4 py-2 rounded-md text-sm font-medium border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="progress">Health (High to Low)</option>
                            <option value="amount">Amount (High to Low)</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>
                </div>
            </ScrollSection>

            {/* Main Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-40 w-full rounded-2xl" />
                        </div>
                    ))}
                </div>
            ) : filteredBudgets.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
                    <Smartphone className="mx-auto h-12 w-12 opacity-50 mb-4" />
                    <p className="text-lg font-medium">No budgets found</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBudgets.map((budget, index) => {
                        const status = getStatus(budget.id);
                        const percent = status ? Math.min(status.percentage, 100) : 0;
                        const statusColor = status?.status === 'exceeded' ? 'bg-destructive' : status?.status === 'warning' ? 'bg-yellow-500' : 'bg-emerald-500';

                        // Badge Styles
                        let badgeClass = 'bg-secondary text-secondary-foreground';
                        if (status?.status === 'exceeded') badgeClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
                        else if (status?.status === 'warning') badgeClass = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
                        else if (status?.status === 'safe') badgeClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';

                        return (
                            <ScrollSection key={budget.id} animation="scale-up" delay={index * 0.1}>
                                <TiltCard className="h-full">
                                    <div
                                        className="relative bg-card text-card-foreground p-6 rounded-2xl border shadow-sm h-full cursor-pointer hover:border-primary/50 transition-colors"
                                        onClick={() => navigate(`/budgets/${budget.id}`)}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-secondary text-secondary-foreground">
                                                    {/* We could use an Icon component mapping here */}
                                                    <span className="material-symbols-outlined">{budget.category?.icon || 'category'}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold leading-none">{budget.name || budget.category?.name}</h3>
                                                    <div className="text-xs text-muted-foreground font-medium mt-1 capitalize">{budget.periodType} • {budget.category?.name}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                                                    {status?.status || 'Active'}
                                                </div>

                                                <div onClick={(e) => e.stopPropagation()}>
                                                    <Menu as="div" className="relative z-10">
                                                        <MenuButton className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                                                            <MoreVertical className="h-5 w-5" />
                                                        </MenuButton>
                                                        <MenuItems
                                                            transition
                                                            className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-popover text-popover-foreground shadow-md ring-1 ring-border focus:outline-none z-50 p-1"
                                                        >
                                                            <MenuItem>
                                                                <button
                                                                    onClick={() => handleEdit(budget)}
                                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                    Edit
                                                                </button>
                                                            </MenuItem>
                                                            <MenuItem>
                                                                <button
                                                                    onClick={() => handleDeleteClick(budget)}
                                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                                                                >
                                                                    <Trash className="h-4 w-4" />
                                                                    Delete
                                                                </button>
                                                            </MenuItem>
                                                        </MenuItems>
                                                    </Menu>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div className="text-2xl font-bold tracking-tight">
                                                    {formatCurrency(status?.spent || 0)}
                                                    <span className="text-sm text-muted-foreground font-normal ml-1">/ {formatCurrency(budget.amount)}</span>
                                                </div>
                                                <div className="text-xs font-bold">
                                                    {Math.round(percent)}%
                                                </div>
                                            </div>

                                            <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${statusColor}`}
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>

                                            <div className="flex justify-between text-xs font-medium pt-3 border-t border-border">
                                                <span className={`${(status?.daysLeft || 0) < 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                    {status?.daysLeft} days left
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {formatCurrency(status?.remaining || 0)} available
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </TiltCard>
                            </ScrollSection>
                        );
                    })}
                </div>
            )}

            <CreateBudgetModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                budgetToEdit={budgetToEdit}
            />

            <ConfirmationModal
                isOpen={!!budgetToDelete}
                onClose={() => setBudgetToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Budget"
                message={`Are you sure you want to delete the budget "${budgetToDelete?.name || budgetToDelete?.category?.name}"?`}
                confirmLabel="Delete"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
