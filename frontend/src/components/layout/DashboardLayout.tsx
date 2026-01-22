import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import ThemeToggle from '../common/ThemeToggle';

export default function DashboardLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'Accounts', path: '/accounts', icon: 'payments' },
        { name: 'Transactions', path: '/transactions', icon: 'receipt_long' },
        { name: 'Analytics', path: '/analytics', icon: 'donut_small' },
        { name: 'Budgeting', path: '/budgets', icon: 'savings' },
        { name: 'Group Splits', path: '/splits', icon: 'groups' },
    ];

    return (
        <div className="bg-background-light dark:bg-dark-bg-primary text-text-main dark:text-dark-text-primary font-display min-h-screen">
            <div className="flex min-h-screen">
                {/* Sticky Sidebar */}
                <aside
                    className={`sticky top-0 h-screen border-r border-gray-100 dark:border-dark-border-primary bg-white dark:bg-dark-bg-secondary flex flex-col p-4 z-50 transition-[width] duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
                        }`}
                >
                    <div className={`flex items-center gap-3 mb-8 px-2 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                            <img src="/images/logo.svg" alt="UniFlow Logo" className="w-6 h-6 object-contain brightness-0 invert" />
                        </div>
                        <div className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                            }`}>
                            <h1 className="text-lg font-extrabold leading-none tracking-tight">UniFlow</h1>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Student Finance</span>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2 flex-1 w-full">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all group relative ${isActive(item.path)
                                    ? 'bg-primary/10 text-primary font-bold'
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-bg-hover font-medium'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? item.name : ''}
                            >
                                <span className={`material-symbols-outlined shrink-0 ${isActive(item.path) ? '' : ''}`}>{item.icon}</span>
                                <span className={`text-sm border-none whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
                                    }`}>
                                    {item.name}
                                </span>
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        ))}

                        {/* Settings / Logout */}
                        <div className="mt-auto flex flex-col gap-2">
                            <Link
                                to="/settings"
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all group relative ${isActive('/settings')
                                    ? 'bg-primary/10 text-primary font-bold'
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-bg-hover font-medium'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? 'Settings' : ''}
                            >
                                <span className={`material-symbols-outlined shrink-0 ${isActive('/settings') ? 'filled-icon' : ''}`}>settings</span>
                                <span className={`text-sm border-none whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
                                    }`}>
                                    Settings
                                </span>
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                        Settings
                                    </div>
                                )}
                            </Link>

                            <button
                                onClick={handleLogout}
                                className={`flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all text-left w-full group relative ${isCollapsed ? 'justify-center' : ''
                                    }`}
                                title={isCollapsed ? 'Log Out' : ''}
                            >
                                <span className="material-symbols-outlined shrink-0">logout</span>
                                <span className={`text-sm font-medium border-none whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
                                    }`}>
                                    Log Out
                                </span>
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                        Log Out
                                    </div>
                                )}
                            </button>
                        </div>
                    </nav>

                    <div className={`mt-4 bg-background-light dark:bg-dark-bg-tertiary rounded-xl flex items-center gap-3 border border-gray-100 dark:border-dark-border-primary transition-all duration-300 ${isCollapsed ? 'p-2 justify-center aspect-square' : 'p-3'
                        }`}>
                        <div
                            className="size-8 rounded-full bg-cover bg-center border border-white shrink-0"
                            style={{ backgroundImage: "url('/images/profile-main.png')" }}
                        ></div>
                        <div className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
                            }`}>
                            <p className="text-xs font-bold truncate">{user?.name || 'Student'}</p>
                            <p className="text-[10px] text-gray-400 truncate">{user?.email || 'student@uni.edu'}</p>
                        </div>
                    </div>

                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`mt-4 flex items-center gap-3 p-2 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-bg-hover transition-all w-full ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {isCollapsed ? 'last_page' : 'first_page'}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'
                            }`}>
                            Collapse Sidebar
                        </span>
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                    {/* Header Nav */}
                    <header className="h-20 flex items-center justify-between px-8 border-b border-gray-100 dark:border-dark-border-primary bg-white/80 dark:bg-dark-bg-primary/80 backdrop-blur-md sticky top-0 z-40">
                        <div className="flex-1 max-w-xl">
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                                <input className="w-full bg-[#f1f5f5] dark:bg-white/5 border-none rounded-xl pl-12 pr-4 h-11 focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Search transactions or accounts..." type="text" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 ml-8">
                            <ThemeToggle />
                            <button className="size-11 flex items-center justify-center rounded-xl bg-background-light dark:bg-dark-bg-tertiary text-gray-500 hover:text-primary transition-colors border border-gray-100 dark:border-dark-border-primary">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <button className="px-5 h-11 flex items-center gap-2 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                <span className="hidden sm:inline">New Transaction</span>
                            </button>
                        </div>
                    </header>

                    {/* Page Content */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
