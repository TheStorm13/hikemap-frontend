import React, {createContext, useContext, useEffect, useState} from 'react';
import {AuthService} from './AuthService';
import {AuthState} from '../../types/auth/authTypes';

const authService = AuthService.getInstance();

const AuthContext = createContext<{
    state: AuthState;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}>({
    state: authService.getAuthState(),
    login: authService.login.bind(authService),
    register: authService.register.bind(authService),
    logout: authService.logout.bind(authService),
    checkAuth: authService.checkAuth.bind(authService),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [state, setState] = useState<AuthState>(authService.getAuthState());

    useEffect(() => {
        // Initialize auth state
        const unsubscribe = authService.subscribe(newState => {
            setState(newState);
        });

        // Check auth status on mount
        authService.checkAuth();

        // Listen for storage changes
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key && ['accsessToken', 'refreshToken'].includes(event.key)) {
                authService.checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            unsubscribe();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const value = {
        state,
        login: authService.login.bind(authService),
        register: authService.register.bind(authService),
        logout: authService.logout.bind(authService),
        checkAuth: authService.checkAuth.bind(authService),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};