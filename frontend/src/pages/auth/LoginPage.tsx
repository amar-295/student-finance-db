import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        // id matches formData keys (email, password)
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });

            // Store user/token (handled by authService inside login? No, service returns data, we should store it?)
            // Ah, my service implementation in Step 1017 didn't automatically store in localStorage inside login().
            // It had a `logout` method that clears it. 
            // I should store it here.
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.user));

            navigate('/'); // Redirect to Home/Dashboard
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark font-display antialiased text-text-main">
            {/* Left Side - Visual */}
            <div className="relative hidden lg:flex w-5/12 flex-col justify-between overflow-hidden p-12">
                <div
                    className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmkyI_dKsTY0DF1gG8r9L918N9dcZpgZaHPQ8hzD0DjLKbnZtdN5f0dV9NBzC3BKstlA7t57wlZC8BDpgoCG2iP9ToCHYKsfgQtCtFo3hk4WIx6xY3RPfc6KeNweuiR1LWm6BqgGzxC-qyPSNFhptUtIhZwS1LIt-KXjNJ5R4qDSud8v3gPfLYoWOUVboUNYWqQMTzOdUrcQQSwC-x2aRMPJP3tp3ZSs6nwnUYLE_uABVLpjLCIt83zUTJrIcqzzWG6dx_z5SmtDA')" }}
                >
                </div>
                {/* Abstract Background - Kept Template Colors as requested */}
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#26d99d]/90 to-[#759FDD]/90 mix-blend-multiply"></div>
                <div className="absolute inset-0 z-10 bg-black/10"></div>

                <div className="relative z-20 flex h-full flex-col justify-center text-white">
                    <div className="mb-6 h-12 w-12 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <img src="/images/logo.svg" alt="UniFlow Logo" className="w-8 h-8 object-contain" />
                    </div>
                    <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
                        Welcome Back!
                    </h1>
                    <p className="text-lg font-medium text-white/90 max-w-md leading-relaxed">
                        Your path to financial freedom and organized studies starts here. Manage your budget, track assignments, and stay ahead.
                    </p>
                </div>

                <div className="relative z-20 flex gap-2">
                    <div className="h-1.5 w-8 rounded-full bg-white"></div>
                    <div className="h-1.5 w-2 rounded-full bg-white/40"></div>
                    <div className="h-1.5 w-2 rounded-full bg-white/40"></div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-background-light dark:bg-background-dark p-6 relative">
                {/* Decorative Blurs - Kept Template Colors as requested */}
                <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-[#26d99d]/5 blur-3xl"></div>
                <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#759FDD]/5 blur-3xl"></div>

                <div className="w-full max-w-[440px] z-10">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="lg:hidden mb-6 flex justify-center">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <img src="/images/logo.svg" alt="UniFlow Logo" className="w-8 h-8 object-contain" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white mb-2">Log in to your account</h2>
                        <p className="text-text-sub text-base">Welcome back! Please enter your details.</p>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-text-main dark:text-gray-200" htmlFor="email">Email Address</label>
                            <div className="relative">
                                {/* Input: Reverted to Primary Brand Color */}
                                <input
                                    className="w-full rounded-lg border border-gray-200 bg-white dark:bg-[#252a30] dark:border-gray-700 dark:text-white pl-4 pr-12 py-3.5 text-base font-normal shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
                                    id="email"
                                    placeholder="student@university.edu"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <span className="material-symbols-outlined absolute right-4 top-3.5 text-gray-400 pointer-events-none text-[20px]">mail</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-text-main dark:text-gray-200" htmlFor="password">Password</label>
                            <div className="relative">
                                {/* Input: Reverted to Primary Brand Color */}
                                <input
                                    className="w-full rounded-lg border border-gray-200 bg-white dark:bg-[#252a30] dark:border-gray-700 dark:text-white pl-4 pr-12 py-3.5 text-base font-normal shadow-sm placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <span
                                    className="material-symbols-outlined absolute right-4 top-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors text-[20px] select-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                {/* Checkbox: Reverted to Primary Brand Color */}
                                <input
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 transition-colors"
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <span className="text-sm text-text-sub group-hover:text-text-main transition-colors select-none">Remember me</span>
                            </label>
                            <a className="text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors" href="#">Forgot Password?</a>
                        </div>

                        {/* Button: Reverted to Primary Brand Color (No Gradient) */}
                        <button
                            className="bg-primary hover:bg-primary-dark hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 mt-2 w-full rounded-lg py-3.5 text-base font-bold text-white mb-2"
                            type="button"
                        >
                            Log In
                        </button>

                        <div className="relative flex items-center gap-4 py-2">
                            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Or continue with</span>
                            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm font-semibold text-text-main hover:bg-gray-50 hover:border-gray-300 transition-all dark:bg-[#252a30] dark:border-gray-700 dark:text-white dark:hover:bg-[#2f353d]" type="button">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"></path>
                                    <path d="M12.24 24.0008C15.4765 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853"></path>
                                    <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.5166C-0.18551 10.0056 -0.18551 14.0005 1.5166 17.3912L5.50253 14.3003Z" fill="#FBBC05"></path>
                                    <path d="M12.24 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.24 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50253 9.70575C6.45064 6.86173 9.10947 4.74966 12.24 4.74966Z" fill="#EA4335"></path>
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm font-semibold text-text-main hover:bg-gray-50 hover:border-gray-300 transition-all dark:bg-[#252a30] dark:border-gray-700 dark:text-white dark:hover:bg-[#2f353d]" type="button">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.09-.08 2.31-.84 3.69-.74 1.51.1 2.65.73 3.4 1.83-3.03 1.83-2.51 6.55.94 7.95-.69 1.76-1.63 3.51-3.11 3.13zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.54 4.54-3.74 4.25z"></path>
                                </svg>
                                Apple
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-text-sub">Don't have an account? <Link to="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">Sign up</Link></p>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            Your data is encrypted and safe
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
