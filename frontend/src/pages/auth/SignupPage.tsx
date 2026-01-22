import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { authService, registerSchema } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';

const signupSchema = registerSchema.extend({
    terms: z.literal(true, {
        message: 'You must accept the terms and conditions',
    }),
});

type SignupInput = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore(state => state.setAuth);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const password = watch('password', '');
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const onSignup = async (data: SignupInput) => {
        setIsLoading(true);
        try {
            // Backend doesn't need 'terms'
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { terms, ...registrationData } = data;
            const response = await authService.register(registrationData);
            setAuth(response);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="font-display bg-white dark:bg-dark-bg-primary text-text-main dark:text-dark-text-primary min-h-screen flex flex-col lg:flex-row selection:bg-primary/30 transition-colors">
            {/* Left Side - Abstract & Testimonials */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-dark-bg-secondary overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/80 to-secondary/40 mix-blend-multiply"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FFD933]/20 rounded-full blur-[100px]"></div>

                <div className="relative z-10 max-w-lg text-white space-y-8">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity w-fit">
                        <div className="size-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-xl">
                            <img src="/images/logo.svg" alt="UniFlow Logo" className="w-6 h-6 object-contain brightness-0 invert" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight">UniFlow</span>
                    </Link>
                    <div className="space-y-4">
                        <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight">Master your finances,<br />ace your semester.</h2>
                        <p className="text-lg text-white/80 font-normal leading-relaxed max-w-md">Join over 50,000 students managing their budget, tasks, and tuition planning in one secure workspace.</p>
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex -space-x-3">
                            <img alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white/20" src="/images/avatar-1.png" />
                            <img alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white/20" src="/images/avatar-2.png" />
                            <img alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white/20" src="/images/avatar-3.png" />
                            <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white">+2k</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex text-[#FFD933] text-sm">
                                <span className="material-symbols-outlined text-[18px] fill-current">star</span>
                                <span className="material-symbols-outlined text-[18px] fill-current">star</span>
                                <span className="material-symbols-outlined text-[18px] fill-current">star</span>
                                <span className="material-symbols-outlined text-[18px] fill-current">star</span>
                                <span className="material-symbols-outlined text-[18px] fill-current">star</span>
                            </div>
                            <span className="text-xs text-white/80 font-medium">Rated 4.9/5 by students</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <main className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative bg-white dark:bg-dark-bg-primary overflow-y-auto font-display transition-colors">
                <div className="w-full max-w-[440px] flex flex-col gap-8">
                    <Link to="/" className="lg:hidden flex items-center gap-2 text-primary mb-2 w-fit hover:opacity-90 transition-opacity">
                        <div className="size-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <img src="/images/logo.svg" alt="UniFlow Logo" className="w-5 h-5 object-contain brightness-0 invert" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-text-main dark:text-dark-text-primary">UniFlow</span>
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight text-text-main dark:text-dark-text-primary">Create an account</h1>
                        <p className="text-text-muted dark:text-dark-text-secondary text-base font-normal">Start your journey to financial freedom today.</p>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSignup)}>
                        <div className="space-y-1.5">
                            <label className="text-text-main dark:text-dark-text-secondary text-sm font-semibold ml-1" htmlFor="name">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[20px]">person</span>
                                </div>
                                <input
                                    {...register('name')}
                                    className={`w-full h-12 pl-11 pr-4 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-dark-border-primary'} bg-gray-50 dark:bg-dark-bg-tertiary text-text-main dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                                    id="name"
                                    placeholder="Jane Doe"
                                    type="text"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">error</span>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-text-main dark:text-dark-text-secondary text-sm font-semibold ml-1" htmlFor="email">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[20px]">mail</span>
                                </div>
                                <input
                                    {...register('email')}
                                    className={`w-full h-12 pl-11 pr-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-dark-border-primary'} bg-gray-50 dark:bg-dark-bg-tertiary text-text-main dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                                    id="email"
                                    placeholder="student@example.com"
                                    type="email"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">error</span>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-text-main dark:text-dark-text-secondary text-sm font-semibold ml-1" htmlFor="password">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[20px]">lock</span>
                                </div>
                                <input
                                    {...register('password')}
                                    className={`w-full h-12 pl-11 pr-11 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-dark-border-primary'} bg-gray-50 dark:bg-dark-bg-tertiary text-text-main dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    disabled={isLoading}
                                />
                                <button
                                    aria-label="Toggle password visibility"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                            <div className="pt-1">
                                <div className="grid grid-cols-2 gap-3 px-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${hasMinLength ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                            <span className={`material-symbols-outlined text-[10px] ${hasMinLength ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                                                {hasMinLength ? 'check' : 'close'}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-medium ${hasMinLength ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                                            8+ Characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${hasNumber ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                            <span className={`material-symbols-outlined text-[10px] ${hasNumber ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                                                {hasNumber ? 'check' : 'close'}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-medium ${hasNumber ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                                            1 Number
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${hasUpper ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                            <span className={`material-symbols-outlined text-[10px] ${hasUpper ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                                                {hasUpper ? 'check' : 'close'}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-medium ${hasUpper ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                                            1 Uppercase
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${hasSymbol ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                            <span className={`material-symbols-outlined text-[10px] ${hasSymbol ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                                                {hasSymbol ? 'check' : 'close'}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-medium ${hasSymbol ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                                            1 Symbol
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mt-2">
                            <div className="flex items-center h-5">
                                <input
                                    {...register('terms')}
                                    className={`w-4 h-4 rounded border-gray-200 dark:border-dark-border-primary text-primary focus:ring-primary/25 bg-gray-50 dark:bg-dark-bg-tertiary cursor-pointer transition-colors ${errors.terms ? 'border-red-500' : ''}`}
                                    id="terms"
                                    type="checkbox"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="text-sm leading-5 -mt-0.5">
                                <label className="font-normal text-text-muted dark:text-dark-text-secondary" htmlFor="terms">
                                    I agree to the <a className="font-semibold text-primary hover:text-primary-dark transition-colors underline decoration-primary/30 underline-offset-2" href="#">Terms of Service</a> and <a className="font-semibold text-primary hover:text-primary-dark transition-colors underline decoration-primary/30 underline-offset-2" href="#">Privacy Policy</a>
                                </label>
                                {errors.terms && (
                                    <p className="text-[10px] text-red-500 mt-0.5">{errors.terms.message}</p>
                                )}
                            </div>
                        </div>

                        <button
                            className="mt-4 relative w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 overflow-hidden group disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
                            type="submit"
                            disabled={isLoading}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                                {!isLoading && <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                            </span>
                        </button>
                    </form>

                    <div className="relative flex items-center gap-4 py-4">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Or continue with</span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm font-semibold text-text-main hover:bg-gray-50 hover:border-gray-300 transition-all dark:bg-dark-bg-tertiary dark:border-dark-border-primary dark:text-dark-text-primary dark:hover:bg-dark-bg-hover" type="button">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"></path>
                                <path d="M12.24 24.0008C15.4765 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853"></path>
                                <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.5166C-0.18551 10.0056 -0.18551 14.0005 1.5166 17.3912L5.50253 14.3003Z" fill="#FBBC05"></path>
                                <path d="M12.24 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.24 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50253 9.70575C6.45064 6.86173 9.10947 4.74966 12.24 4.74966Z" fill="#EA4335"></path>
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm font-semibold text-text-main hover:bg-gray-50 hover:border-gray-300 transition-all dark:bg-dark-bg-tertiary dark:border-dark-border-primary dark:text-dark-text-primary dark:hover:bg-dark-bg-hover" type="button">
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.09-.08 2.31-.84 3.69-.74 1.51.1 2.65.73 3.4 1.83-3.03 1.83-2.51 6.55.94 7.95-.69 1.76-1.63 3.51-3.11 3.13zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.54 4.54-3.74 4.25z"></path>
                            </svg>
                            Apple
                        </button>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-text-sub dark:text-[#8ba7a6] text-sm font-display">
                            Already a member?
                            <Link className="text-primary font-bold hover:text-primary-dark transition-colors inline-flex items-center gap-0.5 group ml-1" to="/login">
                                Log In
                                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
