import { useState } from 'react';
import { useBudgets, useBudgetStatuses, useBudgetRecommendations } from '../hooks/useBudgets';
import Skeleton from '../components/common/Skeleton';
import { formatCurrency } from '../utils/format';
import CreateBudgetModal from '../components/budgets/CreateBudgetModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import type { Budget } from '../services/budget.service';

import { useNavigate } from 'react-router-dom';

export default function BudgetsPage() {
    const navigate = useNavigate();
    const [filterPeriod, setFilterPeriod] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'amount' | 'progress'>('progress');

    const { budgets, isLoading: budgetsLoading, deleteBudget, isDeleting } = useBudgets({ isActive: true });
    const { data: statuses, isLoading: statusesLoading } = useBudgetStatuses();
    const { data: recommendations, isLoading: recsLoading } = useBudgetRecommendations();

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

    const loading = budgetsLoading || statusesLoading || recsLoading;

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
            const matchesSearch = b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.category?.name.toLowerCase().includes(searchQuery.toLowerCase());
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
        <div className="p-8 space-y-8 font-display bg-background-light dark:bg-dark-bg-primary min-h-screen transition-colors">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#1e293b] dark:text-dark-text-primary tracking-tight">Budgets</h2>
                    <p className="text-[#64748b] dark:text-dark-text-tertiary font-medium mt-1">Manage your spending limits.</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleCreate}
                        className="bg-[#1e293b] dark:bg-primary-500 text-white dark:text-text-main px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-black/5"
                    >
                        <span className="material-symbols-outlined">add</span>
                        New Budget
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-dark-bg-secondary p-5 rounded-2xl border border-gray-100 dark:border-dark-border-primary shadow-sm">
                        <div className="text-sm text-gray-500 dark:text-dark-text-tertiary font-bold mb-1">Total Budgeted</div>
                        <div className="text-2xl font-black text-[#1e293b] dark:text-dark-text-primary">{formatCurrency(totalBudgeted)}</div>
                    </div>
                    <div className="bg-white dark:bg-dark-bg-secondary p-5 rounded-2xl border border-gray-100 dark:border-dark-border-primary shadow-sm">
                        <div className="text-sm text-gray-500 dark:text-dark-text-tertiary font-bold mb-1">Total Spent</div>
                        <div className="text-2xl font-black text-[#1e293b] dark:text-dark-text-primary">{formatCurrency(totalSpent)}</div>
                    </div>
                    <div className="bg-white dark:bg-dark-bg-secondary p-5 rounded-2xl border border-gray-100 dark:border-dark-border-primary shadow-sm">
                        <div className="text-sm text-gray-500 dark:text-dark-text-tertiary font-bold mb-1">Remaining</div>
                        <div className={`text-2xl font-black ${totalRemaining < 0 ? 'text-red-500' : 'text-[#10b981]'}`}>{formatCurrency(totalRemaining)}</div>
                    </div>
                    <div className="bg-white dark:bg-dark-bg-secondary p-5 rounded-2xl border border-gray-100 dark:border-dark-border-primary shadow-sm flex flex-col justify-center">
                        <div className="flex justify-between text-xs font-bold mb-2 text-gray-500">
                            <span>Overall Health</span>
                            <span>{Math.round(overallProgress)}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${overallProgress > 100 ? 'bg-red-500' : overallProgress > 85 ? 'bg-yellow-500' : 'bg-[#10b981]'}`}
                                style={{ width: `${Math.min(overallProgress, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Controls Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Search budgets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg text-sm border-none focus:ring-2 focus:ring-[#10b981] dark:text-dark-text-primary font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterPeriod}
                        onChange={(e) => setFilterPeriod(e.target.value)}
                        className="bg-gray-50 dark:bg-dark-bg-tertiary px-4 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-dark-text-tertiary border-none focus:ring-2 focus:ring-[#10b981]"
                    >
                        <option value="all">All Periods</option>
                        <option value="monthly">Monthly</option>
                        <option value="semester">Semester</option>
                        <option value="yearly">Yearly</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-gray-50 dark:bg-dark-bg-tertiary px-4 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-dark-text-tertiary border-none focus:ring-2 focus:ring-[#10b981]"
                    >
                        <option value="progress">Health (High to Low)</option>
                        <option value="amount">Amount (High to Low)</option>
                        <option value="name">Name (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#334155] shadow-sm space-y-4">
                            <Skeleton variant="text" width="50%" className="h-6" />
                            <Skeleton variant="rect" height={10} className="w-full rounded-full" />
                            <div className="flex justify-between"><Skeleton variant="text" width="20%" /><Skeleton variant="text" width="20%" /></div>
                        </div>
                    ))}
                </div>
            ) : filteredBudgets.length === 0 ? (
                <div className="bg-white dark:bg-[#1e293b] p-12 rounded-2xl border border-[#e2e8f0] dark:border-[#334155] text-center shadow-sm">
                    <span className="material-symbols-outlined text-6xl text-[#64748b] dark:text-[#94a3b8] mb-4">savings</span>
                    <p className="text-xl font-bold text-[#1e293b] dark:text-white">No budgets found</p>
                    <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2 mb-6">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBudgets.map(budget => {
                        const status = getStatus(budget.id);
                        const percent = status ? Math.min(status.percentage, 100) : 0;
                        const statusColor = status?.status === 'exceeded' ? 'bg-red-500' : status?.status === 'warning' ? 'bg-yellow-500' : 'bg-[#10b981]';

                        // Define colors for status badge
                        let bgColor = 'bg-gray-100';
                        let labelColor = 'text-gray-600';
                        if (status?.status === 'exceeded') {
                            bgColor = 'bg-red-100';
                            labelColor = 'text-red-600';
                        } else if (status?.status === 'warning') {
                            bgColor = 'bg-yellow-100';
                            labelColor = 'text-yellow-600';
                        } else if (status?.status === 'safe') {
                            bgColor = 'bg-green-100';
                            labelColor = 'text-green-600';
                        }

                        return (
                            <div key={budget.id} className="relative bg-white dark:bg-dark-bg-secondary p-6 rounded-2xl border border-gray-100 dark:border-dark-border-primary shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => navigate(`/budgets/${budget.id}`)}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${budget.category?.color ? '' : 'bg-gray-100 dark:bg-gray-800'}`} style={{ backgroundColor: budget.category?.color ? `${budget.category.color}20` : undefined, color: budget.category?.color }}>
                                            <span className="material-symbols-outlined">{budget.category?.icon || 'category'}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#1e293b] dark:text-dark-text-primary leading-tight line-clamp-1">{budget.name || budget.category?.name}</h3>
                                            <div className="text-xs font-semibold text-text-muted dark:text-dark-text-tertiary capitalize">{budget.periodType} • {budget.category?.name}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${bgColor} dark:bg-opacity-10 ${labelColor}`}>
                                            {status?.status || 'Active'}
                                        </div>

                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Menu as="div" className="relative z-10">
                                                <MenuButton className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                                    <span className="material-symbols-outlined text-xl">more_vert</span>
                                                </MenuButton>
                                                <MenuItems
                                                    transition
                                                    className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-white dark:bg-[#1e293b] shadow-lg ring-1 ring-black/5 focus:outline-none border border-gray-100 dark:border-gray-800 z-50 p-1"
                                                >
                                                    <MenuItem>
                                                        <button
                                                            onClick={() => handleEdit(budget)}
                                                            className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                            Edit
                                                        </button>
                                                    </MenuItem>
                                                    <MenuItem>
                                                        <button
                                                            onClick={() => handleDeleteClick(budget)}
                                                            className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
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
                                        <div className="text-2xl font-black text-[#1e293b] dark:text-dark-text-primary tracking-tight">
                                            {formatCurrency(status?.spent || 0)}
                                            <span className="text-sm text-text-muted dark:text-dark-text-tertiary font-bold ml-1">/ {formatCurrency(budget.amount)}</span>
                                        </div>
                                        <div className={`text-xs font-bold px-2 py-1 rounded-md ${status?.status === 'exceeded' ? 'bg-red-100 text-red-600' : status?.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                            {Math.round(percent)}%
                                        </div>
                                    </div>

                                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${statusColor}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs font-semibold pt-1 border-t border-gray-100 dark:border-gray-800 mt-4">
                                        <span className={`${(status?.daysLeft || 0) < 5 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {status?.daysLeft} days left
                                        </span>
                                        <span className="text-gray-500">
                                            {formatCurrency(status?.remaining || 0)} available
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Recommendations Section */}
            {recommendations && recommendations.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-xl font-bold text-[#1e293b] dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-500">lightbulb</span>
                        AI Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.map((rec: any, i: number) => (
                            <div key={i} className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-indigo-900 p-2 rounded-lg shadow-sm">
                                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">auto_awesome</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1e293b] dark:text-dark-text-primary text-sm mb-1">Budget Recommendation</h4>
                                        <p className="text-sm text-text-muted dark:text-dark-text-secondary leading-relaxed">
                                            Consider setting a budget of <span className="font-bold text-indigo-700 dark:text-indigo-300">{formatCurrency(rec.recommendedBudget)}</span> for <span className="font-semibold">{rec.category}</span>. {rec.reason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
