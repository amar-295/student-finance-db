import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
    return (
        <div className="font-display bg-[#F9FAFB] dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-[500px] bg-white dark:bg-[#1a2828] rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                <div className="p-8 sm:p-12 text-center">
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#5EDACD] to-[#2EC4B6] text-white shadow-xl shadow-primary/20 ring-4 ring-white dark:ring-[#1a2828]">
                            <span className="material-symbols-outlined text-5xl">lock_reset</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                        Reset your password
                    </h1>

                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-10 max-w-sm mx-auto">
                        Enter the email address associated with your account and we will send you a link to reset your password.
                    </p>

                    <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors duration-200">mail</span>
                                </div>
                                <input
                                    className="block w-full pl-11 pr-4 h-12 bg-slate-50 dark:bg-[#131f1f] border-slate-200 dark:border-[#3a4b4b] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ease-in-out placeholder:text-slate-400 text-base outline-none"
                                    id="email"
                                    name="email"
                                    placeholder="student@example.com"
                                    required
                                    type="email"
                                />
                            </div>
                        </div>

                        <button className="group w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-bold text-base bg-gradient-to-r from-[#5EDACD] to-[#2EC4B6] hover:from-[#4BC8BB] hover:to-[#259693] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transform transition-all duration-200 active:scale-[0.98]" type="submit">
                            <span className="mr-2">Send Reset Link</span>
                            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">send</span>
                        </button>
                    </form>

                    <div className="mt-8 flex justify-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors group px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5">
                            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                            Back to Login
                        </Link>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
                            <span className="material-symbols-outlined text-[18px]">verified_user</span>
                            <p>Your data is safe with UniFlow.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
