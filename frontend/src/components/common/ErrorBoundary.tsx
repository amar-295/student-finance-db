import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
    className?: string;
}

interface State {
    hasError: boolean;
}

/**
 * ErrorBoundary
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className={this.state.hasError ? this.props.className : ""}>
                    {this.props.fallback || (
                        <div className="flex h-full w-full items-center justify-center bg-muted/20 text-muted-foreground">
                            <p className="text-sm font-medium">Something went wrong.</p>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
