import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../Context";
import http from "../api";

function Checador({ navigation }) {
  const { userData, token } = useAuth();
  const [mensajeLlegada, setMensajeLlegada] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [entradaRegistrada, setEntradaRegistrada] = useState(false);
  const [salidaRegistrada, setSalidaRegistrada] = useState(false);
  const [registroId, setRegistroId] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const horaEntradaEstatica = new Date(`${formattedDate}T04:05:28-06:00`);
  const horaEntradaFormateada = horaEntradaEstatica.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const [horaLimite, setHoraLimite] = useState("12:35:00");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePressEntrada = async () => {
    try {
      const responseRegistro = await http.get(
        `/api/registro-horas/?clave_empleado=${userData?.clave}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (responseRegistro.status === 200 && responseRegistro.data.length > 0) {
        const registroReciente = responseRegistro.data[0];
        const horaEntrada = registroReciente.hora_entrada;
        const horaEntradaFormateada = new Date(
          horaEntrada
        ).toLocaleTimeString();
        setEntradaRegistrada(true);
        setMensaje(`Ya has registrado tu entrada a las ${horaEntradaFormateada}.`);
        return;
      }

      setEntradaRegistrada(false);

      const horaActual = new Date();
      const horaEntradaEstaticaDate = new Date(horaEntradaEstatica);
      let llegoTarde = horaActual - horaEntradaEstaticaDate >= 15 * 60 * 1000;
      let seCancelaSuDia =
        horaActual >
        new Date(horaEntradaEstaticaDate.getTime() + 2 * 60 * 60 * 1000);

      if (seCancelaSuDia) {
        llegoTarde = false;
      }

      setMensajeLlegada(
        seCancelaSuDia
          ? "Llegaste 2 horas tarde, así que tu día no cuenta."
          : llegoTarde
          ? "Llegaste tarde, se te descontará la hora."
          : "Llegaste a buena hora."
      );

      const entradaData = {
        hora_entrada: horaActual.toISOString(),
        clave_empleado: userData?.clave,
        llego_tarde: llegoTarde,
        se_cancela_su_dia: seCancelaSuDia,
        estado_registro: "A",
        usuario_que_registra: userData?.id,
      };

      const entradaResponse = await http.post(
        "/api/registro-horas/",
        entradaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (entradaResponse.status === 201) {
        setEntradaRegistrada(true);
        const horaEntradaFormateada = horaActual.toLocaleTimeString();
        setMensaje(`Entrada registrada correctamente a las ${horaEntradaFormateada}.`);
      } else {
        setMensaje("Error al registrar la entrada.");
      }
    } catch (error) {
      console.error("Error al registrar la entrada:", error);
      setMensaje("Error al registrar la entrada.");
    }
  };

  const handlePressSalida = async () => {
    if (!entradaRegistrada) {
      setMensaje("No has registrado la entrada. No puedes registrar la salida.");
      return;
    }

    try {
      const responseRegistro = await http.get(
        `/api/registro-horas/?clave_empleado=${userData?.clave}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (responseRegistro.status === 200 && responseRegistro.data.length > 0) {
        const registroReciente = responseRegistro.data[0];

        if (registroReciente.hora_salida) {
          const horaSalidaExistente = new Date(
            registroReciente.hora_salida
          ).toLocaleTimeString();
          setMensaje(`Ya has registrado tu salida a las ${horaSalidaExistente}.`);
          return;
        }

        const horaEntrada = new Date(registroReciente.hora_entrada);
        const horaSalida = new Date();
        let totalHoras = (horaSalida - horaEntrada) / (1000 * 60 * 60);

        if (registroReciente.llego_tarde) {
          totalHoras -= 1;
        }
        if (registroReciente.se_cancela_su_dia) {
          totalHoras = 0;
        }

        const salidaData = {
          hora_salida: horaSalida.toISOString(),
          estado_registro: "A",
          total_horas: registroReciente.se_cancela_su_dia
            ? "No cuenta tu día"
            : totalHoras > 0
            ? totalHoras.toFixed(2)
            : "0",
        };

        const responseSalida = await http.put(
          `/api/registro-horas/${registroReciente.id}/`,
          salidaData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (responseSalida.status === 200) {
          const horaSalidaFormateada = horaSalida.toLocaleTimeString();
          setMensaje(`Salida registrada correctamente a las ${horaSalidaFormateada}.`);
        } else {
          setMensaje("Error al registrar la salida.");
        }
      } else {
        setMensaje("No se encontró registro de entrada. No puedes registrar la salida.");
      }
    } catch (error) {
      console.error("Error al registrar la salida:", error);
      setMensaje("Error al registrar la salida.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Hola {userData?.nombre}!</Text>
          <Text style={styles.subtituloLlegada}>
            Entras a las: {horaEntradaFormateada}{" "}
          </Text>
          <Text style={styles.subtitulo}>Registra tu Salida y Entrada</Text>
        </View>

        <View style={styles.formulario}>
          <View style={styles.input}>
            <Text style={styles.subtitulo}>Hora y Fecha actual:</Text>
            <Text style={styles.titulo}>{time}</Text>
            <Text style={styles.subtitulo}>{formattedDate}</Text>
          </View>

          <View style={styles.botonArea}>
            <TouchableOpacity onPress={handlePressEntrada}>
              <View style={styles.btnGreen}>
                <Text style={styles.btnText}>Registrar Entrada</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePressSalida}>
              <View style={styles.btnRed}>
                <Text style={styles.btnText}>Registrar Salida</Text>
              </View>
            </TouchableOpacity>
          </View>

          {mensaje ? <Text style={styles.subtitulo}>{mensaje}</Text> : null}
          {mensajeLlegada ? <Text style={styles.subtituloLlegada}>{mensajeLlegada} </Text> : null}

          <Text style={styles.formFooter}>
            Si llegas 15 minutos tarde se te descontará la hora. Si llegas 2 horas tarde se te descontará el día.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Checador;
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
    color: "#676767",
    textAlign: "center",
  },
  subtituloLlegada: {
    fontSize: 12,
    fontWeight: "500",
    color: "#676767",
    textAlign: "center",
  },

  //Header
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 36,
  },

  //Formulario
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
    flexDirection: "row",
    justifyContent: "center",
  },

  formFooter: {
    paddingVertical: 24,
    fontSize: 10,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    letterSpacing: 0.15,
    paddingTop: 140,
  },

  // Inputs
  input: {
    marginBottom: 16,
    alignItems: "center",
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

  //Botones
  btnGreen: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    borderWidth: 1,
    backgroundColor: "#4CAF50",
    borderColor: "#00d82a",
    width: 140,
    height: 90,
    marginHorizontal: 25,
  },
  btnRed: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    borderWidth: 1,
    backgroundColor: "#f44336",
    borderColor: "#d80000",
    width: 140,
    height: 90,
    marginHorizontal: 25,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
