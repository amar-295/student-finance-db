import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password strength calculation
    const password = formData.password;
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle both standard inputs and those with specific IDs
        const id = e.target.id === 'confirm_password' ? 'confirmPassword' : e.target.id;
        setFormData({ ...formData, [id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        setIsLoading(true);
        // Simulator backend delay
        setTimeout(() => {
            setIsLoading(false);
            navigate('/login');
        }, 1500);
    };

    // Helper for strength indicators
    const StrengthItem = ({ active, label }: { active: boolean, label: string }) => (
        <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                <span className={`material-symbols-outlined text-[10px] ${active ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                    {active ? 'check' : 'close'}
                </span>
            </div>
            <span className={`text-xs font-medium ${active ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                {label}
            </span>
        </div>
    );

    return (
        <div className="font-display bg-[#F9FAFB] dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-[500px] bg-white dark:bg-[#1a2828] rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                <div className="p-8 sm:p-12 text-center">
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#5EDACD] to-[#2EC4B6] text-white shadow-xl shadow-primary/20 ring-4 ring-white dark:ring-[#1a2828]">
                            <span className="material-symbols-outlined text-5xl">lock</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                        Set new password
                    </h1>

                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
                        Your new password must be different to previously used passwords.
                    </p>

                    <form className="space-y-6 text-left" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1" htmlFor="password">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors duration-200">lock</span>
                                </div>
                                <input
                                    className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-[#131f1f] border-slate-200 dark:border-[#3a4b4b] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ease-in-out placeholder:text-slate-400 text-base outline-none"
                                    id="password"
                                    placeholder="••••••••"
                                    required
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                                >
                                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1" htmlFor="confirm_password">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors duration-200">lock</span>
                                </div>
                                <input
                                    className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-[#131f1f] border-slate-200 dark:border-[#3a4b4b] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ease-in-out placeholder:text-slate-400 text-base outline-none"
                                    id="confirm_password"
                                    placeholder="••••••••"
                                    required
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                                >
                                    <span className="material-symbols-outlined">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="pt-1">
                            <div className="grid grid-cols-2 gap-3">
                                <StrengthItem active={hasMinLength} label="8+ Characters" />
                                <StrengthItem active={hasNumber} label="1 Number" />
                                <StrengthItem active={hasUpper} label="1 Uppercase" />
                                <StrengthItem active={hasSymbol} label="1 Symbol" />
                            </div>
                        </div>

                        <button
                            className="group w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-bold text-base bg-gradient-to-r from-[#5EDACD] to-[#2EC4B6] hover:from-[#4BC8BB] hover:to-[#259693] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transform transition-all duration-200 active:scale-[0.98] mt-2 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
                            type="submit"
                            disabled={isLoading}
                        >
                            <span className="mr-2">{isLoading ? 'Resetting...' : 'Reset Password'}</span>
                            {!isLoading && <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                        </button>
                    </form>

                    <div className="mt-8 flex justify-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors group px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5">
                            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
