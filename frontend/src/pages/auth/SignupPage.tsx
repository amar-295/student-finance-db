import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        terms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.register({
                email: formData.email,
                password: formData.password,
                name: formData.fullname
            });
            // On success, redirect to login (or dashboard if auto-login logic added)
            navigate('/');
            // Note: Ideally show a success message or toast "Account created! Please log in."
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Mock validation for visuals
    const password = formData.password;
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        <div className="font-display bg-white dark:bg-background-dark text-text-main dark:text-white min-h-screen flex flex-col lg:flex-row selection:bg-primary/30">
            {/* Left Side - Abstract & Testimonials */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#131f1f] overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-[#259694]/80 to-[#FFD933]/40 mix-blend-multiply"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FFD933]/20 rounded-full blur-[100px]"></div>

                <div className="relative z-10 max-w-lg text-white space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-xl">
                            <img src="/images/logo.svg" alt="UniFlow Logo" className="w-6 h-6 object-contain brightness-0 invert" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight">UniFlow</span>
                    </div>
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
            <main className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative bg-white dark:bg-[#1a2828] overflow-y-auto">
                <div className="w-full max-w-[440px] flex flex-col gap-8">
                    <div className="lg:hidden flex items-center gap-2 text-primary mb-2">
                        <div className="size-8 bg-gradient-to-br from-primary to-[#259694] rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <img src="/images/logo.svg" alt="UniFlow Logo" className="w-5 h-5 object-contain brightness-0 invert" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-text-main dark:text-white">UniFlow</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight text-text-main dark:text-white">Create an account</h1>
                        <p className="text-text-sub dark:text-[#8ba7a6] text-base font-normal">Start your 30-day free trial. Cancel anytime.</p>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-text-main dark:text-[#e0eaea] text-sm font-semibold ml-1" htmlFor="fullname">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[20px]">person</span>
                                </div>
                                <input
                                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#d3e4e4] dark:border-[#3a4b4b] bg-[#f9fbfb] dark:bg-[#131f1f] text-text-main dark:text-white placeholder-[#94b3b2] dark:placeholder-[#4a6b6a] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    id="fullname"
                                    name="fullname"
                                    placeholder="Jane Doe"
                                    required
                                    type="text"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-text-main dark:text-[#e0eaea] text-sm font-semibold ml-1" htmlFor="email">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[20px]">mail</span>
                                </div>
                                <input
                                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#d3e4e4] dark:border-[#3a4b4b] bg-[#f9fbfb] dark:bg-[#131f1f] text-text-main dark:text-white placeholder-[#94b3b2] dark:placeholder-[#4a6b6a] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    id="email"
                                    name="email"
                                    placeholder="student@example.com"
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-text-main dark:text-[#e0eaea] text-sm font-semibold ml-1" htmlFor="password">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[20px]">lock</span>
                                </div>
                                <input
                                    className="w-full h-12 pl-11 pr-11 rounded-xl border border-[#d3e4e4] dark:border-[#3a4b4b] bg-[#f9fbfb] dark:bg-[#131f1f] text-text-main dark:text-white placeholder-[#94b3b2] dark:placeholder-[#4a6b6a] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
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
                            <div className="grid grid-cols-2 gap-x-2 gap-y-2 px-1 pt-2">
                                <div className={`flex items-center gap-2 font-medium text-xs transition-colors duration-200 ${hasMinLength ? 'text-primary' : 'text-gray-400'}`}>
                                    <span className="material-symbols-outlined text-[16px]">{hasMinLength ? 'check_circle' : 'radio_button_unchecked'}</span>
                                    <span>8+ characters</span>
                                </div>
                                <div className={`flex items-center gap-2 font-medium text-xs transition-colors duration-200 ${hasNumber ? 'text-primary' : 'text-gray-400'}`}>
                                    <span className="material-symbols-outlined text-[16px]">{hasNumber ? 'check_circle' : 'radio_button_unchecked'}</span>
                                    <span>1 number</span>
                                </div>
                                <div className={`flex items-center gap-2 font-medium text-xs transition-colors duration-200 ${hasUpper ? 'text-primary' : 'text-gray-400'}`}>
                                    <span className="material-symbols-outlined text-[16px]">{hasUpper ? 'check_circle' : 'radio_button_unchecked'}</span>
                                    <span>1 uppercase</span>
                                </div>
                                <div className={`flex items-center gap-2 font-medium text-xs transition-colors duration-200 ${hasSymbol ? 'text-primary' : 'text-gray-400'}`}>
                                    <span className="material-symbols-outlined text-[16px]">{hasSymbol ? 'check_circle' : 'radio_button_unchecked'}</span>
                                    <span>1 symbol</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mt-2">
                            <div className="flex items-center h-5">
                                <input
                                    className="w-4 h-4 rounded border-[#d3e4e4] dark:border-[#3a4b4b] text-primary focus:ring-primary/25 bg-[#f9fbfb] dark:bg-[#131f1f] cursor-pointer transition-colors"
                                    id="terms"
                                    name="terms"
                                    required
                                    type="checkbox"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="text-sm leading-5 -mt-0.5">
                                <label className="font-normal text-text-sub dark:text-[#8ba7a6]" htmlFor="terms">
                                    I agree to the <a className="font-semibold text-primary hover:text-[#259694] transition-colors underline decoration-primary/30 underline-offset-2" href="#">Terms of Service</a> and <a className="font-semibold text-primary hover:text-[#259694] transition-colors underline decoration-primary/30 underline-offset-2" href="#">Privacy Policy</a>
                                </label>
                            </div>
                        </div>

                        {/* Button - Reverted to Template Gradient (Teal to Yellow) */}
                        <button
                            className="mt-4 relative w-full h-12 rounded-xl bg-gradient-to-r from-primary to-[#FFD933] text-white font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 overflow-hidden group disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
                            type="submit"
                            disabled={isLoading}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                                {!isLoading && <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                            </span>
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-text-sub dark:text-[#8ba7a6] text-sm">
                            Already a member?
                            <Link className="text-primary font-bold hover:text-[#259694] transition-colors inline-flex items-center gap-0.5 group ml-1" to="/login">
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
