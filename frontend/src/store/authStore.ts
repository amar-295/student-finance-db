import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthResponse } from '../services/auth.service';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAuth: (response: AuthResponse) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            setAuth: (response: AuthResponse) =>
                set({
                    user: response.user,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                    isAuthenticated: true,
                }),
            logout: () =>
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                }),
            updateUser: (userData: Partial<User>) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
