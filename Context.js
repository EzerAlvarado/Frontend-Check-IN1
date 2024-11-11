// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const handleLogout = async () => {
    try {
        await AsyncStorage.setItem("token", "");
        await AsyncStorage.setItem("user", JSON.stringify({}));
        /* Para reiniciar la sesión, podrías agregar un mecanismo adicional en el contexto o en el flujo de navegación en lugar de recargar la ventana. */
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
            const response = await fetch('http://192.168.1.190:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clave, password }), // Usa las credenciales definidas
            });
            const data = await response.json();
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
