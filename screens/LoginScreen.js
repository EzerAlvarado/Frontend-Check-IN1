import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../Context";
import http from "../api"; // Importa tu archivo API

export default function LoginScreen({ setUserRole, navigation }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [password, setContraseña] = useState("");
  const [mensajito, setMensajito] = useState("");
  const { setUserData, setUsername, fetchToken } = useAuth();

  const enableFullScreen = useCallback(() => {
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
    setIsFullScreen(true);
  }, []);

  const handleLogin = async () => {
    try {
      console.log({ clave: numeroEmpleado, password });
      const _token = await fetchToken({ clave: numeroEmpleado, password });

      const response = await http.get(`api/usuarios/?clave=${numeroEmpleado}`, {
        headers: {
          Authorization: `Bearer ${_token}`,
        },
      });

      const userData = response.data;
      const user = userData[0];

      if (!response.status === 200) {
        setMensajito("Datos incorrectos!");
        return;
      }

      if (user?.es_admin) {
        if (
          user.contrasenia.toString() === password &&
          user.clave.toString() === numeroEmpleado
        ) {
          setUserData(user);
          setUsername(user.nombre);
          setUserRole("admin");
          navigation.navigate("AdminTabs");
        } else {
          console.log("Error: Credenciales inválidas para admin");
        }
      } else {
        if (
          user.clave.toString() === numeroEmpleado &&
          user.contrasenia.toString() === password
        ) {
          setUserData(user);
          setUsername(user.nombre);
          setUserRole("empleado");
          navigation.navigate("EmployeeTabs");
        } else {
          console.log("Error: Credenciales inválidas para empleado");
        }
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setMensajito("Error de conexión, intente nuevamente.");
    }
  };

  // Pantalla de inicio con el mensaje para habilitar pantalla completa
  if (!isFullScreen) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#282c34",
          color: "#fff",
          fontSize: "24px",
          cursor: "pointer",
        }}
        onClick={enableFullScreen} // Activar pantalla completa al hacer clic
      >
        Haga clic para continuar
      </div>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Login</Text>
          <Text style={styles.subtitulo}>
            Logeate si eres administrador o empleado!
          </Text>
        </View>

        <View style={styles.formulario}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Número de empleado</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              placeholder="Escribe tu número de empleado"
              placeholderTextColor="#6b7280"
              style={styles.inputDesign}
              onChangeText={setNumeroEmpleado}
              value={numeroEmpleado}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              autoCorrect={false}
              placeholder="**********"
              placeholderTextColor="#6b7280"
              style={styles.inputDesign}
              secureTextEntry={true}
              onChangeText={setContraseña}
              value={password}
            />
          </View>

          <View style={styles.botonArea}>
            <View style={styles.input}>
              <Text style={styles.textoError}>{mensajito}</Text>
            </View>

            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Entrar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  titulo: {
    fontSize: 31,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
  },
  textoError: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 36,
  },
  formulario: {
    paddingTop: 40,
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  botonArea: {
    marginTop: 4,
    marginBottom: 16,
    paddingTop: 30,
    alignItems: "center",
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputDesign: {
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    borderWidth: 1,
    backgroundColor: "#212121",
    borderColor: "#2b2b2b",
    width: 150,
    height: 60,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
