
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    // AuthContext.tsx
    const login = (token: string, refreshToken: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

