import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'Accounts', path: '/accounts', icon: 'payments' },
        { name: 'Transactions', path: '/transactions', icon: 'receipt_long' },
        { name: 'Analytics', path: '/analytics', icon: 'donut_small' },
        { name: 'Budgeting', path: '/budgets', icon: 'savings' },
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#101919] dark:text-white font-display min-h-screen">
            <div className="flex min-h-screen">
                {/* Sticky Sidebar */}
                <aside className="sticky top-0 h-screen w-64 border-r border-[#e9f1f1] dark:border-[#2d3a3a] bg-white dark:bg-background-dark flex flex-col p-6 gap-8 z-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <img src="/images/logo.svg" alt="UniFlow Logo" className="w-6 h-6 object-contain brightness-0 invert" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-extrabold leading-none tracking-tight">UniFlow</h1>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Student Finance</span>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2 flex-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                    ? 'bg-primary/10 text-primary font-bold'
                                    : 'text-[#578e8d] hover:bg-gray-50 dark:hover:bg-white/5 font-medium'
                                    }`}
                            >
                                <span className={`material-symbols-outlined ${isActive(item.path) ? '' : ''}`}>{item.icon}</span>
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        ))}

                        {/* Settings / Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#578e8d] hover:bg-red-50 hover:text-red-500 transition-all mt-auto text-left w-full"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span className="text-sm font-medium">Log Out</span>
                        </button>
                    </nav>
                    <div className="bg-background-light dark:bg-white/5 p-4 rounded-xl flex items-center gap-3 border border-[#e9f1f1] dark:border-white/10">
                        <div
                            className="size-10 rounded-full bg-cover bg-center border border-white"
                            style={{ backgroundImage: "url('/images/profile-main.png')" }}
                        ></div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-xs font-bold truncate">{user?.name || 'Student'}</p>
                            <p className="text-[10px] text-[#578e8d] truncate">{user?.email || 'student@uni.edu'}</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Header Nav */}
                    <header className="h-20 flex items-center justify-between px-8 border-b border-[#e9f1f1] dark:border-[#2d3a3a] bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-40">
                        <div className="flex-1 max-w-xl">
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#578e8d] group-focus-within:text-primary transition-colors">search</span>
                                <input className="w-full bg-[#f1f5f5] dark:bg-white/5 border-none rounded-xl pl-12 pr-4 h-11 focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Search transactions or accounts..." type="text" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 ml-8">
                            <button className="size-11 flex items-center justify-center rounded-xl bg-background-light dark:bg-white/5 text-[#578e8d] hover:text-primary transition-colors border border-[#e9f1f1] dark:border-white/10">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <button className="px-5 h-11 flex items-center gap-2 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                New Transaction
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
