import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <Header />

            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 px-6 overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4"></div>
                    <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-50 -translate-x-1/4 translate-y-1/4"></div>

                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        {/* Hero Content */}
                        <div className="flex flex-col gap-8 text-center lg:text-left z-10">
                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-7xl font-display font-extrabold tracking-tight text-text-main dark:text-dark-text-primary leading-[1.1]">
                                    Your College Life, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Organized.</span>
                                </h1>
                                <p className="text-lg lg:text-xl text-text-muted dark:text-dark-text-secondary max-w-2xl mx-auto lg:mx-0 font-body leading-relaxed">
                                    Stop stressing over assignments and splitting pizza bills. Master your schedule, budget, and social life in one intuitive app designed for students.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/signup" className="flex items-center justify-center bg-primary hover:bg-primary-dark text-white text-base font-bold h-14 px-8 rounded-xl shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
                                    Get Started for Free
                                </Link>
                                <button className="group bg-white dark:bg-dark-bg-tertiary border border-gray-200 dark:border-dark-border-primary text-text-main dark:text-dark-text-primary text-base font-bold h-14 px-8 rounded-xl hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-dark-bg-hover transition-all duration-300 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">play_circle</span>
                                    See how it works
                                </button>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                                <div className="flex -space-x-3">
                                    <img alt="Student user avatar" className="w-10 h-10 rounded-full border-2 border-white dark:border-background-dark object-cover" src="/images/avatar-1.png" />
                                    <img alt="Student user avatar" className="w-10 h-10 rounded-full border-2 border-white dark:border-background-dark object-cover" src="/images/avatar-2.png" />
                                    <img alt="Student user avatar" className="w-10 h-10 rounded-full border-2 border-white dark:border-background-dark object-cover" src="/images/avatar-3.png" />
                                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-bg-primary bg-gray-100 dark:bg-dark-bg-tertiary flex items-center justify-center text-xs font-bold text-text-muted">+2k</div>
                                </div>
                                <p className="text-sm font-medium text-text-muted">Trusted by 2,000+ students</p>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="relative lg:h-[600px] flex items-center justify-center lg:justify-end">
                            <div className="relative w-full aspect-[4/3] lg:aspect-square max-w-[500px] lg:max-w-none">
                                {/* Abstract decorative circle behind */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-2xl scale-90 animate-pulse"></div>
                                {/* Main 3D Illustration */}
                                <img
                                    alt="3D illustration of a stylized student desk setup"
                                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-3xl"
                                    src="/images/hero-illustration.png"
                                    loading="eager"
                                    width={800}
                                    height={800}
                                />
                                {/* Floating Cards */}
                                <div className="absolute top-[20%] left-0 lg:-left-[10%] z-20 bg-white dark:bg-dark-bg-secondary p-4 rounded-xl shadow-soft border border-gray-100 dark:border-dark-border-primary motion-safe:animate-bounce" style={{ animationDuration: '3s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">check</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted">Task Completed</p>
                                            <p className="text-sm font-bold text-text-main dark:text-dark-text-primary">Essay Draft</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-[20%] right-0 lg:right-[0%] z-20 bg-white dark:bg-dark-bg-secondary p-4 rounded-xl shadow-soft border border-gray-100 dark:border-dark-border-primary motion-safe:animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary-light text-secondary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">attach_money</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted">Money Saved</p>
                                            <p className="text-sm font-bold text-text-main dark:text-dark-text-primary">$45.00 this week</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Section */}
                <section className="py-20 bg-white dark:bg-dark-bg-primary/50" id="features">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-main dark:text-dark-text-primary">Everything you need to <span className="text-primary">ace the semester</span></h2>
                            <p className="text-lg text-text-muted font-body">Manage your time and your money without the headache. We've combined the best productivity tools into one simple dashboard.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Card 1: Task Mastery */}
                            <a href="#" className="feature-card bg-background-light dark:bg-dark-bg-secondary rounded-2xl p-8 border border-gray-100 dark:border-dark-border-primary flex flex-col h-full relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-dark-bg-tertiary shadow-sm flex items-center justify-center mb-6 text-primary border border-gray-100 dark:border-dark-border-secondary relative z-10">
                                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                                </div>
                                <h3 className="text-xl font-bold text-text-main dark:text-dark-text-primary mb-3 relative z-10">Task Mastery</h3>
                                <p className="text-text-muted dark:text-dark-text-secondary leading-relaxed flex-grow relative z-10">
                                    Never miss a deadline again. Intuitive task lists that sync with your syllabus and smart reminders that nudge you before it's too late.
                                </p>
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center text-primary font-bold text-sm relative z-10">
                                    Learn more <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </a>
                            {/* Card 2: Smart Budgeting */}
                            <a href="#" className="feature-card bg-background-light dark:bg-dark-bg-secondary rounded-2xl p-8 border border-gray-100 dark:border-dark-border-primary flex flex-col h-full relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center mb-6 text-primary border border-gray-100 dark:border-gray-600 relative z-10">
                                    <span className="material-symbols-outlined text-[32px]">account_balance_wallet</span>
                                </div>
                                <h3 className="text-xl font-bold text-text-main dark:text-white mb-3 relative z-10">Smart Budgeting</h3>
                                <p className="text-text-muted dark:text-gray-400 leading-relaxed flex-grow relative z-10">
                                    Track your coffee addiction and textbook costs. Set realistic saving goals and visualize where your student loan is actually going.
                                </p>
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center text-primary font-bold text-sm relative z-10">
                                    Learn more <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </a>
                            {/* Card 3: Social Bill Splitting */}
                            <a href="#" className="feature-card bg-background-light dark:bg-dark-bg-secondary rounded-2xl p-8 border border-gray-100 dark:border-dark-border-primary flex flex-col h-full relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center mb-6 text-primary border border-gray-100 dark:border-gray-600 relative z-10">
                                    <span className="material-symbols-outlined text-[32px]">groups</span>
                                </div>
                                <h3 className="text-xl font-bold text-text-main dark:text-white mb-3 relative z-10">Social Bill Splitting</h3>
                                <p className="text-text-muted dark:text-gray-400 leading-relaxed flex-grow relative z-10">
                                    Split rent, pizza, and utilities instantly. No more awkward conversations or "I'll pay you later" sticky notes on the fridge.
                                </p>
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center text-primary font-bold text-sm relative z-10">
                                    Learn more <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Mini CTA Strip */}
                <section className="py-12 border-t border-gray-100 dark:border-dark-border-primary">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-lg font-bold text-text-main dark:text-dark-text-primary">Ready to organize your life?</h4>
                            <p className="text-sm text-text-muted">Join thousands of students getting more done.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <input className="flex-grow md:w-64 bg-white dark:bg-dark-bg-tertiary border border-gray-200 dark:border-dark-border-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-dark-text-primary" placeholder="Enter your .edu email" type="email" />
                            <button className="bg-text-main dark:bg-white text-white dark:text-text-main text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors whitespace-nowrap">
                                Get Started
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
