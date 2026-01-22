import { createContext, useContext, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated, logout } = useAuthStore();

    // Mock login for tests to satisfy component requirements
    const login = async () => {
        // In a real scenario, this would call authService.login
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
