import { useState, useEffect } from 'react';
import Skeleton from '../components/common/Skeleton';

export default function BudgetsPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="p-8 space-y-8 font-display">
            <div className="flex flex-col gap-1">
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton variant="text" width="200px" className="h-9" />
                        <Skeleton variant="text" width="350px" className="h-5" />
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-black text-[#101919] dark:text-white">Budgets</h2>
                        <p className="text-[#578e8d]">Track your spending limits and stay financially healthy.</p>
                    </>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-[#e9f1f1] dark:border-white/10 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <Skeleton variant="circle" width={40} height={40} />
                                <Skeleton variant="rect" width={60} height={20} className="rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton variant="text" width="60%" className="h-6" />
                                <Skeleton variant="text" width="40%" className="h-4" />
                            </div>
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between">
                                    <Skeleton variant="text" width="40px" />
                                    <Skeleton variant="text" width="40px" />
                                </div>
                                <Skeleton variant="rect" height={8} className="rounded-full w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-white/5 p-12 rounded-2xl border border-[#e9f1f1] dark:border-white/10 text-center">
                    <span className="material-symbols-outlined text-6xl text-[#578e8d] mb-4">savings</span>
                    <p className="text-xl font-bold text-[#578e8d]">Budgeting Module Coming Soon</p>
                    <p className="text-sm text-[#578e8d] mt-2">Smart limits to keep your finances healthy.</p>
                </div>
            )}
        </div>
    );
}
