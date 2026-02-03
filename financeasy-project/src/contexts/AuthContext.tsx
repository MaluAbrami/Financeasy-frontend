import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authStorage } from "../storage/auth.storage";
import { string } from "zod";

type AuthContextValue = {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(authStorage.getToken());
    }, []);

    const value = useMemo<AuthContextValue>(() => {
        return {
            token,
            isAuthenticated: !!token,
            login: (newToken: string) => {
                authStorage.setToken(newToken);
                setToken(newToken);
            },
            logout: () => {
                authStorage.clear();
                setToken(null);
            },
        };
    }, [token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error("useAuth deve ser usado dentro do <AuthProvider>.");
    return ctx;
}