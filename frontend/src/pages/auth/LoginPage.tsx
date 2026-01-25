import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService, type LoginInput } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';
import LoginForm from '../../components/auth/LoginForm';
import Background3D from '../../components/ui/Background3D';

export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore(state => state.setAuth);
    const [isLoading, setIsLoading] = useState(false);

    const slides = [
        {
            title: "Welcome Back!",
            description: "Your path to financial freedom and organized studies starts here. Manage your budget, track assignments, and stay ahead."
        },
        {
            title: "Smart Analytics",
            description: "Visualize your spending habits with intuitive charts. Identify where your money goes and save smarter with personalized insights."
        },
        {
            title: "Stay Organized",
            description: "Never miss a deadline again. Keep track of tuition payments, recurring bills, and assignment due dates in one secure place."
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const onLogin = async (data: LoginInput) => {
        setIsLoading(true);

        try {
            const response = await authService.login(data);
            setAuth(response);
            toast.success('Successfully logged in!');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-dark-bg-primary font-display antialiased text-text-main dark:text-dark-text-primary">
            {/* Left Side - Visual */}
            <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden p-12">
                <div className="absolute inset-0 z-0">
                    <Background3D />
                </div>
                {/* Overlay gradient - reduced opacity to show 3D */}
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-[1px]"></div>

                <div className="relative z-20 flex h-full flex-col justify-center text-white">
                    <Link to="/" className="mb-6 size-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-xl hover:scale-105 transition-transform">
                        <img src="/images/logo.svg" alt="UniFlow Logo" className="w-7 h-7 object-contain brightness-0 invert" />
                    </Link>

                    <div className="min-h-[220px] lg:min-h-[200px] transition-all duration-500 ease-in-out">
                        <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500" key={`title-${currentSlide}`}>
                            {slides[currentSlide].title}
                        </h1>
                        <p className="text-lg font-medium text-white/90 max-w-md leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700" key={`desc-${currentSlide}`}>
                            {slides[currentSlide].description}
                        </p>
                    </div>
                </div>

                <div className="relative z-20 flex gap-2 mb-12">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center overflow-y-auto overflow-x-hidden bg-background-light dark:bg-dark-bg-primary p-6 sm:p-12 lg:p-16 relative">
                {/* Decorative Blurs - Kept Template Colors as requested */}
                <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
                <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-secondary/5 blur-3xl"></div>

                <div className="w-full max-w-[440px] z-10">
                    <div className="mb-10 text-center lg:text-left">
                        <Link to="/" className="lg:hidden mb-6 flex justify-center hover:scale-105 transition-transform w-fit mx-auto">
                            <div className="size-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <img src="/images/logo.svg" alt="UniFlow Logo" className="w-7 h-7 object-contain brightness-0 invert" />
                            </div>
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-dark-text-primary mb-2">Log in to your account</h2>
                        <p className="text-text-muted dark:text-dark-text-secondary text-base">Welcome back! Please enter your details.</p>
                    </div>

                    <LoginForm
                        onSubmit={onLogin}
                        isLoading={isLoading}
                    />

                    <div className="mt-6 flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 dark:border-dark-border-primary dark:bg-dark-bg-tertiary transition-colors"
                                type="checkbox"
                                id="rememberMe"
                                disabled={isLoading}
                            />
                            <span className="text-sm text-text-muted dark:text-dark-text-tertiary group-hover:text-text-main dark:group-hover:text-dark-text-primary transition-colors select-none">Remember me</span>
                        </label>
                        <Link className="text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors" to="/forgot-password">Forgot Password?</Link>
                    </div>

                    <div className="relative flex items-center gap-4 py-6">
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

                    <div className="mt-4 text-center">
                        <p className="text-sm text-text-muted">Don't have an account? <Link to="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">Sign up</Link></p>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        Your data is encrypted and safe
                    </div>
                </div>
            </div>
        </div>
    );
}
