import React, { createContext, useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('userInfo');
        setUser(null);
    }, []);

    useEffect(() => {
        const checkTokenExpiry = () => {
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser.token) {
                        const decodedToken = JSON.parse(atob(parsedUser.token.split('.')[1]));
                        if (decodedToken.exp * 1000 < Date.now()) {
                            logout();
                        } else {
                            setUser(parsedUser);
                        }
                    } else {
                        setUser(parsedUser);
                    }
                } catch (error) {
                    console.error("Token verification failed:", error);
                    logout();
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        checkTokenExpiry();
        const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [logout]);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const ct = res.headers.get("content-type");
            if (!ct || !ct.includes("application/json")) throw new TypeError("Non-JSON response from Login API");
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUser(data);
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const ct = res.headers.get("content-type");
            if (!ct || !ct.includes("application/json")) throw new TypeError("Non-JSON response from Register API");
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUser(data);
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Registration failed', errors: data.errors || [] };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };



    const updateUser = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
