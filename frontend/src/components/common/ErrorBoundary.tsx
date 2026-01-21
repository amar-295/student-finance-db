import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 font-display">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="flex justify-center">
                            <span className="material-symbols-outlined text-7xl text-red-500 animate-bounce">
                                warning
                            </span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-extrabold tracking-tight text-text-main dark:text-white">Oops! System Failure</h1>
                            <p className="text-text-sub text-lg">
                                Something unexpected happened. We've logged the error and are looking into it.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-[#259694] text-white font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">refresh</span>
                                Restart Application
                            </button>
                            <button
                                onClick={() => (window.location.href = '/')}
                                className="text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors py-2"
                            >
                                Return to Homepage
                            </button>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Error Trace</p>
                            <div className="mt-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-left border border-gray-100 dark:border-white/10">
                                <code className="text-[10px] text-red-500 dark:text-red-400 break-all leading-relaxed">
                                    {this.state.error?.message || 'Unknown application error'}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
