import React, { useEffect, useContext } from 'react';
import * as Notifications from 'expo-notifications';
import AppNavigator from './AppNavigator';
import { AuthProvider } from './Context';


// Configuración de cómo se mostrarán las notificaciones (pantalla activa vs. en segundo plano)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    // Solicitar permisos de notificaciones en dispositivos iOS
    Notifications.requestPermissionsAsync();
  }, []);


  return (
    <AuthProvider>
        <AppNavigator />
    </AuthProvider>
);
}

