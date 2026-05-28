/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const savedSession = sessionStorage.getItem('raaz_session');
    const savedToken = sessionStorage.getItem('raaz_token');
    
    const [user, setUser] = useState(savedSession ? JSON.parse(savedSession) : null);
    const [token, setToken] = useState(savedToken || null);
    const [loading, setLoading] = useState(false);

    const login = (userData, sessionToken) => {
        setUser(userData);
        setToken(sessionToken);
        sessionStorage.setItem('raaz_session', JSON.stringify(userData));
        sessionStorage.setItem('raaz_token', sessionToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('raaz_session');
        sessionStorage.removeItem('raaz_token');
    };

    // Helper to configure API headers
    const getAuthHeaders = () => {
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, getAuthHeaders }}>
            {children}
        </AuthContext.Provider>
    );
};
