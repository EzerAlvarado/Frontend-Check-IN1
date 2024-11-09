import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../Context";
import axios from "axios";

const EmployeeScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(""); // Estado para almacenar el mensaje de error
  const { token, userId } = useAuth();

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/usuarios/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees(response.data);
      setError(""); // Limpiar el mensaje de error al actualizar la lista
      console.log("Empleados actualizados:", response.data);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  const deleteEmployee = async (employeeId) => {
    if (employeeId === userId) {
      setError("No puedes eliminar tu propio usuario.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/v1/usuarios/${employeeId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Empleado eliminado:", response.data);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== employeeId)
      );
      setError(""); // Limpiar el mensaje de error si la eliminación fue exitosa
    } catch (error) {
      // Mostrar el mensaje de error devuelto por el backend, si existe
      setError(error.response?.data?.detail || "Error al eliminar el empleado");
      console.error("Error al eliminar el empleado:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Empleados</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity onPress={fetchEmployees} style={styles.reloadButton}>
        <Ionicons name="refresh" size={24} color="#1D2A32" />
      </TouchableOpacity>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.employeeRow}>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>Nombre</Text>
              <Text style={styles.employeeText}>{item.nombre}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>Clave</Text>
              <Text style={styles.employeeText}>{item.clave}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>Rol</Text>
              <Text style={styles.employeeText}>
                {item.es_admin ? "Admin" : "Empleado"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteEmployee(item.id)}
            >
              <Text style={styles.actionText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  employeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  employeeText: {
    flex: 1,
    marginHorizontal: 5,
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
  },
  actionText: {
    color: "blue",
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  textContainer: {
    alignItems: "center",
  },
  reloadButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default EmployeeScreen;
