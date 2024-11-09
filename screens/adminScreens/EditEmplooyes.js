import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../Context";
import axios from "axios";

const EditEmployeeScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchEmployees();
  }, [token]);

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
      setEmployees(
        response.data.map((emp) => ({
          ...emp,
          nombreEditable: emp.nombre,
          claveEditable: emp.clave,
          esAdminEditable: emp.es_admin,
          contraseniaEditable: emp.contrasenia, // campo editable para la contraseña
        }))
      );
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
    }
  };

  const updateEmployee = async (employeeId, updatedData) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/v1/usuarios/${employeeId}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === employeeId ? response.data : employee
        )
      );
      console.log("Empleado actualizado:", response.data);
    } catch (error) {
      console.error("Error al actualizar el empleado:", error);
    }
  };

  const handleSave = (employeeId, name, clave, es_admin, contrasenia) => {
    const updatedData = {
      nombre: name,
      clave: clave,
      es_admin: es_admin,
      contrasenia: contrasenia,
      password: contrasenia, // siempre envía el campo password igual a contrasenia
    };
    updateEmployee(employeeId, updatedData);
  };

  const handleInputChange = (value, employeeId, field) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === employeeId ? { ...emp, [field]: value } : emp
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Empleados</Text>
      <TouchableOpacity
        onPress={() => fetchEmployees()}
        style={styles.reloadButton}
      >
        <Ionicons name="refresh" size={24} color="#1D2A32" />
      </TouchableOpacity>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.employeeRow}>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={item.nombreEditable}
                onChangeText={(text) =>
                  handleInputChange(text, item.id, "nombreEditable")
                }
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>Clave</Text>
              <TextInput
                style={styles.input}
                value={item.claveEditable}
                onChangeText={(text) =>
                  handleInputChange(text, item.id, "claveEditable")
                }
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>Rol</Text>
              <TextInput
                style={styles.input}
                value={item.esAdminEditable ? "Admin" : "Empleado"}
                onChangeText={(text) =>
                  handleInputChange(
                    text === "Admin",
                    item.id,
                    "esAdminEditable"
                  )
                }
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>Contraseña</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={item.contraseniaEditable}
                onChangeText={(text) =>
                  handleInputChange(text, item.id, "contraseniaEditable")
                }
              />
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                handleSave(
                  item.id,
                  item.nombreEditable,
                  item.claveEditable,
                  item.esAdminEditable,
                  item.contraseniaEditable
                )
              }
            >
              <Text style={styles.actionText}>Guardar</Text>
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
  input: {
    flex: 1,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
  },
  actionText: {
    color: "blue",
  },
  headerText: {
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
});

export default EditEmployeeScreen;
