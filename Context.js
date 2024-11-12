// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import http from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const handleLogout = async () => {
    try {
        await AsyncStorage.setItem("token", "");
        await AsyncStorage.setItem("user", JSON.stringify({}));
    } catch (error) {
        console.error("Error during logout:", error);
    }
};

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState('');
    const [token, setToken] = useState("");

    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
            }
        };
        loadToken();
    }, []);

    const fetchToken = async ({ clave, password }) => {
        try {
            const response = await http.post('api/token/', { clave, password });
            const data = response.data; // Cambiado de response.json() a response.data
    
            if (data.access) {
                setToken(data.access);
                await AsyncStorage.setItem("token", data.access);
            }
            return data.access;
        } catch (error) {
            console.error("Error fetching token:", error);
            return "";
        }
    };

    return (
        <AuthContext.Provider value={{
            userData, 
            setUserData,
            username,
            setUsername,
            token,
            fetchToken,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
