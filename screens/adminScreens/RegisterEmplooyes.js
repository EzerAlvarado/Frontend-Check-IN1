import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useAuth } from "../../Context";
import http from "../../api";

const RegistroUsuariosScreen = () => {
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [esAdmin, setEsAdmin] = useState(false);
  const [contrasenia, setContrasenia] = useState("");
  const { token } = useAuth(); // Obtén el token de autenticación desde tu contexto

  const handleAddEmployee = async () => {
    const newEmployee = {
      nombre,
      clave: parseInt(clave, 10),
      es_admin: esAdmin,
      contrasenia,
      password: contrasenia,
    };

    try {
      const response = await http.post("/api/usuarios/", newEmployee, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Empleado agregado correctamente:", response.data);

      setNombre("");
      setClave("");
      setEsAdmin(false);
      setContrasenia("");
    } catch (error) {
      console.error("Error al agregar empleado:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Registrar Empleado</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={contrasenia}
          onChangeText={setContrasenia}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="No. Empleado"
          value={clave}
          onChangeText={setClave}
          keyboardType="numeric"
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Rol: </Text>
          <Text style={styles.switchText}>
            {esAdmin ? "Admin" : "Empleado"}
          </Text>
          <Switch
            value={esAdmin}
            onValueChange={(value) => setEsAdmin(value)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={esAdmin ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddEmployee}>
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F5",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  switchLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
  switchText: {
    fontSize: 16,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegistroUsuariosScreen;
