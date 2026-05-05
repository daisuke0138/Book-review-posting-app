import apiClient from "@/lib/apiClient";
import React, { ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = React.createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = async (token: string) => {
        window.localStorage.setItem("auth_token", token);
        apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        delete apiClient.defaults.headers["Authorization"];
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const value = {
        isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
