import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Switch,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../Context";
import axios from "axios";

const EditEmployeeScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.190:8000/api/v1/usuarios/",
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
          contraseniaEditable: emp.contrasenia,
        }))
      );
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
    }
  };

  const updateEmployee = async (employeeId, updatedData) => {
    try {
      const response = await axios.put(
        `http://192.168.1.190:8000/api/v1/usuarios/${employeeId}/`,
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

  const handleSave = () => {
    const { id, nombreEditable, claveEditable, esAdminEditable, contraseniaEditable } = selectedEmployee;
    const updatedData = {
      nombre: nombreEditable,
      clave: claveEditable,
      es_admin: esAdminEditable,
      contrasenia: contraseniaEditable,
      password: contraseniaEditable,
    };
    updateEmployee(id, updatedData);
    setModalVisible(false);
  };

  const handleInputChange = (value, field) => {
    setSelectedEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Lista de Empleados</Text>
        <TouchableOpacity onPress={fetchEmployees} style={styles.reloadButton}>
          <Ionicons name="refresh" size={24} color="#1D2A32" />
        </TouchableOpacity>
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.employeeRow}
              onPress={() => openModal(item)}
            >
              <Text style={styles.employeeName}>{item.nombre}</Text>
              <Ionicons name="create-outline" size={20} color="#1D2A32" />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Modal para editar empleado */}
      {selectedEmployee && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Empleado</Text>
              <Text style={styles.modalLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={selectedEmployee.nombreEditable}
                onChangeText={(text) => handleInputChange(text, "nombreEditable")}
              />
              <Text style={styles.modalLabel}>Clave</Text>
              <TextInput
                style={styles.input}
                value={selectedEmployee.claveEditable}
                onChangeText={(text) => handleInputChange(text, "claveEditable")}
              />
              <Text style={styles.modalLabel}>Admin</Text>
              <Switch
                value={selectedEmployee.esAdminEditable}
                onValueChange={(value) => handleInputChange(value, "esAdminEditable")}
              />
              <Text style={styles.modalLabel}>Contraseña</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={selectedEmployee.contraseniaEditable}
                onChangeText={(text) => handleInputChange(text, "contraseniaEditable")}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 16,
  },
  employeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#C9D3DB",
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1D2A32",
  },
  reloadButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 16,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#474747",
    marginBottom: 5,
  },
  input: {
    height: 40,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: "#C9D3DB",
    borderWidth: 1,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#1D2A32",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#A5A5A5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default EditEmployeeScreen;
