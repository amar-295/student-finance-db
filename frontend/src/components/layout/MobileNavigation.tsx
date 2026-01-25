import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, Receipt, PlusCircle, PieChart, User } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileNavigation = () => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/transactions', icon: Receipt, label: 'Transactions' },
        { path: '/add', icon: PlusCircle, label: 'Add' }, // Note: we might need to handle this route or make it a modal trigger
        { path: '/budgets', icon: PieChart, label: 'Budgets' },
        { path: '/profile', icon: User, label: 'Profile' }
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border pb-safe z-50">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                relative flex flex-col items-center justify-center
                flex-1 h-full
                transition-colors
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
              `}
                        >
                            <Icon className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">{item.label}</span>

                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNavigation;
