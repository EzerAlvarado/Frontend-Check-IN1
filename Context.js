// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '././api';

const AuthContext = createContext();

export const handleLogout = () => {
    localStorage.setItem("token","")
    localStorage.setItem("user", JSON.stringify({}))
 /*    window.location.reload() */
}

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState('');
    const [token, setToken] = useState(localStorage.getItem("token")??"");

    const fetchToken = async ({clave,password}) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({clave,password}), // Usa las credenciales definidas
            });
            const data = await response.json();
            console.log(data.access)
            setToken(data.access);
            localStorage.setItem("token",data.access)
            return data.access
        } catch (error) {
            console.error("Error fetching token:", error);
            return ""
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
