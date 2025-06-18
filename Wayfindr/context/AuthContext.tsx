import React, { useState, useEffect, createContext} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const AuthContext = createContext({
    isAuthenticated: null,
    signIn: (token: String) => {},
    signout: () => {},
});

export const AuthProvidor = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    
    useEffect(() => {
        const loadToken = async() => {
            const token = await AsyncStorage.getItem('userToken')
            setIsAuthenticated(!!token)

        };
        loadToken()
    }, []);
    
    const signIn = async(token) => {
        await AsyncStorage.setItem('userToken', JSON.stringify(token));
        setIsAuthenticated(true)
    }

    const signOut = async() => {
        await AsyncStorage.removeItem('userToken');
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    )    

}