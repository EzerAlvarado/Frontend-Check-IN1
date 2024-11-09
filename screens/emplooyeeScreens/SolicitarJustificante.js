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

const SolicitarJustificante = ({ onJustificanteCreado }) => {
  // Agrega la prop aquí
  const { userData, token } = useAuth();
  const [motivo, setMotivo] = useState("");
  const [diaJustificar, setDiaJustificar] = useState(
    new Date().toISOString().split("T")[0]
  ); // Formato YYYY-MM-DD
  const [mensaje, setMensaje] = useState("");
  const [evidenciaPDF, setEvidenciaPDF] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEvidenciaPDF(file);
      setNombreArchivo(file.name);
    }
  };

  const handleSubmit = async () => {
    if (!evidenciaPDF) {
      Alert.alert("Error", "Debe seleccionar un archivo PDF");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("estado_solicitud", "P");
      formData.append("motivo", motivo.trim());
      formData.append("dia_justificar", diaJustificar);
      formData.append("clave_empleado", userData.clave);
      formData.append("usuario_que_registra", userData.id);
      formData.append("evidencia_pdf", evidenciaPDF);

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/solicitudes/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setMensaje("Justificante creado correctamente");
        setMotivo("");
        setDiaJustificar(new Date().toISOString().split("T")[0]);
        setEvidenciaPDF(null);
        setNombreArchivo("");
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

      <input
        type="date"
        value={diaJustificar}
        onChange={(e) => setDiaJustificar(e.target.value)} // Actualiza la fecha con el valor del input
        style={styles.input}
      />

      <Text style={styles.label}>Evidencia PDF</Text>
      <TouchableOpacity
        onPress={() => document.getElementById("fileInput").click()}
        style={styles.uploadButton}
      >
        <Text style={styles.uploadButtonText}>Cargar PDF</Text>
      </TouchableOpacity>
      <input
        id="fileInput"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

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
