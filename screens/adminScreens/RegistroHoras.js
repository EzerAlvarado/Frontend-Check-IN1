import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useAuth } from "../../Context";
import http from "../../api";

const RegistroHoras = () => {
  const { token } = useAuth();
  const [numeroEmpleado, setNumeroEmpleado] = useState("");
  const [registros, setRegistros] = useState([]);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const response = await http.get("/api/registro-horas/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRegistros(response.data);
      } catch (error) {
        console.error("Error al obtener registros:", error);
      }
    };

    fetchRegistros();
  }, [token]);

  const buscarEmpleado = (clave) => {
    const empleadoRegistro = registros.find(
      (reg) => reg.clave_empleado === parseInt(clave)
    );
    if (empleadoRegistro) {
      setResultado(empleadoRegistro);
    } else {
      setResultado(null);
    }
  };

  const handleChange = (text) => {
    setNumeroEmpleado(text);
    if (text) {
      buscarEmpleado(text);
    } else {
      setResultado(null);
    }
  };

  // Función para calcular el tiempo total trabajado en minutos
  const calcularMinutosTrabajados = (horaEntrada, horaSalida) => {
    const entrada = new Date(horaEntrada);
    const salida = new Date(horaSalida);
    const diferenciaEnMs = salida - entrada;
    const diferenciaEnMinutos = Math.floor(diferenciaEnMs / 60000);
    return diferenciaEnMinutos;
  };

  const convertirTotalHorasAMinutos = (total_horas) => {
    const partes = total_horas.split(":");
    const horas = parseInt(partes[0]);
    const minutos = parseInt(partes[1]);

    return horas * 60 + minutos;
  };

  // Función para formatear las horas totales
  const formatTotalHoras = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const restoMinutos = minutos % 60;

    let resultado = "";
    if (horas > 0) {
      resultado += `${horas} hora${horas !== 1 ? "s" : ""}`;
    }
    if (restoMinutos > 0) {
      resultado += ` ${restoMinutos} minuto${restoMinutos !== 1 ? "s" : ""}`;
    }
    return resultado.trim() || "0 minutos";
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Buscar Registros</Text>
            <Text style={styles.subtitulo}>
              Horas trabajadas por los empleados
            </Text>
          </View>

          <TextInput
            style={styles.inputDesign}
            placeholder="Número de empleado"
            value={numeroEmpleado}
            onChangeText={handleChange}
            keyboardType="numeric"
          />

          {/* Encabezados fijos */}
          <View style={styles.resultadoContainer}>
            <View style={styles.resultadoFila}>
              <Text style={styles.subtitulo}>Fecha</Text>
              <Text style={styles.subtitulo}>Periodo de tiempo</Text>
              <Text style={styles.subtitulo}>Horas totales</Text>
            </View>

            {resultado && (
              <View style={styles.resultadoFila}>
                <Text style={styles.resultadoTexto}>
                  {new Date(resultado.hora_entrada).toLocaleDateString()}
                </Text>
                <Text style={styles.resultadoTexto}>
                  {new Date(resultado.hora_entrada).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -
                  {new Date(resultado.hora_salida).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={styles.resultadoTexto}>
                  {resultado.total_horas}
                </Text>
              </View>
            )}
            {resultado === null && numeroEmpleado && (
              <Text style={styles.mensajeError}>Empleado no encontrado.</Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 33,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 36,
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
    color: "#474747",
    textAlign: "center",
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
  resultadoContainer: {
    marginTop: 20,
  },
  resultadoFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  resultadoTexto: {
    fontSize: 15,
    fontWeight: "500",
    color: "#474747",
    textAlign: "center",
  },
  mensajeError: {
    fontSize: 15,
    fontWeight: "500",
    color: "#5f0000",
    marginTop: 10,
  },
});

export default RegistroHoras;
