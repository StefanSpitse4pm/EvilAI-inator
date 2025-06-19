import React, { useState, useEffect, createContext, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const AuthContext = createContext({
    isAuthenticated: null,
    token: null,
    signIn: (token: string) => {},
    signOut: () => {},
});

export const AuthProvidor = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const [token, setToken] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            const stored = await AsyncStorage.getItem('userToken');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    // If login returns an object with access_token, adjust accordingly
                    setToken(parsed.access_token || parsed.token || parsed);
                    setIsAuthenticated(true);
                } catch {
                    setToken(stored);
                    setIsAuthenticated(true);
                }
            } else {
                setToken(null);
                setIsAuthenticated(false);
            }
        };
        loadToken();
    }, []);

    const signIn = async (data) => {
        // data can be a token string or an object with access_token
        let tokenValue = data?.access_token || data?.token || data;
        await AsyncStorage.setItem('userToken', JSON.stringify(tokenValue));
        setToken(tokenValue);
        setIsAuthenticated(true);
    }

    const signOut = async () => {
        await AsyncStorage.removeItem('userToken');
        setToken(null);
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);