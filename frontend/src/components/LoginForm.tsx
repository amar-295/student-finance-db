import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type LoginInput } from '../services/auth.service';

const loginFormSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

interface LoginFormProps {
    onSubmit: (data: LoginInput) => void;
    isLoading?: boolean;
    error?: string;
}

export default function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginFormSchema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit((data) => onSubmit(data))}>
            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-main dark:text-dark-text-secondary" htmlFor="email">
                    Email Address
                </label>
                <div className="relative">
                    <input
                        {...register('email')}
                        className={`w-full h-12 pl-4 pr-12 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-dark-border-primary'
                            } bg-[#f9fbfb] dark:bg-dark-bg-tertiary text-text-main dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal shadow-sm disabled:opacity-50`}
                        id="email"
                        placeholder="student@example.com"
                        type="email"
                        disabled={isLoading}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-3.5 text-gray-400 pointer-events-none text-[20px]">
                        mail
                    </span>
                </div>
                {errors.email && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-main dark:text-dark-text-secondary" htmlFor="password">
                    Password
                </label>
                <div className="relative">
                    <input
                        {...register('password')}
                        className={`w-full h-12 pl-4 pr-12 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-dark-border-primary'
                            } bg-[#f9fbfb] dark:bg-dark-bg-tertiary text-text-main dark:text-dark-text-primary placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal shadow-sm disabled:opacity-50`}
                        id="password"
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        disabled={isLoading}
                    />

                    <button
                        type="button"
                        className="material-symbols-outlined absolute right-4 top-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors text-[20px] select-none"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? 'visibility_off' : 'visibility'}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {errors.password.message}
                    </p>
                )}
            </div>

            <button
                className="mt-2 relative w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 overflow-hidden group disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? 'Logging In...' : 'Log In'}
                    {!isLoading && (
                        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                            arrow_forward
                        </span>
                    )}
                </span>
            </button>
        </form>
    );
}
