import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import AppNavigator from "./AppNavigator";
import { AuthProvider } from "./Context";

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

    // Activar pantalla completa
    const enableFullScreen = () => {
      const element = document.documentElement; // Elemento raíz (HTML)
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(); // Safari/Chrome
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen(); // Firefox
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen(); // IE/Edge
      }
    };

    // Intentar activar pantalla completa
    setTimeout(enableFullScreen, 500); // Ajusta el tiempo si es necesario
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
