import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Wallet,
    CreditCard,
    PieChart,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Wallet, label: 'Accounts', href: '/accounts' },
    { icon: CreditCard, label: 'Transactions', href: '/transactions' },
    { icon: PieChart, label: 'Budgets', href: '/budgets' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial={{ width: 240 }}
            animate={{ width: collapsed ? 80 : 240 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-50 flex h-screen flex-col border-r bg-card text-card-foreground shadow-xl"
        >
            {/* Logo Section */}
            <div className="flex h-16 items-center justify-center border-b px-4">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="font-bold">SF</span>
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="whitespace-nowrap font-bold"
                            >
                                StudentFi
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
                                    collapsed && "justify-center px-2"
                                )
                            }
                        >
                            <item.icon className="h-5 w-5 min-w-[20px]" />
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Footer / Toggle */}
            <div className="border-t p-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    {!collapsed && <span>Collapse</span>}
                </Button>
                <div className="mt-2 flex items-center gap-3 rounded-lg border p-2">
                    <div className="h-8 w-8 min-w-[32px] rounded-full bg-slate-200 dark:bg-slate-700" />
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium">Student User</p>
                            <p className="truncate text-xs text-muted-foreground">user@example.com</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
}
