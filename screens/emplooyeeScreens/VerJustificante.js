import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../Context"; // Importa el contexto de autenticación
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SolicitarJustificante from "./SolicitarJustificante";
import http from "../../api";

const VerJustificantes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const { userData, token } = useAuth(); // Obtén el token y clave del contexto

  const fetchSolicitudes = async () => {
    try {
      const response = await http.get(
        `/api/solicitudes/?clave_empleado=${userData.clave}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSolicitudes(data);
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
    }
  };

  useEffect(() => {
    fetchSolicitudes(); // Llama a la función al montar el componente
  }, [userData.clave, token]);

  // Esta función será llamada cuando se crea un justificante
  const handleJustificanteCreado = () => {
    fetchSolicitudes(); // Vuelve a obtener las solicitudes
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloMain}>Solicitudes de Justificante</Text>
        <TouchableOpacity
          onPress={fetchSolicitudes}
          style={styles.reloadButton}
        >
          <Ionicons name="refresh" size={24} color="#1D2A32" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SolicitudCard solicitud={item} />}
      />
    </SafeAreaView>
  );
};

// Componente para cada tarjeta de solicitud
const SolicitudCard = ({ solicitud }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
      <View style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
        <View style={styles.card}>
          <Text style={styles.titulo}>
            Numero de empleado: {solicitud.clave_empleado}
          </Text>
          <Text style={styles.subtitulo}>
            Fecha: {solicitud.dia_justificar}
          </Text>
          <Text style={styles.subtitulo}>Motivo: {solicitud.motivo}</Text>
          <Text style={styles.subtitulo}>
            Estado:{" "}
            {solicitud.estado_solicitud === "A"
              ? "Aceptada"
              : solicitud.estado_solicitud === "R"
              ? "Rechazada"
              : "Pendiente"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 36,
  },

  container: {
    flex: 1,
    backgroundColor: "#e8ecf4", // Fondo para toda la pantalla
  },
  reloadButton: {
    marginLeft: 10,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  tituloMain: {
    fontSize: 31,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 6,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "500",
    color: "#474747",
    marginBottom: 6,
  },
});

export default VerJustificantes;
