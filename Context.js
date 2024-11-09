// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Tus credenciales de superusuario
const CREDENTIALS = {
    clave: "1919191", // Aqui colocas tu clave de superusuario
    password: "messi1234" // y aqui la password
};

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState('');
    const [token, setToken] = useState(null);

    const fetchToken = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(CREDENTIALS), // Usa las credenciales definidas
            });
            const data = await response.json();
            console.log(data.access)
            setToken(data.access); // Asumiendo que el token está en data.token
        } catch (error) {
            console.error("Error fetching token:", error);
        }
    };

    // Llama a fetchToken una vez al cargar el contexto
    useEffect(() => {
        fetchToken();
    }, []);

    return (
        <AuthContext.Provider value={{
            userData, 
            setUserData,
            username,
            setUsername,
            token,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
