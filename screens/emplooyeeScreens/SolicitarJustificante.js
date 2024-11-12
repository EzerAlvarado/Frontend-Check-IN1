import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useAuth } from "../../Context"; // Importa el contexto de autenticación
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import http from "../../api";

const SolicitarJustificante = ({ onJustificanteCreado }) => {
  const { userData, token } = useAuth();
  const [motivo, setMotivo] = useState("");
  const [diaJustificar, setDiaJustificar] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [mensaje, setMensaje] = useState("");
  const [evidenciaPDF, setEvidenciaPDF] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleFileChange = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (res.type === "success") {
        const selectedFile = res.assets[0];
        if (selectedFile.uri) {
          const base64Data = selectedFile.uri.split(",")[1];

          setEvidenciaPDF({
            base64: base64Data,
            mimeType: selectedFile.mimeType,
            name: selectedFile.name,
          });
          setNombreArchivo(selectedFile.name);
        } else {
          Alert.alert("Error", "El archivo seleccionado no es válido.");
        }
      } else if (res.type === "cancel") {
        console.log("El usuario canceló la selección del archivo");
      } else {
        console.log("Otro tipo de respuesta:", res);
      }
    } catch (err) {
      console.error("Error al seleccionar el archivo", err);
      Alert.alert("Error", "Hubo un problema al seleccionar el archivo");
    }
  };

  const handleSubmit = async () => {
    if (!evidenciaPDF || !evidenciaPDF.base64) {
      Alert.alert("Error", "Debe seleccionar un archivo PDF.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("estado_solicitud", "P");
      formData.append("motivo", motivo.trim());
      formData.append("dia_justificar", diaJustificar);
      formData.append("clave_empleado", userData.clave);
      formData.append("usuario_que_registra", userData.id);

      if (evidenciaPDF.base64) {
        formData.append("evidencia_pdf", {
          uri: `data:${evidenciaPDF.mimeType};base64,${evidenciaPDF.base64}`,
          type: evidenciaPDF.mimeType,
          name: evidenciaPDF.name,
        });
      }

      const response = await http.post("/api/solicitudes/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        setMensaje("Justificante creado correctamente");
        setMotivo("");
        setDiaJustificar(new Date().toISOString().split("T")[0]);
        setEvidenciaPDF(null);
        setNombreArchivo("");
        if (onJustificanteCreado) onJustificanteCreado();
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          `Error al crear la solicitud: ${
            errorData.message || "Error desconocido"
          }`
        );
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al crear la solicitud");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const currentDate = selectedDate || diaJustificar;
    setDiaJustificar(currentDate.toISOString().split("T")[0]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloMain}>Solicitar justificante</Text>
      </View>

      <Text style={styles.label}>Motivo de la falta</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el motivo"
        value={motivo}
        onChangeText={setMotivo}
        maxLength={150}
      />

      <Text style={styles.label}>Día a justificar</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          value={diaJustificar}
          editable={false}
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(diaJustificar)}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Evidencia PDF</Text>
      <TouchableOpacity onPress={handleFileChange} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Cargar PDF</Text>
      </TouchableOpacity>

      {nombreArchivo ? (
        <Text style={styles.fileName}>{nombreArchivo}</Text>
      ) : null}

      <View style={styles.header}>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Enviar solicitud</Text>
        </TouchableOpacity>
      </View>

      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 36,
  },
  tituloMain: {
    fontSize: 31,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 6,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e8ecf4",
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    marginBottom: 25,
  },
  uploadButton: {
    backgroundColor: "#212121",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fileName: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#212121",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    width: 130,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  mensaje: {
    marginTop: 20,
    fontSize: 16,
    color: "#474747",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SolicitarJustificante;
